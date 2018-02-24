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
    read();
});

function read(){
    inquirer
    .prompt([
        {
            name: "choice",
            type: "list",
            choices: ["View Products for Sale",
                     "View Low Inventory",
                     "Add to Inventory",
                     "Add New Product"],
            message: "Hi, Manager! What would you like to do?"
        }
    ])
    .then(function(answer){
        if (answer.choice === "View Products for Sale"){
            connection.query(
                "SELECT * FROM products",function(err,res){
                    if(err) throw err;
                    console.log("See available items below:");
                    res.forEach(function(x){
                        console.log(`Item ID: ${x.item_id} || Item Name: ${x.product_name} || Item Price: ${x.price} || Item Quantity: ${x.stock_quantity}`);                      
                    })
                    read();
                }   
            ) 
        }
        if (answer.choice === "View Low Inventory"){
            lowInventory();
        }
        if (answer.choice === "Add to Inventory"){
            updateInventory();
        }
        if (answer.choice === "Add New Product"){
            postAuction();
        }
        else {
            console.log("please select one of the above.");
        }
    })
}

function lowInventory(){
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE stock_quantity BETWEEN 0 AND 4";
    connection.query(query, function(err,res){
        console.log("All items with an inventory count less than 5.")
        res.forEach(function(x){
            console.log(`Item ID: ${x.item_id}
                         Item Name: ${x.product_name}
                         Item Price: ${x.price}
                         Item Quantity: ${x.stock_quantity}
            `);
        })
        read();
    })
}

function updateInventory(){
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
                message: "Which item would you like to update the quantity for?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many do you want to add?" 
            }
        ])
        .then(function(answer){
            var choseItem;
            res.forEach(function(x){
                if(x.product_name === answer.choice){
                    choseItem = x;
                }
            })
            var newQuantity = choseItem.stock_quantity + parseInt(answer.quantity);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        product_name: answer.choice
                    }
                ],
                function(err,res){
                    if(err) throw err;
                    console.log(`You've added ${answer.quantity} to ${choseItem.product_name}`);
                    read();
                }
            )
        })
    })
}

function postAuction() {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "product",
          type: "input",
          message: "What is the item you would like to add?"
        },
        {
          name: "department",
          type: "input",
          message: "Which department does the item belong to?"
        },
        {
          name: "price",
          type: "input",
          message: "How much is the item?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?",
            validate: function(value){
                if (isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.product,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
          },
          function(err) {
            if (err) throw err;
            console.log("Your item was added successfully!");
            // re-prompt the user for if they want to bid or post
            read();
          }
        );
      });
  }