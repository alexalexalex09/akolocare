const express = require("express");
var router = express.Router();
const CR = require("../models/crs.js");
const User = require("../models/users.js");
const ERR_PARAM = { err: "Incorrect parameters" };
const ERR_LOGIN = { err: "User not logged in" };
var fuzzyMatch = require("jaro-winkler");

/**
 * Checking by param, iterate through newArray to update existing elements and add new elements
 * @param {Array} arrayToModify
 * @param {Array} newArray
 * @param {String} param
 */
function addOrReplaceObjectsInArray(arrayToModify, newArray, param) {
  newArray.forEach(function (e, i) {
    theIndex = arrayToModify.findIndex(function (curEl) {
      return curEl[param] == e[param];
    });
    if (theIndex > -1) {
      //if the current id matches an existing _id
      arrayToModify[curInd] = newArray[i]; // then replace it with the new note
    } else {
      arrayToModify.push(newArray[i]); // otherwise add it to then end
    }
  });
  return arrayToModify;
}

/* Create CR */
router.get("/createCR", function (req, res, next) {
  if (
    typeof req.body.firstName == "undefined" ||
    typeof req.body.lastName == "undefined"
  ) {
    res.send(ERR_PARAM);
  }
  const CR = new CR({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    notes: [],
    actions: [],
  });
  CR.save().then((theCR) => {
    res.send(theCR);
  });
});

/* Read CR */
router.get("/readCR", function (req, res, next) {
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  CR.findOne({ profile_id: req.user.id }).exec(function (err, curCR) {
    res.send(curCR);
  });
});

/* Update CR */
router.get("/editCR", function (req, res, next) {
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  //get the curCR based on its id
  CR.findOne({ profile_id: req.user.id }).exec(function (err, curCR) {
    //If a firstName has been passed, replace
    if (typeof req.body.firstName != "undefined") {
      curCR.firstName = req.body.firstName;
    }
    //if a lastName has been passed, replace
    if (typeof req.body.lastName != "undefined") {
      curCR.lastName = req.body.lastName;
    }
    //if an array of notes has been passed, analyze it and add or replace elements
    if (Array.isArray(req.body.notes)) {
      //for each note in the new array, check to see if it is brand new or an edit
      curCR.notes = addOrReplaceObjectsInArray(
        curCR.notes,
        req.body.notes,
        "_id"
      );
    }
    //if an array of actions has been passed, analyze it and add or replace elements
    if (Array.isArray(req.body.actions)) {
      curCR.actions = addOrReplaceObjectsInArray(
        curCR.actions,
        req.body.actions,
        "_id"
      );
    }
    curCR.save().then(function (theCR) {
      res.send(theCR);
    });
  });
});

/* Delete CR */
router.get("/deleteCR", function (req, res, next) {
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  CR.deleteOne({ _id: req.body.id }).exec(function (err, curCR) {
    res.send(curCR);
  });
  CR.res.send("deleting CR(s)");
});

/* Create Org */
router.get("/createOrganization", function (req, res, next) {
  if (typeof req.body.name == "undefined") {
    res.send(ERR_PARAM);
  }
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  //Find the user so that we can get the _id from the profile_id
  User.findOne({ profile_id: req.user.id }).exec(function (err, curUser) {
    //create a new organization
    const Organization = new Organization({
      name: req.body.name,
      owner: curUser._id,
    });
    //save the organization
    Organization.save().then((theOrganization) => {
      res.send(theOrganization);
    });
  });
});

/* Read Organization */
router.get("/readOrganization", function (req, res, next) {
  if (typeof req.body.id == "undefined") {
    res.send(ERR_PARAM);
  }
  Organization.findOne({ _id: req.body.id }).exec(function (
    err,
    curOrganization
  ) {
    res.send(curOrganization);
  });
});

/* Update Organization */
router.get("/editOrganization", function (req, res, next) {
  if (typeof req.user.id == "undefined") {
    res.send(ERR_PARAM);
  }
  //get the curOrganization based on its id
  Organization.findOne({ _id: req.body.id }).exec(function (
    err,
    curOrganization
  ) {
    //If a name has been passed, replace
    if (typeof req.body.name != "undefined") {
      curOrganization.name = req.body.name;
    }
    //If a code has been passed, replace
    if (
      typeof req.body.code != "undefined" &&
      curUser.code == req.body.confirm
    ) {
      //Only the current owner can change the code
      User.findOne({ profile_id: req.user.id }).exec(function (err, curUser) {
        if (curOrganization.owner == curUser._id) {
          curOrganization.code = req.body.code;
        }
      });
    }
    //If an owner has been passed, replace
    if (typeof req.body.owner != "undefined") {
      //find a user based on the passed profile_id
      User.findOne({ profile_id: req.body.owner }).exec(function (
        err,
        curUser
      ) {
        curOrganization.owner = curUser._id;
      });
    }
    curOrganization.save().then(function (err, curOrganization) {
      res.send(curOrganization);
    });
  });
});

/* Delete Organization */
router.get("/deleteOrganization", function (req, res, next) {
  if (typeof req.body.id == "undefined") {
    res.send(ERR_PARAM);
  }
  Organization.deleteOne({ _id: req.body.id }).exec(function (
    err,
    theOrganization
  ) {
    res.send(theOrganization);
  });
});

/* Create User */
router.get("/createUser", function (req, res, next) {
  if (
    typeof req.body.firstName == "undefined" ||
    typeof req.body.lastName == "undefined" ||
    typeof req.body.organization == "undefined"
  ) {
    res.send(ERR_PARAM);
  }
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  const User = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profile_id: req.user.id,
    darkMode: false,
    organization: req.body.organization,
  });
  User.save().then((theUser) => {
    res.send(theUser);
  });
});

/* Read User */
router.get("/readUser", function (req, res, next) {
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  User.findOne({ profile_id: req.user.id }).exec(function (err, curUser) {
    res.send(curUser);
  });
});

/* Update User */
router.get("/editUser", function (req, res, next) {
  if (typeof req.user.id == "undefined") {
    res.send(ERR_LOGIN);
  }
  //get the curUser based on its id
  User.findOne({ profile_id: req.user.id }).exec(function (err, curUser) {
    //If a firstName has been passed, replace
    if (typeof req.body.firstName != "undefined") {
      curUser.firstName = req.body.firstName;
    }
    //if a lastName has been passed, replace
    if (typeof req.body.lastName != "undefined") {
      curUser.lastName = req.body.lastName;
    }
    //if darkMode has been passed, change it
    if (typeof req.body.darkMode != "undefined") {
      curUser.darkMode = req.body.darkMode;
    }
    curUser.save().then(function (theUser) {
      res.send(theUser);
    });
  });
});

/* Delete User */
router.get("/deleteUser", function (req, res, next) {
  User.deleteOne({ profile_id: req.body.id }).exec(function (err, curUser) {
    res.send(curUser);
  });
  User.res.send("deleting CR(s)");
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
