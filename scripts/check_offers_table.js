
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDQ2ODEsImV4cCI6MjA4MjA4MDY4MX0.1QVjRASldswSZo1gfMTugh3tzyAsHxzN859GUmc5P-0';

async function checkTables() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log("Checking for 'offers' table...");

    const { data, error } = await supabase.from('offers').select('*').limit(1);

    if (error) {
        console.error("Error accessing 'offers' table:", error.message);
    } else {
        console.log("Table 'offers' exists!");
        console.log("Sample data:", data);
    }
}

checkTables();
