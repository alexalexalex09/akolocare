require("dotenv").config();
var passport = require("passport");
const express = require("express");
const router = express.Router();

router.get(
  "/login",
  passport.authenticate("google", { scope: ["profile", "email", "openid"] })
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    console.log("Callback");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL + "?err=cannot_login",
    session: false,
  }),
  function (req, res) {
    req.logIn(req.user, function (err) {
      res.redirect(process.env.CLIENT_URL + "/dashboard");
    });
  }
);

router.get("/logout", (req, res) => {
  console.log("Logout");
  req.logout();
  res.redirect("/");
});

module.exports = router;
