const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "post Added",
      postId: createdPost._id,
    });
  });
});

router.put("/edit/:id", (req, res, next) => {
  const updatePost = new Post({
    _id: req.body.id,
    title: req.body.title,
    connect: req.body.connect,
  });
  const updatePostId = req.params.id;
  Post.updateOne({ _id: updatePostId }, updatePost).then((results) => {
    console.log(results);
    res.status(200).json({ message: "Post Updated" });
  });
});
router.get("", (req, res, next) => {
  Post.find().then((results) => {
    res.status(200).json({
      message: "posts fetched",
      posts: results,
    });
  });
});
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});
router.delete("/:id", (req, res, next) => {
  const deletePostId = req.params.id;
  Post.deleteOne({ _id: deletePostId }).then((results) => {
    res.status(200).json({
      message: "post Deleted",
    });
  });
});

module.exports=router
