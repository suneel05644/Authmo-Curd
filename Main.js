const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
mongoose.Promise = global.Promise;
// Imports routes for the products
const book = require("./routes/product.route");
// Imports routes for the user
const user = require("./routes/user.route");
// initialize our express app
const app = express();
//connect the database
mongoose.connect(
  "mongodb://localhost:27017/Product",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", book);
app.use("/user", user);

let Port = 3500;

app.listen(Port, () => {
  console.log("welocome to the server" + Port);
});
