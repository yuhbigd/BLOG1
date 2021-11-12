const { Router } = require("express");
const accountController = require("../controllers/accountController");
const { checkUser } = require("../middlewares/authMiddleware");
const multer = require("multer");
const router = Router();
const imageUpload = multer({
  dest: "public/uploads/images", // co the co loi cho nay
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
  const upload = imageUpload.single("avatar");

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
router.put("/", accountController.account_put);
router.put("/avatar", [uploadFile], accountController.avatar_put);
router.put("/password", accountController.password_put);
router.get("/", accountController.account_get);
module.exports = { router };
