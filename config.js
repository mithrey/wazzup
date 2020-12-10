let config = {
    secret: "thisIsSecret",
    JWTlifeTime: 1000*60*60*3 /* In ms */
}

module.exports.get = function (key) {
    return config[key];
  };
  