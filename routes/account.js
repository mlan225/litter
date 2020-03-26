var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/:id/edit', isLoggedIn, function(req, res, next) {
  res.render('accountEdit', { 
    user: req.user
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

module.exports = router;
