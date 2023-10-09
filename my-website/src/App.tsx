import React, { useState, useEffect } from 'react';
import './App.css';
import { insertFunFact } from './Components/insertFunFact';
import { getFunFact } from './Components/api';
import CountdownTimer from './Components/countdownTimer';
import { calculateWordScores } from '../server/factAnalyzerTransformer';

function App() {
  const [todaysFact, setTodaysFact] = useState<string>('');
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [wordScores, setWordScores] = useState<Record<string, number>>({});
  
  const [text, setText] = useState('');
  useEffect(() => {
    const fetchTodaysFact = async () => {
      try {
        const fact = await getFunFact(); // Fetch today's fun fact
        setTodaysFact(fact);
        setText(fact); // Set the text state with today's fun fact
  
        // Calculate the target date for the next day
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        setTargetDate(nextDay);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching today\'s fun fact:', error);
        setLoading(false);
      }
    };
  
    fetchTodaysFact();
  }, []);

  const analyzeFact = async () => {
    console.log('Text to be analyzed:', JSON.stringify({text})); // Log the text variable
    try {
      const response = await fetch('http://localhost:3005/analyze-fact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setWordScores(data);
      } else {
        console.log(text);
        console.error('Failed to analyze fact:', response.statusText);
      }
    } catch (error) {
      console.log(text);
      console.error('Error occurred during analysis:', error);
    }
  };

  const handleInsertClick = async () => {
    await insertFunFact();
    // Call any additional logic after inserting the fun fact if needed
  };

  return (
    <div className="App">
      <h1>Your App</h1>
      <button className="insert-button" onClick={handleInsertClick}>
        Insert Fun Fact
      </button>

      <h2>Today's Fun Fact</h2>
      {loading ? <p>Loading...</p> : <p>{todaysFact}</p>}
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={analyzeFact}>Analyze Fact</button>

      <h2>Word Scores</h2>
      <pre>{JSON.stringify(wordScores, null, 2)}</pre>
    </div>
  );
}

export default App;
