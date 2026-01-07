import { useState } from 'react';
import { Shield, ChevronRight, User, ArrowLeft } from 'lucide-react';
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
  const { cart, getTotalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
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
          notes: parcelDetails?.notes,
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
        amount: getTotalPrice() * 100, // Amount in paise
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
    <div className="min-h-screen bg-gradient-to-b from-brand-darker via-brand-dark to-brand-darker py-8 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8 md:mb-12 animate-fade-in-down">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-3 leading-tight">
            Complete Your <span className="text-brand-yellow">Order</span>
          </h1 >
          <div className="flex items-center gap-2 text-gray-400 font-medium text-sm md:text-base">
            <Shield className="w-4 h-4 md:w-5 md:h-5" />
            Secure & Encrypted Transaction
          </div>
        </div >

        {/* Main Card */}
        <Card glowing className="p-4 md:p-12 animate-fade-in-up space-y-6 md:space-y-8">
          {/* Order Summary */}
          <div className="bg-brand-gray/30 rounded-2xl p-4 md:p-6 border border-brand-yellow/20">
            {tableId > 0 ? (
              <>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-2">Table Number</p>
                <p className="text-3xl font-bold text-brand-yellow mb-6">#{tableId}</p>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-2">Order Type</p>
                <p className="text-3xl font-bold text-brand-yellow mb-6">Parcel / Online</p>
                {parcelDetails && (
                  <div className="mb-6 text-sm text-gray-300">
                    <p><span className="text-gray-400">Name:</span> {parcelDetails.name}</p>
                    <p><span className="text-gray-400">Phone:</span> {parcelDetails.phone}</p>
                    <p><span className="text-gray-400">Address:</span> {parcelDetails.address}</p>
                  </div>
                )}
              </>
            )}

            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">x {item.quantity}</p>
                  </div>
                  <p className="text-brand-yellow font-bold">₹{(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">Total Amount</span>
              <span className="text-4xl font-bold text-brand-yellow">₹{getTotalPrice()}</span>
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
              placeholder="Enter your name for the order"
            />
          </div>

          {/* Info */}
          <div className="rounded-xl border border-white/10 bg-brand-gray/30 p-4 text-sm text-gray-300">
            <p>
              Please review your order carefully. You will be redirected to Razorpay to complete your payment securely.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-4 border-t border-white/10">
            <Button
              onClick={onBack}
              variant="secondary"
              size="lg"
              fullWidth
              disabled={isProcessing}
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              isLoading={isProcessing}
              size="lg"
              fullWidth
              disabled={isProcessing}
              icon={<ChevronRight className="w-5 h-5" />}
              iconPosition="right"
              className="shadow-lg shadow-brand-yellow/20"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>

          {/* TEST MODE BYPASS */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <button
              onClick={async () => {
                setIsProcessing(true);
                try {
                  const mockResponse = {
                    razorpay_payment_id: 'pay_test_' + Math.random().toString(36).substring(7),
                    razorpay_order_id: 'order_test_' + Math.random().toString(36).substring(7),
                    razorpay_signature: 'test_signature'
                  };
                  await processOrderAfterPayment(mockResponse);
                } catch (err) {
                  console.error("Test payment failed", err);
                  setError("Test payment failed");
                  setIsProcessing(false);
                }
              }}
              className="text-xs text-brand-yellow/50 hover:text-brand-yellow hover:underline cursor-pointer"
            >
              [TEST MODE] Bypass Payment Gateway
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
