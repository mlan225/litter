var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Follow = require('../models/follow');
var {getAccountInfo} = require('../controllers/accountController');

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
    res.redirect('/account/' + req.user._id + '/edit')
  })
})

router.get('/followers', isLoggedIn, function(req, res) {

  var currentUserId = req.user._id;

  Follow.find({follower_id: currentUserId}, async function(err, follows) {
    if(err) return console.log(err)
    if(!follows) return console.log('no user found')

    var asyncForLoop = async function(follows) {
      console.log('start')
      for(let index = 0; index < follows.length; index++) {
        follows_array.push(await getAccountInfo(follows[index].following_id));
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

router.get('/:short_id/view', isLoggedIn, function(req, res, next){
  User.findOne({'short_id': req.params.short_id}, (err, userFound) => {
    if(err) {console.log(err)}
    res.render('accountView', {userFound, currentUser: req.user})
  })
})

router.post('/search', isLoggedIn, function(req, res, next) {
  var short_id = req.body.short_id;

  User.findOne({'short_id': short_id}, (err, userFound) => {
    if(err) {console.log(err)}
    if(!userFound) {
      res.render('noAccountFound', {currentUser: req.user._id})
    }
    res.render('accountView', {userFound, currentUser:req.user})
  })
})

router.post('/:follower_id/:following_id/follow', isLoggedIn, function(req, res) {
  var following = req.params.following_id;
  var follower = req.params.follower_id;

  var follow_entity = new Follow ({
    follower_id: follower,
    following_id: following,
  })

  follow_entity.save(function(err) {
    if(err) return console.log(err);

    res.redirect('/account/followers')
  })
})

router.post('/:follower_id/:following_id/unfollow', isLoggedIn, function(req, res) {
  var following = req.params.following_id;
  var follower = req.params.follower_id;

  Follow.findOneAndDelete({'follower_id': follower, 'following_id': following}, (err, userFound) => {
    if(err) {console.log(err)}
    if(!userFound) {
      console.log('no user found')
    }
   
    res.redirect('/account/followers')
  })
})

module.exports = router;
