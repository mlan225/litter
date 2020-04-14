var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var {getAllRelevantPosts} = require('../controllers/postController');


router.get('/', isLoggedIn, async function(req, res, next) {

  var postCounter = 25
  var posts = await getAllRelevantPosts(req.user);

  posts = posts.slice(posts.length - postCounter)

  res.render('index', {
    currentUser: req.user,
    posts,
    moment,
    postCounter,
  });
});

//DEV NOTE: Could clean this file up a bit by making one route for posts and more posts
router.post('/more', isLoggedIn, async function(req, res, next) {

  var posts = await getAllRelevantPosts(req.user);

  posts = posts.slice(posts.length - req.body.postCounter)

  res.render('index', {
    currentUser: req.user,
    posts,
    moment,
    postCounter: req.body.postCounter,
  });
});

module.exports = router;
