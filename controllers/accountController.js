var User = require('../models/user');
var Follow = require('../models/follow');
var Post = require('../models/post');

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

var updatePostsForChange = function(previousHanle, newHandle) {

  console.log('initiating updatepostsforchange')

  var updatePost = function(postId, newPostHandle) {
    console.log('initiating updatepost to the new handle: ' + newPostHandle)
    return new Promise(resolve => {
      Post.findOneAndUpdate({'_id': postId}, {
        author: newPostHandle
      }, {upsert: true}, (err, post) => {
        if(err) { resolve(err); }
        resolve();
      })
    })
  }

  var updatePostsLoop = async function(posts) {
    console.log('initiating updatepostloop')
    for(let index = 0; index < posts.length; index++) {
      await updatePost(posts[index]._id, newHandle);
    }
    return new Promise(resolve => {
      resolve()
    })
  }

  var getPostsByHandle = function(previousHanle) {
    console.log('initiating getpostsbyhandle')
    return new Promise(resolve => {
      Post.find({'author': previousHanle}, function(err, posts) {
        if(err) {resolve(err);}
        if(!posts.length > 0) {resolve();}
        updatePostsLoop(posts)
        resolve();
      })
    })
     

  }

  getPostsByHandle(previousHanle);
}

module.exports = {
  getAccountInfo,
  findUserForView,
  doesUserFollow,
  updatePostsForChange,
}