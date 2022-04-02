import React, {useState} from 'react';
import './App.css';
import './components/Sidebar/Sidebar'
import Sidebar from './components/Sidebar/Sidebar';

function App() {

  const [physicians, setPhysicians] = useState([]);
  const fetchPhysicians = () => {

    fetch('http://localhost:3000/physician')
      .then( response => response.json())
      .then(data => {
        console.log(data);
        setPhysicians(data);
      });
  }
  if (physicians.length === 0) {
    fetchPhysicians();
  }

  return (
    <div className="App">
      <Sidebar physicians={physicians}/>
      
    </div>
  );
}

export default App;
