var Post = require('../models/post');
var User = require('../models/user');
var Follow = require('../models/follow');
const moment = require('moment')

//get all posts from followed accounts for user
var getAllRelevantPosts = function(currentUser) {
  console.log('starting the getAllRlevantPosts function wiht currentUser: ' + currentUser.short_id)

  var postsFromFollowedUsers = [];

  var pushPostsToArray = function(postToPush) {
    return new Promise(resolve => {
      postsFromFollowedUsers.push(postToPush);
      resolve();
    })
  }

  var findPostsFromCurrentUser = async function(currentUserShortId) {
    console.log('running findpostsfromcurrentuser')
    return new Promise(resolve => {
      Post.find({'authorShortId': currentUserShortId}, async function(err, currentUserPosts){
        // if(currentUserPosts.length <= 1) { resolve(null) }

        console.log('posts from current user')
        console.log(currentUserPosts)
        for(let index = 0; index < currentUserPosts.length; index++) {
          await pushPostsToArray(currentUserPosts[index]);
          resolve();
        }
      })
    })
  }

  
  return new Promise(async resolve => {
     //add current user posts to postsFromFollowedUsers from current user using currentUser before finding follower posts
     console.log('about to get posts from current user')
     await findPostsFromCurrentUser(currentUser.short_id);
     
    //create array of followed users from current user
    Follow.find({'followerShortId': currentUser.short_id}, async function(err, foundUsers) {
      //async for function for looping through users followed
      // console.log(foundUsers)

      // followingUsersArray = foundUsers
      var asyncFollowingUsersLoop = async function(foundUsers) {

        for(let index = 0; index < foundUsers.length; index++) {
          await getPostsFromUser(foundUsers[index].followingShortId);
        }
        return new Promise(resolve => {
          resolve()
        })
      }

      
      var getPostsFromUser = async function(followedUserShortId) {
        console.log('Preparing to find user posts with short id: ' + followedUserShortId)
      
        var findUserWithShortId = async function(err, user) {
          return new Promise(resolve => {
            User.findOne({'short_id': followedUserShortId}, function(err, user){
              resolve(user.short_id)
            })
          })
        }

        var findPostsWithShortId = async function(shortId) {
          return new Promise(resolve => {
            Post.find({'authorShortId': shortId}, async function(err, posts){
              for(let j_index = 0; j_index < posts.length; j_index++) {
                await pushPostsToArray(posts[j_index]);
                resolve();
              }
            })
          })
        }
        
        var userFoundShortId = await findUserWithShortId(followedUserShortId);
        await findPostsWithShortId(userFoundShortId);
        console.log(postsFromFollowedUsers);        
      }

      await asyncFollowingUsersLoop(foundUsers)
      const sortedPostsByDate = postsFromFollowedUsers.sort((a,b) => new moment(a.messageDate) - new moment(b.messageDate))
      resolve(sortedPostsByDate.reverse());
    })
  })
}


//get all posts from individual user for accountView
var getAllUserPosts = function(userShortId) {
  return new Promise(resolve => {
    Post.find({'authorShortId': userShortId}, async function(err, posts){
      resolve(posts.sort((a,b) => new moment(a.messageDate) - new moment(b.messageDate)))
    })
  })
}


module.exports = {
  getAllRelevantPosts,
  getAllUserPosts,
}


// Follow.find({followerShortId: req.user.short_id}, async function(err, follows) {
//   if(!follows) return console.log('no user found')

//   var asyncForLoop = async function(follows) {
//     for(let index = 0; index < follows.length; index++) {
//       follows_array.push(await getAccountInfo(follows[index].followingShortId));
//     }
//     return new Promise(resolve => {
//       resolve()
//     })
//   }

//   var follows_array = [];

//   await asyncForLoop(follows);

//   res.render('accountFollowing', {currentUser: req.user, followed_users: follows_array})
// })