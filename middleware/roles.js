module.exports = function (req, res, next) {
  if (!req.user.role.admin) return res.status(403).send("Access denied Admin");
  if (user.role !== admin) {
    return res.status(403).send({
      message: "Please make sure you are Deleting all in form right portal",
      status: false,
    });
  }

  next();
};

module.exports = function (req, res, next) {
  if (!req.user.role.user) return res.status(403).send("Access denied to User");

  next();
};

module.exports = function (req, res, next) {
  if (!req.user.role.publisher)
    return res.status(403).send("Access denied to Publisher");

  next();
};
