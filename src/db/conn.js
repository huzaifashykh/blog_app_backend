const mongoose = require("mongoose");

const mongoDB =
  "mongodb+srv://admin:admin@cluster0.wvgkm.mongodb.net/blogApp?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connect Successful!");
  })
  .catch((err) => {
    console.log(err);
  });
