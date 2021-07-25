// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var User = require("../models/user.model");
// const jwt = require("../config/jwt");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const userService = require("./user.service");

exports.register = async (req, res) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    // Validate user input
    if (!user) {
      res.status(400).send("All input is required");
    }

    // // generate salt to hash password
    // const salt = await bcrypt.genSalt(10);
    // // now we set user password to hashed password
    // user.password = await bcrypt.hash(user.password, salt);

    user.password = userService.encryptPassword(user.password);
    console.log(user.password);

    // Create token
    const token = jwt.sign({ user_id: user._id }, config.secret, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    res.cookie("jwt", user.token, {
      expires: new Date(Date.now() + 20000000),
      httpOnly: true,
    });

    await user.save();
    res.status(201).send({ sucess: true, data: user });
    // return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err, sucess: false });
  }
};

exports.login = async (req, res) => {
  try {
    // Validate if user exist in our database
    const user = await User.findOne({ email: req.body.email });
    // Validate user input
    if (!user) {
      return res.status(401).json({ err: "unauthorized" });
    }
    // res.status(200).json({ sucess: true, data: user });
    const authenticted = userService.comparePassword(
      req.body.password,
      user.password
    );
    if (!authenticted) {
      return res.status(401).json({ err: "unauthorized" });
    }
    // Create token
    const token = jwt.sign({ user_id: user._id }, config.secret, {
      expiresIn: "2h",
    });

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    // save user token
    user.token = token;

    res.cookie("jwt", user.token, {
      expires: new Date(Date.now() + 20000000),
      httpOnly: true,
    });

    await user.save();
    res.status(201).send({ sucess: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

exports.welcome = (req, res) => {
  res.status(200).send("Welcome 🙌 ");
};

exports.details = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404);
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getall = function (req, res) {
  User.find({}, function (err, Users) {
    if (err) return done(err);

    if (Users) {
      console.log("Users count : " + user.length);
    }
  });
};

exports.Delete = async (req, res) => {
  try {
    console.log(req.user.user_id, req.params.id);
    if (req.user.user_id == req.params.id) {
      await User.findOneAndDelete(req.params.id);
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

// exports.getall = async (req, res) => {
//   try {
//     const user = await User.findAll({});
//     console.log(user);
//     res.send(user);
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// };

exports.deleteall = async function (req, res) {
  try {
    const Prod = await User.deleteMany({});
    console.log(Prod);
    res.send(Prod);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
