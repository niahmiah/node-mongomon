'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Collstat(options){
  this.interval = options.interval;
  this.connection = options.connection;
  this.timer = null;
}

util.inherits(Collstat, EventEmitter);

function getCollectionNames(db, callback){
  var all = [];
  var nsLength = db.databaseName.length + 1;
  db.collection('system.namespaces').find().toArray(function(err, collectionNames){
    if(err){
      return callback(err);
    }
    collectionNames.forEach(function(collectionName){
      var name = collectionName.name;
      if ( name.indexOf( '$' ) >= 0 && name.indexOf( '.oplog.$' ) < 0 ){
        //skip
      }else{
        all.push( name.substring( nsLength ) );
      }
    });
    callback(null,all.sort());
  });
}

Collstat.prototype.fetchData = function(){
  var self = this;
  getCollectionNames(self.connection, function(err, names){
    if(names){
      names.forEach(function(name){
        self.connection.command({collstats: name}, function(err, stats){
          if(stats){
            self.emit('collstat', stats);
          }
        });
      });
    }
  });
};

module.exports = Collstat;