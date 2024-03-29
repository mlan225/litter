var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var accountRouter = require('./routes/account');
var postRouter = require('./routes/post');
var requestRouter = require('./routes/request');

var User = require('./models/user');

var {isLoggedIn} = require('./controllers/middleware');

var app = express();

// for local use, include the db connection string in place of 'process.env.DB'
mongoose.connect(process.env.DB,{ useNewUrlParser : true, useUnifiedTopology: true});
mongoose.connection.on("error",(err)=>{
    console.log("err",err);
});
mongoose.connection.on("connected",(err,res) => {
    console.log("mongoose is connected");
});

// passport config
app.use(require("express-session")({
  secret: "Fusce egestas elit",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//included with passport local mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/dashboard', indexRouter);
app.use('/', authRouter);
app.use('/account', accountRouter);
app.use('/post', postRouter);
app.use('/request', requestRouter);

app.use('*', isLoggedIn, function(req, res) {
  res.redirect('/dashboard/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
