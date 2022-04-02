const express = require('express');
const bodyParser = require('body-parser')
const uuid = require('uuid');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const app = express();
var db = new sqlite3.Database(':memory:');

// Functions for Interacting with DB

const createPhysician = (firstName, lastName) => {
  const id =  uuid.v4(); 
  let createStatement = db.prepare("INSERT INTO physicians VALUES (?, ?, ?)");
  createStatement.run(id, firstName, lastName);
  createStatement.finalize();
}

const getAllPhysicians = (callback) => {
  return db.all(`SELECT * FROM physicians;`, callback);
}

getAppointmentsByPhysicianId = (physicianId, callback) => {
  return db.all(`SELECT * FROM appointments WHERE physicianId=?`, physicianId, callback)
}

// unnecessary for this assignment
const getPhysicianById = (id, callback) => {
  return db.get(`SELECT * FROM physicians WHERE id=?`, id, callback)
}

const createAppointment = (physicianId, patientFirst, patientLast, time, type) => {
  const id =  uuid.v4(); 
  let createStatement = db.prepare("INSERT INTO appointments VALUES (?, ?, ?, ?, ?, ?)");
  createStatement.run(id, patientFirst, patientLast, time, type, physicianId);
  createStatement.finalize();
}


// DB Initializing
db.serialize(function() {
  db.run("CREATE TABLE physicians (physicianId NVARCHAR(36) PRIMARY KEY, firstName NVARCHAR(40), lastName NVARCHAR(40))");
  db.run(`
    CREATE TABLE appointments
    (
      appointmentId NVARCHAR(36) PRIMARY KEY,
      patientFirstName NVARCHAR(40),
      patientLastName NVARCHAR(40),
      time NVARCHAR(10),
      type NVARCHAR(100),
      physicianId NVARCHAR(36),
      FOREIGN KEY (physicianId)
          REFERENCES physicians (physicianId)
    );
  `);
  createPhysician("Julius", "Hibbert");
  createPhysician("Alger", "Krieger");
  createPhysician("Cam", "K");
  getAllPhysicians( (err, rows) => {
    let physicians = rows;
    for (const physician of physicians) {
      createAppointment(physician.id, "Lana", "Kane", "8:00AM", "Follow-up");
    }
  });

});

// Express Routes

app.use(express.static(path.join(__dirname, 'build')));

app.get('/physician', function (req, res) {
  const dbCallback = (err, rows) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    else {
      res.send(rows);
    }
  };
 getAllPhysicians(dbCallback);
});

app.get('/physician/:physicianId', function (req, res) {
  const id = req.params.physicianId;
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
   getPhysicianById(id, dbCallback);
  }
});

app.get('/physician/:physicianId/appointments', function (req, res) {
  const id = req.params.physicianId;
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
   getAppointmentsByPhysicianId(id, dbCallback);
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
console.log("listening...")
