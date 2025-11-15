
'use client';
import React, { useState } from 'react';
import { Home, MapPin, DollarSign, Calendar, Bed, Maximize, Zap, CheckCircle, LoaderCircle } from 'lucide-react';
import { fetchFundaResults } from '@/app/actions';
import PropertyCard from './PropertyCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ValidateAndStructurePropertyQueryInput, ValidateAndStructurePropertyQueryOutput } from '@/ai/flows/validate-and-structure-property-query';

const HomeFindingAgent = () => {
  const [step, setStep] = useState(0);
  const [searchParams, setSearchParams] = useState<ValidateAndStructurePropertyQueryInput>({
    selected_area: '',
    price: '',
    availability: '',
    floor_area: '',
    bedrooms: '',
    energy_label: [],
    construction_period: []
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState('');

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
        { value: 'negotiations', label: 'Under negotiation' }
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
      type: 'multiselect_checkbox',
      options: [
        { value: 'A%2B%2B%2B%2B%2B', label: 'A+++++' },
        { value: 'A%2B%2B%2B%2B', label: 'A++++' },
        { value: 'A%2B%2B%2B', label: 'A+++' },
        { value: 'A%2B%2B', label: 'A++' },
        { value: 'A%2B', label: 'A+' },
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
        { value: 'E', label: 'E' },
        { value: 'F', label: 'F' },
        { value: 'G', label: 'G' }
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

  const handleSelection = (value: string) => {
    const questionId = currentQuestion.id as keyof typeof searchParams;
    
    if (currentQuestion.type === 'multiselect' || currentQuestion.type === 'multiselect_checkbox') {
      const currentValues = (searchParams[questionId] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const newAvailability = newValues.join(',');

      if (questionId === 'availability') {
        setSearchParams({ ...searchParams, [questionId]: newAvailability });
      } else {
        setSearchParams({ ...searchParams, [questionId]: newValues });
      }

    } else {
      setSearchParams({ ...searchParams, [questionId]: value as never });
    }
  };

  const buildFundaUrl = (paramsToBuild: ValidateAndStructurePropertyQueryOutput) => {
    let url = 'https://www.funda.nl/en/zoeken/koop?';
    const queryParts: string[] = [];

    // This logic correctly formats each parameter.
    // It is important not to use URLSearchParams which can double-encode values.
    
    if (paramsToBuild.selected_area && paramsToBuild.selected_area.length > 0) {
      // Split comma-separated string into an array for proper formatting
      const areas = Array.isArray(paramsToBuild.selected_area) ? paramsToBuild.selected_area : paramsToBuild.selected_area.split(',').map(s => s.trim());
      queryParts.push(`selected_area=${JSON.stringify(areas)}`);
    }
    if (paramsToBuild.price) {
      queryParts.push(`price=${JSON.stringify(paramsToBuild.price)}`);
    }
    if (paramsToBuild.availability && paramsToBuild.availability.length > 0) {
      const availability = Array.isArray(paramsToBuild.availability) ? paramsToBuild.availability : paramsToBuild.availability.split(',').map(s => s.trim());
      queryParts.push(`availability=${JSON.stringify(availability)}`);
    }
    if (paramsToBuild.floor_area) {
      queryParts.push(`floor_area=${JSON.stringify(paramsToBuild.floor_area)}`);
    }
    if (paramsToBuild.bedrooms) {
      queryParts.push(`bedrooms=${JSON.stringify(paramsToBuild.bedrooms)}`);
    }
    if (paramsToBuild.energy_label && paramsToBuild.energy_label.length > 0) {
      queryParts.push(`energy_label=${JSON.stringify(paramsToBuild.energy_label)}`);
    }
    if (paramsToBuild.construction_period && paramsToBuild.construction_period.length > 0) {
      queryParts.push(`construction_period=${JSON.stringify(paramsToBuild.construction_period)}`);
    }
  
    const finalUrl = `${url}${queryParts.join('&')}`;
    setFinalUrl(finalUrl);
    return finalUrl;
  };

  const handleFindHome = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
      // ** PATTERN FOR OPUS INTEGRATION **
      // 1. Send your collected data to your Opus workflow endpoint.
      // const opusResponse = await fetch('YOUR_OPUS_WORKFLOW_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(searchParams),
      // });
      // const structuredParams = await opusResponse.json();
      
      // For now, we will simulate the response by directly using the collected params.
      // Replace this line with the actual call to your Opus workflow.
      const structuredParams = {
        ...searchParams,
        selected_area: Array.isArray(searchParams.selected_area) ? searchParams.selected_area : searchParams.selected_area.split(',').map(s => s.trim()),
        availability: Array.isArray(searchParams.availability) ? searchParams.availability : searchParams.availability.split(',').map(s => s.trim()),
      } as ValidateAndStructurePropertyQueryOutput;


      // 2. Build the URL using the data returned from your Opus workflow.
      const url = buildFundaUrl(structuredParams);
      
      // 3. Fetch the results from Funda using the generated URL.
      const scrapedResults = await fetchFundaResults(url);
      setResults(scrapedResults);

    } catch (e: any) {
      setError(e.message || "An error occurred while fetching results.");
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };
  
  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleFindHome();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleStartNewSearch = () => {
    setShowResults(false);
    setStep(0);
    setSearchParams({
      selected_area: '',
      price: '',
      availability: '',
      floor_area: '',
      bedrooms: '',
      energy_label: [],
      construction_period: []
    });
    setResults([]);
    setError(null);
    setFinalUrl('');
  };

  const isCurrentStepValid = () => {
    const questionId = currentQuestion.id as keyof typeof searchParams;
    const value = searchParams[questionId];
    
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    return value !== '';
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen w-full max-w-3xl mx-auto">
            <LoaderCircle className="w-16 h-16 animate-spin text-blue-600 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Finding Properties...</h1>
            <p className="text-gray-600">Our AI is fetching the latest listings from Funda.</p>
        </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {results.length > 0 ? `Found ${results.length} properties` : 'No properties found'}
            </h2>
            <div className="flex gap-4">
                <button
                    onClick={() => window.open(finalUrl, '_blank')}
                    className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all border border-gray-300"
                >
                    View on Funda Website
                </button>
                <button
                    onClick={handleStartNewSearch}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                    Start New Search
                </button>
            </div>
          </div>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : !error && (
            <div className="text-center py-16 px-4 bg-white rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h2>
                <p className="text-gray-600 max-w-md mx-auto">We couldn't find any properties matching your criteria. Try a broader search.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const Icon = currentQuestion.icon;

  const renderInput = () => {
    if (currentQuestion.type === 'text_input') {
      return (
        <input
          type="text"
          value={searchParams.selected_area as string}
          onChange={(e) => handleSelection(e.target.value)}
          placeholder={currentQuestion.placeholder}
          className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none text-gray-700 font-medium transition-all"
        />
      );
    }

    if (currentQuestion.type === 'multiselect_checkbox') {
        const questionId = currentQuestion.id as 'energy_label';
        return (
            <div className="grid grid-cols-4 gap-2">
                {currentQuestion.options.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                            id={option.value}
                            checked={(searchParams[questionId] as string[])?.includes(option.value)}
                            onCheckedChange={() => handleSelection(option.value)}
                        />
                        <Label
                            htmlFor={option.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
        );
    }
    
    return currentQuestion.options.map((option) => {
        const questionId = currentQuestion.id as keyof ValidateAndStructurePropertyQueryInput;
        const isSelected = currentQuestion.type === 'multiselect' || currentQuestion.type === 'multiselect_checkbox'
            ? (searchParams[questionId] as string[])?.includes(option.value)
            : searchParams[questionId] === option.value;

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
    });
};


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
            {renderInput()}
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
    

    