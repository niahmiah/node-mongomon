# mongomon

[![Greenkeeper badge](https://badges.greenkeeper.io/niahmiah/node-mongomon.svg)](https://greenkeeper.io/)
mongomon is a MongoDB server status monitor written for node.js.

The current version is a wrapper around the several mongo diagnostic commands that are available in the mongo shell.

- db.serverStatus()
- db.stats()
- db.[collectionName].stats()

This can be used to monitor the mongos shard router, or mongod instances.

mongomon.start() is used to start the interval that monitors the server statistics.
The methods to get database stats and collection stats are not meant to be run very often, therefore, they do not run on the interval when mongomon.start() is called, and have to be called manually.

For example, you can run this to monitor each mongos and mongod process in your cluster every 60 seconds, but only run the database stats and collection stats once or twice a day.

### Usage: 

```
var Mongomon = require('./index');
var mongomon = new Mongomon({interval: 5000, url: 'mongodb://localhost:27017/mydatabase'});

mongomon.on('mongostat', function(data){
  console.log('server stats:',JSON.stringify(data));
  console.log();
});

mongomon.on('dbstat', function(data){
  console.log('db stats:',JSON.stringify(data));
  console.log();
});

mongomon.on('collstat', function(data){
  console.log('collection stats:',JSON.stringify(data));
  console.log();
});

//start calling db.serverStatus() on the provided interval
mongomon.start();

//or, to just get stats, you can manually connect and pull them

mongomon.connect(function(){
  //get database statistics once
  mongomon.getDBStats();
  //get collection statistics once (for each collection in the database)
  mongomon.getCollStats();
});

```
