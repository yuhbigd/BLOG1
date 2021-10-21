const { Router } = require("express");
const authController = require("../controllers/authController");
const { checkUser } = require("../middlewares/authMiddleware");
const router = Router();

router.get("/signup", [checkUser], authController.signup_get);
router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.get("/login", [checkUser], authController.login_get);
router.get("/logout", authController.logout_get);
module.exports = { router };
