var express = require("express");
var router = express.Router();

/* Login */
router.get("/login", function (req, res, next) {
  res.send("logging in");
});

/* Logout */
router.get("/logout", function (req, res, next) {
  res.send("logging out");
});

/* Edit user */
router.get("/edit", function (req, res, next) {
  res.send("editing user");
});

module.exports = router;
