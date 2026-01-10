
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

async function seedOffer() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log("Seeding 'offers' table...");

    const offerData = {
        code: 'CHEESE1218',
        type: 'percentage_bill',
        value: 30, // 30%
        heading: 'Get 30% OFF with code CHEESE1218',
        valid_from: '2026-01-01',
        valid_to: '2026-01-18',
        is_active: true
    };

    // Delete existing CHEESE1218 if any to avoid duplicates (assuming code is not unique constraint or just to be clean)
    const { error: deleteError } = await supabase
        .from('offers')
        .delete()
        .eq('code', 'CHEESE1218');

    if (deleteError) {
        console.error("Error cleaning up:", deleteError);
    }

    // Also delete the random one found if we want to ensure CHEESE1218 shows up
    // But maybe let's not be destructive of other data unless we are sure.
    // However, CartContext fetches limit(1). If RPD3TMPY is there, it might pick it up.
    // Let's delete RPD3TMPY too as it seems to be test data.
    await supabase.from('offers').delete().eq('code', 'RPD3TMPY');

    const { data, error } = await supabase.from('offers').insert(offerData).select();

    if (error) {
        console.error("Error inserting offer:", error.message);
        console.error("Full Error:", error);
    } else {
        console.log("Offer inserted successfully:", data);
    }
}

seedOffer();
