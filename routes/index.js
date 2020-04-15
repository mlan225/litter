var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var {getAllRelevantPosts, getAllUserPosts} = require('../controllers/postController');


router.get('/', isLoggedIn, async function(req, res, next) {

  // DEV NOTE: hard coding mod posts to 5 for now this feature can be adjusted for future development

  var postCounter = 25;
  var modPostCounter = 5;

  var posts = await getAllRelevantPosts(req.user);
  //DEV NOTE: update to have multiple moderators. Search for each moderator post and send to view.
  var modPosts = await getAllUserPosts('vHN_B6IA7')

  posts = posts.slice(posts.length - postCounter)
  modPosts = modPosts.slice(modPosts.length - modPostCounter)

  res.render('index', {
    currentUser: req.user,
    posts,
    moment,
    postCounter,
    modPosts,
  });
});

//DEV NOTE: Could clean this file up a bit by making one route for posts and more posts
router.post('/more', isLoggedIn, async function(req, res, next) {

  var posts = await getAllRelevantPosts(req.user);
  //DEV NOTE: update to have multiple moderators. Search for each moderator post and send to view.
  var modPosts = await getAllUserPosts('vHN_B6IA7')

  if(!req.body.postCounter == 'all') {
    posts = posts.slice(posts.length - req.body.postCounter) 
  }
  modPosts = modPosts.slice(modPosts.length - 5)

  res.render('index', {
    currentUser: req.user,
    posts,
    moment,
    postCounter: req.body.postCounter,
    modPosts,
  });
});

module.exports = router;
