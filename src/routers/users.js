const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// const { check, validationResult } = require("express-validator");

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/user/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST api/user/login
// @desc    Login user
// @access  Public
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST api/user/logout
// @desc    Logout user
// @access  Private
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/user/logoutall
// @desc    Logout user from all devices
// @access  Private
router.post("/user/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: "Logout successfull from all devices" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@route GET api/user/:id
//@desc Get user by id
//@access Public
// router.get("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// @route   GET api/user/me
// @desc    Get all users
// @access  Private
router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

// @route  PATCH api/user/update
// @desc   Update user
// @access Private
router.patch("/user/updateme", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["password", "name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid updates!" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send({ user: req.user, message: "User updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@route DELETE api/user/me
//@desc Delete user
//@access Private
router.delete("/user/deleteme", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({ user: req.user, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
