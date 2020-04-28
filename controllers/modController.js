var Request = require('../models/request');
var Users = require('../models/user');
var moment = require('moment');

var getUserRequests = function() {
  return new Promise(resolve => {
    Request.find({}, async function(err, requests){
      if(requests.length == 0) {
        // DEV NOTE: returning empty array for no posts found. Will error out when running array checks on no results
        resolve([]);
      }
      console.log(requests)
      resolve(requests.sort((a,b) => new moment(a.dateCreated) - new moment(b.dateCreated)))
    })
  })
}

var getNumberOfUsers = function() {
  return new Promise(resolve => {
    Users.find({}, function(err, users) {
      if(!users.length > 0) {
        resolve(0);
      } else {
        resolve(users.length);
      }
    })
  })
}

var getNumberOfRequests = function() {
  return new Promise(resolve => {
    Request.find({}, function(err, requests) {
      if(!requests.length > 0) {
        resolve(0);
      } else {
        resolve(requests.length);
      }
    })
  })
}

module.exports = {
  getUserRequests,
  getNumberOfUsers,
  getNumberOfRequests
}