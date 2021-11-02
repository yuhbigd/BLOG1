const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

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
//function to change avatar
async function image_post_put(req, res) {
  try {
    let unDupText = require("crypto").randomBytes(2).toString("hex");
    let dataNow = new Date().toISOString().split("T");
    dataNow = dataNow[0] + "_" + dataNow[1].split(":").join("-");
    const imageBuffer = decodeBase64Image(req.body.image);
    const fileName = req.user._id + "+" + dataNow + "+" + unDupText;
    const filepath = `public/uploads/posts/images/${fileName}.png`;

    fs.writeFileSync(filepath, imageBuffer.data);

    // if (req.user.avatar !== "") {
    //   fs.unlinkSync(`public${req.user.avatar}`);
    // }

    res.json({
      link: `/uploads/posts/images/${fileName}.png`,
      message: "done",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = { image_post_put };