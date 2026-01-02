export interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  category: string;
  description?: string;
  status?: string;
  image_url?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface RestaurantTable {
  id: number;
  table_number: number;
  status: 'available' | 'occupied' | 'reserved';
  capacity?: number;
  current_order_id?: number;
}

export type Page =
  | 'splash'
  | 'home'
  | 'menu'
  | 'table-selection'
  | 'parcel-details'
  | 'payment'
  | 'success'
  | 'about'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'refund';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler?: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

