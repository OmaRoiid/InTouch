const express = require("express");
const path= require("path")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
//Connect the db
mongoose
  .connect(
    "mongodb+srv://OmarSalem011:OmarSalem011@cluster0.r4hag.mongodb.net/Mean?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect to DB");
  });
//setup backend midelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")))
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
//setup backend apis
app.use("/api/posts",postRoutes)
app.use("/api/user", userRoutes);

module.exports = app;
