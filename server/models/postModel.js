const mongoose = require("mongoose");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "please enter an email"],
    unique: [true, "this is email was chosen by another person"],
    validate: [isEmail, "It's not an email"],
  },
  password: {
    type: String,
    require: [true, "please enter an password"],
    minlength: 6,
  },
  name: {
    type: String,
    require: [true, "please enter a name"],
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

const Post = mongoose.model("posts", userSchema);

module.exports = Post;
