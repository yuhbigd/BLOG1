const { Router } = require("express");
const accountController = require("../controllers/accountController");
const { checkUser } = require("../middlewares/authMiddleware");
const multer = require("multer");
const router = Router();
const imageUpload = multer({
  dest: "../public/uploads/images",
  limits: {
    fieldNameSize: 300,
    fileSize: 1048576, // 10 Mb
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});
router.put("/", [checkUser], accountController.account_put);
router.put("/avatar", [checkUser ,imageUpload.single("avatar")], accountController.avatar_put);
router.put("/password", [checkUser], accountController.password_put);
router.get("/", [checkUser], accountController.account_get);
module.exports = { router };
