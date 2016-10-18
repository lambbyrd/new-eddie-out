var passport = require('passport');
var flash = require('connect-flash');

var User = require('../models/user-model');

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
  
  sendToFavs : (req, res) => {
	    var locationId = req.params.site;
	    
      User.findOneAndUpdate({'_id': req.user._id},{$push: {'favorites': locationId}}, function(err, user){
        if(err){
          throw err;
        }
        res.send(locationId);
      });
      
	},
	
	deleteFavs : (req, res) => {
	  
	  var siteCode = req.params.site;
	  
	  User.findOneAndUpdate({'_id': req.user._id},{$pull: {'favorites': siteCode}}, function(err, user){
	    if(err){
	      throw err
	    }
	    
	    res.send({'message' : 'Favorite Removed'});
	  });
	  
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