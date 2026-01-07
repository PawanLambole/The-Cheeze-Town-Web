
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://gnpdhisyxwqvnjleyola.supabase.co';
// WARNING: Service Role Key - Do not expose to client side!
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
    db: {
        schema: 'public',
    },
});

const CONCURRENT_REQUESTS = 100; // Increased to 100
const TABLE_NAME = 'menu_items'; // Ensure this table exists and has some data

async function makeRequest(id) {
    const start = Date.now();
    try {
        // Determine query type (read)
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('count')
            .limit(1)
            .single();

        if (error) throw error;

        const duration = Date.now() - start;
        return { id, success: true, duration, error: null };
    } catch (err) {
        const duration = Date.now() - start;
        return { id, success: false, duration, error: err.message || err };
    }
}

async function runStressTest() {
    console.log(`🚀 Starting stress test with ${CONCURRENT_REQUESTS} concurrent requests...`);
    console.log(`Target: ${SUPABASE_URL}`);

    const promises = [];
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
        promises.push(makeRequest(i));
    }

    const results = await Promise.all(promises);

    // Analysis
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const avgDuration = successful.reduce((acc, curr) => acc + curr.duration, 0) / (successful.length || 1);

    console.log('\n📊 Results:');
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`⏱️ Avg Duration: ${avgDuration.toFixed(2)}ms`);

    if (failed.length > 0) {
        console.log('\nSample Errors:');
        failed.slice(0, 5).forEach(f => console.log(`- Request ${f.id}: ${JSON.stringify(f.error)}`));
    }
}

runStressTest();
