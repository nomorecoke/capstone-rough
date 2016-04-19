var express = require('express');
var app = express();
var path = require('path');
var fs= require('fs');
var xml2js = require('xml2js');
var request = require('request');

var url='http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1144060000';

var parser = new xml2js.Parser();
var date;
var tempa=0;
var data_str='';


//var routes = require('./routes');
//var user  = require('./routes/user');
var http = require('http');

var mysql = require('mysql');

var connection =  mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password:'gusrlqus1598',
	database:'temp'
});



connection.connect(function(err){
	if(err){
		console.error('mysql connection error');
		console.error(err);
		throw err;
		}
});





var cnt=0;
var inv=3000;
var ti;
app.get('/', function(req, res){
	
	var query=connection.query('select * from templog', function(err, data){
		for( var i=0; i<data.length;i++){
//		console.log(data[i].date);
//		console.log(data[i].temp);
		var t=data[i].time;
		t='\''+t+'\'';
//		console.log(t);
		data_str +='['+t+','+data[i].temp+','+data[i].reh+']';
		if(i!=data.length-1)
			data_str +=',';
	//	data_str+='\n';
		}
//		res.json(data);
	});

fs.readFile('./gr.html', function(err, html){
	var html = ''+html;


	html = html.replace('<COLUMNS>', 'data.addColumn(\'string\',\'time\');data.addColumn(\'number\',\'temp\');data.addColumn(\'number\',\'reh\');');
	html = html.replace('<DATA>', data_str);
	html = html.replace('<TITLE>', '\'Weather Cast\'');
	html = html.replace('<SUBTITLE>', '\'Mapogu Daeheungdong\'');
//	console.log(data_str);
//	console.log(html);
	data_str='';
	//...
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(html);
});	
//	res.sendFile(path.join(__dirname)+'/gr.html');
});
setInterval(function(){
	request(url, function( err, res, body){
		parser.parseString(body, function(err, res){
			tempa=res.rss.channel[0].item[0].description[0].body[0].data[0].temp[0];
			date=res.rss.channel[0].pubDate[0];
			ti = res.rss.channel[0].item[0].description[0].header[0].tm[0];
		});
	});
	ti*=1;
	var time = ti+400;
	ti%=10000;
	ti/=100;
	ti+=4;
	date = date+"";
	date = date.substring(0,20);
	date = date+ ti+":00";
//	console.log(ti);	
//	if(cnt==0){
//		//setInterval(function(){
//		inv=10000; console.log("f");}
//		//},500);
	if(cnt){
		//inv=10800000;
//	console.log(tempa);
//	console.log(date);
	var temp = {'date': date,
		'temp': tempa,
		'time': time};
	var query = connection.query('insert into templog set ?', temp, function(err, result){
		if(err){
			console.error(err);
			throw err;
		}
		//console.log(query);
		//res.send(200, 'success');
	});	
	}
	cnt++;
},2800000);

app.listen(3000, function(){
	console.log("app listen on 3000!");
});
