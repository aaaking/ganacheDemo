var redis = require('./redis/async')
var methods = require('./methods');
require('./controllers/package');
// require('./controllers/buyAgent');
// require('./controllers/sellAgent');

function onRequest(name, ops) {
  console.log(name, ops);
  name = name.toUpperCase();
  method = methods[name];
  if (method) {
    if (name != 'login'.toUpperCase()) {
      redis.getUserLoginTime(ops.uid, function(err, rep) {
        if (err) {
          console.error(err);
        } else {
          if (Date.now() - rep > 86400000) {
            console.error(`user: ${ops.uid} not login`);
          } else {
            method(ops);            
          }
        }
      })
    } else {
      method(ops);
    }
  } else {
    console.log("no method name " + name);
  }
}

module.exports = {
  onRequest: onRequest
}