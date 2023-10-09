import React, { useState, useEffect } from 'react';
import './App.css';
import { insertFunFact } from './Components/insertFunFact';
import { getFunFact } from './Components/api';
import CountdownTimer from './Components/countdownTimer';
import { calculateWordScores } from './Components/factAnalyzerTransformer';

function App() {
  const [todaysFact, setTodaysFact] = useState<string>('');
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [wordScores, setWordScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchTodaysFact = async () => {
      try {
        const fact = await getFunFact(); // Fetch today's fun fact
        setTodaysFact(fact);

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

  useEffect(() => {
    const analyzeFact = async () => {
      try {
        const fact = await getFunFact(); // Fetch today's fun fact
        setTodaysFact(fact);

        // Calculate word scores for today's fact
        const scores = await calculateWordScores(fact);
        setWordScores(scores);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching today\'s fun fact or calculating word scores:', error);
        setLoading(false);
      }
    };

    analyzeFact();
  }, []);

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
      <h2>Word Scores</h2>
    <pre>{JSON.stringify(wordScores, null, 2)}</pre>
      <CountdownTimer targetDate={targetDate} />
    </div>
  );
}

export default App;
