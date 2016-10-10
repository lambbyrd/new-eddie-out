var passport = require('passport');
module.exports = {
  
  //displays homepage content
  
  displayHome : (req,res) => {
 
    res.render('pages/home');

  }, 
  
  signUp: (req, res) => {
    res.render('pages/signup');
  },
  
  addNewUser: passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })
};