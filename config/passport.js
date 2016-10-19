var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user-model');

module.exports = function(passport) {
	
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

// Local Sign up
    passport.use('local-signup', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallBack : true 
    },
    
    function(email, password, done) {

        process.nextTick(function() {

 
        
        User.findOne({ 'email' :  email }, function(err, user) {
        		
            if (err){
                return done(err);
            }
            
            if (user) {
                return done(null, false, { message: 'That email is already taken!'});
            } else {
                
                var newUser      = new User();
                newUser.email    = email;
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err){
                        throw err;
                    }else{
                    	return done(null, newUser);
                    }
                });
            }

        });    

        });

    }));
    
    //Local Login
    
    passport.use('local-login', new LocalStrategy({
    	
    	usernameField : 'email',
        passwordField : 'password'

    	
    },
    function(email, password, done){
    	
    	User.findOne({'email' : email}, function(err, user){
    	    
    		if(err){
    		  
    			return done(err);
    		}
    		
    		if(!user){
 
    		    return done(null, false, { message: 'No one by the email'});
    		}
    		
    		if(!user.validPassword(password)){
    		   
    		    return done(null, false, { message: 'That is not the correct password!'});
    		}
    		
    		return done(null, user);
    		
    	});
    
    	
    }));

};