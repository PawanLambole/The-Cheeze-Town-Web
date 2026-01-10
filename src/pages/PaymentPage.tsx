import { useState } from 'react';
import { Shield, ChevronRight, User, ArrowLeft, Ticket, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { customerDB } from '../services/database';
import { Button, Card, Input, Alert } from '../components';
import { RazorpayOptions } from '../types';

import { ParcelDetails } from './ParcelDetailsPage';

interface PaymentPageProps {
  tableId: number;
  orderNumber?: string;
  parcelDetails?: ParcelDetails;
  onPaymentComplete: (orderNumber: string) => void;
  onBack: () => void;
}

export default function PaymentPage({ tableId, orderNumber, parcelDetails, onPaymentComplete, onBack }: PaymentPageProps) {
  const { cart, getSubtotal, getDiscountAmount, getFinalPrice, applyCoupon, removeCoupon, appliedCoupon, couponError, activeOffer, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processOrderAfterPayment = async (response: any) => {
    console.log('Payment Successful:', response);

    try {
      const orderItems = cart.map(item => ({
        menu_item_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      let resultOrderNumber = orderNumber;

      if (orderNumber) {
        // ADD TO EXISTING ORDER
        const { error: addError } = await customerDB.addItemsToOrder({
          orderNumber: orderNumber,
          items: orderItems,
          paymentDetails: {
            payment_id: response.razorpay_payment_id,
            gateway: 'razorpay'
          }
        });

        if (addError) throw addError;
      } else {
        // CREATE NEW ORDER
        const { data: order, error: orderError } = await customerDB.createOrder({
          table_id: tableId,
          customer_name: customerName || parcelDetails?.name || undefined,
          phone_number: parcelDetails?.phone,
          delivery_address: parcelDetails?.address,
          order_type: tableId > 0 ? 'dine-in' : 'parcel',
          notes: (parcelDetails?.notes || '') + (appliedCoupon ? ` [Coupon: ${appliedCoupon}, Savings: ₹${getDiscountAmount().toFixed(0)}]` : ''),
          items: orderItems,
          status: 'paid', // Mark as paid immediately
          paymentDetails: {
            payment_id: response.razorpay_payment_id,
            gateway: 'razorpay'
          }
        });

        if (orderError) throw orderError;
        resultOrderNumber = order.order_number;
      }

      // Mark table as occupied (idempotent)
      if (tableId > 0) {
        await customerDB.updateTableStatus(tableId, 'occupied');
      }

      // Clear cart and navigate
      clearCart();
      if (resultOrderNumber) {
        onPaymentComplete(resultOrderNumber);
      }

    } catch (err: any) {
      console.error('Error processing order after payment:', err);
      setError(`Payment successful, but failed to update order system. Error: ${err.message || JSON.stringify(err)}`);
      setIsProcessing(false); // Make sure to stop processing state on error
    }
  };

  const handlePayment = async () => {
    if (!cart.length) {
      setError('Your cart is empty. Please add some items before placing an order.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      console.error('❌ Missing VITE_RAZORPAY_KEY_ID environment variable');
      setError('Payment service configuration error. Please contact staff.');
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare Razorpay options - NO ORDER CREATED YET
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: Math.round(getFinalPrice() * 100), // Amount in paise (rounded to avoid float issues)
        currency: 'INR',
        name: 'The Cheeze Town',
        description: orderNumber ? `Add-on Order #${orderNumber}` : (tableId > 0 ? 'Dine-in Order' : 'Parcel Order'),
        image: '/logo.jpeg',
        prefill: {
          name: customerName || parcelDetails?.name,
          contact: parcelDetails?.phone,
        },
        theme: {
          color: '#FFB800',
        },
        handler: processOrderAfterPayment,
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            console.log('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-darker via-brand-dark to-brand-darker py-4 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-4 md:mb-8 animate-fade-in-down">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors mb-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-2 leading-tight">
            Complete Your <span className="text-brand-yellow">Order</span>
          </h1>
          <div className="flex items-center gap-2 text-gray-400 font-medium text-xs md:text-sm">
            <Shield className="w-3 h-3 md:w-4 md:h-4" />
            Secure & Encrypted Transaction
          </div>
        </div>

        {/* Main Card */}
        <Card glowing className="p-4 md:p-8 animate-fade-in-up space-y-4 md:space-y-6">
          {/* Order Summary */}
          <div className="bg-brand-gray/30 rounded-2xl p-4 border border-brand-yellow/20">
            {tableId > 0 ? (
              <>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">Table Number</p>
                <p className="text-2xl font-bold text-brand-yellow mb-4">#{tableId}</p>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-1">Order Type</p>
                <p className="text-2xl font-bold text-brand-yellow mb-4">Parcel / Online</p>
                {parcelDetails && (
                  <div className="mb-4 text-xs text-gray-300">
                    <p><span className="text-gray-400">Name:</span> {parcelDetails.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {parcelDetails.phone}</p>
                    <p><span className="text-gray-400">Address:</span> {parcelDetails.address}</p>
                  </div>
                )}
              </>
            )}

            <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm md:text-base">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-xs">x {item.quantity}</p>
                  </div>
                  <p className="text-brand-yellow font-bold">₹{(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2 space-y-1 text-sm md:text-base">
              <div className="flex justify-between items-center text-gray-300">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toFixed(0)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-400 font-medium">
                  <span>Discount ({activeOffer?.value}% OFF)</span>
                  <span>-₹{getDiscountAmount().toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                <span className="text-lg md:text-xl font-bold text-white">Total Amount</span>
                <span className="text-3xl font-bold text-brand-yellow">₹{getFinalPrice().toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              title="Payment Error"
              message={error}
              dismissible
              onClose={() => setError(null)}
            />
          )}

          {/* Customer Name */}
          <div>
            <Input
              label="Your Name (Optional)"
              icon={<User className="w-5 h-5" />}
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Coupon Code Section */}
          {activeOffer && (
            <div className="bg-brand-gray/20 rounded-xl p-3 border border-white/5">
              <label className="block text-gray-400 text-xs font-medium mb-1">Have a Coupon?</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="uppercase"
                    disabled={!!appliedCoupon}
                    icon={<Ticket className="w-5 h-5" />}
                  />
                  {!appliedCoupon && !couponCode && activeOffer && (
                    <button
                      onClick={() => setCouponCode(activeOffer.code)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-[10px] grid place-items-center font-bold bg-brand-yellow/20 text-brand-yellow px-2 py-1 rounded hover:bg-brand-yellow hover:text-brand-darker transition-all"
                    >
                      Use {activeOffer.code}
                    </button>
                  )}
                </div>
                {appliedCoupon ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      removeCoupon();
                      setCouponCode('');
                    }}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/50"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    onClick={() => applyCoupon(couponCode)}
                    disabled={!couponCode}
                    className="bg-brand-yellow text-brand-darker hover:bg-yellow-400"
                  >
                    Apply
                  </Button>
                )}
              </div>
              {couponError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span className="block w-1.5 h-1.5 rounded-full bg-red-400" />
                  {couponError}
                </p>
              )}
              {appliedCoupon && (
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Coupon applied!
                </p>
              )}
            </div>
          )}

          {/* Info */}
          <div className="rounded-xl border border-white/10 bg-brand-gray/30 p-3 text-xs text-gray-300">
            <p>
              You will be redirected to Razorpay to complete your payment securely.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <Button
              onClick={onBack}
              variant="secondary"
              size="lg"
              disabled={isProcessing}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              isLoading={isProcessing}
              size="lg"
              disabled={isProcessing}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
              className="shadow-lg shadow-brand-yellow/20"
            >
              Pay Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
