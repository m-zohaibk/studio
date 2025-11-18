'use client';
import React from 'react';
import { Check, Search, Calendar } from 'lucide-react';

interface SuccessScreenProps {
  onNewSearch: () => void;
  propertiesScanned: number;
  matchesFound: number;
  viewingsBooked: number;
}

export default function SuccessScreen({ 
  onNewSearch, 
  propertiesScanned, 
  matchesFound, 
  viewingsBooked 
}: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl text-center border border-slate-100">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check className="w-20 h-20 text-white" />
          </div>

          <h2 className="text-5xl font-bold text-slate-900 mb-4">All Set! 🎉</h2>
          <p className="text-2xl text-slate-600 mb-12">Your viewings have been successfully scheduled</p>

          {/* Confirmation Details */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-10 text-left border-2 border-indigo-100">
            <div className="flex items-start gap-5">
              <div className="text-5xl">📧</div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-slate-900 mb-3">Confirmation Emails Sent</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Check your inbox! We've sent detailed confirmation emails with:
                </p>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Viewing dates and times
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Agent contact information
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Property addresses with directions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    Parking and arrival instructions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 mb-10">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-4xl font-bold text-slate-900 mb-2">{propertiesScanned}</div>
              <div className="text-sm text-slate-600 font-medium">Properties Scanned</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-4xl font-bold text-slate-900 mb-2">{matchesFound}</div>
              <div className="text-sm text-slate-600 font-medium">Perfect Matches</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-4xl font-bold text-slate-900 mb-2">{viewingsBooked}/{matchesFound}</div>
              <div className="text-sm text-slate-600 font-medium">Viewings Booked</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={onNewSearch}
              className="group relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
            >
              <Search className="w-6 h-6" />
              Start a New Search
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </button>
            <button className="w-full bg-slate-100 text-slate-700 py-5 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
              <Calendar className="w-5 h-5" />
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}