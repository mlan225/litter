var Post = require('../models/post');
var User = require('../models/user');
var Follow = require('../models/follow');

//get all posts from followed accounts for user
var getAllRelevantPosts = function(currentUserShortId) {
  var postsFromFollowedUsers = [];

  //create array of followed users from current user
  // Follow.find({'followerShortId': currentUserShortId}, function(err, foundUser) {
    
  // })

  //loop through array and pull posts from users followed by the current user to store in new array


}


//get all posts from individual user
var getAllUserPosts = function() {

}


module.exports = {
  getAllRelevantPosts,
  getAllUserPosts,
}