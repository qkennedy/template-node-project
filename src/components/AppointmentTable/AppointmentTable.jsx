import React, {useState} from 'react';

function AppointmentTable(props) {

  const { physicianName, physicianEmail, appointments } = props;
  
  return (
    <div>
      <h1>{physicianName}</h1>
      <h3>{physicianEmail}</h3>
      <table>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Time</th>
          <th>Kind</th>
        </tr>
        {appointments && appointments.map((appt, i) => (
        <tr>
            <td>{i}</td>
           <td>{`${appt.patientFirstName} ${appt.patientLastName}`}</td>
           <td>{appt.time}</td>
           <td>{appt.type}</td>
        </tr>
      ))}
      </table>
    </div>
  );
}

export default AppointmentTable;
