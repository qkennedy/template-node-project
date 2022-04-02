const express = require('express');
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const app = express();
var db = new sqlite3.Database(':memory:');

// Functions for Interacting with DB

const createEmployee = (firstName, lastName, age) => {
  const id =  uuidv4(); 
  let createStatement = db.prepare("INSERT INTO employees VALUES (?, ?, ?, ?)");
  createStatement.run(id, firstName, lastName, age);
  createStatement.finalize();
}

const getAllEmployees = (callback) => {
  return db.all(`SELECT * FROM employees;`, callback);
}


db.serialize(function() {
// DB Initializing
db.run("CREATE TABLE employees (id INTEGER, firstName NVARCHAR(40), lastName NVARCHAR(40), age INTEGER)");

createEmployee("Will", "Mathers", 25);
createEmployee("Quinn", "Kennedy", 26);
});
// Express Routes

app.use(express.static(path.join(__dirname, 'build')));

app.get('/employee', function (req, res) {
  const dbCallback = (err, rows) => {
    if (err) {
      console.log(err);
      res.send();
    } else {
      const jsonRes = JSON.stringify(rows);
      console.log(rows);
      res.send(rows);
    }
  };
 getAllEmployees(dbCallback);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
console.log("listening :)")
