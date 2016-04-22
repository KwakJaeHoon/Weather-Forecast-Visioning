#!/usr/local/bin/node
var db			= require('./db');
var request		= require('request');
var xml2js		= require('xml2js');
var fs			= require('fs');
var dateUtils	= require('date-utils');
var xmlParser	= new xml2js.Parser();

var INTERVAL	= 3600 * 1000;
var ENCODING	= 'UTF-8';
var URLBASE		= 'http://www.kma.go.kr/';
var LOGPREFIX	= 'log';

var URLLIST = [
	{file: 'total',	url: 'weather/forecast/mid-term-rss3.jsp?stnId=108'},
	{file: 'mapo',	url: 'wid/queryDFSRSS.jsp?zone=1144063000'}
];

function repeat(f) {
	f();
	setInterval(f, INTERVAL);
}

repeat(function() {
	for(var i = 0; i < URLLIST.length; ++i) {
		var f = function f(err, res, body) {
			handleError(err, 'Failed to open url: [' + url + ']');
			xmlParser.parseString(body, function(err, res) {
				handleError(err, 'Failed to parse xml');

				var str = JSON.stringify(res);
				logJSON(f.logFile, str);

				if(f.total) db.addTotal(str);
				else db.addLocal(str);
			});
		};

		f.total		= i == 0;
		f.logFile	= LOGPREFIX	+ URLLIST[i].file;
		var url		= URLBASE	+ URLLIST[i].url;
		var option	= {uri: url, encoding: ENCODING};
		request(option, f);
	}
});

function logJSON(logFile, str) {
	fs.writeFile(logFile, str + '\n', {flag : 'a'}, function(err, data) {
		handleError(err, 'Failed to write file: [' + logFile + ']');

		var date = (new Date()).toFormat('YYYY-MM-DD HH24:MI:SS');
		console.log('new log: [' + logFile + '], (' + date + ')');
	});
}

function handleError(err, msg) {
	if(err) {
		console.error(err);
		console.error(msg);
	}
}
