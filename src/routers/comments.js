const express = require("express");
const Comment = require("../models/comments");
const router = express.Router();
const auth = require("../middleware/auth");
const Experience = require("../models/experiences");

// create one comment
// @route   POST api/comments
// access Private
router.post("/comment/:id", auth, async (req, res) => {
  const comment = new Comment({
    ...req.body,
    createdBy: req.user._id,
    experience: req.params.id,
  });

  try {
    await comment.save();
    const experience = await Experience.findById(req.params.id);
    experience.comments.push(comment._id);
    await experience.save();

    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// get all comments on an experience
// @route   GET api/comments/experience/:id
// access Public
router.get("/comment/experience/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const comments = await Comment.find({ experience: _id });
    res.send(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all comments by a user
// @route   GET api/comments/user/:id
// access Public (for now) - change to private later or might not need it

router.get("/comment/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const comments = await Comment.find({ createdBy: _id });
    res.send(comments);
  } catch (e) {
    res.status(500).send();
  }
});

//delete a comment by user who created it
// @route   DELETE api/comments/:id
// access Private
router.delete("/comment/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const comment = await Comment.findOneAndDelete({
      _id,
      createdBy: req.user._id,
    });
    if (!comment) {
      return res.status(404).send();
    }
    res.send(comment);
  } catch (e) {
    res.status(500).send();
  }
});

//delete a comment by user who owns experience
// @route   DELETE api/comments/:id
// access Private
//to-do

module.exports = router;
