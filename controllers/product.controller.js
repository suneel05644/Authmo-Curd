const Book = require("../models/product.model");
var User = require("../models/user.model");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test controller!");
};

exports.create = async (req, res) => {
  try {
    //validate data as required
    const book = new Book(req.body);
    // book.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
    // Create token
    const token = jwt.sign({ user_id: book._id }, config.secret, {
      expiresIn: "2h",
    });
    // save user token
    book.token = token;

    res.cookie("jwt", book.token, {
      expires: new Date(Date.now() + 20000000),
      httpOnly: true,
    });
    await book.save();
    const user = await User.findById({ _id: book.user });
    user.Books.push(book);
    await user.save();

    //return new book object, after saving it to Publisher
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.details = async (req, res) => {
  try {
    const product = await Book.findById(req.params.id);
    if (!product) {
      return res.status(404);
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.Delete = async (req, res) => {
  try {
    console.log(req.user.user_id, req.params.id);
    if (req.user.user_id == req.params.id) {
      await Book.findOneAndDelete(req.params.id);
      return res
        .status(200)
        .json({ success: true, msg: "User deleted successfully" });
    } else {
      res.status(401).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteall = async (req, res) => {
  try {
    const Prod = await Book.deleteMany({});
    console.log(Prod);
    res.send(Prod);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
