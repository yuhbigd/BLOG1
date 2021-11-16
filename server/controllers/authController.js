const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sanitize = require("mongo-sanitize");
require("dotenv").config();

createToken = async function (user) {
  const token = await jwt.sign(
    {
      user: _.pick(user, ["_id", "isAdmin"]),
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 1000 * 60 * 10,
    },
  );
  const refreshToken = await jwt.sign(
    {
      user: _.pick(user, "_id"),
    },
    process.env.SECRET_REFRESH_KEY + user.password,
    {
      expiresIn: 1000 * 60 * 60 * 24 * 3,
    },
  );
  return { token, refreshToken };
};
signup_get = async (req, res) => {
  res.send("signup");
};

// getting data when first time going to the website
login_get = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new Error("This user doesn't exist");
    }

    const { token, refreshToken } = await createToken(user);
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      user: _.pick(user, ["_id", "email", "name", "isAdmin", "avatar"]),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//sign-up controller
signup_post = async (req, res) => {
  try {
    const { email, password, name } = req.body.user;
    const user = await User.create({
      email,
      password,
      name,
    },);
    const { token, refreshToken } = await createToken(user);
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({
      user: _.pick(user, ["_id", "email", "name", "isAdmin", "avatar"]),
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "This email has been used by another person" });
        return;
      }
    }
    res.status(400).json({ error: error.message });
  }
};

// login controller
login_post = async (req, res) => {
  try {
    let { email, password } = req.body.user;
    // email = sanitize(email);
    // password = sanitize(password);
    const user = await User.login(email, password);

    const { token, refreshToken } = await createToken(user);
    res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      user: _.pick(user, ["_id", "email", "name", "isAdmin", "avatar"]),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//logout
function logout_get(req, res) {
  res.clearCookie("refreshToken");
  res.clearCookie("token");
  res.status(200).json({
    message: "Logged out",
  });
}
module.exports = {
  createToken,
  login_post,
  signup_post,
  login_get,
  signup_get,
  logout_get,
};
