const { Router } = require("express");
const drafts = require("../controllers/draftsController");
const router = Router();
router.get("/", drafts.draft_get);
router.post("/", drafts.draft_post);
router.put("/:id", drafts.draft_put);
router.delete("/:id", drafts.draft_delete);
router.get("/:id", drafts.draft_get_single_post);
module.exports = { router };
