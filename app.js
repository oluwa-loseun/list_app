// importing express package
const express = require('express');
// assigning express package to a constant called app
const app = express();

// importing mysql package
const mysql = require('mysql');

// assigning the package to a constant called connection
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '0000',
        database: 'list_app',
    }
);

// error message should the connection fails
connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
  });


// connecting the app constant to the public directory
app.use(express.static('public'));

// required configuration for accessing form values
app.use(express.urlencoded({extended: false}));



// adding the route and method for the front-page
app.get(
    '/',
    (req, res) => {
        res.render('home.ejs');
    }
);

// adding the route and method for the list-page
app.get(
    '/index',
    (req, res) => {
        connection.query(
            'SELECT * FROM users',
            (error, results) => {
                res.render('index.ejs', {items: results});
            }
        );
    }
);

// adding the route and method for rendering the new-page
app.get(
    '/new',
    (req, res) => {
        res.render('new.ejs');
    }
);

// adding the route and method for posting the data on the new page to db
app.post(
    '/create',
    (req, res) => {
        connection.query(
            'INSERT INTO users (name) VALUES (?)',
             [req.body.itemName],
             (error, results) => {
                 res.redirect('/index');
            }
        );
    }
);

// adding the route and method for rendering the edit-page
app.get(
    '/edit/:id',
    (req, res) => {
        connection.query(
            'SELECT * FROM users WHERE id = ?',
            [req.params.id],
            (error, results) => {
                res.render('edit.ejs', {item: results[0]});
            }
        );
    }
);

// adding the route and method for posting the change made to the data in db (updating a list)
app.post(
    '/update/:id',
    (req, res) => {
        connection.query(
            'UPDATE users SET name = ? WHERE id = ?',
            [req.body.itemName, req.params.id ],
            (error, results) => {
                res.redirect('/index');
            }
        );
    }
);

// adding the route and method for posting the change made to the data in db (deleting a list)
app.post(
    '/delete/:id',
    (req, res) => {
        connection.query(
            'DELETE FROM users WHERE id = ?',
            [req.params.id ],
            (error, results) => {
                res.redirect('/index');
            }
        );
    }
);

app.listen(3000);