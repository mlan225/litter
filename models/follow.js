var mongoose = require('mongoose');

var FollowSchema = new mongoose.Schema({
  followerShortId: String,
  followingShortId: String
})

module.exports = mongoose.model('Follow', FollowSchema);