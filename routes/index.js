var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/electricOrNot';
var db;

mongoClient.connect(mongoUrl, function(error, database){
	db = database;

})

/* GET home page. */
router.get('/', function(req, res, next) {
  // var cars = db.collection('cars').insert({name: 'Buick'});
  db.collection('cars').find({}).toArray(function(error,carResult){
  	// console.log(carResult);
  	// for(i=0; i<carResult.length; i++){
  	// 	console.log(carResult[i].imageSrc);
  	var getRandomImage = Math.floor(Math.random() * carResult.length);
  	 res.render('index', { carImage: carResult[getRandomImage].imageSrc });
  	// }
  })
  // console.log(cars);
});
router.post('/.electric', function(req, res, next){
  res.send(req.body);
});
router.post('/.notElectric', function(req, res, next){
  res.send(req.body);
});
module.exports = router;
