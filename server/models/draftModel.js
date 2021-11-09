const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name can not be emptied"],
    unique: [true, "This name has been used by another draft"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: [true],
    index: true,
  },
  thumbnailImage: {
    type: String,
  },
  contentHtml: {
    type: String,
    require: [true, "Content can not be emptied"],
  },
  contentJson: {
    type: Object,
    require: [true, "Content can not be emptied"],
  },
});
const Draft = mongoose.model("drafts", postSchema);

module.exports = Draft;
