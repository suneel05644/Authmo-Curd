const Book = require("../models/product.model");
const User = require("../models/user.model");

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
      if (req.role == "user" || "admin") {
        const product = await Book.findById(req.params.id);
        if (!product) {
          return res.status(404);
        }
        res.status(200).send(product);
      } else {
        res
          .status(401)
          .json({ success: false, error: "Only user and Admin Get Details" });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    if (req.role == "user" || "admin") {
      const books = await Book.find({ isDeleted: "false" });
      return res.json({ success: true, books });
    } else {
      res
        .status(401)
        .json({ success: false, error: "Only user and Admin GetAll User" });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    // console.log(req.userID);
    const oldUser = await Book.findOne({ user: req.userID });
    // console.log(oldUser);
    if (oldUser) {
      if (req.role == "user" || "admin") {
        await Book.findOneAndUpdate(req.params.id, req.body, {
          new: true,
        });
        return res
          .status(200)
          .send({ success: true, msg: "User Update successfully" });
      } else {
        res
          .status(401)
          .json({ success: false, error: "Only user and Admin Updated" });
      }
    } else {
      res.status(401).json({ success: false, error: "user not Updated" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.Delete = async (req, res) => {
  try {
    // console.log(req.userID);
    const oldUser = await Book.findOne({ user: req.userID });
    const Bookdata = await Book.findOne({ _id: req.params.id });
    // console.log(oldUser);
    if (oldUser) {
      if (req.role == "user" || "admin") {
        if (Bookdata.isdelete == false) {
          await Book.findByIdAndUpdate(
            req.params.id,
            { isdelete: true },
            async (err, category) => {
              if (err) return next(err);
              category.deletedAt = new Date();
              await category.save();
              res.status(200).json({ message: "Book Delete Successfully" });
            }
          );
        } else {
          return res
            .status(401)
            .json({ success: false, error: "Book Already Deleted" });
        }
      } else {
        return res
          .status(401)
          .json({ success: false, error: "Only Admin and User Deleted" });
      }
    } else {
      res.status(401).json({ success: false, error: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.deleteall = async (req, res) => {
  try {
    if (req.role == "user" || "admin") {
      const Prod = await Book.deleteMany({});
      console.log(Prod);
      res.send(Prod);
    } else {
      res.status(400).json({ msg: "Only Admin deleted all books" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
