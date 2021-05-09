// for test purpose

const mongoose = require('mongoose');

const Product = require('./models/products');

mongoose.connect(
	'mongodb+srv://dinesh:zL6iRSuHPozyNClo@cluster0.9x4kv.mongodb.net/products_test?retryWrites=true&w=majority',
	{ useUnifiedTopology: true }
).then(()=>{
	console.log('connected to database');
}).catch(()=>{
	console.log('connection failed')
});

const createProduct = async (req,res,next) => {
	const createdProduct = new Product({
		name: req.body.name,
		price: req.body.price
	});
	const result = await createdProduct.save();

	res.json(result);
};

const getProducts = async (req,res,next) => {
	const products = await Product.find().exec();
	res.json(products);
}



const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/products',createProduct);

app.get('/products',getProducts);

app.listen(3000);


exports.createProduct = createProduct;