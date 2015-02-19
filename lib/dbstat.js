'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function DBstat(options){
  this.interval = options.interval;
  this.connection = options.connection;
  this.timer = null;
}

util.inherits(DBstat, EventEmitter);

DBstat.prototype.fetchData = function(){
  var self = this;
  self.connection.command({dbstats: 1}, function(err, stats){
    if(stats){
      self.emit('dbstat', stats);
    }
  });
};

module.exports = DBstat;