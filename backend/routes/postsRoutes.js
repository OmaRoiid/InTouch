const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const Post = require("../models/posts");
const IMAGES_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = IMAGES_TYPE[file.mimetype];
    let err = new Error("Invaild image type");
    if (isValid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = IMAGES_TYPE[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "post Added",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    }).catch((err)=>{
      res.status(500).json({
          title:"Adding issue",
        message:"Post is not created"
      })
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedResults;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((results) => {
      fetchedResults = results;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "posts fetched",
        posts: fetchedResults,
        maxPosts: count,
      });
    }).catch((err)=>{
      res.status(500).json({
         title:"Fetching issue",
        message:"Fetching posts failed"
      })
    });
});
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  }).catch((err)=>{
      res.status(500).json({
         title:"Fetching issue",
        message:"Fetching post failed"
      })
    });
});

router.put(
  "/edit/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator:req.userData.userId
    });
    console.log(post);
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful" });
      } else {
        res.status(401).json({ message: "Not Authorized!!" });
      }
    }).catch((error)=>{
      res.status(500).json({
         title:"updating issue",
        message:"Couldn't update post !"
      })
    });
  }
);
router.delete("/:id", checkAuth, (req, res, next) => {
  const deletePostId = req.params.id;
  Post.deleteOne({ _id: deletePostId, creator: req.userData.userId }).then(
    (result) => {
    if (result.n > 0) {
      res.status(200).json({ message: "Post Deleted successful" });
    } else {
      res
        .status(401)
        .json({ title: "deleteing issue", message: "Not Authorized!!" });
    }
    }
  ).catch(()=>{
    res.status(500).json({
      title:"deleteing issue",
      message:"can not detele post"
    })
  });
});

module.exports = router;
