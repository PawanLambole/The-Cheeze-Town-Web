
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

const POSSIBILITIES = [
    'percent', 'percentage', 'Percent', 'Percentage', 'PERCENT', 'PERCENTAGE',
    'fixed', 'flat', 'amount', 'Fixed', 'Flat', 'Amount', 'FIXED', 'FLAT', 'AMOUNT',
    'discount', 'Discount', 'DISCOUNT',
    'coupon', 'Coupon', 'COUPON',
    'promo', 'Promo', 'PROMO',
    'voucher', 'Voucher',
    'site_wide', 'site-wide',
    'global',
    'reduction',
    'sale',
    'special',
    'offer',
    'P', 'F',
    '1', '2', '0',
    'true', 'false', // sometimes boolean stored as text?
    'percentage_discount',
    'fixed_amount'
];

async function discover() {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    console.log(`Testing ${POSSIBILITIES.length} potential types...`);

    // We can run these in parallel batches
    const promises = POSSIBILITIES.map(async (t) => {
        const { data, error } = await supabase.from('offers').insert({
            code: `TRY_${t.replace(/[^a-zA-Z0-9]/g, '')}`,
            type: t,
            value: 30,
            valid_from: '2026-01-01',
            valid_to: '2026-01-18'
        }).select();

        if (!error) {
            console.log(`!!! SUCCESS !!! Type '${t}' works!`);
            await supabase.from('offers').delete().eq('id', data[0].id);
            return t;
        }
        return null;
    });

    const results = await Promise.all(promises);
    const success = results.find(r => r !== null);

    if (!success) {
        console.log("All failed.");
    }
}

discover();
