
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
// Using service role key from memory/user rules, or trying anon key if that fails.
// User rule provided: service_role key - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

async function checkOffers() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log("Checking 'offers' table content...");

    const { data, error } = await supabase.from('offers').select('*');

    if (error) {
        console.error("Error fetching offers:", error.message);
    } else {
        data.forEach(offer => {
            console.log(`Code: ${offer.code}, Type: ${offer.type}, Value: ${offer.value}, Valid: ${offer.valid_from} to ${offer.valid_to}`);
        });
        if (data.length > 0) {
            console.log("First offer keys:", Object.keys(data[0]));
        }
    }
}

checkOffers();
