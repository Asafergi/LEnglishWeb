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
