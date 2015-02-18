'use strict';
function bson2json(data){
  data = data.split('\n');
  for(var i=0;i<data.length;i++){
    var numLong = /NumberLong\(\"?(\d+)\"?\)/;
    var numLongMatch = numLong.exec(data[i]);
    if(numLongMatch){
      data[i] = data[i].replace(numLongMatch[0], parseInt(numLongMatch[1]));
    }
    var isoDate = /ISODate\((\"\S+\")\)/;
    var isoDateMatch = isoDate.exec(data[i]);
    if(isoDateMatch){
      data[i] = data[i].replace(isoDateMatch[0], isoDateMatch[1]);
    }
  }
  data = data.join('');
  data = JSON.parse(data);
  return data;
}

module.exports = bson2json;