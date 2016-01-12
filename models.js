var mongoose = require('mongoose');

var config = require("./config");

// initialize mongo
mongoose.connect(process.env.MONGOLAB_URI || config.db);

var searchSchema = new mongoose.Schema({
  term: String,
  when: {
    type: Date,
    expires: 60 * 10 //expire in 10 mins
  }
})

var Search = mongoose.model('Search', searchSchema);

module.exports = {
  Search: Search
};
