const express = require("express");
const bodyParser = require("body-parser");
const app = express();
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
  const post = req.body;
  res.status(201).json({
    message: "post Added",
  });
});
app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "adsasd3252",
      title: "this is server post",
      content: "this post from server :)",
    },
    {
      id: "adsasd3253",
      title: "this is server post",
      content: "this sec post from server :}",
    },
  ];
  res.status(200).json({
    message: "posts fetched",
    posts: posts,
  });
});

module.exports = app;
