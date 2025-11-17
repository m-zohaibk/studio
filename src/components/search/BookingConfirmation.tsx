
'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Search, BookMarked, Target, Scan } from 'lucide-react';

interface BookingConfirmationProps {
    stats: {
        propertiesScanned: number;
        perfectMatches: number;
        viewingsBooked: number;
    };
    onStartNewSearch: () => void;
}

const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: number | string, label: string }) => (
    <div className="bg-gray-100/60 p-4 rounded-lg text-center">
        <Icon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
    </div>
);


export default function BookingConfirmation({ stats, onStartNewSearch }: BookingConfirmationProps) {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
            <div className="flex justify-center items-center w-24 h-24 bg-green-500 rounded-full mx-auto mb-6">
                <CheckCircle className="w-16 h-16 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                All Set! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Your viewings have been successfully scheduled
            </p>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left mb-8">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <Mail className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Confirmation Emails Sent</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Check your inbox! We've sent detailed confirmation emails with:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-3 space-y-1">
                            <li>Viewing dates and times</li>
                            <li>Agent contact information</li>
                            <li>Property addresses with directions</li>
                            <li>Parking and arrival instructions</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard icon={Scan} value={stats.propertiesScanned} label="Properties Scanned" />
                <StatCard icon={Target} value={stats.perfectMatches} label="Perfect Matches" />
                <StatCard icon={BookMarked} value={`${stats.viewingsBooked}/${stats.perfectMatches}`} label="Viewings Booked" />
            </div>

            <div className="flex flex-col gap-4">
                <Button size="lg" onClick={onStartNewSearch} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Search className="mr-2" /> Start a New Search
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                    <BookMarked className="mr-2" /> View My Bookings
                </Button>
            </div>
        </div>
    )
}
