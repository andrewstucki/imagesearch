var _ = require("underscore");

var environment = process.env.ENVIRONMENT || "development";

var config = {
  development: {
    db: "mongodb://localhost/shortener",
    port: 3000
  },

  test: {
    db: "mongodb://localhost/shortener-test",
    port: 3000
  }
}

if (!(environment in config))
  throw new Error("Invalid environment specified: " + environment + "!");

module.exports = _.extend({}, config[environment], {
  environment: environment
});
