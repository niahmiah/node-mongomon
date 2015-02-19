'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Mongostat(options){
  this.interval = options.interval;
  this.connection = options.connection;
  this.timer = null;
}

util.inherits(Mongostat, EventEmitter);

Mongostat.prototype.start = function(){
  var self = this;
  self.stop();
  this.timer = setInterval(function(){
    self.fetchData();
  },self.interval);
};

Mongostat.prototype.stop = function(){
  var self = this;
  if(self.timer) { 
    clearInterval(self.timer);
    self.timer = null;
  }
};

Mongostat.prototype.fetchData = function(){
  var self = this;
  self.connection.command({serverStatus: 1}, function(err, data){
    if(data){
      self.emit('mongostat', data);
    }
  });
};

module.exports = Mongostat;