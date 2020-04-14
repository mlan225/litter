var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var Post = require('../models/post');


//create post
router.post('/create', isLoggedIn, function(req, res){
  var currentFormatDate = moment();

  var postObj = new Post ({
    author: req.body.author,
    authorShortId: req.body.authorShortId,
    authorProfileImage: req.body.authorProfileImage,
    message: req.body.message,
    messageDate: currentFormatDate,
  })

  postObj.save(function(err, post) {
    if(err) return console.log(err);

    res.redirect('/dashboard/')
  })
})



//delete post


//edit post

module.exports = router;
