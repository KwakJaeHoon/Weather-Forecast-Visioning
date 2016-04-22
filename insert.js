#!/usr/local/bin/node

var fs = require('fs');
var db = require('./db');

var ENCODING = 'UTF-8'

db.clearDB(function() {

	fs.readFile('logmapo', ENCODING, function(err, data) {
		handleError(err, 'Failed to read logmapo');
		var lines = data.split('\n');

		for(var i in lines) {
			if(lines[i]) db.addLocal(lines[i]);
		}
	});

	fs.readFile('logtotal', ENCODING, function(err, data) {
		handleError(err, 'Failed to read logtotal');
		var lines = data.split('\n');

		for(var i in lines) {
			if(lines[i]) db.addTotal(lines[i]);
		}
	});

	db.end();
});

function handleError(err, msg) {
	if(err) {
		console.error(err);
		console.error(msg);
		throw err;
	}
}
