const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/files");

router.post("", checkAuth, extractFile, postController.createPost);

router.get("", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.put("/edit/:id", checkAuth, extractFile, postController.editPostById);
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
