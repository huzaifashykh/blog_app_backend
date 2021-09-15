const express = require("express");
const User = require("../models/user.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware = require("../middlewear");

const router = new express.Router();

// Signing User
router.get("/:username", middleware.checkToken, async (req, res) => {
  try {
    const userInfo = await User.findOne({
      username: req.params.username,
    });
    res.status(200).json({
      data: userInfo,
      username: req.params.username,
    });
    // console.log(userInfo);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// Checking username already exist or not
router.get("/checkusername/:username", async (req, res) => {
  try {
    const userInfo = await User.findOne({
      username: req.params.username,
    });

    if (userInfo != null) {
      res.json({
        Status: true,
      });
    } else {
      res.json({
        Status: false,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }

  // console.log(userInfo);
});

//Loging a User
router.post("/login", async (req, res) => {
  try {
    const userInfo = await User.findOne({
      username: req.body.username,
    });

    if (userInfo == null) {
      res.status(403).json("Invalid Username");
    }

    if (req.body.password === userInfo.password) {
      //JWT
      let token = jwt.sign({ username: req.body.username }, config.key, {});
      res.json({
        token: token,
        msg: "Login SuccessfUlly!",
      });
      // console.log(userInfo);
    } else {
      res.status(403).json("Invalid Password");
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// Registering User
router.post("/register", async (req, res) => {
  try {
    const userInfo = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    const userData = await userInfo.save();

    res.status(200).json("Register Successful!");

    console.log(userData);
  } catch (error) {
    res.status(403).json({ msg: error });
  }
});

// Updating User Password By Username
router.patch("/register/:username", middleware.checkToken, async (req, res) => {
  try {
    const updatedUserData = await User.findOneAndUpdate(
      {
        username: req.params.username,
      },
      {
        $set: {
          password: req.body.password,
        },
      },
      {
        new: true,
      },
    );
    res.status(200).json({
      msg: "Password Updated Successfully!",
      username: req.params.username,
    });
    // console.log(updatedUserData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Deleting User By Username
router.delete(
  "/register/:username",
  middleware.checkToken,
  async (req, res) => {
    try {
      const deletedUserData = await User.findOneAndDelete({
        username: req.params.username,
      });
      res.status(200).json({
        msg: "User Deleted!",
        username: req.params.username,
      });
      // console.log(deletedUserData);
    } catch (error) {
      res.status(500).json(error);
    }
  },
);

module.exports = router;
