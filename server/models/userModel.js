const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const sanitize = require("mongo-sanitize");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: [true, "this email was chosen by another person"],
    validate: [isEmail, "It's not an email"],
  },
  password: {
    type: String,
    required: [true, "please enter an password"],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, "please enter a name"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  resetKey: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
});
//pre insert new user middleware
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//pre update user middleware
userSchema.pre("updateOne", async function (next) {
  try {
    if (this._update.password) {
      const salt = await bcrypt.genSalt();
      this._update.password = await bcrypt.hash(this._update.password, salt);
    }
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: sanitize(email) });
  if (user) {
    const isCorrectPass = await bcrypt.compare(
      sanitize(password),
      user.password,
    );
    if (isCorrectPass) {
      return user;
    }
    throw new Error("Your password is incorrect");
  }
  throw new Error("Your email or password is incorrect");
};
userSchema.statics.checkUser = async function (userId) {
  let _id = sanitize(userId);
  const user = await this.findOne({ _id: _id });
  if (!user) {
    throw new Error("user not found");
  }
  return true;
};
const User = mongoose.model("users", userSchema);

module.exports = User;
