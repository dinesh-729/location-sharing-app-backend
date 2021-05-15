const express = require('express');
const { check } = require('express-validator');

const usersControlers = require('../controlers/users-controlers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/',usersControlers.getUsers);

router.post(
	'/signup',
	fileUpload.single('image'),
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({min:6})
	],
	usersControlers.signup
);

router.post('/login',usersControlers.login);

module.exports = router;