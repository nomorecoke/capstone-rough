var express = require('express');
var app = express();
var path = require('path');
var fs = require ('fs');
var os = require('os');
var useragent = require('useragent');
var interfaces = os.networkInterfaces();
var addresses = [];

useragent(true);

var arr='';
var pattern='';
var str='';

app.get('/:id', function(req, res){
	var id = req.params.id;

	var now = new Date(); 
	
	var time_stamp = now.getFullYear()+'.'+ (now.getMonth()+1)+'.'+ now.getDate()+' '+  now.getHours()+':'+ now.getMinutes()+':'+ now.getSeconds();

	arr += time_stamp+'\t';

	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        	if (address.family === 'IPv4' && !address.internal)
				arr += address.address+'\t';
   		}
	}

	var ua = req.headers['user-agent'];

	if(useragent.is(req.headers['user-agent']).chrome)
		arr+= 'chrome\t';
	
	if(useragent.is(req.headers['user-agent']).firefox)
		arr+= 'firefox\t';
	
	if(useragent.is(req.headers['user-agent']).safari)
		arr+= 'safari\t';
	
	if(useragent.is(req.headers['user-agent']).ie)
		arr+= 'I.E.\t';
	
	if(useragent.is(req.headers['user-agent']).mobile_safari)
		arr+= 'mobile_safari\t';
	

	arr += 'http://localhost:3000'+req.originalUrl;

	arr += '\n';
	fs.writeFile('./log.txt', arr, function(err, data){
		fs.readFile('./log.txt', 'utf-8', function(err, data){
			str = data;
		});
	})


	if( id == 'log' ){
		if(req.query.pattern != null){
			pattern = req.query.pattern;
			var match='';
			
			var pars = str.split('\n');
			var re = new RegExp(pattern);
			var m, tmp;
			var cnt=0;
			for( var i = 0 ; i<pars.length; i++){
				tmp=pars[i].split('\t');
				var j=0;
				for( j=0; j<tmp.length; j++){
					m = re.exec(tmp[j]);
					if( m != null ){
						match += pars[i]+'\n';
						cnt++;
					}
				}
			//	fs.writeFile('./match.txt', match);
			}

			res.set({ 'content-type': 'application/json; charset=utf-8' })

			if(cnt==0)
				res.send('There is no matching for '+pattern);
			else
				res.send(match+"\n");
		}
		else
			res.sendFile(path.join(__dirname + '/log.html'));
	}
	else if( id == 'reg' ){
		res.sendFile(path.join(__dirname + '/reg.html'));
	}
	else
		res.send('CANNOT GET :/'+id);

;
})

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));

	var now = new Date(); 
	
	var time_stamp = now.getFullYear()+'.'+ (now.getMonth()+1)+'.'+ now.getDate()+' '+  now.getHours()+':'+ now.getMinutes()+':'+ now.getSeconds();

	arr += time_stamp+'\t';

	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        	if (address.family === 'IPv4' && !address.internal)
    	        		arr += address.address+'\t';
   		}
	}

	var ua = req.headers['user-agent'];

	if(useragent.is(req.headers['user-agent']).chrome)
		arr+= 'chrome\t';
	if(useragent.is(req.headers['user-agent']).firefox)
		arr+= 'firefox\t';
	if(useragent.is(req.headers['user-agent']).safari)
		arr+= 'safari\t';
	if(useragent.is(req.headers['user-agent']).ie)
		arr+= 'I.E.\t';
	if(useragent.is(req.headers['user-agent']).mobile_safari)
		arr+= 'mobile_safari\t';

	arr += 'http://localhost:3000'+req.originalUrl;

	arr += '\n';
	fs.writeFile('./log.txt', arr);

});
app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});
