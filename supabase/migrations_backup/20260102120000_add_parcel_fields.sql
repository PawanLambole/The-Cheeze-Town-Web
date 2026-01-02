-- Add phone_number and delivery_address to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address text;

-- Ensure order_type is present (it should be, but just in case)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type text DEFAULT 'dine-in';
