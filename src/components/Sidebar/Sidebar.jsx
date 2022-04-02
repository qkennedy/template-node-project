import React, {useState} from 'react';

function Sidebar(props) {

  const { physicians, handlePhysSelect } = props;
  
  return (
    <div>
      <h2>Notable</h2>
      <h3>Physicians</h3>
      {physicians && physicians.map(phys => (
        <button onClick={() => handlePhysSelect(phys)}>
          <p>{`${phys.firstName} ${phys.lastName}`}</p>
        </button>
      ))}
    <button>Logout</button>
    </div>
  );
}

export default Sidebar;
