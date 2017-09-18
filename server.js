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
app.post('/login',function(req,res){
    pool.getConnection(function(error,conn){
        var queryString="select * from login where name='"+req.body.name1+"' and password='"+req.body.password+"'";
        conn.query(queryString,function(error,results,fields)
        {
        if(error)
        {
            throw error;
        }
        else{
            if(results.length>0)
            {               
                    res.render('product');
            }             
            else
            {
                res.render('index');
            }
        }

    });

});
});
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
                    var output = '<html><head><style>table {width: 100%; margin: 20px auto; table-layout: auto;  }table,td, th { border-collapse: collapse;}tr,td {padding: 10px; border: solid 1px;text-align: center;}</style></head><body><center><h1>All Products</h1></center><ul><table><tr><td><b>Product Code</b></td><td><b>Product Name</b></td><td><b>Product price</b></td><td><b>Product GST</b></td></tr>';
                    
                    for (var index in results) {
                        output += '<tr><td>' + results[index].code + '</td>';
                        output += '<td>' + results[index].name + '</td>';
                        output += '<td>' + results[index].price+ '</td>';
                        output += '<td>' + results[index].gst + '</td></tr>';
                    }
                    output += '</ul><center><form action="/bill" method="POST"><input type="submit" value="Billing" id="Billing" name="billing"></form></center></br><center><form action="/update" method="POST"><input type="submit" value="Update" id="Update" name="Update"></form></center></body></html>';
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(output);
               });
            }
       });

       conn.release();
   });
    
    
}); 
app.post('/bill', function(req,res){
    res.render('billing');
});
app.post('/update',function(req,res){
    res.render('update');
});
app.post('/update1',function(req,res){
    pool.getConnection(function(error,conn){
        var queryString="update product set name='"+req.body.pname+"',price='"+req.body.price+"',gst='"+req.body.gst+"'where code='"+req.body.code+"'";
        conn.query(queryString,function(error,results,fields)
        {
            if(error)
            {
                throw error;
            }
        else 
            {
                conn.query("select * from product",function(err, results, fields) {
                    if (err) throw err;
                    var output = '<html><head><style>table {width: 100%; margin: 20px auto; table-layout: auto;  }table,td, th { border-collapse: collapse;}tr,td {padding: 10px; border: solid 1px;text-align: center;}</style></head><body><center><h1>All Products</h1></center><ul><table><tr><td><b>Product Code</b></td><td><b>Product Name</b></td><td><b>Product price</b></td><td><b>Product GST</b></td></tr>';
                    
                    for (var index in results) {
                        output += '<tr><td>' + results[index].code + '</td>';
                        output += '<td>' + results[index].name + '</td>';
                        output += '<td>' + results[index].price+ '</td>';
                        output += '<td>' + results[index].gst + '</td></tr>';
                    }
                    output += '</ul><center><tr><td><form action="/bill" method="POST"><input type="submit" value="Billing" id="Billing" name="billing"></form></center></br><center><form action="/update" method="POST"><input type="submit" value="Update" id="Update" name="Update"></form></td></tr></center></table></body></html>';
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(output);
               });
            }
        });

});
});
var total=0;
app.post('/billing',function(req,res,fields){
    pool.getConnection(function(error,conn){
        var queryString="select * from product where code='"+req.body.id+"' or name='"+req.body.id+"'";
        var quantity=req.body.quantity;
        conn.query(queryString,function(error,results,fields)
        {
            var price=results[0].price;
            var gst=results[0].gst;
            var gstrate=((gst/100)*price)*quantity;
            price=price+gstrate;
            total=total+quantity*price;
            var output = '<html><head><style>h1{text-shadow: 2px 2px #FF0000;}.txt {text-decoration: underline;text-decoration-color: red;text-size:16;}</style></head><body><center><h1>Total Cost:</h1></center>';
            output=output+'<div class="txt"><center><table>'+total;
            output=output+'</table></center></div></br><center><form action="/bill" method="POST"><input type="submit" value="Add Product" id="Billing" name="billing"></form></center></body></html>';
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(output);
        });
});
    
});
 
//start server
 
var server = app.listen(8891, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Example app listening at http://%s:%s", host, port)
 
});