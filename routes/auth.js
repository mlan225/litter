var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
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
  var newUser = new User({
    email: req.body.email,
    handle: req.body.handle,
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    bio: null,
    profile_image: await setAccountImage(),
    short_id: shortid.generate(),
  });
  User.register(newUser, req.body.password,(err, user) => {
    if(err) {
      console.log(err)
      return res.render('register');
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/dashboard")
    })
  });
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router;
