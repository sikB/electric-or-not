var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || 
'mongodb://localhost:27017/electricOrNot';
var db;


// 'mongodb://localhost:27017/electricOrNot'
mongoClient.connect(mongoUrl, function(error, database){
  // db.collection('cars').find({}).toArray(function(error,carResult){
  //   var getRandomImage = Math.floor(Math.random() * carResult.length);
	db = database;

  })
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  db.collection('cars').find({}).toArray(function(error,carResult){
    var getRandomImage = Math.floor(Math.random() * carResult.length);
    var currIP = req.ip;
    console.log('The current users IP is: ' + currIP);
    db.collection('users').find({ip:currIP}).toArray(function(error, userResult){
      if(userResult.length == 0){
        // photosToShow = allPhotos;
      }
      
    })



  	res.render('index', { carImage: carResult[getRandomImage].imageSrc });
  })
});

router.post('/electric', function(req, res, next){
  // res.send(req.body);
  db.collection('cars').updateOne(
  {imageSrc: req.body.photo},
  {$set: {'totalVotes': 1}},
  function(error, results){
    console.log(results);
  }
  )
  res.send('The user chose ' + req.body.photo + ' as an electric car');
});

router.post('/notElectric', function(req, res, next){
  // res.send(req.body);
  db.collection('cars').updateOne(
  {imageSrc: req.body.photo},
  {$set: {'totalVotes': -1}},
  function(error, results){
    console.log(results);
  }
  )
  res.send('The user chose ' + req.body.photo + ' as not an electric car');
});

module.exports = router;
