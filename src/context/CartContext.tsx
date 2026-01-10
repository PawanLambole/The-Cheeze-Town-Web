import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '../types';
import { supabase } from '../config/supabase';

interface Offer {
  id: number;
  code: string;
  type: string;
  value: number;
  heading: string;
  valid_from: string;
  valid_to: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string | number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getFinalPrice: () => number;
  getTotalPrice: () => number; // Deprecated alias

  // Coupon / Offer Logic
  activeOffer: Offer | null;
  isOfferActive: boolean; // Computed based on DB existence
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  appliedCoupon: string | null;
  couponError: string | null;

  // Banner state
  isBannerVisible: boolean;
  dismissBanner: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  const dismissBanner = () => setIsBannerDismissed(true);

  // Fetch active offer on mount
  useEffect(() => {
    async function fetchOffer() {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .lte('valid_from', today)
          .gte('valid_to', today)
          .limit(1);

        if (error) {
          console.error('Error fetching offers:', error);
          return;
        }

        if (data && data.length > 0) {
          console.log("Active offer found:", data[0]);
          setActiveOffer(data[0]);
        } else {
          setActiveOffer(null);
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      }
    }

    fetchOffer();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => String(cartItem.id) === String(item.id));
      if (existingItem) {
        return prevCart.map((cartItem) =>
          String(cartItem.id) === String(item.id)
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string | number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => String(cartItem.id) === String(itemId));
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          String(cartItem.id) === String(itemId)
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter((cartItem) => String(cartItem.id) !== String(itemId));
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null); // Clear coupon on cart clear? Maybe optional.
    setCouponError(null);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    if (!activeOffer) {
      setCouponError("No active offers available currently.");
      return false;
    }

    // Strict case-sensitive check or case-insensitive? 
    // Usually codes are case-insensitive, let's normalize to uppercase.
    if (code.trim().toUpperCase() === activeOffer.code.toUpperCase()) {
      setAppliedCoupon(activeOffer.code);
      return true;
    } else {
      setCouponError("Invalid coupon code.");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const getDiscountAmount = () => {
    // Only apply discount if a valid coupon is applied AND matches the active offer
    if (!activeOffer || !appliedCoupon) return 0;

    // Safety check: ensure applied coupon still matches active offer
    if (appliedCoupon.toUpperCase() !== activeOffer.code.toUpperCase()) return 0;

    const subtotal = getSubtotal();

    // Handle different discount types loosely based on what we found (mostly 'heading' exists, 'value' exists)
    // We discovered 'type' has a check constraint we couldn't easily crack, 
    // but we will retrieve whatever is in the DB.
    // Assuming 'value' is the percentage or amount.
    // Logic: If activeOffer.value > 0

    // We assume it's percentage based on context, but let's try to be smart.
    // If type contains 'percent' or 'Percent', or if we default to percent.

    // Simplification for this task: User asked for 30% discount logic specifically.
    // We will trust 'value' is the percentage.

    return subtotal * (activeOffer.value / 100);
  };

  const getFinalPrice = () => {
    return getSubtotal() - getDiscountAmount();
  };

  // Deprecated: Alias for getSubtotal
  const getTotalPrice = () => {
    return getSubtotal();
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getSubtotal,
      getDiscountAmount,
      getFinalPrice,
      getTotalPrice,

      activeOffer,
      isOfferActive: !!activeOffer, // Expose boolean for UI convenience
      isBannerVisible: !!activeOffer && !isBannerDismissed,
      dismissBanner,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      couponError
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
