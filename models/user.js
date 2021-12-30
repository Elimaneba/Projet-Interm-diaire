const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var userSchema = mongoose.Schema({
  fullname: { 
    type: String, 
    required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true },
  password: { 
    type: String, 
    required: true 
  },
  phone: {
    type: Number,
    default: 770000000
},
pays: {
  type: String,
  default: "pays non renseigner"
},
region: {
  type: String,
  default: "region non renseigner"
},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
