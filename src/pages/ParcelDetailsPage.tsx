import { useState } from 'react';
import { ArrowRight, MapPin, Phone, User, FileText, ArrowLeft } from 'lucide-react';
import { Button, Card, Input } from '../components';

interface ParcelDetailsPageProps {
    onContinue: (details: ParcelDetails) => void;
    onBack: () => void;
}

export interface ParcelDetails {
    name: string;
    phone: string;
    address: string;
    notes: string;
}

export default function ParcelDetailsPage({ onContinue, onBack }: ParcelDetailsPageProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    const [errors, setErrors] = useState<Partial<ParcelDetails>>({});

    const validate = () => {
        const newErrors: Partial<ParcelDetails> = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit phone number';
        if (!address.trim()) newErrors.address = 'Delivery address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onContinue({ name, phone, address, notes });
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
                        Back to Menu
                    </button>
                    <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-3 leading-tight">
                        Order <span className="text-brand-yellow">Details</span>
                    </h1>
                    <p className="text-gray-400">Please provide your details for the parcel order.</p>
                </div>

                {/* Form Card */}
                <Card glowing className="p-4 md:p-8 animate-fade-in-up space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            icon={<User className="w-5 h-5" />}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            error={errors.name}
                            required
                        />

                        <Input
                            label="Phone Number"
                            icon={<Phone className="w-5 h-5" />}
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter 10-digit mobile number"
                            error={errors.phone}
                            required
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300 ml-1">
                                Delivery Address <span className="text-brand-red">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-brand-yellow transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter complete delivery address"
                                    className={`w-full bg-brand-dark/50 border ${errors.address ? 'border-brand-red' : 'border-white/10 focus:border-brand-yellow/50'
                                        } rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-yellow/50 transition-all min-h-[100px] resize-none`}
                                />
                            </div>
                            {errors.address && (
                                <p className="text-xs text-brand-red ml-1">{errors.address}</p>
                            )}
                        </div>

                        <Input
                            label="Order Notes (Optional)"
                            icon={<FileText className="w-5 h-5" />}
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special instructions?"
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleSubmit}
                            size="lg"
                            fullWidth
                            icon={<ArrowRight className="w-5 h-5" />}
                            iconPosition="right"
                            className="shadow-lg shadow-brand-yellow/20"
                        >
                            Continue to Payment
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
