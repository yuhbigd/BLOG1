const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const fs = require("fs");
const { bucket } = require("../firebase/index");
const uuid = require("uuid-v4");

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
    await User.updateOne(
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
    res.clearCookie("refreshToken");
    res.clearCookie("token");
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
      { runValidators: true },
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
    const filePath = `public/uploads/images/avatar-${unDupText}.png`;
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
    await file.save(imageBuffer.data, {
      metadata: metadata,
      gzip: true,
      public: true,
      metadata: metadata,
    });
    // download link
    // console.log(file.metadata.mediaLink);

    // fs.writeFileSync(filepath, imageBuffer.data);

    if (req.user.avatar !== "") {
      // fs.unlinkSync(`public${req.user.avatar}`);
      bucket
        .file(req.user.avatar)
        .delete()
        .catch((error) => {
          throw error;
        });
    }
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { avatar: filePath } },
      { upsert: true },
    );

    res.json({
      link: filePath,
      message: "done",
    });
  } catch (error) {
    if (req.errors) {
      res.status(404).json({ error: req.errors });
      return;
    }
    res.status(404).json({ error: error.message });
  }
}
module.exports = {
  password_put,
  account_get,
  account_put,
  avatar_put,
};
