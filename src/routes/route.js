const express = require('express');
const router = express.Router();
const urlController = require('../Controllers/urlController')
const userController = require("../Controllers/userController");

const middlewares = require('../middlewares/appMiddleware')

router.post('/signup', userController.RegisterUser)
router.post('/login', userController.Login);
router.post('/Logout', userController.Logout);


//POST API FOR url shorten  
router.post('/url/shorten', middlewares.auth, urlController.shortenUrl)

router.get('/urlCode', middlewares.auth, urlController.getshortcut)


router.get('/list', middlewares.auth, urlController.userList)

router.delete('/dellist', middlewares.auth, urlController.deleteshortcut)

module.exports = router;