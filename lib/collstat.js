'use strict';
var shell = require('shelljs');
var util = require('util');
var bson2json = require('./bson2json');
var EventEmitter = require('events').EventEmitter;

if(!shell.which('mongo')){
  throw new Error('mongomon requires mongo');
}

function Collstat(options){
  this.url = options.url;
}

util.inherits(Collstat, EventEmitter);

Collstat.prototype.fetchData = function(){
  var self = this;
  var getcolls = shell.exec('mongo '+self.url+' --quiet --eval "printjson(db.getCollectionNames())"',
    {async: true, silent: true}
  );
  getcolls.stdout.on('data', function(collnames){
    collnames = bson2json(collnames);
    collnames.forEach(function(collname){
      var collstats = {};
      collstats[collname] = shell.exec('mongo '+self.url+' --quiet --eval "printjson(db.'+collname+'.stats())"',
        {async: true, silent: true}
      );
      collstats[collname].stdout.on('data', function(collstats){
        collstats = bson2json(collstats);
        self.emit('collstat', collstats);
      });
    });
  });
};

module.exports = Collstat;