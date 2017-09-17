var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); //extension of views
app.use(bodyParser.urlencoded({ extended: false }));
 
//mysql 
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'mydb'
    
    
});
//opening view
 
app.get('/', function(req,res){
    res.render('index');
});
 
//insert data 
app.post('/insert', function(req,res){
    
   pool.getConnection(function(error,conn){
       
       var queryString = "insert into product(code,name,price,gst) values('"+req.body.code+"','"+req.body.pname+"','"+req.body.price+"','"+req.body.gst+"')";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                conn.query("select * from product",function(err, results, fields) {
                    if (err) throw err;
                    var output = '<html><head></head><body><h1>All Products</h1><ul><table border=1><tr>';
                    
                    for (var index in results) {
                        output += '<tr><td>' + results[index].code + '</td>';
                        output += '<td>' + results[index].name + '</td>';
                        output += '<td>' + results[index].price+ '</td>';
                        output += '<td>' + results[index].gst + '</td></tr>';
                    }
                    output += '</ul></body></html>';
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(output);
               });
            }
       });

       conn.release();
   });
    
    
});

 
 
//start server
 
var server = app.listen(8020, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Example app listening at http://%s:%s", host, port)
 
});