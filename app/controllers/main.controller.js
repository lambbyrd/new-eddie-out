var passport = require('passport');
module.exports = {
  
  //displays homepage content
  
  displayHome : (req,res) => {
 
    res.render('pages/home');

  }, 
  
  signUp: (req, res) => {
    res.render('pages/signup',{message:'Will get this working'});
  },
  
  logIn : (req, res) => {
    res.render('pages/login', {message: 'Will get this working'});
  },
  
  chatInit: (req, res) => {
    res.render('pages/chat');
  },
  
  addNewUser: passport.authenticate('local-signup', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }),
    
  loginUser : passport.authenticate('local-login', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  })
};