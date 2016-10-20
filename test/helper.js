"use strict";

var async = require('async'),
    http = require('http');


function createServer(base, host, next) {
  var server = http.createServer(function () {});

  if (!next) {
    server.listen(base, host);
  } else {
    server.listen(base, host, next);
  }

  server.on('error', function() {
    server.close();
  });

  return server;
}

module.exports = function(servers, callback) {
  var base = 32768;

  async.whilst(
    function () { return base < 32773; },
    function (next) {
      var hosts = ['localhost']; // default hosts documented @ https://github.com/nodejs/node/blob/4b65a65e75f48ff447cabd5500ce115fb5ad4c57/doc/api/net.md#L231
      while (hosts.length > 1) { servers.push(createServer(base, hosts.shift())); }
      servers.push(createServer(base, hosts.shift(), next)); // call next for host
      base++;
    }, callback);
};
