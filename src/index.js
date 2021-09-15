require("./db/conn");

const express = require("express");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const blogPostRouter = require("./routes/blogpost");

const app = express();
const port = process.env.PORT || 8000;

app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/blogpost", blogPostRouter);

app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

app.listen(port, () => {
  console.log(`Listening to ther port ${port}`);
});
