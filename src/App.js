import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [employees, setEmployees] = useState([]); 
  const fetchEmployees = () => {

    fetch('http://localhost:3000/employee')
      .then( response => response.json())
      .then(data => {
        console.log(data);
        setEmployees(data);
      });
  }
  if (employees.length === 0) {
    fetchEmployees();
  }

  return (
    <div className="App">
      <p>{`Have ${employees.length} employee records :)`}</p>
    </div>
  );
}

export default App;
