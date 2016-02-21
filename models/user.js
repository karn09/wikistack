// NOT USED
var mongoose = require('mongoose');
var db = require('./index')
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true}
});

var User = mongoose.model('User', userSchema);
module.exports.User = User;
