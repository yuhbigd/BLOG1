const { Router } = require("express");
const authController = require("../controllers/authController");
const { checkUser } = require("../middlewares/authMiddleware");
const { checkBotMiddleware } = require("../middlewares/checkBotMiddleware");
const router = Router();
function mongooseErrorHandler(err, req, res, next) {
  if (err.errors) {
    const error = {};
    const keys = Object.keys(err.errors);

    keys.forEach((key) => {
      let message = err.errors[key].message;

      if (err.errors[key].properties && err.errors[key].properties.message) {
        message = err.errors[key].properties.message.replace("`{PATH}`", key);
      }

      message = message.replace("Path ", "").replace(key, "").trim();
      error[key] = message;
    });

    console.log(error);
  }

  next();
}
router.get("/signup", [checkUser], authController.signup_get);
router.post("/signup", [checkBotMiddleware], authController.signup_post);
router.post("/login", [checkBotMiddleware], authController.login_post);
router.get("/login", [checkUser], authController.login_get);
router.get("/logout", authController.logout_get);
module.exports = { router };
