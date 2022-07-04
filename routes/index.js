var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "AkoloCare" });
});

/* GET dashboard. */
router.get("/dashboard", function (req, res, next) {
  res.render("dashboard", { title: "AkoloCare Dashboard" });
});

/* GET privacy/tos. */
router.get("/privacy-tos", function (req, res, next) {
  res.render("privacy-tos", { title: "AkoloCare Dashboard" });
});

module.exports = router;
