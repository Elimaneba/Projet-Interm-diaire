const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");
var UserSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
});

UserSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model("User", UserSchema);
