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

//newuser signup

router.post('/newuser', mainController.addNewUser);

//User login



//Browse rivers route
//router.get('/browse',  )

//chat function route

//router.get('/chat', )