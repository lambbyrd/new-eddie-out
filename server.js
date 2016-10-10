var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');


var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var configDB = require('./config/database.js');

//static assets
app.use(express.static('public'));

//ejs templating
app.set('view engine', 'ejs');
app.use(expressLayouts);


//runs Server and connects to database
var runServer = function(callback) {
    mongoose.Promise = global.Promise;
    mongoose.connect(configDB.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(configDB.PORT, function() {
            console.log('Listening on localhost:' + configDB.PORT);
            if (callback) {
                callback();
            }
        });
        
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

//passport config

require('./config/passport')(passport);


//express setup

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//required for passport to work

app.use(session({ 
    secret: 'paddlingupstreamwithnopaddle', 
    name: 'eddie-out',
    //store: 'sessionStore',
    proxy: true,
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//set routes

app.use(require('./app/routes'));

exports.app = app;
exports.runServer = runServer;
//app.listen(process.env.PORT || 8080);