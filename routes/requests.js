const express = require("express");
var router = express.Router();
const CR = require("../models/crs.js");
const User = require("../models/users.js");
const ERR_PARAM = { err: "Incorrect parameters" };
const ERR_LOGIN = { err: "User not logged in" };
const Crud = require("./crud");
var fuzzyMatch = require("jaro-winkler");

/* Bulk import CR */
router.get("/importCR", function (req, res, next) {
  res.send("importing CR");
});

/* Search for CR */
router.get("/searchCR", function (req, res, next) {
  res.send("searching for a CR");
});

router.get("/getAllCRs", function (req, res, next) {
  //Get all CRs owned by the current user's org
  if (typeof req.body.organization != "undefined") {
    CR.find({ organization: req.body.organization }).exec(function (
      err,
      curCRs
    ) {
      res.send(curCRs);
    });
  }

  //if there is no current org, get all CRs owned by the current user
  User.findOne({ profile_id: req.user.id }).exec(function (err, curUser) {
    CR.find({ owner: curUser._id }).exec(function (err, curCRs) {
      res.send(curCRs);
    });
  });
});

module.exports = router;
