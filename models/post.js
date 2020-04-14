var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  author: String,
  authorShortId: String,
  authorProfileImage: String,
  message: String,
  messageDate: String,
})

module.exports = mongoose.model('Post', PostSchema);