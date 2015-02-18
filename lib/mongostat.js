'use strict';
var shell = require('shelljs');
var util = require('util');
var bson2json = require('./bson2json');
var EventEmitter = require('events').EventEmitter;

if(!shell.which('mongo')){
  throw new Error('mongomon requires mongo');
}

function Mongostat(options){
  this.interval = options.interval;
  this.url = options.url;
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
  var mongostat = shell.exec('mongo '+self.url+' --quiet --eval "printjson(db.serverStatus())"',
   {async: true, silent: true}
  );
  mongostat.stdout.on('data', function(data){
    data = bson2json(data);
    self.emit('mongostat', data);
  });
};

module.exports = Mongostat;