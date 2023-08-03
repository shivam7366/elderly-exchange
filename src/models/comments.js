const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "experience",
      required: [true, "Post is required"],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
