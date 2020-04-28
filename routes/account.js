var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Follow = require('../models/follow');
const moment = require('moment')

var { getAccountInfo, findUserForView, doesUserFollow, updatePostsForChange } = require('../controllers/accountController');
var {getAllUserPosts} = require('../controllers/postController');

router.get('/:id/edit', isLoggedIn, function(req, res, next) {
  res.render('accountEdit', { 
    currentUser: req.user
  });
});

router.post('/:id/edit', isLoggedIn, function(req, res, next) {
  User.findOneAndUpdate({'_id': req.user._id}, {
    handle: req.body.handle,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    bio: req.body.bio,
  }, {upsert: true}, (err, user) => {
    if(err) { console.log(err); }


    //find all posts with old name and change to new name
    updatePostsForChange(req.body.previousHandle, req.body.handle)


    res.redirect('/account/' + req.user._id + '/edit')
  })
})

router.get('/followers', isLoggedIn, function(req, res) {

  Follow.find({followerShortId: req.user.short_id}, async function(err, follows) {
    if(!follows) return console.log('no user found')

    var asyncForLoop = async function(follows) {
      for(let index = 0; index < follows.length; index++) {
        follows_array.push(await getAccountInfo(follows[index].followingShortId));
      }
      return new Promise(resolve => {
        resolve()
      })
    }

    var follows_array = [];

    await asyncForLoop(follows);

    res.render('accountFollowing', {currentUser: req.user, followed_users: follows_array})
  })
})

router.get('/:short_id/view', isLoggedIn, async function(req, res, next){  

  var userForView = await findUserForView(req.params.short_id);
  if(userForView.short_id !== req.user.short_id) {
    var userFollows = await doesUserFollow(req.user.short_id, req.params.short_id);
    console.log('doesUserFollow function returns: ' + userFollows)
  }

  var userPosts = await getAllUserPosts(req.params.short_id)

  res.render('accountView', 
  // DEV NOTE: hardcoding setting user posts to the default 25
  {
    userFound: userForView, 
    currentUser: req.user, 
    userFollows, 
    userPosts,
    moment,
    postCounter: 25,
  })
})

// DEV NOTE: repeated code with retrieving user posts
router.post('/:short_id/view/more', isLoggedIn, async function(req, res, next){  

  var userForView = await findUserForView(req.params.short_id);
  if(userForView.short_id !== req.user.short_id) {
    var userFollows = await doesUserFollow(req.user.short_id, req.params.short_id);
    console.log('doesUserFollow function returns: ' + userFollows)
  }

  var userPosts = await getAllUserPosts(req.params.short_id)
  if(!req.body.postCounter == 'all') {
    userPosts.slice(userPosts.length - req.body.postCounter)
  }

  res.render('accountView', 
  {
    userFound: userForView, 
    currentUser: req.user, 
    userFollows, 
    userPosts,
    moment,
    postCounter: req.body.postCounter,
  })
})


router.post('/search', isLoggedIn, async function(req, res) {

  // console.log('search short id: ' + req.body.short_id)

  // var userForView = await findUserForView(req.body.short_id);

  // if(userForView.short_id !== req.user.short_id) {
  //   var userFollows = await doesUserFollow(req.user.short_id, req.body.short_id);
  // }

  // res.render('accountView', {userFound: userForView, currentUser: req.user, userFollows, postCounter: 25})

  res.redirect('/account/' + req.body.short_id  + '/view');

})

router.post('/:followerShortId/:followingShortId/follow', isLoggedIn, function(req, res) {

  var follow_entity = new Follow ({
    followerShortId: req.params.followerShortId,
    followingShortId: req.params.followingShortId,
  })

  follow_entity.save(function(err, follow) {
    if(err) return console.log(err);

    console.log('saved the follow: ' + follow)

    res.redirect('/account/followers')
  })
})

router.post('/:followerShortId/:followingShortId/unfollow', isLoggedIn, function(req, res) {

  var followingShortId = req.params.followingShortId;
  var followerShortId = req.params.followerShortId;

  // DEV NOTE: make sure the the user is not entering the moderator in route
  if(followingShortId != 'vHN_B6IA7') {
    Follow.findOneAndDelete({'followerShortId': followerShortId, 'followingShortId': followingShortId}, (err, userFound) => {
      if(err) {console.log(err)}
      if(!userFound) {
        console.log('no user found')
      }

      res.redirect('/account/followers')
    })
  } else {
    res.redirect('/dashboard/')
  }
})

module.exports = router;
