import { Megaphone, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface OfferBannerProps {
    hasNavbar?: boolean;
}

export default function OfferBanner({ hasNavbar = false }: OfferBannerProps) {
    const { isBannerVisible, activeOffer, dismissBanner } = useCart();

    if (!isBannerVisible || !activeOffer) return null;

    const positionClasses = hasNavbar
        ? "fixed top-16 md:top-20 left-0 right-0"
        : "relative";

    return (
        <div className={`${positionClasses} bg-gradient-to-r from-brand-yellow to-yellow-600 text-brand-darker px-4 py-2 shadow-lg z-50 animate-fade-in-down`}>
            <div className="container mx-auto flex items-center justify-center gap-3 text-center">
                <Megaphone className="w-5 h-5 animate-pulse" />
                <p className="font-bold text-sm md:text-base">
                    {activeOffer.heading || `Special Offer! Use coupon ${activeOffer.code} for ${activeOffer.value}% OFF!`}
                </p>
                <button
                    onClick={dismissBanner}
                    className="absolute right-2 md:right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
