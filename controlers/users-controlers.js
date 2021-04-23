const {v4:uuid} = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
	{
		id:'u1',
		name: 'Jacky',
		email: 'test@test.com',
		password: 'test'
	}
]

const getUsers = (req,res,next) =>{
	res.status(200).json({users:DUMMY_USERS});
}

const signup = (req,res,next) => {
	const error = validationResult(req);
 	if (!error.isEmpty()) {
		throw new Error ('Invalid inputs passed, please check your data',422);
	}
	
	const {name,email,password} = req.body;

	const hasUser = DUMMY_USERS.find(u=>u.email===email);
	if (hasUser) {
		throw new HttpError('Could not create a user, email already exists.',422);
	}

	const createuser = {
		id:uuid(),
		name,
		email,
		password
	};

	DUMMY_USERS.push(createuser);

	res.status(201).json({user:createuser});
}

const login = (req,res,next) => {
	const {email, password} = req.body;

	const identifiedUser = DUMMY_USERS.find(u=>u.email===email);

	if (!identifiedUser || identifiedUser.password !== password) {
		throw new Error('Could not identify user',401);
	}

	res.json({message:'Logged In'});
	
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login =login;