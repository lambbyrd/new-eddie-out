//new router
const express = require('express'),
  router = express.Router(),
  mainController = require('./controllers/main.controller');

//export router

module.exports = router;

//Routes

//homepage route
router.get('/', mainController.displayHome);

router.get('/signup', mainController.signUp);

//newuser

router.post('/newuser', mainController.addNewUser);

//Browse rivers route
//router.get('/browse',  )

//chat function route

//router.get('/chat', )