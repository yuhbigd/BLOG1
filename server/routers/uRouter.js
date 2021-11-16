const { Router } = require("express");
const user = require("../controllers/uController");
const router = Router();
router.get("/:userId", user.posts_get);
module.exports = { router };
