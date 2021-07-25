const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// Require the controllers WHICH WE DID NOT CREATE YET!!
const Book = require("../controllers/product.controller");

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", Book.test);
router.post("/create", Book.create);
router.get("/create", Book.create);
router.get("/:id", auth, Book.details);
router.put("/:id", auth, Book.update);
router.delete("/:id", auth, Book.Delete);
router.delete("/", auth, Book.deleteall);

module.exports = router;
