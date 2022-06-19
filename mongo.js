// for test purpose

const express = require('express');

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://dinesh:zL6iRSuHPozyNClo@cluster0.9x4kv.mongodb.net/products_test?retryWrites=true&w=majority';
// const url = 'mongodb://localhost:27017/?compressors=zlib&gssapiServiceName=mongodb';
// 
const createProduct = async (req,res,next) => {
	const newProduct = {
		name: req.body.name,
		price: req.body.price
	};
	const client = new MongoClient(url, { useUnifiedTopology: true });

	try {
		await client.connect();
		const db = client.db();
		const result = await db.collection('products').insertOne(newProduct);
	} catch(error) {
		// console.log(error);
		return res.json({message:'Could not store data'});
	}
	client.close();

	res.json(newProduct);
}

const getProducts = async (req,res,next) => {
	const client = new MongoClient(url, { useUnifiedTopology: true });

	let products;

	try {
		await client.connect();
		const db = client.db();
		products = await db.collection('products').find().toArray();

	} catch(error) {
		return res.json({message:'Could not retrive products'})
	}
	client.close();

	res.json(products);

}



const app = express();

app.use(express.json());

app.post('/products',createProduct);

app.get('/products',getProducts);

app.listen(3000);


exports.createProduct = createProduct;
exports.getProducts = getProducts;