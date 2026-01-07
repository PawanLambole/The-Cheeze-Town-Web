
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
// Provided in user rules/memory
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

if (!SUPABASE_URL || !ANON_KEY) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function testConnection(role, key) {
    console.log(`\n--- Testing with ${role} Role ---`);
    const supabase = createClient(SUPABASE_URL, key);

    // 1. Check basic toggle (Insert then Update)
    const channel = supabase.channel(`debug_${role}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            console.log(`✅ [${role}] Received Realtime Event:`, payload.eventType);
        })
        .subscribe((status) => {
            console.log(`ℹ️ [${role}] Subscription status:`, status);
        });

    // Give it a moment to connect
    await sleep(2000);

    return { supabase, channel };
}

async function triggerChange() {
    console.log('\n--- Triggering Database Change (using Service Role) ---');
    // Use service role to guarantee write access
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // We need an order to update. Let's find one or create a dummy one.
    // Ideally update user-created one, but verification is safer with dummy or just check policies.
    // For now, let's just inspect policies using a clever query if possible, or assume user will manually update.
    // Actually, I can update the most recent order to 'pending' then back to original status if I'm careful.

    // fetch last order
    const { data: orders } = await adminClient.from('orders').select('*').limit(1);
    if (!orders || orders.length === 0) {
        console.log('⚠️ No orders found to update.');
        return;
    }

    const targetOrder = orders[0];
    console.log(`Targeting Order: ${targetOrder.order_number} (Current Status: ${targetOrder.status})`);

    // Update to same status just to trigger 'UPDATE' event
    const { error } = await adminClient
        .from('orders')
        .update({ notes: (targetOrder.notes || '') + ' ' }) // Add space to notes to force update
        .eq('id', targetOrder.id);

    if (error) console.error('❌ Update failed:', error);
    else console.log('✅ Update sent.');
}

async function main() {
    console.log('Starting Supabase Realtime Diagnostic...');

    // 1. Test Service Role (Should always work if Realtime is enabled on table)
    const serviceRole = await testConnection('SERVICE_ROLE', SERVICE_ROLE_KEY);

    // 2. Test Anon Role (Will fail if RLS Policy blocks 'SELECT' for anon)
    const anonRole = await testConnection('ANON', ANON_KEY);

    await sleep(2000); // Wait for subs

    // 3. Trigger an update
    await triggerChange();

    await sleep(5000); // Wait for events

    console.log('\n--- Diagnosis ---');
    console.log('If [SERVICE_ROLE] received event but [ANON] did not -> RLS Policy Issue.');
    console.log('If NEITHER received event -> Realtime not enabled on "orders" table.');

    process.exit(0);
}

main();
