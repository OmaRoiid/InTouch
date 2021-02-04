const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/user_info/:id", UserController.userInfo);
router.put("/user_info/update/:id", UserController.editUserInfo);
module.exports = router;
