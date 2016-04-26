var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || 
'mongodb://localhost:27017/electricOrNot' || 'https://still-chamber-54392.herokuapp.com/';
var db;

mongoClient.connect(mongoUrl, function(error, database){
	db = database;
  })

/* GET home page. */
router.get('/', function(req, res, next) {
  var photosVoted = [];
  var currIP = req.ip;
  db.collection('users').find({ip:currIP}).toArray(function(error, userResult){ 
    for(i=0; i<userResult.length; i++){
            photosVoted.push(userResult[i].image);
        }

    db.collection('cars').find({imageSrc: {$nin: photosVoted}}).toArray(function(error, result){
    if(result.length == 0){
      res.redirect('/standings');
    }else{
      var getRandomImage = Math.floor(Math.random() * result.length);
      res.render('index', { carImage: result[getRandomImage].imageSrc });
      } 
    });
  });
});

router.get('/standings', function(req, res, next){
  db.collection('cars').find().toArray(function(error, result){
    result.sort(function(a,b){
      return (b.totalVotes - a.totalVotes)
    });
    res.render('standings', {theStandings: result});
  });
});

router.post('/electric', function(req, res, next){
  // res.send(req.body);
  db.collection('users').insertOne({
    ip: req.ip,
    vote: 'electric',
    image: req.body.photo
  });
  db.collection('cars').find({imageSrc: req.body.photo}).toArray(function(error, result){
    if(isNaN(result[0].totalVotes)){
      total = 0;
    }else{
      total = result[0].totalVotes;
    }
     db.collection('cars').updateOne(
      {imageSrc: req.body.photo},
      {$set: {'totalVotes': total + 1}},
      function(error, results){
        // console.log(results);
      }
    )
  });
  res.redirect('/');
});

router.post('/notElectric', function(req, res, next){
  db.collection('users').insertOne({
    ip: req.ip,
    vote: 'notElectric',
    image: req.body.photo
  });

  db.collection('cars').find({imageSrc: req.body.photo}).toArray(function(error, result){
    if(isNaN(result[0].totalVotes)){
      total = 0;
    }else{
      total = result[0].totalVotes;
    }

  db.collection('cars').updateOne(
  {imageSrc: req.body.photo},
  {$set: {'totalVotes': total - 1}},
  function(error, results){ 
    }
  )
});
  res.redirect('/');
});

module.exports = router;