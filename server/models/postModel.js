const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  createAt: {
    type: Date,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Title can not be emptied"],
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    index: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  contentHtml: {
    type: String,
    required: [true, "Content can not be emptied"],
  },
  contentJson: {
    type: Object,
    required: [true, "Content can not be emptied"],
  },
  slugUrl: {
    type: String,
    required: [true],
    unique: true,
    index: true,
  },
  totalViews: { type: Number, default: 0, index: true },
  dayViews: { type: Number, default: 0, index: true },
  monthViews: { type: Number, default: 0, index: true },
  yearViews: { type: Number, default: 0, index: true },
  comments: { type: Array, default: [] },
});
const Post = mongoose.model("posts", postSchema);

module.exports = Post;
