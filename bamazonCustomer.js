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
    //read();
    pick();
});

function pick(){
    connection.query("SELECT * FROM products",function(err,res){
        if(err)throw err;
        inquirer
        .prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function(){
                    var choiceArray = [];
                    res.forEach(function(x){
                        choiceArray.push(x.product_name);
                    })
                    return choiceArray;
                },
                message: "Which item would you like to purchase?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want?" 
            }
        ])
        .then(function(answer){
            var choseItem;
            res.forEach(function(y){
                if(y.product_name === answer.choice){
                    choseItem = y;
                }
            })
            //console.log(choseItem);
            if(choseItem.stock_quantity > parseInt(answer.quantity)){
                //console.log(answer.quantity);
                var quantityLeft;
                quantityLeft = choseItem.stock_quantity - answer.quantity;
                //console.log(quantityLeft);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: quantityLeft
                        },
                        {
                            product_name: answer.choice
                        }
                    ],
                    function(err,res){
                        if(err) throw err;
                        console.log(`You've spent ${choseItem.price * answer.quantity} dollars on ${choseItem.product_name}`);
                    }
                )
            }
            else {
                console.log("Insufficient Quantity! Please choose a different item.")
            }
        })
    })
}
