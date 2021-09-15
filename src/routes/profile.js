const express = require("express");
const Profile = require("../models/profile.model");
const middleware = require("../middlewear");
const multer = require("multer");
const path = require("path");

const router = new express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.username + ".jpg");
  },
});

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype == "image/jpeg" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/png"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  // fileFilter: fileFilter,
});

router.patch(
  "/add/image",
  middleware.checkToken,
  upload.single("img"),
  async (req, res) => {
    try {
      const profileImg = await Profile.findOneAndUpdate(
        { username: req.decoded.username },
        {
          $set: {
            img: req.file.path,
          },
        },
        { new: true },
      );

      const response = {
        message: "image added successfully updated",
        data: profileImg,
      };
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

router.post("/add", middleware.checkToken, (req, res) => {
  try {
    const profile = Profile({
      username: req.decoded.username,
      name: req.body.name,
      profession: req.body.profession,
      DOB: req.body.DOB,
      titleline: req.body.titleline,
      about: req.body.about,
    });

    profile.save().then(() => {
      return res.json({ msg: "Profile Successfully Stored" });
    });
  } catch (err) {
    return res.status(400).json({ err: err });
  }
});

router.get("/checkprofile", middleware.checkToken, async (req, res) => {
  try {
    const data = await Profile.findOne({
      username: req.decoded.username,
    });

    console.log(data);

    if (data != null) {
      return res.json({ status: true, username: req.decoded.username });
    } else {
      return res.json({ status: false, username: req.decoded.username });
    }
  } catch (error) {
    return res.status(400).json({ err: error });
  }
});

router.get("/getdata", middleware.checkToken, async (req, res) => {
  try {
    const data = await Profile.findOne({
      username: req.decoded.username,
    });
    console.log(data);
    if (data == null) {
      return res.json({ data: "Data is empty" });
    } else {
      return res.json({ data: data });
    }
  } catch (error) {
    return res.status(400).json({ err: error });
  }
});

router.patch("/update", middleware.checkToken, async (req, res) => {
  try {
    const profileData = await Profile.findOne({
      username: req.decoded.username,
    });

    const profileNewData = await Profile.findOneAndUpdate(
      { username: req.decoded.username },
      {
        $set: {
          name: req.body.name ? req.body.name : profileData.name,
          profession: req.body.profession
            ? req.body.profession
            : profileData.profession,
          DOB: req.body.DOB ? req.body.DOB : profileData.DOB,
          titleline: req.body.titleline
            ? req.body.titleline
            : profileData.titleline,
          about: req.body.about ? req.body.about : profileData.about, //about:""
        },
      },
      { new: true },
    );

    if (profileNewData != null) {
      return res.json({ data: profileNewData });
    } else {
      return res.json({ data: [] });
    }
  } catch (error) {
    return res.json({ err: error });
  }
});

module.exports = router;
