const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.secret, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (!user) {
        return res.sendStatus(404);
      }
      console.log(user);
      req.token = token;
      req.userID = user.user_id.toString();
      req.role = user.role;
      // console.log(req.userID);
      return next();
    });
  } else {
    res.status(401).send({
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
