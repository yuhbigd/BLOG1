const User = require("../models/userModel");
const Post = require("../models/postModel");
async function posts_get(req, res) {
  try {
    const id = req.params.userId;
    const checkUser = await User.checkUser(id);
    const searchString = req.query.searchString || "";
    const isCount = req.query.isCount;
    if (isCount) {
      if (isCount === "1") {
        const countDocument = await Post.count({
          $and: [
            { userId: id },
            { title: { $regex: ".*" + searchString + ".*", $options: "i" } },
          ],
        }).exec();

        res.status(200).json({
          count: countDocument,
        });
        return;
      }
    }
    const query = req.query;
    let orderBy = {};
    if (query.order) {
      if (query.direction) {
        if (query.direction === "desc") {
          orderBy[query.order] = -1;
        } else if (query.direction === "asc") {
          orderBy[query.order] = 1;
        } else {
          throw new Error("?");
        }
      }
    }
    if (_.isEmpty(orderBy) || !orderBy._id) {
      orderBy._id = -1;
    }

    const pageNum = parseInt(req.query.pageNum) - 1 || 0;
    const numPerPage = parseInt(req.query.numPerPage) || 10;

    const skip = pageNum * numPerPage;
    const articles = await Post.find({
      $and: [
        { userId: id },
        { title: { $regex: ".*" + searchString + ".*", $options: "i" } },
      ],
    })
      .sort(orderBy)
      .skip(skip)
      .limit(numPerPage)
      .select({
        title: 1,
        createAt: 1,
        thumbnailImage: 1,
        slugUrl: 1,
        totalViews: 1,
      })
      .exec();
    if (!articles) {
      throw new Error("No document found");
    }
    res.status(200).json({
      articles: articles,
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
module.exports = {
  posts_get,
};
