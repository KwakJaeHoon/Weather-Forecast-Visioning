var express		= require('express');
var mysql		= require('mysql');  
var fs			= require('fs');
var bodyParser	= require('body-parser');
var htmlFilename = 'chart.html';

var app = express();  
var connection = mysql.createConnection({  
	host : 'localhost',
 	user : 'root',
	password : 'ahqkdlf!@#',
	database : 'CAPSTONE_PRJ2_FORECAST',
	port : 3306
});  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

connection.connect(function(err) {  
	handleError(err, 'Error connecting database ...'); 
	console.log('Database is connected ... \n\n');
});  

function handleError(err, msg) {
    if(err) {
		console.error(err);
		console.error(msg);
	}
};

app.listen(8080, function() {
	console.log('Waiting for Clients');
	console.log('\tport          : ',8080);
});

app.get('/',function(req,res){ 
	fs.readFile(htmlFilename, function(err, data) {
		handleError(err, 'Failed to read log main html');
		res.end(data);
    });
});

app.post('/chacha', function(req,res) {
	var q = req.body.q || req.query.q;
	var sql = 'SELECT * from TEMPERATURE WHERE REGION_ID = ' + q;

	connection.query(sql, function(err, rows, fields) {
		handleError(err, 'Failed to query temperature');

		var data = {
			rows: [],
			cols: [
		        {'id':'date','label':'Day','type':'date'},
		        {'id':'max-temp','label':'Max_temp','type':'number'},
		        {'id':'min-temp','label':'Min_temp','type':'number'}
	   		]
		};

		for(var i in rows) {
		// 	구글 차트를 위한 표준대로 파싱  
			data['rows'].push({'c': [
				{'v': rows[i].DATE},
				{'v': Number(rows[i].TEMP_MAX)},
				{'v': Number(rows[i].TEMP_MIN)},
			]});
		}
	
		res.json(data);
	});
}); 

app.post('/region', function(req, res) {
	connection.query('SELECT * from REGION', function(err, rows, fields) {
		handleError(err, 'Failed to query region');

		var data = [];
		for(var i in rows) {
			data.push({ id: Number(rows[i].REGION_ID), name: rows[i].REGION_NAME});
		}

		res.json(data);
	});
});



