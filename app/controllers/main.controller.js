var passport = require('passport');
var flash = require('connect-flash');

module.exports = {
  
  //displays homepage content
  
  displayHome : (req,res) => {
    var locals = { 
      user: req.user,
    }
    res.render('pages/home', locals)
  }, 
  
  signUp: (req, res) => {
    var locals = { 
      user: req.user,
      message: req.flash('error')
    }
    res.render('pages/signup', locals)
  },
  
  logIn : (req, res) => {
    var locals = { 
      user: req.user,
      message: req.flash('error')
    }
    res.render('pages/login', locals)
  },
  
  chatInit: (req, res) => {
    var locals = { 
      user: req.user,
    }
    res.render('pages/chat', locals);
  },

  
  profileInit: (req, res) => {
    var locals = { 
      user: req.user
    }
    console.log('locals:', locals)
    res.render('pages/profile', locals)
  },
  
  browseRivers: (req, res) =>{
    var locals = { 
      user: req.user,
    }
    res.render('pages/browse', locals);
  },
  
  userLogout : (req, res) => {
    var locals = { 
      user: req.user,
    }
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