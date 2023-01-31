const express = require('express');
const app = express();
const mongoose  = require('mongoose');
mongoose.set("strictQuery", false)
require ("dotenv").config()
const route = require('./route');

app.use(express.json());
app.use("/", route)

mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is Connected...");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(8800, () => {
  console.log("Server is runnning...");
});
