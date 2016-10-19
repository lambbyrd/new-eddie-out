//new router
const express = require('express'),
  router = express.Router(),
  mainController = require('./controllers/main.controller'),
  locationController = require('./controllers/locations.controller');

//export router

module.exports = router;

//Routes

//homepage route
router.get('/', mainController.displayHome);

//sign up route
router.get('/signup', mainController.signUp);

//login route
router.get('/login', mainController.logIn);

//chat route
router.get('/chat', mainController.chatInit);

//profile page route

router.get('/profile',isLoggedIn, mainController.profileInit);

//newuser signup

router.post('/newuser', mainController.addNewUser);


//User login

router.post('/loginUser', mainController.loginUser);

//Is User Logged in

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

//logout

router.get('/logout', mainController.userLogout);

//get users data

router.get('/user_data', function(req, res) {

            if (req.user === undefined) {
                // The user is not logged in
                res.json({});
            } else {
                res.json({
                    user: req.user
                });
            }
        });

//Browse rivers route

router.get('/browse', mainController.browseRivers);

//get USGS Data

router.get('/usgs/:site', locationController.getUsgsFlow);
router.get('/locations', locationController.returnLocations);

//save usgs Favorites

router.post('/favorites/:site',isLoggedIn, mainController.sendToFavs);

//Delete Usgs Favorites

router.put('/deleteFavs/:site', isLoggedIn, mainController.deleteFavs);

//Add username and short description

router.post('/updateDetails', isLoggedIn, mainController.updateDetails);

router.post('/updatePass', isLoggedIn, mainController.updatePass);

