const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');



/* GET home page. */
router.get('/', function(req, res) {
  // console.log(req);
  // return res.send(JSON.stringify([
  //   {aaa: 100},
  //   {aaa: 100},
  //   {aaa: 100},
  //   {aaa: 100},
  // ]));
  // return res.send("<h1>Hello world</h1>");
  return res.sendFile("index.html");
});





// router.use(express.static(path.join(__dirname, 'public')));
/*
router.get('/calc', function(req, res) {
  return res.sendFile("calculator.html", {root: path.join('public','calc')});
});


router.get('/weather', function(req, res) {
  return res.sendFile("countiresIndex.html", {root: path.join('public','weather')});
});


router.get('/users/register', function(req, res) {
  return res.sendFile("register.html", {root: path.join('public','register')});
});

router.get('/users/web', function(req, res) {
  return res.sendFile("web.html", {root: path.join('public','web')});
});
router.get('/users/webDrink', function(req, res) {
  return res.sendFile("webDrink.html", {root: path.join('public','webDrink')});
});
router.get('/users/webHamama', function(req, res) {
  return res.sendFile("webHamama.html", {root: path.join('public','webHamama')});
});
router.get('/users/webFruit', function(req, res) {
  return res.sendFile("webFruit.html", {root: path.join('public','webFruit')});
});


/* My project. */

router.get('/users/project', function(req, res) {
  return res.sendFile("index.html", {root: path.join('public','project')});
});






router.get('/axios', function(req, res) {
  val = "vodka";
  axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + val)
    .then(function (response) {
      return res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

module.exports = router;
