import React, { useState, useEffect } from 'react';
import './App.css';
import { insertFunFact } from './Components/insertFunFact';
import { getFunFact } from './Components/api';
import { calculateWordScores } from '../server/factAnalyzerTransformer';
import { analyzeFactComp } from './Components/analyzeFact';
import CountdownTimer from './Components/countdownTimer';
import PixabayFetch from './Components/pixabayFetch';
import { getFunFactTag } from './Components/api';

function App() {
  const [todaysFact, setTodaysFact] = useState<string>('');
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [wordScores, setWordScores] = useState<Record<string, number>>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // State to store the Pixabay search term

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

  useEffect(() => {
    // Fetch the tag for today's date and store it in the state
    const fetchTag = async () => {
      try {
        const tag = await getFunFactTag();
        if (tag !== null) {
          setSearchTerm(tag); // Set the search term for Pixabay API
        } else {
          console.log('No tag available.');
        }
      } catch (error) {
        console.error('Error fetching tag:', error);
      }
    };

    fetchTag();
  }, []);
  const analyzeFact = async () => {
    console.log('Text to be analyzed:', JSON.stringify({ text })); // Log the text variable
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
    <div className="container" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', height: '100vh', width: '100vw', position: 'relative' }}>
      <div className="App" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        {/* Banner */}
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', width: '100vw', textAlign: 'left', padding: '0px', position: 'absolute', top: '0', left: '0', fontSize: '48px', maxHeight: '100vh', overflowY: 'auto' }}>
          FWHYI.com
        </div>

        <button className="insert-button" onClick={handleInsertClick} style={{ position: 'absolute', top: '0', right: '10px' }}>
          Insert Fun Fact
        </button>

        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', width: 'auto', maxWidth: '80%', textAlign: 'center', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '16px', whiteSpace: 'pre-wrap', maxHeight: '100vh', overflowY: 'auto' }}>
          <h2>FWHYI...</h2>
          {loading ? <p>Loading...</p> : <p>{todaysFact}</p>}
        </div>

        {/* Countdown Timer */}
        <PixabayFetch searchWord={searchTerm} setImageUrl={setImageUrl} />

        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', width: 'auto', maxWidth: '80%', textAlign: 'center', padding: '20px', position: 'absolute', bottom: '10px', right: '10px', fontSize: '18px', color: 'white', maxHeight: '100vh', overflowY: 'auto' }}>
          <h2>Time Until Next Fun Fact</h2>
          <CountdownTimer targetDate={targetDate} />
        </div>
      </div>
    </div>






  );
}

export default App;


/*<textarea value={text} onChange={(e) => setText(e.target.value)} />
    <button onClick={analyzeFact}>Analyze Fact</button>
    <h2>Word Scores</h2>
<pre>{JSON.stringify(wordScores, null, 2)}</pre>*/