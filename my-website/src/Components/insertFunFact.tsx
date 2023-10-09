import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

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

async function insertFunFact() {
  try {
    // Fetch the most recent date from the database
    const { data: latestFact } = await supabase.from('funfacts').select('date').order('date', { ascending: false }).limit(1);

    // Calculate the next date to insert the fact
    let nextDate = new Date();
    if (latestFact && latestFact.length > 0) {
      nextDate = new Date(latestFact[0].date);
      nextDate.setDate(nextDate.getDate() + 1); // Increment date by one day
    }

    const formattedDate = nextDate.toISOString().split('T')[0];
    const funFact = await fetchUselessFact();

    if (funFact) {
      const { data, error } = await supabase.from('funfacts').insert([{ fact: funFact, date: formattedDate }]);
      if (error) {
        console.error(`Error inserting fun fact for ${formattedDate} into Supabase:`, error);
      } else {
        console.log(`Fun fact for ${formattedDate} inserted successfully:`, data);
      }
    }
  } catch (error) {
    console.error('Error fetching the most recent date from Supabase:', error);
  }
}
export { insertFunFact };
