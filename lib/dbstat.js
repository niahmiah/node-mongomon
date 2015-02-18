'use strict';
var shell = require('shelljs');
var util = require('util');
var bson2json = require('./bson2json');
var EventEmitter = require('events').EventEmitter;

if(!shell.which('mongo')){
  throw new Error('mongomon requires mongo');
}

function DBstat(options){
  this.url = options.url;
}

util.inherits(DBstat, EventEmitter);

DBstat.prototype.fetchData = function(){
  var self = this;
  var dbstat = shell.exec('mongo '+self.url+' --quiet --eval "printjson(db.stats())"',
    {async: true, silent: true}
  );
  dbstat.stdout.on('data', function(data){
    data = bson2json(data);
    self.emit('dbstat', data);
  });
};

module.exports = DBstat;