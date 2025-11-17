
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: {
    booking_message: string;
    available_days: string[];
    day_slots: string[];
  }) => void;
  property: any;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
    { value: 'Morning', label: 'Morning (9am-12pm)' },
    { value: 'Afternoon', label: 'Afternoon (1pm-5pm)' },
    { value: 'Evening', label: 'Evening (6pm-9pm)' }
];

export default function BookingDialog({ isOpen, onClose, onSubmit, property }: BookingDialogProps) {
  const [bookingMessage, setBookingMessage] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [daySlots, setDaySlots] = useState<string[]>([]);
  
  const handleDayToggle = (day: string) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSlotToggle = (slotValue: string) => {
    setDaySlots(prev => 
      prev.includes(slotValue) ? prev.filter(s => s !== slotValue) : [...prev, slotValue]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      booking_message: bookingMessage,
      available_days: availableDays,
      day_slots: daySlots,
    });
  };
  
  const isFormValid = availableDays.length > 0 && daySlots.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Viewing</DialogTitle>
          <DialogDescription>
            Submit your availability for: <span className="font-semibold">{property?.title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="booking-message">Message (optional)</Label>
            <Textarea
              id="booking-message"
              value={bookingMessage}
              onChange={(e) => setBookingMessage(e.target.value)}
              placeholder="Any specific questions or requests for the agent?"
            />
          </div>
          <div className="grid gap-2">
            <Label>Which days are you available?</Label>
            <div className="grid grid-cols-3 gap-2">
              {weekDays.map(day => (
                <Button 
                  key={day} 
                  variant={availableDays.includes(day) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(day)}
                >
                  {day.substring(0,3)}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>What times of day work best?</Label>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map(slot => (
                 <div key={slot.value} className="flex items-center space-x-2">
                    <Checkbox 
                        id={slot.value}
                        checked={daySlots.includes(slot.value)}
                        onCheckedChange={() => handleSlotToggle(slot.value)}
                    />
                    <label
                        htmlFor={slot.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {slot.label}
                    </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
