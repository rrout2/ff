import React, {useEffect} from 'react';
import './App.css';
import {getRosters} from './sleeper-api/sleeper-api';

function App() {
  useEffect(() => {
    getRosters('1048770475687571456');
  });
  return (
    <div className="App">
      ayo
    </div>
  );
}

export default App;
