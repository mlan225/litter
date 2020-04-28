var mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
  requestType: String,
  authorHandle: String,
  authorShortId: String,
  subject: String,
  message: String,
  dateCreated: String,
})

module.exports = mongoose.model('Request', RequestSchema);