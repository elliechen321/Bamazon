DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT(10) NOT NULL,
  stock_quantity INT (10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Call me by your name", "Movies", 5.95, 100), ("chocolate", "Foods", 3.10, 120), ("strawberry", "Foods", 2.25, 2), ("Gucci Bag", "Clothing", 3900, 1),
("camera","Electronics", 600, 5), ("desk", "Furnitures", 200, 3), ("Hoodie", "Clothing", 25, 500), ("Lego sets", "Kids", 50, 45), 
("iPhone", "Electronics", 999, 800), ("Lion King", "Movies", 1, 1);

SELECT * FROM products;