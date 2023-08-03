const express = require("express");
const Experience = require("../models/experiences");
const router = express.Router();
const auth = require("../middleware/auth");
const Comment = require("../models/comments");

// create one experience
// @route   POST api/experiences
// access Private
router.post("/experience", auth, async (req, res) => {
  const experience = new Experience({
    ...req.body,
    owner: req.user._id,
  });

  try {
    const newExperience = await experience.save();
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get all experiences
// @route   GET api/experiences
// access Public
router.get("/experience", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get one experience
// @route   GET api/experiences/:id
// access Public
router.get("/experience/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const experience = await Experience.findOne({ _id });
    const comments = await Comment.find({ experience: _id });

    if (!experience) {
      return res.status(404).send();
    }

    res.send({ experience, comments });
  } catch (e) {
    res.status(500).send();
  }
});

//get all experiences by user
// @route   GET api/experiences/user/:id
// access Public (for now) - change to private later or might not need it
router.get("/experience/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const experiences = await Experience.find({ owner: _id });
    res.send(experiences);
  } catch (e) {
    res.status(500).send();
  }
});

// update one experience
// @route   PATCH api/experiences/:id
// access Private
router.patch("/experience/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "role",
    "company",
    "startDate",
    "endDate",
    "description",
    "area",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const experience = await Experience.findOne({ _id: req.params.id });

    if (!experience) {
      return res.status(404).send({ error: "Experience not found" });
    }

    updates.forEach((update) => (experience[update] = req.body[update]));
    await experience.save();
    res.send(experience);
  } catch (e) {
    res.send(400).send(e);
  }
});

// delete one experience
// @route   DELETE api/experiences/:id
// access Private
router.delete("/experience/:id", auth, async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!experience) {
      res.status(404).send({ error: "Experience not found" });
    }
    res.send({ ...experience?._doc, message: "Experience deleted" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
