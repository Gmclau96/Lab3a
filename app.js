const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const path = require("path");
const { isBuffer } = require('util');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));

let db = new sqlite3.Database('./database/employees.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else
        console.log('Connected to the employees database');
});

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//INSERT
app.post('/add', function (req, res) {
    db.serialize(() => {
        db.run('INSERT INTO emp(id,name) VALUES(?,?)', [req.body.id, req.body.name],
            function (err) {
                if (err) {
                    return console.log(err.message);
                }
                console.log("New employee has been added");
                res.send("New employee has been added into the databse with ID = " + req.body.id + " and Name = " + req.body.name);
            });
    });
});

//VIEW
app.post('/view', function (req, res) {
    db.serialize(() => {
        db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.body.id],
            function (err, row) {
                if (err) {
                    res.send("Errorencoutered while displaying");
                    return console.error(err.message);
                }
                res.send(' ID: ${row.ID}, Name: ${row.NAME}');
                console.log("Entry displayed successfully");
            });
    });
});

//UPDATE
app.post('/update', function (req, res) {
    db.serialize(() => {
        db.run('UPDATE emp SET name = ? WEHERE id = ?', [req.body.name, reqbody.id],
            function (err) {
                if (err) {
                    res.send("Error encounteredf while updating");
                    return console.error(err.message);
                }
                res.send("Entry updated sucessfully");
                console.log("Entry updated sucessfully");
            });
    });
});

//DELETE
app.post('/delete', function (req, res) {
    db.serialize(() => {
        db.run('DELETE FROM emp WHERE id = ?', req.body.id, function (err) {
            if (err) {
                res.send("Error encountered while deleting");
                return console.error(err.message);
            }
            res.send("Entry deleted");
            console.log("Entry Deleted");
        });
    });
});




app.get('/close', function (req, res) {
    db.close((err) => {
        if (err) {
            res.send('There is some error in closing the database')
            return console.error(err.message);
        }
        console.log('Closing the Database connection');
        res.send('Database connection sucsessfully closed');
    });
});

app.listen(3000,()=>{
    console.log("server listening on port: 3000");
});