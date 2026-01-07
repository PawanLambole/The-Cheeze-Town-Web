
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
    console.error('❌ Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

console.log('📡 Monitoring Supabase Realtime Channel: public:orders (No Filter)');
console.log('Use Ctrl+C to stop.');

const channel = supabase.channel('monitor_all_orders')
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
    }, (payload) => {
        console.log(`\n🔔 [${new Date().toISOString()}] Event: ${payload.eventType}`);
        if (payload.new) {
            console.log(`   Order: ${payload.new.order_number}`);
            console.log(`   Status: ${payload.new.status}`);
            console.log(`   Total: ${payload.new.total_amount}`);
        }
    })
    .subscribe((status) => {
        console.log(`🔌 Connection Status: ${status}`);
    });

// Keep process alive
setInterval(() => { }, 1000);
