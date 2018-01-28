var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var now = require("performance-now")

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	client.lpush("mylist", req.url);
	client.ltrim("mylist", 0, 4)
	// ... INSERT HERE.
	next(); // Passing the request to the next handler in the stack.
});


app.get('/test', function(req, res) {
	{
		res.writeHead(200, {'content-type':'text/html'});
		res.write("<h3>test</h3>");
   		res.end();
	}
})

app.get('/get', function(req, res) {
	client.get("new_key",function(err,reply) {
		client.ttl("new_key", function(err1, value1) {	
			if (reply == null) {
				reply = "Already expired.";
			} else {
				reply = reply + " <p> Time remaining: <b>" + value1 +
					" seconds</b> </p>";
			}
		res.send(reply);
		});
	});
})

app.get('/set', function(req, res) {
	client.set("new_key","this message will self-destruct in 10 seconds");
	client.expire("new_key",10);
	res.send(" New Key is set. <p> This message will self-destruct in <b> 10 </b> seconds </p>");
})


app.get('/recent', function(req, res){
	client.lrange("mylist", 0, 4, function(err,value) {
	res.send(" Recently visited URLs: " + value)
	});
})


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
// 			console.log(img);
			  
 			client.lpush('cats', img, function(err)
 			{
 				res.status(204).end()
 			});
 		});
    }

 }]);

 app.get('/meow', function(req, res) {
 	{
		client.lpop('cats', function(err,imagedata){
			res.writeHead(200, {'content-type':'text/html'});
			res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
			res.end();
		});
 	}
 })


app.get('/catfact/:num', function(req, res) {
	var number = req.params.num;
	number = number.substring(number.indexOf(":") + 1);
	var keyname= "catfact:" + number;
	console.log(keyname);
        client.exists(keyname,function(err,reply) {
	        console.log(reply);
		if(reply) {
			var t0 = now();
		        client.get(keyname,function(err,reply) {
				var t1 = now();
		                client.ttl(keyname, function(err1, value1) {
                		        if (reply == null) {
                                	reply = "Already expired.";
                       	 		} else {
                                	reply = reply + " <p> Time remaining: <b>" + value1 +
                                        " seconds</b> </p>";
                        		}
			        	res.send(reply + "<p> Time taken to retrieve key from Keyname: <b> " + (t1-t0) + "</b> milliseconds </p>"
						+ "" );
			        	console.log(reply + "\n Time taken to retrieve keys: " + (t1-t0) + " milliseconds");
		        	});
		        });
		} else {
			var t0 = now();
				get_line("./catfacts.txt", parseInt(number), function(err2,lines){
				if(err2) {
					 res.send( "File end reached without finding line ");
				} else {
				var t1 = now();
	              		console.log(lines + "\n Time taken to retrieve keys: " + (t1-t0) + " milliseconds" );
//         		      console.log(number);
			        client.exists('toggleCacheFeature',function(err,reply) {
                		if(reply) {
					client.get('toggleCacheFeature',function(err1,reply1) {
                			if(reply1=='enable') {
		     	      			res.send(lines + '<p> catfact Key created will self-destruct in <b>10</b> seconds </p>' 
								+ "<p> Time taken to retrieve keys from FS: <b>" + (t1-t0) + " </b> milliseconds </p>" );
					      	      console.log(keyname);
				        	      client.set(keyname,lines);
	       					      client.expire(keyname,10);
					} else {
		     	      			res.send(lines + "<p> Time taken to retrieve keys from filesystem: <b>" + (t1-t0) + "</b> milliseconds</p>" );
					}	
					});	
				}	
		      		});	
		      }
		      });
		}
        });
})


/* app.get('/catfact/:num', function(req, res) {
	var number = req.params.num;
	number = number.substring(number.indexOf(":") + 1);
	var keyname= "catfact:" + number;
	console.log(keyname);
        client.exists(keyname,function(err,reply) {
	        console.log(reply);
		if(reply) {
			var t0 = now();
		        client.get(keyname,function(err,reply) {
				var t1 = now();
			        res.send(reply + "\t Time taken to retrieve keys: " + (t1-t0) + " milliseconds" );
			        console.log(reply + "\t Time taken to retrieve keys: " + (t1-t0) + " milliseconds");
		        });
		} else {
			var t0 = now();
		      get_line("./catfacts.txt", parseInt(number), function(err2,lines){
				var t1 = now();
	              		console.log(lines + "\t Time taken to retrieve keys: " + (t1-t0) + " milliseconds" );
         		      console.log(number);
		     	      res.send(lines + '\n\n\ncatfact Key created will self-destruct in 10 seconds' + "\t Time taken to retrieve keys: " + (t1-t0) + " milliseconds" );
			      console.log(keyname);
	        	      client.set(keyname,lines);
	       		      client.expire(keyname,10);
		      });	
		}
        });
})
*/

app.get('/toggleCacheFeature', function(req, res) {
        client.exists('toggleCacheFeature',function(err,reply) {
		if(reply==1) {
			console.log("Key exists\n");
		        client.get('toggleCacheFeature',function(err,reply) {
				console.log(reply);
//				client.set('toggleCacheFeature', !reply );
//				res.send('toggleCacheFeature is set to: ' + !reply);
	        		if(reply=='enable') {
					client.set('toggleCacheFeature', 'disable' );
					res.send('toggleCacheFeature is set to: <b> disable </b>');
	       			} else { 
					client.set('toggleCacheFeature', 'enable' );
					res.send('toggleCacheFeature is set to: <b> enable </b>');
				}
		        });
		} else {
			console.log("Key Does Not exist\n");
        		client.set('toggleCacheFeature', 'enable' );
			res.send("toggleCacheFeature is set to: <b> enable </b>");
		}
	});
})


function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
//      throw new Error('File end reached without finding line');
      callback( new Error('File end reached without finding line'), null);
    } else {
    callback(null, lines[+line_no]);
}
}

// HTTP SERVER
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
