var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UsersSchema = new mongoose.Schema({
  username: String,
  handle: String,
  first_name: String,
  last_name: String,
  bio: String,
  profile_image: String,
  short_id: String,
  is_moderator: Boolean,
})

// auto add all the needed functions
UsersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UsersSchema);