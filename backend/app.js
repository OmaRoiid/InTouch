const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/posts");
const app = express();
//Connect the db
mongoose
  .connect(
    "mongodb+srv://OmarSalem011:OmarSalem011@cluster0.r4hag.mongodb.net/Mean?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect to DB");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PATCH ,DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then(createdPost=>{
  res.status(201).json({
    message: "post Added",
    postId:createdPost._id
  });
  })
});
app.get("/api/posts", (req, res, next) => {
  Post.find().then((results) => {
    res.status(200).json({
      message: "posts fetched",
      posts: results,
    });
  });
});
app.delete("/api/posts/:id", (req, res, next) => {
  const deletePostId = req.params.id;
  Post.deleteOne({ _id: deletePostId }).then((results) => {
    res.status(200).json({
      message: "post Deleted",
    });
  });
});

module.exports = app;
