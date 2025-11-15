
'use client';
import React, { useState } from 'react';
import { Home, MapPin, DollarSign, Calendar, Bed, Maximize, Zap, CheckCircle } from 'lucide-react';

const HomeFindingAgent = () => {
  const [step, setStep] = useState(0);
  const [searchParams, setSearchParams] = useState({
    selected_area: [],
    price: '',
    availability: [],
    floor_area: '',
    bedrooms: '',
    energy_label: [],
    construction_period: []
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'selected_area',
      question: "Which area are you interested in?",
      icon: MapPin,
      type: 'text_input',
      placeholder: 'e.g., amsterdam, rotterdam, utrecht'
    },
    {
      id: 'price',
      question: "What's your budget range?",
      icon: DollarSign,
      type: 'select',
      options: [
        { value: '0-200000', label: 'Up to €200,000' },
        { value: '200000-300000', label: '€200,000 - €300,000' },
        { value: '300000-500000', label: '€300,000 - €500,000' },
        { value: '500000-750000', label: '€500,000 - €750,000' },
        { value: '750000-1000000', label: '€750,000 - €1,000,000' },
        { value: '1000000-', label: 'Over €1,000,000' }
      ]
    },
    {
      id: 'availability',
      question: "When do you want to move in?",
      icon: Calendar,
      type: 'multiselect',
      options: [
        { value: 'available', label: 'Available now' },
        { value: 'negotiable', label: 'Negotiable' }
      ]
    },
    {
      id: 'bedrooms',
      question: "How many bedrooms do you need?",
      icon: Bed,
      type: 'select',
      options: [
        { value: '1-', label: '1 or more' },
        { value: '2-', label: '2 or more' },
        { value: '3-', label: '3 or more' },
        { value: '4-', label: '4 or more' },
        { value: '5-', label: '5 or more' }
      ]
    },
    {
      id: 'floor_area',
      question: "What's your minimum floor area (m²)?",
      icon: Maximize,
      type: 'select',
      options: [
        { value: '50-', label: '50 m² or more' },
        { value: '80-', label: '80 m² or more' },
        { value: '100-', label: '100 m² or more' },
        { value: '150-', label: '150 m² or more' },
        { value: '200-', label: '200 m² or more' }
      ]
    },
    {
      id: 'energy_label',
      question: "What energy efficiency rating do you prefer?",
      icon: Zap,
      type: 'multiselect',
      options: [
        { value: 'A++++', label: 'A++++' },
        { value: 'A+++', label: 'A+++' },
        { value: 'A++', label: 'A++' },
        { value: 'A+', label: 'A+' },
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' }
      ]
    },
    {
      id: 'construction_period',
      question: "What construction period do you prefer?",
      icon: Home,
      type: 'multiselect',
      options: [
        { value: 'before_1906', label: 'Before 1906' },
        { value: 'from_1906_to_1930', label: '1906 - 1930' },
        { value: 'from_1931_to_1944', label: '1931 - 1944' },
        { value: 'from_1945_to_1959', label: '1945 - 1959' },
        { value: 'from_1960_to_1970', label: '1960 - 1970' },
        { value: 'from_1971_to_1980', label: '1971 - 1980' },
        { value: 'from_1981_to_1990', label: '1981 - 1990' },
        { value: 'from_1991_to_2000', label: '1991 - 2000' },
        { value: 'from_2001_to_2010', label: '2001 - 2010' },
        { value: 'from_2011_to_2020', label: '2011 - 2020' },
        { value: 'from_2021', label: '2021 onwards' }
      ]
    }
  ];

  const currentQuestion = questions[step];

  const handleSelection = (value) => {
    const questionId = currentQuestion.id;
    
    if (currentQuestion.type === 'text_input') {
      // For text input, store as array with single value
      setSearchParams({ ...searchParams, [questionId]: [value.toLowerCase().trim()] });
    } else if (currentQuestion.type === 'multiselect') {
      const currentValues = searchParams[questionId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setSearchParams({ ...searchParams, [questionId]: newValues });
    } else {
      setSearchParams({ ...searchParams, [questionId]: value });
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const buildFundaUrl = () => {
    const params = new URLSearchParams();
    
    if (searchParams.selected_area.length > 0) {
      params.append('selected_area', JSON.stringify(searchParams.selected_area));
    }
    if (searchParams.price) {
      params.append('price', `"${searchParams.price}"`);
    }
    if (searchParams.availability.length > 0) {
      params.append('availability', JSON.stringify(searchParams.availability));
    }
    if (searchParams.floor_area) {
      params.append('floor_area', `"${searchParams.floor_area}"`);
    }
    if (searchParams.bedrooms) {
      params.append('bedrooms', `"${searchParams.bedrooms}"`);
    }
    if (searchParams.energy_label.length > 0) {
      params.append('energy_label', JSON.stringify(searchParams.energy_label));
    }
    if (searchParams.construction_period.length > 0) {
      params.append('construction_period', JSON.stringify(searchParams.construction_period));
    }

    return `https://www.funda.nl/en/zoeken/koop?${params.toString()}`;
  };

  const getFormattedOutput = () => {
    return JSON.stringify(searchParams, null, 2);
  };

  const isCurrentStepValid = () => {
    const questionId = currentQuestion.id;
    const value = searchParams[questionId];
    
    if (currentQuestion.type === 'text_input') {
      return value && value.length > 0 && value[0] !== '';
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    return value !== '';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Your Perfect Home Search is Ready!
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Search Parameters:</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{getFormattedOutput()}</pre>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Funda URL:</h3>
              <div className="bg-gray-50 rounded-lg p-4 break-all text-sm text-blue-600">
                {buildFundaUrl()}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.open(buildFundaUrl(), '_blank')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                View Homes on Funda
              </button>
              <button
                onClick={() => {
                  setShowResults(false);
                  setStep(0);
                  setSearchParams({
                    selected_area: [],
                    price: '',
                    availability: [],
                    floor_area: '',
                    bedrooms: '',
                    energy_label: [],
                    construction_period: []
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Start New Search
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = currentQuestion.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {step + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((step + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.type === 'text_input' ? (
              <input
                type="text"
                value={(searchParams[currentQuestion.id] && Array.isArray(searchParams[currentQuestion.id])) ? searchParams[currentQuestion.id][0] || '' : ''}
                onChange={(e) => handleSelection(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none text-gray-700 font-medium transition-all"
              />
            ) : (
              currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === 'multiselect'
                  ? (searchParams[currentQuestion.id] && Array.isArray(searchParams[currentQuestion.id])) ? searchParams[currentQuestion.id].includes(option.value) : false
                  : searchParams[currentQuestion.id] === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelection(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              isCurrentStepValid()
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === questions.length - 1 ? 'Find My Home' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeFindingAgent;

    