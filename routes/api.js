const express = require("express");
var router = express.Router();
const CR = require("../models/crs.js");

/* Create CR */
router.get("/createCR", function (req, res, next) {
  const CR = new CR({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    notes: [],
    actions: [],
  });
  CR.save().then((theCR) => {
    res.send("created CR");
  });
});

/* Read CR */
router.get("/readCR", function (req, res, next) {
  res.send("reading CR(s)");
});

/* Update CR */
router.get("/editCR", function (req, res, next) {
  res.send("editing CR(s)");
});

/* Delete CR */
router.get("/deleteCR", function (req, res, next) {
  res.send("deleting CR(s)");
});

/* Bulk import CR */
router.get("/importCR", function (req, res, next) {
  res.send("importing CR");
});

/* Search for CR */
router.get("/searchCR", function (req, res, next) {
  res.send("searching for a CR");
});

module.exports = router;
