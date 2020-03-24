var {isLoggedIn} = require('../controllers/middleware');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/account/edit', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
