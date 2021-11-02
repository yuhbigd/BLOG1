const { Router } = require("express");
const posts = require("../controllers/postsController");
const { checkUser } = require("../middlewares/authMiddleware");

const multer = require("multer");
const router = Router();
const imageUpload = multer({
  dest: "public/uploads/posts/images", // co the co loi cho nay
  limits: {
    fieldNameSize: 300,
    fileSize: 5242880, // 5 Mb
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});

router.post(
  "/images",
  [checkUser, imageUpload.single("image")],
  posts.image_post_put,
);
module.exports = { router };
