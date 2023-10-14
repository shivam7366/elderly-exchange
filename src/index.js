const express = require("express");
require("./db/mongoose");
const experienceRouter = require("./routers/experiences");
const userRouter = require("./routers/users");
const commentRouter = require("./routers/comments");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    //allow all origins
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(userRouter);
app.use(experienceRouter);
app.use(commentRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
