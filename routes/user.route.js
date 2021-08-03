const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// const role = require("../middleware/roles");

//Require the controllers WHICH WE DID NOT CREATE YET!!
const userHandlers = require("../controllers/user.controllers");

router.post("/register", userHandlers.register);
router.get("/getall", userHandlers.getall);
router.post("/login", userHandlers.login);
router.get("/logout", auth, userHandlers.logout);
router.get("/welcome", userHandlers.welcome);
router.get("/details/:id", auth, userHandlers.details);
router.put("/update/:id", auth, userHandlers.update);
router.put("/forgot-password", userHandlers.forgotpassword);
router.put("/reset-password", auth, userHandlers.resetpassword);
router.delete("/delete", userHandlers.deleteall);
router.delete("/delete/:id", auth, userHandlers.Delete);

// router.delete("/deleteall", userHandlers.delete);
// router.post('/refresh-token',userHandlers.refreshToken)
// router.delete('/logout', userHandlers.logout)
// router.get(
//   "/me",
//   passport.authenticate("jwt", { session: false }),
//   userHandlers.authenticate
// );

module.exports = router;
