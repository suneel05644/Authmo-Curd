// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var User = require("../models/user.model");
const _ = require("lodash");
const { sendEmail } = require("../models/email.models");
// const jwt = require("../config/jwt");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const userService = require("./user.service");
// var SibApiV3Sdk = require('sib-api-v3-sdk');
// var defaultClient = SibApiV3Sdk.ApiClient.instance;
// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = 'YOUR_API_V3_KEY';
// var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
// var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

exports.register = async (req, res) => {
  try {
    const { role } = req.body;
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      role: role || "user",
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

    // await User.findByIdAndUpdate(user._id, { token });
    // res.status(200).json({
    //   data: { email: user.email, role: user.role },
    //   token,
    // });

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

exports.forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    await User.findOne({ email: email }, (err, user) => {
      if (err || !user) {
        return res
          .status(404)
          .json({ err: "User with this email address does not exits" });
      }

      // Create token
      const token = jwt.sign({ user_id: user._id }, config.secret, {
        expiresIn: "2h",
      });

      if (!token) {
        return res.status(403).send("A token is required for authentication");
      }

      const data = {
        from: "noreply@node-react.com'",
        to: email,
        subject: "Forgot Passwword Link",
        html: `<h2>Please click to the given link to reset your password</h2><p>${"http://localhost:3500"}/user/forgot-password/${token}</p> `,
      };

      return User.updateOne({ resetlink: token }, (err, success) => {
        if (err) {
          return res.status(404).json({ err: "reset password link error" });
        } else {
          sendEmail(data);
          return res.status(200).json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
          });
        }
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resetpassword = (req, res) => {
  const { resetlink, newPassword } = req.body;
  User.findOneAndUpdate({ resetlink }, req.body, { new: true }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!",
      });

    // const updatedFields = {
    //   password: newPassword,
    //   resetlink: "",
    // };
    console.log(newPassword);
    user.password = newPassword;
    user.resetlink = undefined;
    // user = _.extend(user, updatedFields);
    user.password = userService.encryptPassword(user.password);
    console.log(user.password);
    user.update = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};

exports.details = async (req, res) => {
  try {
    if (req.user.user_id == req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404);
      }
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getall = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.update = async (req, res) => {
  try {
    if (req.user.user_id == req.params.id) {
      await User.findOneAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res
        .status(200)
        .json({ success: true, msg: "User Update successfully" });
    } else {
      res.status(401).json({ success: false, error: "user not Updated" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res
      .status(200)
      .json({ success: true, msg: "User logout successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
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
