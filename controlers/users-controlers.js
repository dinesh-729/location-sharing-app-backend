// const {v4:uuid} = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async(req,res,next) =>{
	let users;
	try {
		users = await User.find({},'-password');
	}catch(err) {
		const error = new HttpError('Fetching users failed, please try again later',500);
		return next(error);
	}
	res.status(200).json({users:users.map(user=>user.toObject({ getters: true }))});
}

const signup = async(req,res,next) => {
	const error = validationResult(req);
 	if (!error.isEmpty()) {
		return next(new Error ('Invalid inputs passed, please check your data',422));
	}
	
	const {name,email,password} = req.body;

	let existingUser;
	try{
		existingUser = await User.findOne({ email: email });
	}catch(err) {
		const error = new HttpError('Signing up failed, please try again later',500);
		return next(error);
	}

	if (existingUser){
		const error = new HttpError('User existing already, please login instead',422);
		return next(error);
	}

	let hasedPassword;
	try {
		hasedPassword = await bcrypt.hash(password, 12);	
	}catch (err) {
		const error = new HttpError('could not create a user. please try again',500);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		password: hasedPassword,
		image: req.file.path,
		places:[]
	});

	try {
		createdUser.save();
	}catch(err) {
		const error = new HttpError('Signing up failed, please try again later',500);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email }, 
			'txR7cs84@ks!isa43', 
			{ expiresIn: '1h' }
		);
	}catch(err){
		const error = new HttpError('Signing up failed, please try again later',500);
		return next(error);
	}

	res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
}

const login = async(req,res,next) => {
	const {email, password} = req.body;

	let existingUser;

	try{
		existingUser = await User.findOne({ email: email });
	}catch(err) {
		const error = new HttpError('Logging up failed, please try again later',500);
		return next(error);
	}

	if(!existingUser) {
		const error = new HttpError('Invalid credentials, could not log you in',403);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);		
	}catch(err) {
		const error = new HttpError('could not log you in, please check your credentials and try again.',500);
		return next(error);
	}

	if(!isValidPassword) {
		const error = new HttpError('Invalid credentials, could not log you in',401);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email }, 
			'txR7cs84@ks!isa43', 
			{ expiresIn: '1h' }
		);
	}catch(err){
		const error = new HttpError('Logging in failed, please try again.',500);
		return next(error);
	}

	res.json({ userId: existingUser.id, email: existingUser.email, token: token });
	
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login =login;