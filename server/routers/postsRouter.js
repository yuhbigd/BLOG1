const { Router } = require("express");
const posts = require("../controllers/postsController");
const { checkBotMiddleware } = require("../middlewares/checkBotMiddleware");
const multer = require("multer");
const { checkUser, checkAnonymous } = require("../middlewares/authMiddleware");
const router = Router();
const imageUpload = multer({
  dest: "public/uploads/posts/images", // co the co loi cho nay
  limits: { fieldSize: 5 * 1024 * 1024 }, // 5 mb
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});
function uploadFile(req, res, next) {
  const upload = imageUpload.single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      req.errors = err.message;
    } else if (err) {
      req.errors = err.message;
    }
    // Everything went fine.
    next();
  });
}
router.post("/images", [uploadFile, checkUser], posts.image_post_put);
router.delete("/images", [checkUser], posts.images_post_delete);
router.post("/", [checkBotMiddleware, checkUser], posts.article_post);
router.put("/:slug", [checkUser], posts.post_put);
router.delete("/:slug", [checkUser], posts.post_delete);
router.get("/", posts.get_all_post);
router.get("/:slug", posts.get_post);
router.get("/:slug/comments", posts.comments_get);
router.post(
  "/:slug/comments",
  [checkBotMiddleware, checkAnonymous],
  posts.comment_post,
);
module.exports = { router };
