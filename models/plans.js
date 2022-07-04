//These are individual actions that have been created from ActionTemplates and assigned to specific CRs
//Set up mongoose connection
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Create schema
var planSchema = new Schema(
  {
    name: String,
    description: String,
    startDate: String,
    completed: Boolean,
    archived: Boolean,
    CR: Schema.Types.ObjectId,
    steps: [
      { name: String, date: Number, required: Boolean, completed: String },
    ],
  },
  { collection: "plans" }
);

module.exports = mongoose.model("plan", planSchema);
/*

//Export function to create "SomeModel" model class
module.exports = mongoose.model('SomeModel', SomeModelSchema );

You can then require and use the model immediately in other files. Below we show how you might use it to get all instances of the model.

//Create a SomeModel model just by requiring the module
var SomeModel = require('../models/somemodel')

// Use the SomeModel object (model) to find all SomeModel records
SomeModel.find(callback_function);
*/
