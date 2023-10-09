import React from 'react';
import './App.css';
import { insertFunFact } from './Components/insertFunFact'; // Import the function from your TypeScript file

function App() {
  const handleInsertClick = async () => {
    await insertFunFact(); // Call the insertFunFact function when the button is clicked
    // You can add additional logic here if needed
  };

  return (
    <div className="App">
      <h1>Your App</h1>
      <button className="insert-button" onClick={handleInsertClick}>
        Insert Fun Fact
      </button>
    </div>
  );
}

export default App;
