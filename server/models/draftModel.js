const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name can not be emptied"],
    unique: [true, "This name has been used by another draft"],
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    index: true,
  },
  title: {
    type: String,
  },
  thumbnailImage: {
    type: String,
  },
  contentHtml: {
    type: String,
  },
  contentJson: {
    type: Object,
  },
});
const Draft = mongoose.model("drafts", draftSchema);

module.exports = Draft;
