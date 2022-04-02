const express = require('express');
const bodyParser = require('body-parser')
const uuid = require('uuid');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const app = express();
var db = new sqlite3.Database(':memory:');

// Functions for Interacting with DB

const createEmployee = (firstName, lastName, age) => {
  const id =  uuid.v4(); 
  let createStatement = db.prepare("INSERT INTO employees VALUES (?, ?, ?, ?)");
  createStatement.run(id, firstName, lastName, age);
  createStatement.finalize();
}

const getAllEmployees = (callback) => {
  return db.all(`SELECT * FROM employees;`, callback);
}

const getEmployeeById = (id, callback) => {
  return db.get(`SELECT * FROM employees WHERE id=?`, id, callback)
}

// DB Initializing
db.serialize(function() {
  db.run("CREATE TABLE employees (id INTEGER, firstName NVARCHAR(40), lastName NVARCHAR(40), age INTEGER)");
  createEmployee("Will", "Mathers", 25);
  createEmployee("Quinn", "K", 26);
  createEmployee("Cam", "K", 22);
});

// Express Routes

app.use(express.static(path.join(__dirname, 'build')));

app.get('/employee', function (req, res) {
  const dbCallback = (err, rows) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.send(rows);
    }
  };
 getAllEmployees(dbCallback);
});

app.get('/employee/:employeeId', function (req, res) {
  const id = req.params.employeeId;
  if (!uuid.validate(id)) {
    res.sendStatus(400)
  }
  else {
    const dbCallback = (err, rows) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      else if (!rows) {
        res.sendStatus(404);
      }
      else {
        res.send(rows);
      }
    };
   getEmployeeById(id, dbCallback);
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
console.log("listening :)")
