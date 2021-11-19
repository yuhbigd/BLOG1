const Post = require("../models/postModel");
require("dotenv").config();
const slugify = require("slugify");
const CronJob = require("cron").CronJob;

const { bucket } = require("../firebase/index");
const uuid = require("uuid-v4");

function postImageToStorage(filePath, imageBuffer) {
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uuid(),
    },
    contentType: "image/png",
    cacheControl: "public",
  };
  //

  // Upload the image to the bucket
  const file = bucket.file(filePath);
  return file.save(imageBuffer, {
    metadata: metadata,
    gzip: true,
    public: true,
    metadata: metadata,
  });
}

function deleteImageFromStorage(filePath) {
  const file = bucket.file(filePath);
  return file.delete();
}
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
function getTimeNow() {
  let date = new Date();
  let dateNow = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ).toISOString();
  return dateNow;
}
async function image_post_put(req, res) {
  try {
    let unDupText = require("crypto").randomBytes(2).toString("hex");
    let dateNow = getTimeNow().split("T");
    dateNow = dateNow[0] + "_" + dateNow[1].split(":").join("-");
    const imageBuffer = decodeBase64Image(req.body.image);
    const fileName = req.user._id + "+" + dateNow + "+" + unDupText;
    const filePath = `public/uploads/posts/images/${fileName}.png`;

    await postImageToStorage(filePath, imageBuffer.data);

    res.json({
      link: filePath,
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
      for (let i = 0; i < imageArray.length; i += 10) {
        // each turn will delete 10 image
        const request = imageArray.slice(i, i + 10).map((image) => {
          return deleteImageFromStorage(image).catch((e) => {
            throw new Error(
              `Error in delete image for ${req.user.email} - ${image}`,
            );
          });
        });
        await Promise.all(request).catch((e) => {
          throw new Error(`Error in sending email for the batch ${i} - ${e}`);
        });
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
  try {
    let unDupText = require("crypto").randomBytes(3).toString("hex");
    const slugUrl = slugify(req.body.data.title + " " + unDupText, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    const { title, contentHtml, contentJson, thumbnailImage } = req.body.data;
    const article = await Post.create({
      title: title,
      userId: req.user._id,
      createAt: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000,
      ),
      contentHtml,
      contentJson,
      slugUrl: slugUrl,
      thumbnailImage: thumbnailImage,
      author: req.user._id,
    });
    res.status(201).json({
      article: article,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "This title has been used by too many people" });
        return;
      }
    }
    res.status(400).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function post_put(req, res) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      throw new Error("data can not be emptied");
    }
    const userId = req.user._id;
    const { contentHtml, contentJson, thumbnailImage } = req.body.data;
    const article = await Post.findOneAndUpdate(
      { $and: [{ slugUrl: slug }, { userId: userId }] },
      {
        $set: { contentHtml, contentJson, thumbnailImage },
      },
      { new: true },
    );
    if (!article) {
      throw new Error("No document found");
    }
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function post_delete(req, res) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      throw new Error("data can not be emptied");
    }
    const userId = req.user._id;
    const article = await Post.findOneAndDelete({
      $and: [{ slugUrl: slug }, { userId: userId }],
    }).select({ contentJson: 1, thumbnailImage: 1 });
    if (!article) {
      throw new Error("No document found");
    }

    res.status(200).json({
      article: article,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function get_all_post(req, res) {
  try {
    const searchString = req.query.searchString || "";
    const isCount = req.query.isCount;
    if (isCount) {
      if (isCount === "1") {
        const countDocument = await Post.count({
          title: { $regex: ".*" + searchString + ".*", $options: "i" },
        }).exec();

        res.status(200).json({
          count: countDocument,
        });
        return;
      }
    }
    const pageNum = parseInt(req.query.pageNum) - 1 || 0;
    const numPerPage = parseInt(req.query.numPerPage) || 12;
    const query = req.query;
    let orderBy = {};
    if (query.order) {
      if (query.direction) {
        if (query.direction === "desc") {
          orderBy[query.order] = -1;
        } else if (query.direction === "asc") {
          orderBy[query.order] = 1;
        } else {
          throw new Error("?");
        }
      }
    }
    if (_.isEmpty(orderBy) || !orderBy._id) {
      orderBy._id = -1;
    }
    const skip = pageNum * numPerPage;
    const articles = await Post.find({
      title: { $regex: ".*" + searchString + ".*", $options: "i" },
    })
      .populate({ path: "author", select: { _id: 1, avatar: 1, name: 1 } })
      .sort(orderBy)
      .skip(skip)
      .limit(numPerPage)
      .select({
        title: 1,
        createAt: 1,
        thumbnailImage: 1,
        slugUrl: 1,
        totalViews: 1,
        userId: 1,
      })
      .exec();
    if (!articles) {
      throw new Error("No document found");
    }
    res.status(200).json({
      articles: articles,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "This name has been used. Please use another name" });
        return;
      }
    }
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function get_post(req, res) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      throw new Error("data can not be emptied");
    }
    const article = await Post.findOne({
      $and: [{ slugUrl: slug }],
    })
      .populate({ path: "author", select: { _id: 1, avatar: 1, name: 1 } })
      .select({
        slugUrl: 1,
        title: 1,
        thumbnailImage: 1,
        contentHtml: 1,
        contentJson: 1,
        createAt: 1,
      });
    if (!article) {
      throw new Error("No document found");
    }
    await Post.addView(article._id);
    res.status(200).json({
      article: article,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function comment_post(req, res) {
  try {
    const slug = req.params.slug;
    let userId;
    if (req.user) {
      userId = req.user._id;
    } else {
      userId = "61951804739b2253ce58adbe";
    }
    if (!slug) {
      throw new Error("data can not be emptied");
    }
    const article = await Post.findOneAndUpdate(
      { slugUrl: slug },
      {
        $push: {
          comments: {
            $each: [
              {
                text: req.body.data.text,
                author: userId,
                createAt: new Date(
                  new Date().getTime() - new Date().getTimezoneOffset() * 60000,
                ),
              },
            ],
            $position: 0,
          },
        },
      },
      { new: true },
    );
    if (!article) {
      throw new Error("No document found");
    }
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function comments_get(req, res) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      throw new Error("data can not be emptied");
    }
    const isCount = req.query.isCount;
    if (isCount) {
      if (isCount === "1") {
        const countDocument = await Post.findOne({
          slugUrl: slug,
        }).exec();

        res.status(200).json({
          count: countDocument.comments.length,
        });
        return;
      }
    }

    const article = await Post.findOne({ slugUrl: slug })
      .populate({
        path: "comments.author",
        select: { _id: 1, avatar: 1, name: 1 },
      })
      .select({
        _id: 0,
        comments: 1,
      });
    if (!article || _.isEmpty(article.comments)) {
      res.status(200).json({
        error: "No Document Found" || "something goes wrong",
      });
      return;
    }
    res.status(200).json({
      data: article,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
module.exports = {
  image_post_put,
  images_post_delete,
  article_post,
  post_put,
  post_delete,
  get_all_post,
  get_post,
  comment_post,
  comments_get,
};
