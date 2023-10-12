import { supabase } from './supabase';
import { format } from 'date-fns-tz'; // Import the format function from date-fns-tz

export async function getFunFact(): Promise<string> {
  // Get the current date in EST timezone
  const estDate = format(new Date(), 'yyyy-MM-dd', { timeZone: 'America/New_York' });

  const { data, error } = await supabase.from('funfacts').select('fact').eq('date', estDate);
  if (error) {
    throw error;
  }

  if (data && data.length > 0) {
    return data[0].fact;
  } else {
    return 'No fun fact available for today.';
  }
}

export async function getFunFactTag(): Promise<string | null> {
  // Get the current date in EST timezone
  const estDate = format(new Date(), 'yyyy-MM-dd', { timeZone: 'America/New_York' });

  const { data, error } = await supabase
    .from('funfacts')
    .select('tag')
    .eq('date', estDate);

    console.log(data)

  if (error) {
    throw error;
  }

  if (data && data.length > 0) {
    return data[0].tag;
  } else {
    return null;
  }
}

export async function getImageURL(): Promise<string | null> {
  // Get the current date in EST timezone
  const estDate = format(new Date(), 'yyyy-MM-dd', { timeZone: 'America/New_York' });

  const { data, error } = await supabase
    .from('funfacts')
    .select('imageURL')
    .eq('date', estDate);

    console.log(data)

  if (error) {
    throw error;
  }

  if (data && data.length > 0) {
    return data[0].imageURL;
  } else {
    return null;
  }
}
