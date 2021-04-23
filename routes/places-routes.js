const express = require('express');

const { check } = require('express-validator');

const placesControlers = require('../controlers/places-controlers');

const router = express.Router();

router.get('/:pid',placesControlers.getPlacesById);

router.get('/user/:uid',placesControlers.getPlacesByUserId);

router.post(
	'/', 
	[
		check('title').not().isEmpty(),
		check('description').isLength({min: 5}),
		check('address').not().isEmpty()
	], 
	placesControlers.createPlace);

router.patch(
	'/:pid',
	 [
		 check('title').not().isEmpty(),
		 check('description').isLength({min: 5}) 
	 ],
	 placesControlers.updatePlace);

router.delete('/:pid',placesControlers.deletePlace);

module.exports = router;