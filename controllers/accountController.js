var User = require('../models/user');
var Follow = require('../models/follow');

function getAccountInfo(follow) {

  console.log(follow)

  return new Promise(resolve => {
    User.findOne({'short_id': follow}, function(err, userFound){
      if(err) return console.log(err)
      if(!userFound) return;

      resolve({
        _id: userFound._id,
        handle: userFound.handle,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        profile_image: userFound.profile_image,
        short_id: userFound.short_id,
        is_moderator: userFound.is_moderator,
      })
    })
  })
}

var findUserForView = function(accountShortId) {
  return new Promise(resolve => {
    User.findOne({'short_id': accountShortId}, (err, userFound) => {
      if(err) {console.log(err)}
      
      resolve(userFound)
    })
  })
}

var doesUserFollow = function(currentUserShortId, accountShortId){
  return new Promise(resolve => {
    Follow.findOne({"followerShortId": currentUserShortId, "followingShortId": accountShortId}, (err, followedUser) => {
      if(err) {console.log(err)}

      if(!followedUser) {
        resolve(false)
      } else {
        resolve(true)
      } 
    })
  })
}


module.exports = {
  getAccountInfo,
  findUserForView,
  doesUserFollow
}