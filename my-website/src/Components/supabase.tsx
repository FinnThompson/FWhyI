import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL: string = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_API_KEY: string = process.env.REACT_APP_SUPABASE_API_KEY!;

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export { supabase };