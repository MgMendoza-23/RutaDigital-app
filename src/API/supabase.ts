import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwhvegfrwilgmkxdrgdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aHZlZ2Zyd2lsZ21reGRyZ2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NjE3NDEsImV4cCI6MjA4NjQzNzc0MX0.prl4J3Rt5jZVKLfjXmH-BL6uFUuu87sFdmt6ZQanDgc';

export const supabase = createClient(supabaseUrl, supabaseKey);
