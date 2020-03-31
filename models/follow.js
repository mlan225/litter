var mongoose = require('mongoose');

var FollowSchema = new mongoose.Schema({
  follower_id: String,
  following_id: String
})

module.exports = mongoose.model('Follow', FollowSchema);