require('dotenv').load();

var express = require('express');
var request = require('superagent');

var models = require('./models');
var config = require('./config');

var app = express();

if (!process.env.API_KEY || !process.env.API_ID) throw new Error(
  "Missing Google API Credentials!");

var port = process.env.PORT || config.port;
var baseUrl = "https://www.googleapis.com/customsearch/v1?key=" + process.env.API_KEY +
  "&cx=" + process.env.API_ID + "&searchType=image&safe=high&alt=json&q=";

// application core
app.get("/", function(req, res) {
  models.Search.find({}, function(err, searches) {
    if (err) res.status(500).json({
      error: "Sorry, something went wrong"
    });
    else res.json(searches.map(function(search) {
      return {
        term: search.term,
        when: search.when
      };
    }));
  });
});

app.get("/:term", function(req, res) {
  var search = new models.Search({
    term: req.params.term,
    when: new Date()
  });
  search.save(function(err) {
    if (err) res.status(500).json({
      error: "Something went wrong"
    });
    else {
      request(baseUrl + req.params.term + "&start=" + (req.query.offset ||
        1)).end(function(err, result) {
        if (err) res.status(500).json({
          error: "Sorry, Google had a problem with this search."
        })
        else {
          var items = result.body.items || [];
          res.json(items.map(function(item) {
            return {
              url: item.url,
              snippet: item.snippet,
              thumbnail: item.image.thumbnailLink,
              context: item.image.contextLink
            };
          }));
        }
      });
    }
  });
});

module.exports = app.listen(port, function() {
  if (config.environment !== "test") console.log(
    'Image search app listening on port ' + port + '!');
});
