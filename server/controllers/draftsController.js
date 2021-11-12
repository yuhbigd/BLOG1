const Draft = require("../models/draftModel");
require("dotenv").config();

async function draft_put(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    if (!id) {
      throw new Error("data can not be emptied");
    }
    const userId = req.user._id;
    const { contentHtml, contentJson, thumbnailImage, title } = req.body.data;
    const draft = await Draft.findOneAndUpdate(
      { $and: [{ _id: id }, { userId: userId }] },
      {
        $set: { title, contentHtml, contentJson, thumbnailImage },
      },
      { new: true },
    );
    if (!draft) {
      throw new Error("No document found");
    }
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function draft_delete(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("data can not be emptied");
    }
    const userId = req.user._id;
    const draft = await Draft.findOneAndDelete({
      $and: [{ _id: id }, { userId: userId }],
    });
    if (!draft) {
      throw new Error("No document found");
    }
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function draft_post(req, res) {
  try {
    const { name, contentHtml, contentJson, thumbnailImage, title } =
      req.body.data;
    const draft = await Draft.create({
      name,
      userId: req.user._id,
      title,
      thumbnailImage,
      contentHtml,
      contentJson,
    });
    res.status(200).json({
      message: "Done",
      id: draft._id,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "This name has been used. Please use another name" });
        return;
      }
    }
    res.status(400).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function draft_get_all_post(req, res) {
  try {
    const pageNum = parseInt(req.query.pageNum) - 1 || 0;
    const numPerPage = parseInt(req.query.numPerPage) || 10;
    console.log(pageNum, numPerPage);
    const countDocument = await Draft.count({ userId: req.user._id }).exec();
    const draft = await Draft.find({ userId: req.user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(numPerPage)
      .exec();
    if (!draft) {
      throw new Error("No document found");
    }
    res.status(200).json({
      drafts: draft,
      count: countDocument,
    });
  } catch (error) {
    if (error.code) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "This name has been used. Please use another name" });
        return;
      }
    }
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
async function draft_get_single_post(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("data can not be emptied");
    }
    const userId = req.user._id;
    const draft = await Draft.findOne({
      $and: [{ _id: id }, { userId: userId }],
    });
    if (!draft) {
      throw new Error("No document found");
    }
    res.status(200).json({
      data: draft,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message || "something goes wrong",
    });
  }
}
module.exports = {
  draft_post,
  draft_put,
  draft_delete,
  draft_get: draft_get_all_post,
  draft_get_single_post,
};
