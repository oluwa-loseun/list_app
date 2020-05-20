// import express package
const express_package = require("express");
// initialized express_package
const list_app = express_package();

// import mysql package
const mysql_package = require("mysql");
const mysql_connection = mysql_package.createConnection(
    {
        host: "localhost",
        database: "shopping_list",
        user: "root",
        password: "0000",
    }
);

// connection status
mysql_connection.connect(
    (error_messaege) => {
        if (error_messaege) {
            Console.log("CONNECTION WITH THE DATABASE WAS NOT SUCCESSFUK" + error_messaege.stack);
            return;
        }
    console.log("CONNECTION WITH THE DATABASE WAS SUCCESSFUL");
    }
);



// adding css and image files
list_app.use(express_package.static("public"));


list_app.use(express_package.urlencoded({extended: false}));


// home-page
list_app.get(
    "/",
    (req, res) => {
        res.render("home.ejs"), {};
    }
);

// index-page
list_app.get(
    "/index",
    (req, res) => {
        mysql_connection.query(
            "SELECT * FROM lists",
            (error, results) => {
                res.render("index.ejs", {items: results});
            }
        );
    }
);

// new-page
list_app.get(
    "/new",
    (req, res) => {
        res.render("new.ejs", {});
    }
);


// adding a new list
list_app.post(
    "/create",
    (req, res) => {
        mysql_connection.query(
            "INSERT INTO lists (name) VALUES (?)",
            [req.body.itemName],
            (error, results) => {
                res.redirect("/index");
            }
        );
    }
);  

// edit-page
list_app.get(
    "/edit/:id",
    (req, res) => {
        mysql_connection.query(
            "SELECT * FROM lists WHERE id = ?",
            [req.params.id],
            (error, results) => {
                res.render("edit.ejs", {item: results[0]});
            }
        );
    }
);

// update a list
list_app.post(
    "/update/:id",
    (req, res) => {
        mysql_connection.query(
            "UPDATE lists SET name = ? WHERE id = ?",
            [req.body.itemName, req.params.id],
            (error, results) => {
                res.redirect("/index");
            }
        );
    }
);

list_app.post(
    "/delete/:id",
    (req, res) => {
        mysql_connection.query(
            "DELETE FROM lists WHERE id = ?",
            [req.params.id],
            (error, results) => {
                res.redirect("/index");
            }
        );
    }
);


list_app.listen(3000);