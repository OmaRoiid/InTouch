const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postsRoutes");
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
    "GET, POST,PATCH ,PUT,DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts",postRoutes)

module.exports = app;
