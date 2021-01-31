const userAuth = require("../models/userAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    const newUserAuth = new userAuth({
      email: req.body.email,
      password: hashedPassword,
    });
    newUserAuth
      .save()
      .then((results) => {
        res.status(200).json({
          messasge: "user saved to DB",
          results: results,
        });
      })
      .catch(() => {
        res.status(500).json({
          title: "User is exist!",
          message: "Invalid userAuthentication",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  userAuth
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "userAuth failed",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "userAuth failed",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch(() => {
      return res.status(401).json({
        message: "Invalid userAuthentication",
      });
    });
};