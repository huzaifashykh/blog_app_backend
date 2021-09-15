const express = require("express");
const middleware = require("../middlewear");
const BlogPost = require("../models/blogpost.model");
const multer = require("multer");
const { checkToken } = require("../middlewear");

const router = new express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

router.patch(
  "/add/coverimage/:id",
  middleware.checkToken,
  upload.single("img"),
  async (req, res) => {
    try {
      const coverImg = await BlogPost.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            coverImage: req.file.path,
          },
        },
        { new: true },
      );

      return res.status(200).send({ data: coverImg });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
);

router.post("/add", middleware.checkToken, async (req, res) => {
  try {
    const blogpost = BlogPost({
      username: req.decoded.username,
      title: req.body.title,
      body: req.body.body,
    });

    const result = await blogpost.save();

    return res.json({ data: result["_id"] });
  } catch (error) {
    return res.json({ err: error });
  }
});

router.get("/getownblog", middleware.checkToken, async (req, res) => {
  try {
    const blogPostData = await BlogPost.find({
      username: req.decoded.username,
    });

    return res.json({ data: blogPostData });
  } catch (error) {
    return res.json(error);
  }
});

router.get("/getotherblog", middleware.checkToken, async (req, res) => {
  try {
    const result = await BlogPost.find();

    return res.json({ data: result });
  } catch (error) {
    return res.json(error);
  }
});

router.delete("/delete/:id", middleware.checkToken, async (req, res) => {
  try {
    const result = await BlogPost.findOneAndDelete({
      $and: [{ username: req.decoded.username }, { _id: req.params.id }],
    });

    if (result) {
      return res.json("Blog deleted");
    } else {
      return res.json("Blog not deleted");
    }
  } catch (error) {
    return res.json(error);
  }
});

module.exports = router;
