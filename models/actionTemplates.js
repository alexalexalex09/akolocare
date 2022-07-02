//These are templates for actions that can be copied and assigned to CRs
//Set up mongoose connection
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Create schema
var ActionTemplateSchema = new Schema(
  {
    name: String,
    description: String,
    steps: [{ name: String, day: Number, required: Boolean }],
  },
  { collection: "actionTemplates" }
);

module.exports = mongoose.model("ActionTemplate", ActionTemplateSchema);
/*

//Export function to create "SomeModel" model class
module.exports = mongoose.model('SomeModel', SomeModelSchema );

You can then require and use the model immediately in other files. Below we show how you might use it to get all instances of the model.

//Create a SomeModel model just by requiring the module
var SomeModel = require('../models/somemodel')

// Use the SomeModel object (model) to find all SomeModel records
SomeModel.find(callback_function);
*/
