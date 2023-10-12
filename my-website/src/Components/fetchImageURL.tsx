import { format, addDays } from 'date-fns';
import { utcToZonedTime  } from 'date-fns-tz';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL: string = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_API_KEY: string = process.env.REACT_APP_SUPABASE_API_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);


export const fetchImageDatabase = async (): Promise<string | null> => {
    try {
      const estDate = utcToZonedTime(new Date(), 'America/New_York');
  
      const { data } = await supabase.from('funFacts').select('imageURL').eq('date', estDate).single();
      
      // Extract imageURL from data or set it to null if no matching record is found
      const imageURL: string | null = data ? data.imageURL : null;
  
      // Return the imageURL or null if no matching record is found
      return imageURL;
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      throw error;
    }
};

export default fetchImageDatabase;
  