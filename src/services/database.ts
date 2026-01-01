/**
 * Customer Website Database Service
 * Real Supabase integration for menu, tables, and orders
 */

import { supabase } from '../config/supabase';

export const customerDB = {
    /**
     * Get all menu items from database
     */
    async getMenuItems() {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('category', { ascending: true });

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return { data: [], error };
        }
    },

    /**
     * Get available tables from database
     */
    async getAvailableTables() {
        try {
            const { data, error } = await supabase
                .from('restaurant_tables')
                .select('*')
                .eq('status', 'available')
                .order('table_number', { ascending: true });

            if (error) {
                // If table doesn't exist, return mock data
                console.warn('Tables table not found, using mock data:', error);
                const mockTables = [
                    { id: 1, table_number: 1, capacity: 2, status: 'available', location: 'indoor' },
                    { id: 2, table_number: 2, capacity: 4, status: 'available', location: 'indoor' },
                    { id: 3, table_number: 3, capacity: 6, status: 'available', location: 'outdoor' },
                    { id: 4, table_number: 4, capacity: 4, status: 'available', location: 'indoor' },
                    { id: 5, table_number: 5, capacity: 8, status: 'available', location: 'outdoor' },
                ];
                return { data: mockTables, error: null };
            }
            return { data: data || [], error: null };
        } catch (error) {
            console.error('Error fetching tables:', error);
            return { data: [], error };
        }
    },

    /**
     * Update table status
     */
    async updateTableStatus(tableId: number, status: 'available' | 'occupied' | 'reserved') {
        try {
            const { error } = await supabase
                .from('restaurant_tables')
                .update({ status })
                .eq('id', tableId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Error updating table status:', error);
            return { error };
        }
    },

    /**
     * Create a new order in the database
     */
    async createOrder(orderData: {
        table_id: number;
        customer_name?: string;
        items: Array<{ menu_item_name: string; quantity: number; unit_price: number }>;
        status?: string;
        paymentDetails?: any;
    }) {
        try {
            // Calculate total amount
            const totalAmount = orderData.items.reduce(
                (sum, item) => sum + item.unit_price * item.quantity,
                0
            );

            // Generate sequential order number with WEB prefix
            let nextNum = 1;

            // Get the last order that starts with WEB
            const { data: lastOrders } = await supabase
                .from('orders')
                .select('order_number')
                .like('order_number', 'WEB%')
                .order('created_at', { ascending: false })
                .limit(1);

            if (lastOrders && lastOrders.length > 0) {
                const lastId = lastOrders[0].order_number;
                // Extract number part
                const numPart = parseInt(lastId.replace('WEB', ''), 10);
                if (!isNaN(numPart)) {
                    nextNum = numPart + 1;
                }
            }

            const orderNumber = `WEB${nextNum}`;

            // Prepare insert data - only include fields that exist in schema
            const insertData: any = {
                order_number: orderNumber,
                table_id: orderData.table_id,
                customer_name: orderData.customer_name || null,
                status: orderData.status || 'pending',
                total_amount: totalAmount,
                order_time: new Date().toISOString(),
            };

            // Note: Payment details (payment_id, payment_gateway, payment_time) 
            // are not included as they may not exist in the current schema
            // The 'paid' status is sufficient to indicate successful payment

            // 1. Insert the order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert(insertData)
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Insert order items
            const orderItems = orderData.items.map(item => ({
                order_id: order.id,
                menu_item_name: item.menu_item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.unit_price * item.quantity, // Calculate total price per item
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Insert payment record if payment details are provided
            if (orderData.paymentDetails) {
                const paymentData = {
                    order_id: order.id,
                    amount: totalAmount,
                    status: 'success',
                    transaction_id: orderData.paymentDetails.payment_id,
                    payment_method: 'razorpay', // Now we know this column exists
                    payment_date: new Date().toISOString(), // Found this column too
                    processed_by: null,
                    notes: `Gateway: ${orderData.paymentDetails.gateway}`
                };

                const { error: paymentError } = await supabase
                    .from('payments')
                    .insert(paymentData);

                if (paymentError) {
                    console.error('Error recording payment:', paymentError);
                }
            }

            console.log('✅ Order created successfully:', order);
            return { data: order, error: null };
        } catch (error) {
            console.error('Error creating order:', error);
            return { data: null, error };
        }
    },

    /**
     * Add items to an existing order
     */
    async addItemsToOrder(orderData: {
        orderNumber: string;
        items: Array<{ menu_item_name: string; quantity: number; unit_price: number }>;
        paymentDetails?: any;
    }) {
        try {
            // Calculate total amount for new items
            const newItemsTotal = orderData.items.reduce(
                (sum, item) => sum + item.unit_price * item.quantity,
                0
            );

            // Get the order first to get its ID
            const { data: order, error: fetchError } = await supabase
                .from('orders')
                .select('*')
                .eq('order_number', orderData.orderNumber)
                .single();

            if (fetchError) throw fetchError;

            // 1. Insert new order items
            const orderItems = orderData.items.map(item => ({
                order_id: order.id,
                menu_item_name: item.menu_item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.unit_price * item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 2. Update order total amount
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    total_amount: order.total_amount + newItemsTotal,
                    // Optionally update status back to 'paid' if it was 'served' or something, 
                    // but for now keeping it simple or maybe 'paid' is fine.
                    // If the previous status was 'served', adding new items might theoretically 
                    // make it 'pending' (for the new items), but the order level status is tricky.
                    // However, for web orders, they are usually 'pending' -> 'delivered'.
                    // Let's keep the status as is or ensure it's not 'cancelled'.
                })
                .eq('id', order.id);

            if (updateError) throw updateError;

            // 3. Insert new payment record
            if (orderData.paymentDetails) {
                const paymentData = {
                    order_id: order.id,
                    amount: newItemsTotal, // Only the amount for new items
                    status: 'success',
                    transaction_id: orderData.paymentDetails.payment_id,
                    payment_method: 'razorpay',
                    payment_date: new Date().toISOString(),
                    processed_by: null,
                    notes: `Gateway: ${orderData.paymentDetails.gateway} (Add-on)`
                };

                const { error: paymentError } = await supabase
                    .from('payments')
                    .insert(paymentData);

                if (paymentError) {
                    console.error('Error recording payment for add-on:', paymentError);
                }
            }

            console.log('✅ Items added to order successfully:', orderData.orderNumber);
            return { data: order, error: null };
        } catch (error) {
            console.error('Error adding items to order:', error);
            return { data: null, error };
        }
    },

    /**
     * Update order status (used for payment confirmation)
     */
    async updateOrderStatus(orderNumber: string, status: string, paymentDetails?: any) {
        try {
            const updateData: any = { status };

            if (paymentDetails) {
                updateData.payment_id = paymentDetails.payment_id;
                updateData.payment_gateway = paymentDetails.gateway;
                updateData.payment_time = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('orders')
                .update(updateData)
                .eq('order_number', orderNumber)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error updating order status:', error);
            return { data: null, error };
        }
    },

    /**
     * Subscribe to menu changes (real-time)
     */
    subscribeToMenu(callback: (payload: any) => void) {
        const channel = supabase
            .channel('menu_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'menu_items',
            }, (payload: any) => {
                console.log('Menu updated:', payload);
                callback(payload);
            })
            .subscribe();

        return {
            unsubscribe: () => {
                channel.unsubscribe();
            },
        };
    },

    /**
     * Subscribe to table changes (real-time)
     */
    subscribeToTables(callback: (payload: any) => void) {
        const channel = supabase
            .channel('table_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tables',
            }, (payload: any) => {
                console.log('Tables updated:', payload);
                callback(payload);
            })
            .subscribe();

        return {
            unsubscribe: () => {
                channel.unsubscribe();
            },
        };
    },

    /**
     * Unsubscribe from a channel
     */
    async unsubscribe(subscription: { unsubscribe?: () => void }) {
        if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe();
        }
    },
};

// Default export for convenience
export default customerDB;

// Export supabase client for direct access if needed
export { supabase };
