const mongoose = require("mongoose");
// const { validate } = require("./experiences");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      lowercase: true,
    },

    password: {
      type: String,
      minLength: 7,

      required: [true, "Password is required"],
      validator: function (value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },

  { timestamps: true }
);

//hashing password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }

  next();
});

//login
userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//generate token

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Hiding Passwords and unnecessary tokens from response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.virtual("experiences", {
  ref: "experience",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "owner",
});

// if a user is deleted, delete all his experiences and comments

userSchema.pre("remove", async function (next) {
  const user = this;
  await Experience.deleteMany({ owner: user._id });
  await Comment.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
