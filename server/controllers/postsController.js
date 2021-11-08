const Post = require("../models/postModel");
require("dotenv").config();
const fs = require("fs");
const slugify = require("slugify");
const CronJob = require("cron").CronJob;
//decode base64 image Stream
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], "base64");

  return response;
}
//post image
async function image_post_put(req, res) {
  try {
    let unDupText = require("crypto").randomBytes(2).toString("hex");
    let date = new Date();
    let dataNow = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T");
    dataNow = dataNow[0] + "_" + dataNow[1].split(":").join("-");
    const imageBuffer = decodeBase64Image(req.body.image);
    const fileName = req.user._id + "+" + dataNow + "+" + unDupText;
    const filepath = `public/uploads/posts/images/${fileName}.png`;

    fs.writeFileSync(filepath, imageBuffer.data);

    res.json({
      link: `/uploads/posts/images/${fileName}.png`,
      message: "done",
    });
  } catch (error) {
    if (req.errors) {
      res.status(400).json({ error: req.errors });
      return;
    }
    res.status(400).json({ error: error.message });
  }
}
//delete redundant image
async function images_post_delete(req, res) {
  try {
    const imageArray = req.body.data.images;
    if (imageArray.length > 0) {
      for (const image of imageArray) {
        fs.unlinkSync(`public${image}`);
      }
    }
  } catch (error) {
    res.status(400).json({
      error: error.message || "something goes wrong",
    });
  }
}

const resetDayViews = new CronJob(
  "0 0 * * *",
  async function () {
    await Post.updateMany({}, { $set: { dayViews: 0 } });
  },
  null,
  true,
  "Etc/GMT-7",
);
resetDayViews.start();
const resetMonthViews = new CronJob(
  "0 0 1 * *",
  async function () {
    await Post.updateMany({}, { $set: { monthViews: 0 } });
  },
  null,
  true,
  "Etc/GMT-7",
);
resetMonthViews.start();
const resetYearViews = new CronJob(
  "0 0 1 1 *",
  async function () {
    await Post.updateMany({}, { $set: { yearViews: 0 } });
  },
  null,
  true,
  "Etc/GMT-7",
);
resetYearViews.start();

async function article_post(req, res) {
  let unDupText = require("crypto").randomBytes(3).toString("hex");
  const slugUrl = slugify(req.body.data.title + " " + unDupText, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  });
  const { title, contentHtml, contentJson } = req.body.data;
  const article = await Post.create({
    title: title,
    userId: req.user._id,
    createAt: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000,
    ),
    contentHtml,
    contentJson,
    slugUrl: slugUrl,
  });
  res.status(201).json({
    article: article,
  });
}
module.exports = { image_post_put, images_post_delete, article_post };
