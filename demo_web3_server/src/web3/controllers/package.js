var asyncRedis = require('../redis/async');
var package = require('../contracts/package');

function init_packages() {
  var typeNum = package.typeNum();

  for(let i = 0; i < typeNum; i++) {
    for(let j = 0; j < package.campNumOfType(i); j++) {
      for(let k = 0; k < package.packageNumOfCamp(i, j); k++) {
        package.getPackageCard(i, j, k, (err, cards) => {
          if (err) {
            console.error(err);
          } else {
              asyncRedis.setPackageCards(i, j, k, cards);
          }
        })
      }
    }
  }
}

//TODO: add package event

init_packages();