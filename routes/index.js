var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "AkoloCare" });
});

/* GET dashboard. */
router.get("/dashboard", function (req, res, next) {
  if (req.user) {
    res.render("dashboard", { title: "AkoloCare Dashboard" });
  } else {
    res.redirect("/?error=not_logged_in");
  }
});

/* GET privacy/tos. */
router.get("/privacy-tos", function (req, res, next) {
  res.render("privacy-tos", { title: "AkoloCare Dashboard" });
});

module.exports = router;
