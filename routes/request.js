var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var Request = require('../models/request');

router.get('/', isLoggedIn, function(req, res) {
  res.render('requestForm', {
    currentUser: req.user,
    moment,
  });
})


//create request
router.post('/create', isLoggedIn, function(req, res){
  var currentFormatDate = moment();

  var requestObj = new Request ({
    requestType: req.body.requestType,
    authorHandle: req.body.handle,
    authorShortId: req.body.shortId,
    subject: req.body.subject,
    message: req.body.message,
    dateCreated: currentFormatDate,
  })

  requestObj.save(function(err, request) {
    if(err) return console.log(err);

    res.redirect('/dashboard/')
  })
})

// DEV NOTE: these routes are not protected by a mod check
router.get('/single/view/:requestId', isLoggedIn, function(req, res){
  var requestId = req.params.requestId;

  Request.findById(requestId, function(err, request) {
    if(err) return err;
    res.render('requestSingleView', 
    {
      currentUser: req.user,
      request,
      moment
    });
  })
})


//delete request
router.post('/delete', isLoggedIn, function(req, res){
  Request.findOneAndDelete({'_id': req.body.requestId}, (err, requestDeleted) => {
    if(err) {console.log(err)}
    if(!requestDeleted) {
      console.log('no request found')
    }
  
    res.redirect('/dashboard/')
  })
})

module.exports = router;