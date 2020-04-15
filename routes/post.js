var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var Post = require('../models/post');


//create post
router.post('/create', isLoggedIn, function(req, res){
  var currentFormatDate = moment();

  // DEV NOTE: hardcoding isModPost check

  var postObj = new Post ({
    author: req.body.author,
    authorShortId: req.body.authorShortId,
    authorProfileImage: req.body.authorProfileImage,
    message: req.body.message,
    messageDate: currentFormatDate,
    isModPost: req.body.authorShortId == 'vHN_B6IA7' ? true : false,
  })

  postObj.save(function(err, post) {
    if(err) return console.log(err);

    res.redirect('/dashboard/')
  })
})



//delete post
// DEV NOTE the bulk of this function should be handled in the postController
router.post('/delete', isLoggedIn, function(req, res){

  Post.findOneAndDelete({'_id': req.body.post_id}, (err, userDeleted) => {
    if(err) {console.log(err)}
    if(!userDeleted) {
      console.log('no user found')
    }
   
    res.redirect('/dashboard/')
  })
})


//edit post


module.exports = router;
