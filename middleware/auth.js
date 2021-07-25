const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = require("../config/auth.config");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.secret, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // const Pad = await User.findOne({ id: user._id, token: user.token });
      if (!user) {
        return res.sendStatus(403);
      }
      req.token = token;
      req.user = user;
      // console.log(req.user);
      next();
    });
  } else {
    res.sendStatus(401).json({
      success: false,
      error:
        "You are not registered. Register here: https://localhost:3500/user/register",
    });
  }
};

// const authenticateJWT = async (req, res, next) => {
//   try {
//     const authHeader = req.header.authorization;
//     const token = authHeader.split(" ")[1];
//     const decodedToken = jwt.verify(token, config.secret);
//     const user = await User.findOne({ id: decodedToken._id, token: token });

//     if (!user) throw new Error();
//     req.token = token;
//     req.user = user;
//     next();
//   } catch (e) {
//     res.status(401).send({ error: "please authenticate." });
//   }
// };

// module.exports = verifyToken;
module.exports = authenticateJWT;
