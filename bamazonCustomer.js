var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
});

function read(){
    var query = connection.query(
        "SELECT * FROM products", function(err,res){
            if(err) throw err;
            res.forEach(function(x){
                console.log(`Items for sale: ${x.item_id} ${x.product_name} Listed Price: ${x.price} dollars`);
            })
        }
    )
    console.log(query.sql);
};
read();
function pick(){
    inquirer
     .prompt([
         {
            type:"input",
            message: "What's the ID of the product you'd like to purchase?",
            name: "productId"
         },
         {
             type: "input",
             message: "How many do you want?",
             name: "quantity"
         }
     ])
     .then(function(answer){

     }
    )
}