import { useEffect, useState } from 'react';
import { PlusCircle, Clock, UtensilsCrossed, Home, CheckCircle } from 'lucide-react';
import { Button, Card } from '../components';
import { supabase } from '../config/supabase';

interface SuccessPageProps {
  onOrderMore: () => void;
  onHome?: () => void;
  orderNumber: string;
  isParcel?: boolean;
}

export default function SuccessPage({ onOrderMore, onHome, orderNumber, isParcel }: SuccessPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [estimatedTime] = useState(15 + Math.floor(Math.random() * 6)); // Default 15-20 min
  const [orderStatus, setOrderStatus] = useState<string>('pending');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Request Notification Permission on mount
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // 2. Fetch initial status
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('order_number', orderNumber)
        .single();

      if (data) {
        setOrderStatus(data.status);
      }
    };

    fetchStatus();

    // 3. Subscribe to Realtime Updates
    const channel = supabase
      .channel(`order_status_${orderNumber}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          // REMOVED FILTER FOR DEBUGGING: filter: `order_number=eq.${orderNumber}`,
        },
        (payload) => {
          console.log('Order update received:', payload);
          const newStatus = payload.new.status;
          setOrderStatus(newStatus);

          if (newStatus === 'ready' || newStatus === 'served') {
            triggerNotification();
          }
        }
      )
      .subscribe((status) => {
        console.log(`🔌 Subscription status for ${orderNumber}:`, status);
        setIsConnected(status === 'SUBSCRIBED');

        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime channel error. Check connection or permissions.');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderNumber]);

  const triggerNotification = () => {
    const message = "Your order is ready! Please collect it from the counter.";

    // 1. Audio Notification
    const audio = new Audio('/belli.m4a');
    audio.play().catch(e => console.log('Audio autoplay prevented:', e));

    // 2. System Notification (Screen Off support)
    if ('Notification' in window && Notification.permission === 'granted') {
      const options: any = {
        body: message,
        icon: '/logo.jpeg',
        vibrate: [200, 100, 200],
        tag: 'order-ready'
      };

      // Use the service worker registration if available for better background handling on mobile
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Order Ready!', options);
        });
      } else {
        // Fallback to standard notification
        new Notification('Order Ready!', options);
      }
    }

    // 3. Text-to-Speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isReady = orderStatus === 'ready' || orderStatus === 'served';

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-darker via-brand-dark to-brand-darker flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      <div className="max-w-lg w-full relative z-10">
        {/* Success Message */}
        {/* Success Message */}
        <div className="text-center mb-6 md:mb-10 animate-fade-in-down relative">
          {/* Connection Status Indicator */}
          <div className="absolute right-0 top-0 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/5">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-300 mb-2 md:mb-3">
            {isParcel ? 'Order Placed!' : 'Order Confirmed!'}
          </h1>
          <p className="text-gray-400 text-sm md:text-lg">Thank you for choosing The Cheeze Town</p>
        </div>

        {/* Order Details Card */}
        <Card glowing className="p-4 md:p-8 mb-6 md:mb-8 space-y-4 md:space-y-6 animate-fade-in-up">
          {/* Order Number */}
          <div className="bg-brand-gray/30 rounded-2xl p-4 md:p-6 border border-brand-yellow/30 text-center">
            <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-medium mb-1 md:mb-2">Order Number</p>
            <p className="text-3xl md:text-5xl font-bold text-brand-yellow tracking-wider">#{orderNumber}</p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-yellow to-transparent"></div>

          {/* Status Section */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 md:w-5 md:h-5 text-brand-yellow" />
              Preparation Status
            </h3>

            <div className={`rounded-xl p-3 md:p-4 transition-colors duration-500 ${isReady ? 'bg-green-500/20 border border-green-500/30' : 'bg-brand-gray/20'}`}>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <p className={`font-medium text-sm md:text-base ${isReady ? 'text-green-400' : 'text-gray-300'}`}>
                  {isReady ? 'Order Ready!' : 'Your order is being prepared'}
                </p>
                {isReady && <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 animate-bounce" />}
              </div>

              {!isReady ? (
                <div className="flex items-center gap-2 md:gap-3 text-brand-yellow font-bold text-base md:text-lg">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                  <span>Estimated time: {estimatedTime} minutes</span>
                </div>
              ) : (
                <div className="text-green-300 text-sm md:text-base animate-pulse">
                  Please collect your order from the counter.
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl p-3 md:p-4 text-center">
            <p className="text-gray-300 font-medium mb-1 text-sm md:text-base">
              {isReady ? "Enjoy your meal!" : "Our kitchen team is working on your delicious order"}
            </p>
            <p className="text-gray-500 text-xs md:text-sm">
              {isParcel
                ? (isReady ? "Ready for pickup" : "We'll have it ready for pickup shortly")
                : (isReady ? "Served fresh!" : "We'll notify you when it's ready")
              }
            </p>
          </div>
        </Card>

        {/* Action Button */}
        <div className="animate-fade-in-up animation-delay-200">
          {isParcel ? (
            <Button
              onClick={onHome}
              fullWidth
              size="lg"
              icon={<Home className="w-5 h-5" />}
              iconPosition="left"
              className="shadow-2xl shadow-brand-yellow/30"
            >
              Go to Home
            </Button>
          ) : (
            <Button
              onClick={onOrderMore}
              fullWidth
              size="lg"
              icon={<PlusCircle className="w-5 h-5" />}
              iconPosition="left"
              className="shadow-2xl shadow-brand-yellow/30"
            >
              Order More Items
            </Button>
          )}
        </div>

        {/* Footer Note */}
        {!isParcel && (
          <p className="text-center text-gray-500 text-xs md:text-sm mt-4 md:mt-6 animate-fade-in">
            We will play a sound notification when your order is ready.
          </p>
        )}
      </div>
    </div>
  );
}
