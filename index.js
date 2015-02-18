'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Mongostat = require('./lib/mongostat');
var DBstat = require('./lib/dbstat');
var Collstat = require('./lib/collstat');
var mongostat;
var dbstat;
var collstat;

function Mongomon(options){
  this.interval = options.interval;
  this.url = options.url;
}

util.inherits(Mongomon, EventEmitter);

Mongomon.prototype.start = function(){
  var self = this;
  mongostat = new Mongostat({interval: self.interval, url: self.url});
  mongostat.start();
  mongostat.on('mongostat', function(json){
    self.emit('mongostat', json);
  });
};

Mongomon.prototype.stop = function(){
  mongostat.stop();
};

Mongomon.prototype.getDBStats = function(){
  var self = this;
  dbstat = new DBstat({url: self.url});
  dbstat.fetchData();
  dbstat.on('dbstat', function(json){
    self.emit('dbstat', json);
  });
};

Mongomon.prototype.getCollStats = function(){
  var self = this;
  collstat = new Collstat({url: self.url});
  collstat.fetchData();
  collstat.on('collstat', function(json){
    self.emit('collstat', json);
  });
};

module.exports = Mongomon;