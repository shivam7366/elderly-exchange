const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    company: {
      type: String,
      required: [true, "Company is required"],
    },
    // startDate: {
    //   type: Date,
    //   required: [true, "Start date is required"],
    // },
    // endDate: {
    //   type: Date,
    //   required: [true, "End date is required"],
    // },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    heading: {
      type: String,
      //   required: [true, "Area is required"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "user",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
      {
        timestamps: true,
      },
    ],
  },
  { timestamps: true }
);

experienceSchema.virtual("ccomments", {
  ref: "comment",
  localField: "_id",
  foreignField: "Post",
});

// if an experience is deleted, delete all the comments of that experience
experienceSchema.pre("remove", async function (next) {
  const experience = this;
  await Comment.deleteMany({ post: experience._id });
  next();
});

const Experience = mongoose.model("experience", experienceSchema);

module.exports = Experience;
