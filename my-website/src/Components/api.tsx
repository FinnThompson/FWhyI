// api.ts

import { supabase } from './supabase'; // Assume you have your Supabase client initialized in this file

export async function getFunFact(): Promise<string> {
  const { data, error } = await supabase.from('funfacts').select('fact').eq('date', new Date().toISOString().split('T')[0]);
  if (error) {
    throw error;
  }

  if (data && data.length > 0) {
    return data[0].fact;
  } else {
    return 'No fun fact available for today.';
  }
}

export{}
