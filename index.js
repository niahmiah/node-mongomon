'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var MongoClient = require('mongodb').MongoClient;
var Mongostat = require('./lib/mongostat');
var DBstat = require('./lib/dbstat');
var Collstat = require('./lib/collstat');
var mongostat;
var dbstat;
var collstat;

function Mongomon(options){
  this.interval = options.interval;
  this.url = options.url;
  this.connection = options.connection;
  this.selfConnected = false;
}

util.inherits(Mongomon, EventEmitter);

Mongomon.prototype.connect = function(callback){
  var self = this;
  if(!self.connection){
    MongoClient.connect(self.url, function(err, db){
      if(db){ 
        self.connection = db;
        self.selfConnected = true;
      }
      callback(err);
    });
  }else{
    callback(null);
  }
};

Mongomon.prototype.disconnect = function(){
  if(this.connection && this.selfConnected){
    this.connection.close();
    this.connection = null;
    this.selfConnected = false;
  }
};

Mongomon.prototype.start = function(callback){
  var self = this;
  self.connect(function(err){
    if(err){ throw err; }
    mongostat = new Mongostat({interval: self.interval, connection: self.connection});
    mongostat.start();
    mongostat.on('mongostat', function(json){
      self.emit('mongostat', json);
    });
    if(callback){ callback(); }
  });
};

Mongomon.prototype.stop = function(){
  this.disconnect();
  mongostat.stop();
};

Mongomon.prototype.getDBStats = function(){
  var self = this;
  self.connect(function(err){
    if(err){ throw err; }
    dbstat = new DBstat({connection: self.connection});
    dbstat.fetchData();
    dbstat.on('dbstat', function(json){
      self.emit('dbstat', json);
    });
  });
};

Mongomon.prototype.getCollStats = function(){
  var self = this;
  self.connect(function(err){
    if(err){ throw err; }
    collstat = new Collstat({connection: self.connection});
    collstat.fetchData();
    collstat.on('collstat', function(json){
      self.emit('collstat', json);
    });
  });
};

module.exports = Mongomon;