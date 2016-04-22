var mysql		= require('mysql');
var dateParser	= require('date-utils');

var connection = mysql.createConnection({
	    host : 'localhost',
	    user : 'root',
	    password : 'ahqkdlf!@#',
	    database : 'CAPSTONE_PRJ2_FORECAST',
	    port : 3306
});

var quit = false;
var remain	= 0;
var exports	= module.exports = {};

exports.addTotal = function(line) {
	var desc = JSON.parse(line).rss.channel[0].item[0].description[0];
	var body = desc.body[0];

	remain += body.location.length;

	for(var i in body.location) {
		var data	= body.location[i].data[0];
		var loc		= body.location[i].province + ' [' + body.location[i].city + ']';

		var f = function f(err, rows, fields) {
			handleError(err);

			f.id = Number(rows[0].REGION_ID);

			var post = {
				DATE:		f.date.toFormat('YYYY-MM-DD HH24:MI:SS'),
				TEMP_MIN:	f.min,
				TEMP_MAX:	f.max,
				REGION_ID:	f.id
			};

			var sql = 'INSERT INTO TEMPERATURE SET ?';
			connection.query(sql, post, function(err, result) {
				handleError(err, 'Failed to insert');
				--remain;

				if(quit && remain == 0) connection.end();
			});
		};

		f.loc = loc;
		f.date	= new Date(data.tmEf);
		f.min	= Number(data.tmn);
		f.max	= Number(data.tmx);

		var sql = 'SELECT * FROM REGION WHERE REGION_NAME = ?';
		connection.query(sql, [loc], f);
	}
};

exports.addLocal = function(line) {
	++remain;

	var desc	= JSON.parse(line).rss.channel[0].item[0].description[0];
	var data	= desc.body[0].data[0];

	var match   = desc.header[0].tm[0].toString().match(/(....)(..)(..)(..)(..)/);
	var year	= Number(match[1]);
	var month	= Number(match[2]) - 1;
	var day		= Number(match[3]) + Number(data.day);
	var hour	= Number(data.hour);
	var minute	= Number(match[5]);
	
	var date	= new Date(year, month, day, hour, minute);
	var temp	= parseFloat(data.temp);

	var post = {
		DATE:		date.toFormat('YYYY-MM-DD HH24:MI:SS'),
		TEMP_MIN:	temp,
		TEMP_MAX:	temp,
		REGION_ID:	25
	};

	var sql = 'INSERT INTO TEMPERATURE SET ?';
	connection.query(sql, post, function(err, result) {
		handleError(err, 'Failed to insert');
		--remain;

		if(quit && remain == 0) connection.end();
	});
};

exports.clearDB = function(callBack) {
	++remain;
	connection.query('truncate table TEMPERATURE', function(err) {
		handleError(err, 'Failed to clear DB');
		--remain;

		if(quit && remain == 0) connection.end();
		callBack();
	});
};

exports.end = function() {
	if(quit && remain == 0) {
		connection.end();
	}
	else {
		quit = true;
	}
};

function handleError(err, msg) {
	if(err) {
		console.error(err);
		console.error(msg);
		throw err;
	}
}

