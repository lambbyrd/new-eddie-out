//new router
const express = require('express'),
  router = express.Router(),
  mainController = require('./controllers/main.controller');

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

//Browse rivers route
//router.get('/browse',  )

//chat function route

//router.get('/chat', )