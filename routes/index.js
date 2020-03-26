var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();


router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { 
    user: req.user
  });
});

module.exports = router;
