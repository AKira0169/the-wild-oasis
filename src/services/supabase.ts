import { createClient } from '@supabase/supabase-js';
export const supabaseUrl: string = 'https://ugzqghxzuczbvuesstup.supabase.co';
const supabaseKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnenFnaHh6dWN6YnZ1ZXNzdHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MTY4MTgsImV4cCI6MjA0Njk5MjgxOH0.KbWasYBBNEFVLOJ0lJVFcmwKOLS22Q-9g0k3u77dFDM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
