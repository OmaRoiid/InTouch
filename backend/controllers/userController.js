const userAuth = require("../models/userAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    const newUserAuth = new userAuth({
      email: req.body.email,
      password: hashedPassword,
    })
      .save()
      .then((results) => {
        console.log(results);
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
exports.userInfo = (req, res, next) => {
  userAuth
    .findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({ message: "featching success", user: user });
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        title: "Fetching issue",
        message: "Fetching User failed",
      });
    });
};
exports.editUserInfo = (req, res, next) => {
  console.log(req.body)
  const updatedUser = new userAuth({
    _id: req.body.id,
    email: req.body.info.email,
    password: req.body.info.password,
    name: req.body.info.name,
    age: req.body.info.age,
    country: req.body.info.country,
    birthday: req.body.info.birthday,
  });
    console.log(updatedUser._id);

  console.log(updatedUser);
  userAuth
    .updateOne({_id:req.body.id}, updatedUser)
    .then((result) => {
      console.log(result)
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful" });
      } else {
        res.status(401).json({ message: "Not Authorized!!" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        title: "updating issue",
        message: "Couldn't update user!",
      });
    });
};
