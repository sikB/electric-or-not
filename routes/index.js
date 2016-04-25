var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || 
'mongodb://localhost:27017/electricOrNot';
var db;


// 'mongodb://localhost:27017/electricOrNot'
mongoClient.connect(mongoUrl, function(error, database){
	db = database;

})

/* GET home page. */
router.get('/', function(req, res, next) {
  db.collection('cars').find({}).toArray(function(error,carResult){
  	var getRandomImage = Math.floor(Math.random() * carResult.length);
  	 res.render('index', { carImage: carResult[getRandomImage].imageSrc });
  })
});

router.post('/electric', function(req, res, next){
  // res.send(req.body);
  res.send('The user chose ' + req.body.photo + ' as an electric car');
});

router.post('/notElectric', function(req, res, next){
  // res.send(req.body);
  res.send('The user chose ' + req.body.photo + ' as not an electric car');
});

module.exports = router;
