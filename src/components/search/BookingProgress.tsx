
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Loader, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingProgressProps {
  properties: any[];
  onComplete: () => void;
}

const steps = [
  'Opening agent page',
  'Contacting agent',
  'Filling your details',
  'Confirmed',
];

const cardColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-pink-500',
];

const PropertyBookingCard = ({ property, isActive, currentStep, isComplete }: { property: any, isActive: boolean, currentStep: number, isComplete: boolean }) => {
  let cardColor = 'bg-gray-400';
  if (isActive) {
    cardColor = 'bg-green-500';
  } else if (!isComplete) {
    // Assign a color from the list based on property id or index to keep it consistent
    const colorIndex = (property.id.charCodeAt(0) || 0) % cardColors.length;
    cardColor = cardColors[colorIndex];
  }


  const getStatusIcon = (stepIndex: number) => {
    if (isComplete || (isActive && stepIndex < currentStep)) {
      return <CheckCircle className="w-5 h-5 text-white" />;
    }
    if (isActive && stepIndex === currentStep) {
      return <Hourglass className="w-5 h-5 text-white animate-spin" />;
    }
    return <Circle className="w-5 h-5 text-white/50" />;
  };

  const getStepClass = (stepIndex: number) => {
    const isStepDone = isComplete || (isActive && stepIndex < currentStep);
    return cn(
      "flex items-center gap-3 text-sm transition-opacity",
      isStepDone ? 'text-white' : 'text-white/60'
    );
  };

  return (
    <div className={cn(
      "p-6 rounded-2xl text-white transition-all duration-500",
      cardColor,
      isActive || isComplete ? 'shadow-lg' : 'shadow-md opacity-80'
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider">Property {property.id.substring(0,4)}</p>
          <h3 className="font-bold text-xl">{property.title}</h3>
          <p className="text-sm opacity-80">{property.address?.split(',')[1] || 'Unknown Location'}</p>
        </div>
        <div className="flex-shrink-0">
          {isComplete ? <CheckCircle className="w-8 h-8 text-white" /> : isActive ? <Loader className="w-8 h-8 text-white animate-spin"/> : <Circle className="w-8 h-8 text-white/30"/>}
        </div>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step} className={getStepClass(index)}>
            {getStatusIcon(index)}
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function BookingProgress({ properties, onComplete }: BookingProgressProps) {
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (properties.length === 0) {
      onComplete();
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep < steps.length - 1) {
          return prevStep + 1;
        } else {
          // Move to next property or finish
          setActivePropertyIndex(prevIndex => {
            if (prevIndex < properties.length - 1) {
              setCurrentStep(0); // Reset step for new property
              return prevIndex + 1;
            } else {
              // All properties are done
              clearInterval(stepInterval);
              setTimeout(onComplete, 1000); // Wait a bit before completing
              return prevIndex;
            }
          });
          return prevStep;
        }
      });
    }, 1500); // Time per step

    return () => clearInterval(stepInterval);
  }, [properties.length, onComplete]);


  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Booking Your Viewings
        </h1>
        <p className="text-lg text-gray-600 mb-8">
            Our AI is contacting agents and scheduling appointments...
        </p>

        <div className="space-y-6">
            {properties.map((prop, index) => (
                <PropertyBookingCard 
                    key={prop.id}
                    property={prop}
                    isActive={index === activePropertyIndex}
                    currentStep={currentStep}
                    isComplete={index < activePropertyIndex}
                />
            ))}
        </div>
    </div>
  );
}
