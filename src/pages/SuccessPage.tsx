import { PlusCircle, Clock, UtensilsCrossed } from 'lucide-react';
import { Button, Card } from '../components';

interface SuccessPageProps {
  onOrderMore: () => void;
  orderNumber: string;
}

export default function SuccessPage({ onOrderMore, orderNumber }: SuccessPageProps) {
  const estimatedTime = 15 + Math.floor(Math.random() * 6); // 15-20 min

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-darker via-brand-dark to-brand-darker flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      <div className="max-w-lg w-full relative z-10">
        {/* Success Message */}
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-yellow-300 mb-2 md:mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 text-sm md:text-lg">Thank you for choosing The Cheeze Town</p>
        </div>

        {/* Order Details Card */}
        <Card glowing className="p-4 md:p-8 mb-6 md:mb-8 space-y-4 md:space-y-6">
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
            <div className="bg-brand-gray/20 rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <p className="text-gray-300 font-medium text-sm md:text-base">Your order is being prepared</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-brand-yellow font-bold text-base md:text-lg">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span>Estimated time: {estimatedTime} minutes</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl p-3 md:p-4 text-center">
            <p className="text-gray-300 font-medium mb-1 text-sm md:text-base">Our kitchen team is working on your delicious order</p>
            <p className="text-gray-500 text-xs md:text-sm">We'll notify you when it's ready to serve</p>
          </div>
        </Card>

        {/* Action Button */}
        <div>
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
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-xs md:text-sm mt-4 md:mt-6">
          Your table staff will bring your order as soon as it's ready
        </p>
      </div>
    </div>
  );
}
