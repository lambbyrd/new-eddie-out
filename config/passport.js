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


    passport.use('local-signup', new LocalStrategy({
       
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallBack : true 
    },
    
    function(email, password,done) {
    	
        process.nextTick(function() {

        User.findOne({ 'email' :  email }, function(err, user) {
        		
            if (err){
                return done(err);
            }
            
            if (user) {
                return done(null, false, {message: 'That email is already taken!'});
            } else {
								
                var newUser      = new User();
                newUser.email    = email;
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err){
                    	console.log('save error is firing');
                        throw err;
                    }else{
                    	return done(null, newUser);
                    }
                });
            }

        });    

        });

    }));

};