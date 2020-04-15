var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Follow = require('../models/follow');
var {setAccountImage} = require('../controllers/userImageController');
const shortid = require('shortid');

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local',
{
  successRedirect: "/dashboard",
  failureRedirect: "/login"
}))

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'login'});
})

router.post('/register', async (req, res, next) => {

  // if the pass and confirm pass do not match then send user back to register page
  if(req.body.password != req.body.confirm_password) {
    console.log('pass and confirm pass do not match. Sending user back to register')
    //DEV NOTE: there a log message about resetting headers when this point is reached. 
    res.redirect('/register');
  }

  var followModAccount = function(accountShortId) {
    return new Promise(resolve => {
      var follow_entity = new Follow ({
        followerShortId: accountShortId,
        followingShortId: 'vHN_B6IA7',
      })
    
      follow_entity.save(function(err, follow) {
        if(err) resolve(err);
        resolve()
      })
    })
  }

  var newUser = new User({
    email: req.body.email,
    handle: req.body.handle,
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    bio: null,
    profile_image: await setAccountImage(),
    short_id: shortid.generate(),
    is_moderator: false,
  });

  User.register(newUser, req.body.password,(err, user) => {
    if(err) {
      console.log(err)
      return res.render('register');
    }
    passport.authenticate("local")(req, res, async () => {
      //manually have the user follow the mod account
      await followModAccount(user.short_id);

      res.redirect("/dashboard")
    })
  });
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router;
