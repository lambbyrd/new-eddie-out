var passport = require('passport');
var flash = require('connect-flash');
module.exports = {
  
  //displays homepage content
  
  displayHome : (req,res) => {
 
    res.render('pages/home');

  }, 
  
  signUp: (req, res) => {
    
    res.render('pages/signup', {message: req.flash('error')});
  },
  
  logIn : (req, res) => {
    res.render('pages/login', {message: req.flash('error')});

  },
  
  chatInit: (req, res) => {
    res.render('pages/chat');
  },

  
  profileInit: (req, res) => {
  
    
    res.render('pages/profile', {
      user : req.user
    });
  },
  
  userLogout : (req, res) => {
    req.logout();
    res.redirect('/');
  },
  
  addNewUser: passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }),
    
  loginUser : passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  })
};