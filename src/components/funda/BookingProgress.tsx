'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Check } from 'lucide-react';

interface BookingProgressProps {
  properties: any[];
  onComplete: () => void;
}

interface BookingState {
  id: number;
  title: string;
  status: 'pending' | 'processing' | 'confirmed';
  step: number;
  color: string;
}

const BOOKING_STEPS = [
  'Opening agent page',
  'Contacting agent',
  'Filling your details',
  'Confirmed!'
];

export default function BookingProgress({ properties, onComplete }: BookingProgressProps) {
  const [bookings, setBookings] = useState<BookingState[]>(
    properties.slice(0, 3).map((prop, idx) => ({
      id: prop.id,
      title: prop.title,
      status: 'pending' as const,
      step: 0,
      color: ['from-emerald-500 to-emerald-600', 'from-blue-500 to-blue-600', 'from-violet-500 to-violet-600'][idx]
    }))
  );

  useEffect(() => {
    const processBookings = async () => {
      for (let i = 0; i < bookings.length; i++) {
        for (let step = 0; step <= BOOKING_STEPS.length; step++) {
          await new Promise(resolve => setTimeout(resolve, 900));

          setBookings(prev => {
            const updated = [...prev];
            updated[i] = {
              ...updated[i],
              status: step === BOOKING_STEPS.length ? 'confirmed' : 'processing',
              step: step
            };
            return updated;
          });
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1200));
      onComplete();
    };

    processBookings();
  }, [onComplete, bookings.length]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-2xl border border-slate-100">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Calendar className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Booking Your Viewings</h2>
            <p className="text-xl text-slate-600">Our AI is contacting agents and scheduling appointments...</p>
          </div>

          {/* Bookings */}
          <div className="space-y-6 mb-10">
            {bookings.map((booking, idx) => (
              <div key={booking.id} className="relative">
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${booking.color} text-white transition-all duration-500 shadow-lg`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex-1">
                      <div className="text-sm opacity-90 mb-1 font-medium">Property {idx + 1}</div>
                      <div className="font-bold text-xl mb-1 truncate">{booking.title}</div>
                    </div>
                    <div className="text-5xl">
                      {booking.status === 'confirmed' ? '✅' :
                        booking.status === 'processing' ? '⏳' : '○'}
                    </div>
                  </div>

                  {/* Steps Progress */}
                  <div className="space-y-3">
                    {BOOKING_STEPS.map((stepName, stepIdx) => (
                      <div
                        key={stepIdx}
                        className={`flex items-center gap-3 transition-all duration-300 ${stepIdx < booking.step ? 'opacity-100' :
                            stepIdx === booking.step ? 'opacity-100' :
                              'opacity-40'
                          }`}
                      >
                        <div className={`w-3 h-3 rounded-full transition-all ${stepIdx < booking.step ? 'bg-white scale-100' :
                            stepIdx === booking.step ? 'bg-white animate-pulse scale-125' :
                              'bg-white/50 scale-100'
                          }`}></div>
                        <span className="text-sm font-medium">{stepName}</span>
                        {stepIdx < booking.step && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-slate-600 mb-3 font-medium">Overall Progress</div>
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {bookings.filter(b => b.status === 'confirmed').length} / {bookings.length}
            </div>
            <div className="text-sm text-slate-500 font-medium">Viewings Confirmed</div>
          </div>
        </div>
      </div>
    </div>
  );
}