const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Require the controllers WHICH WE DID NOT CREATE YET!!
const userHandlers = require("../controllers/user.controllers");

router.post("/register", userHandlers.register);
router.get("/getall", userHandlers.register);
router.post("/login", userHandlers.login);
router.get("/welcome", userHandlers.welcome);
router.get("/:id", auth, userHandlers.details);
router.delete("/:id", auth, userHandlers.Delete);
router.delete("/deleteall", auth, userHandlers.deleteall);
// router.delete("/deleteall", userHandlers.delete);
// router.post('/refresh-token',userHandlers.refreshToken)
// router.delete('/logout', userHandlers.logout)
// router.get(
//   "/me",
//   passport.authenticate("jwt", { session: false }),
//   userHandlers.authenticate
// );

module.exports = router;
