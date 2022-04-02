import React, {useState} from 'react';
import './App.css';
import './components/Sidebar/Sidebar'
import Sidebar from './components/Sidebar/Sidebar';
import AppointmentTable from './components/AppointmentTable/AppointmentTable';

function App() {

  const [physicians, setPhysicians] = useState([]);
  const [selectedPhys, setSelectedPhys] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const fetchPhysicians = () => {

    fetch('http://localhost:3000/physician')
      .then( response => response.json())
      .then(data => {
        console.log(data);
        setPhysicians(data);
      });
  }

  const fetchAppointmentsForPhysId = (physId) => {
    fetch(`http://localhost:3000/physician/${physId}/appointments`)
    .then( response => response.json())
    .then(data => {
      console.log(data);
      setAppointments(data);
    });
  }

  if (physicians.length === 0) {
    fetchPhysicians();
  }

  if (selectedPhys && appointments.length === 0) {
    fetchAppointmentsForPhysId(selectedPhys.physicianId);
  }

  const handlePhysSelect = (phys) => {
    setSelectedPhys(phys);
  }


  return (
    <div className="App">
      <Sidebar 
        physicians={physicians}
        handlePhysSelect={handlePhysSelect}/>
      {selectedPhys && (
      <AppointmentTable
        appointments={appointments}
        physicianName={`${selectedPhys.firstName} ${selectedPhys.lastName}`}
        physicianEmail={"definitelyTheEmail@gmail.com"}
      />)}
      
    </div>
  );
}

export default App;
