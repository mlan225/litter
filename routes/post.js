var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var Post = require('../models/post');


//create post
router.post('/create', isLoggedIn, function(req, res){
  var currentFormatDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"

  var postObj = new Post ({
    author: req.body.author,
    authorShortId: req.body.authorShortId,
    authorProfileImage: req.body.authorProfileImage,
    message: req.body.message,
    messagDate: currentFormatDate,
  })

  postObj.save(function(err, post) {
    if(err) return console.log(err);

    res.redirect('/dashboard/')
  })
})



//delete post


//edit post

module.exports = router;
