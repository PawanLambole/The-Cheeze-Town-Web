
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

async function updateOffer() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log("Updating offers to be valid from today...");

    // Update all offers to start from 2026-01-01 just to be safe for testing
    // Or just the specific one. There is only one in the output (id starting with c452...)
    // But let's just update based on code or just all.

    const { data, error } = await supabase
        .from('offers')
        .update({ valid_from: '2026-01-01' })
        .eq('code', 'RPD3TMPY') // The code I saw in the output
        .select();

    if (error) {
        console.error("Error updating offer:", error);
    } else {
        console.log("Offer updated:", data);
    }

    // Also update CHEESE1218 if it exists, as that was in the seed script
    const { data: data2, error: error2 } = await supabase
        .from('offers')
        .update({ valid_from: '2026-01-01' })
        .eq('code', 'CHEESE1218')
        .select();

    if (!error2 && data2.length > 0) {
        console.log("Also updated CHEESE1218:", data2);
    }
}

updateOffer();
