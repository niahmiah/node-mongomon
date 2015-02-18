var Mongomon = require('./index');
var mongomon = new Mongomon({interval: 2000, url: 'localhost:27017/bitpay-dev'});

mongomon.on('mongostat', function(data){
  console.log('mongostat',JSON.stringify(data));
  console.log();
});

mongomon.on('dbstat', function(data){
  console.log('dbstat',JSON.stringify(data));
  console.log();
});

mongomon.on('collstat', function(data){
  console.log('collstat',JSON.stringify(data));
  console.log();
});

mongomon.start();
mongomon.getDBStats();
mongomon.getCollStats();

setTimeout(function(){
  mongomon.stop();
},5000);

