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
    required: [true, "Thumbnail image can not be emptied"],
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
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  comments: [
    {
      text: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    },
  ],
});

postSchema.statics.addView = async function (id) {
  await this.findOneAndUpdate(
    { _id: id },
    { $inc: { totalViews: 1, dayViews: 1, monthViews: 1, yearViews: 1 } },
  );
};
const Post = mongoose.model("posts", postSchema);

module.exports = Post;
