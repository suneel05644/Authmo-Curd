const Book = require("../models/product.model");
var User = require("../models/user.model");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test controller!");
};

exports.create = async (req, res) => {
  try {
    //validate data as required
    const book = new Book(req.body);
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
    // console.log(req.userID);
    const oldUser = await Book.findOne({ user: req.userID });
    // console.log(oldUser);
    if (oldUser) {
      const product = await Book.findById(req.params.id);
      if (!product) {
        return res.status(404);
      }
      res.status(200).send(product);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    // console.log(req.userID);
    const oldUser = await Book.findOne({ user: req.userID });
    // console.log(oldUser);
    if (oldUser) {
      await Book.findOneAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res
        .status(200)
        .send({ success: true, msg: "User Update successfully" });
    } else {
      res.status(401).json({ success: false, error: "user not Updated" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.Delete = async (req, res) => {
  try {
    console.log(req.userID);
    const oldUser = await Book.findOne({ user: req.userID });
    // console.log(oldUser);
    if (oldUser) {
      await Book.findOneAndDelete(req.params.id);
      return res
        .status(200)
        .json({ success: true, msg: "User deleted successfully" });
    } else {
      res.status(401).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    // console.log(error);
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
