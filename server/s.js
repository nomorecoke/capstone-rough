var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser');

//var value;
var arr=[300];
var hum=[300];
var num=0, prv=0;

app.use(bodyParser.urlencoded({extended: true}));

function arr_pop(){
    for(var i=0; i<299; i++){
	arr[i]= arr[i+1];
	hum[i]= hum[i+1];
    }
    num--;
}

app.get('/', function(req, res){
	fs.readFile('./bb.html', function(err, html){
		var html = ''+html;
		var datstr = '';
		var tmp = '';

		/*******replace*****************/

		html = html.replace('<COLUMNS>', 'data.addColumn(\'date\', \'Date/Time\');data.addColumn(\'number\', \'Temperature\');data.addColumn(\'number\', \'Humidity\');');

		var now = new Date();
		var month = now.getMonth();
		var date = now.getDate();
		var hour = now.getHours()+9;
		var min = now.getMinutes();

		if( hour > 24)
		{
			date++;
			hour-=24;
		}

		for(var i=0 ; i<300; i++)
		{	
			tmp = "[new Date(2016,"+month+","+date+","+hour+","+min+"),";
			if(i<num){
				tmp += arr[num-1-i]+",";
				tmp += hum[num-1-i]+"]";
			}
			else
				tmp += "null, null]";


			if( i>0 )
			    datstr = tmp+","+datstr;
			else
			    datstr = tmp;

			min--;
			if(min<0){
			    hour--;
			    min=59;
			}
			if(hour<0){
			    date--;
			    hour=23;
			}
		}
		html = html.replace('<DATA>', datstr);

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(html);
	});
});

app.get('/logone', function(req, res){
	var value = req.query.value;
	var humi = req.query.humi;
	var serial;
	prv = serial
	serial = req.query.serial;

	if(prv == serial)
		num=0;

	if( num >= 300 ){
		arr_pop();
	}

	hum[num]= humi;
	arr[num++]= value;

	console.log(num);

	res.send(arr);
	setInterval(function(){}, 1000);
});

app.listen(3000, function(){
	console.log("app listen on 3000!");
});
