const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

async function account_get(req, res) {
  const { email } = req.body.user;
  try {
    const user = User.findOne({ email: email });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    res.status(200).json({ user: _.pick(user, ["email", "name", "avatar"]) });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
// function to change password
async function password_put(req, res) {
  try {
    const _id = req.user._id;
    const email = req.user.email;
    const password = req.body.data.password;
    const newPassword = req.body.data.newPassword;
    const checkUser = await User.login(email, password);
    const user = await User.updateOne(
      { _id: _id },
      {
        password: newPassword,
      },
      {
        // For adding new user to be updated
        new: true,
        // upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: "query",
      },
    );
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

//function to change account information
async function account_put(req, res) {
  const data = req.body.data;
  try {
    const _id = req.user._id;
    const user = await User.updateOne(
      { _id: _id },
      {
        name: data.name,
      },
    );
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
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
//function to change avatar
async function avatar_put(req, res) {
  try {
    let unDupText = require("crypto").randomBytes(8).toString("hex");
    const imageBuffer = decodeBase64Image(req.body.avatar);
    const filepath = `public/uploads/images/avatar-${unDupText}.png`;

    fs.writeFileSync(filepath, imageBuffer.data);

    if (req.user.avatar !== "") {
      fs.unlinkSync(`public${req.user.avatar}`);
    }
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { avatar: `/uploads/images/avatar-${unDupText}.png` } },
      { upsert: true },
    );

    res.json({
      link: `/uploads/images/avatar-${unDupText}.png`,
      message: "done",
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
module.exports = {
  password_put,
  account_get,
  account_put,
  avatar_put,
};
