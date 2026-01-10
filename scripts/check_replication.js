
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function checkReplication() {
    console.log('🔍 Checking Supabase Replication Settings...');

    // Check if 'orders' table is in the publication
    const { data, error } = await supabase.rpc('get_publication_tables');
    // Note: get_publication_tables might not exist unless we created it. 
    // Alternate: use a direct query if we could, but with JS client we need RPC or direct Table access.
    // However, we can infer it by trying to subscribe with the service role client and receiving an event ourselves.
    // Actually, let's just try to update a dummy row and see if we get it? 
    // Better: let's use the 'rpc' to run SQL if the user has that setup, BUT likely they don't.
    // We can't run raw SQL with JS client easily without an RPC function.

    // Instead, let's just inspect the 'orders' table structure via REST to see if we can read it.
    // Realtime enablement is not directly exposed via REST API metadata.

    // PLAN B: Trust the 'monitor_realtime.js' output. 
    // If monitor_realtime.js (using ANON) says "SUBSCRIBED", it typically means the socket connected. 
    // But if the TABLE is not in publication, it won't receive events.

    console.log("⚠️ Cannot directly check pg_publications via JS Client without RPC.");
    console.log("👉 Suggestion: Run this SQL in Supabase SQL Editor:");
    console.log("   select * from pg_publication_tables where tablename = 'orders';");

    // We can try to subscribe with SERVICE ROLE here and see if IT works.

    const channel = supabase.channel('service_role_check')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            console.log('✅ Service Role received event!');
        })
        .subscribe((status) => {
            console.log(`Service Role Subscription Status: ${status}`);
        });

    // Wait a bit
    setTimeout(() => {
        console.log("Done waiting.");
        process.exit(0);
    }, 5000);
}

checkReplication();
