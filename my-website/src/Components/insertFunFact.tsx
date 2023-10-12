import { format, addDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { analyzeFactComp } from './analyzeFact';

const {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} = require('obscenity');




const SUPABASE_URL: string = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_API_KEY: string = process.env.REACT_APP_SUPABASE_API_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

async function fetchUselessFact() {
  try {
    const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
    return response.data.text; // Extract the text property from the API response
  } catch (error) {
    console.error('Error fetching useless fact:', error);
    return null;
  }
}

function containsSpecialCharacters(word: string): boolean {
  // Regular expression to check for special characters
  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  return regex.test(word);
}

async function checkFactNotInDatabase(fact: string): Promise<boolean> {
  try {
    // Check if the fact already exists in the 'funfacts' table
    const { data, error } = await supabase
      .from('funfacts')
      .select('id')
      .eq('fact', fact);

    if (error) {
      console.error('Error checking fact existence:', error);
      throw error; // Handle the error appropriately in your application
    }

    // If data is not present or its length is 0, the fact does not exist in the table
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}





function containsProfanity(text: string): boolean {
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });
  return (matcher.hasMatch(text));
}

async function insertFunFact() {
  try {


    // Fetch the most recent date from the database
    const { data: latestFact } = await supabase.from('funfacts').select('date').order('date', { ascending: false }).limit(1);

    // Calculate the current date in EST timezone
    const estDate = utcToZonedTime(new Date(), 'America/New_York');

    // Calculate the next date to insert the fact
    let nextDate = new Date();


    if (latestFact && latestFact.length > 0) {

      nextDate = new Date(latestFact[0].date);
      nextDate.setDate(nextDate.getDate() + 2); // Increment date by one day
    } else {
      nextDate = estDate; // Use today's date in EST timezone
    }

    const formattedDate = format(nextDate, 'yyyy-MM-dd');
    const funFact = await fetchUselessFact();

    
    const factIsUnique = await checkFactNotInDatabase(funFact);
    if(factIsUnique) {

    
    if (containsProfanity(funFact)) {
      console.log('contains profanity')
      await insertFunFact();
    }

    if (funFact) {
      // Analyze the fun fact using the analyzeFact function
      const wordScores = await analyzeFactComp(funFact);

      // Find the most popular word from the wordScores object
      let mostPopularWord = '';
      let maxFrequency = 0;
      Object.entries(wordScores).forEach(([word, frequency]) => {
        if (frequency > maxFrequency && !containsSpecialCharacters(word)) {
          mostPopularWord = word;
          maxFrequency = frequency;
        }
      });

      if (mostPopularWord) {
        console.log('Most Popular Word:', mostPopularWord);
        console.log('Frequency:', maxFrequency);

        let secondMostPopularWord = '';
        let secondMaxFrequency = 0;
        Object.entries(wordScores).forEach(([word, frequency]) => {
          if (frequency > secondMaxFrequency && word !== mostPopularWord && !containsSpecialCharacters(word)) {
            secondMostPopularWord = word;
            secondMaxFrequency = frequency;
          }
        });

        const tag = secondMostPopularWord ? `${mostPopularWord}, ${secondMostPopularWord}` : mostPopularWord;


        const apiKey = '26449723-554b1a548f2e90edf3bcfd722';
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(tag)}&image_type=photo`;
        let imageUrl = null;
        try {
          const response = await fetch(url);
          const returnData = await response.json();
          if (returnData.totalHits > 0) {
            imageUrl = returnData.hits[0].largeImageURL; // Set the image URL in the state
            // Insert the fun fact and date into Supabase
            const { data, error } = await supabase.from('funfacts').insert([{ fact: funFact, date: formattedDate, tag, imageURL: imageUrl }]);
            if (error) {
              console.error(`Error inserting fun fact for ${formattedDate} into Supabase:`, error);
            } else {
              console.log(`Fun fact for ${formattedDate} inserted successfully:`, data);
            }
          } else {
            console.log('No images found for the given search term.');
            await insertFunFact();

          }
        } catch (error) {
          console.error('Error fetching data from Pixabay:', error);
        }






      } else {

        // If no valid word found, call the function again recursively
        console.log('No valid word found. Calling function again.');
        await insertFunFact();
      }
    }

  }
  else {
    console.log('fact is not unique')
    await insertFunFact();
  }





  } catch (error) {
    console.error('Error fetching the most recent date from Supabase:', error);
  }
}

export { insertFunFact };