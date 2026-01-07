
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// We need SERVICE_ROLE key or a user with permissions to update. 
// Since we are backend/script, we might need the service role key if RLS allows.
// However, the user provided a service_role key in the global memory!
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Env Vars or Service Role Key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const orderNumber = process.argv[2];
const status = process.argv[3] || 'ready';

if (!orderNumber) {
    console.log('Usage: node scripts/simulate_order_update.js <order_number> [status]');
    process.exit(1);
}

async function updateOrder() {
    console.log(`🚀 Updating Order #${orderNumber} to status: '${status}'...`);

    const { data, error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('order_number', orderNumber)
        .select();

    if (error) {
        console.error('❌ Error updating order:', error);
    } else {
        console.log('✅ Order updated successfully:', data);
    }
}

updateOrder();
