const express = require("express");
var router = express.Router();
const CR = require("../models/crs.js");
const User = require("../models/users.js");
const ERR_PARAM = { err: "Incorrect parameters" };
const ERR_LOGIN = { err: "User not logged in" };
const Crud = require("./crud");
var fuzzyMatch = require("jaro-winkler");

/* Bulk import CR */
router.post("/importCR", function (req, res, next) {
  res.send("importing CR");
});

/* Search for CR */
router.post("/searchCR", function (req, res, next) {
  res.send("searching for a CR");
});

router.post("/getAllCRs", function (req, res, next) {
  //Get all CRs owned by the current user's org
  if (typeof req.body.organization != "undefined") {
    CR.find({ organization: req.body.organization }).exec(function (
      err,
      curCRs
    ) {
      console.log("Number of CRS to send:" + curCRs.length);
      res.send(curCRs);
    });
  }

  //if there is no current org, get all CRs owned by the current user
  User.findOne({ profile_id: req.user.id }).exec(function (err, curUser) {
    CR.find({ owner: curUser._id }).exec(function (err, curCRs) {
      console.log("CRS to send:" + curCRs.length);
      res.send(curCRs);
    });
  });
});

router.post("/createCR", function (req, res, next) {
  if (!req.user) {
    res.send(ERR_LOGIN);
  }
  Crud.cr.createCR(req, res, next).then(function (result) {
    res.send(result);
  });
});

module.exports = router;
