
'use client';
import React, { useState } from 'react';
import { runOpusWorkflow, fetchFundaResults } from '@/app/actions';
import { Home, MapPin, DollarSign, Calendar, Bed, Maximize, Zap, CheckCircle, ExternalLink, Loader, Mail, User, Phone, Briefcase, Repeat, Plus, Mailbox } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type View = 'questionnaire' | 'booking' | 'results';

const HomeFindingAgent = () => {
  const [step, setStep] = useState(0);
  const [view, setView] = useState<View>('questionnaire');
  const [searchParams, setSearchParams] = useState<any>({
    selected_area: [],
    price: '0-1000000',
    availability: [],
    floor_area: '',
    bedrooms: '',
    energy_label: [],
    construction_period: []
  });
  const [bookingInfo, setBookingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    postCode: '',
    houseNumber: '',
    addition: '',
    wantToSellHouse: null as boolean | null,
    hadFinancialConsultation: null as boolean | null,
  });
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const searchQuestions = [
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
      type: 'slider',
      min: 0,
      max: 2000000,
      step: 50000,
    },
    {
      id: 'availability',
      question: "Availability?",
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
    },
  ];

  const currentQuestion = searchQuestions[step];

  const handleSelection = (value: any) => {
    const questionId = currentQuestion.id;
  
    if (currentQuestion.type === 'text_input') {
      if (questionId === 'selected_area') {
         const locations = value.split(',').map((loc: string) => loc.trim().toLowerCase()).filter(Boolean);
         setSearchParams({ ...searchParams, [questionId]: locations });
      } else {
         setSearchParams({ ...searchParams, [questionId]: value });
      }
    } else if ((currentQuestion.type === 'multiselect' || currentQuestion.type === 'multiselect_checkbox')) {
      const currentValues = searchParams[questionId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      setSearchParams({ ...searchParams, [questionId]: newValues });
    } else if (currentQuestion.type === 'slider' && Array.isArray(value) && typeof value[0] === 'number') {
      setPriceRange(value as number[]);
      const priceString = `${value[0]}-${value[1]}`;
      setSearchParams({ ...searchParams, [questionId]: priceString });
    } else {
      setSearchParams({ ...searchParams, [questionId]: value });
    }
  };

  const handleBookingInfoChange = (field: keyof typeof bookingInfo, value: string | boolean | null) => {
    setBookingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFindHome = async () => {
    setLoading(true);
    setError(null);
    setView('results');

    const apiSearchParams = JSON.parse(JSON.stringify(searchParams));

    searchQuestions.forEach(q => {
        if ((q.type === 'multiselect' || q.type === 'multiselect_checkbox') && !apiSearchParams[q.id]) {
            apiSearchParams[q.id] = [];
        }
    });

    try {
      console.log("Attempting to fetch results via Opus workflow with params:", apiSearchParams);
      const opusResults = await runOpusWorkflow(apiSearchParams);
      setProperties(opusResults);
      console.log("Successfully fetched results from Opus.");
    } catch (opusErr: any) {
      console.warn("Opus workflow failed. Falling back to direct scraping.", opusErr.message);
      setError("Primary search failed. Trying backup method...");
      
      const fundaUrl = buildFundaUrl();
      try {
        console.log("Attempting direct scraping...");
        const directResults = await fetchFundaResults(fundaUrl);
        setProperties(directResults);
        setError(null);
        console.log("Successfully fetched results via direct scraping.");
      } catch (directErr: any) {
        console.error("Direct scraping also failed.", directErr.message);
        setError('Could not fetch results. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleNext = () => {
    if (step < searchQuestions.length - 1) {
      setStep(step + 1);
    } else {
      setView('booking');
    }
  };

  const handleBack = () => {
    if (view === 'booking') {
      setView('questionnaire');
      return;
    }
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const buildFundaUrl = () => {
    const baseUrl = `https://www.funda.nl/en/zoeken/koop?`;
    const queryParts: string[] = [];
  
    if (searchParams.selected_area && searchParams.selected_area.length > 0) {
      queryParts.push(`selected_area=${JSON.stringify(searchParams.selected_area)}`);
    }
    if (searchParams.price) {
      queryParts.push(`price="${searchParams.price}"`);
    }
    if (searchParams.availability && searchParams.availability.length > 0) {
       queryParts.push(`availability=${JSON.stringify(searchParams.availability)}`);
    }
    if (searchParams.floor_area) {
        queryParts.push(`floor_area="${searchParams.floor_area}"`);
    }
    if (searchParams.bedrooms) {
        queryParts.push(`bedrooms="${searchParams.bedrooms}"`);
    }
    if (searchParams.energy_label && searchParams.energy_label.length > 0) {
        queryParts.push(`energy_label=${JSON.stringify(searchParams.energy_label)}`);
    }
    if (searchParams.construction_period && searchParams.construction_period.length > 0) {
        queryParts.push(`construction_period=${JSON.stringify(searchParams.construction_period)}`);
    }
    
    return baseUrl + queryParts.join('&');
  };

  const isCurrentStepValid = () => {
    const questionId = currentQuestion.id;
    const value = searchParams[questionId];

    if (questionId === 'price') return true; 
    if (Array.isArray(value)) return value.length > 0;
    
    return !!value;
  };
   
  const isBookingFormValid = () => {
    const { email, firstName, lastName, phone, postCode, houseNumber, wantToSellHouse, hadFinancialConsultation } = bookingInfo;
    return email && firstName && lastName && phone && postCode && houseNumber && wantToSellHouse !== null && hadFinancialConsultation !== null;
  };

  if (view === 'results') {
    return (
      <div className="min-h-screen bg-background p-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Search Results
                </h2>
                <p className="text-gray-600">Based on your search criteria</p>
              </div>
              <button
                onClick={() => {
                  setView('questionnaire');
                  setStep(0);
                  setProperties([]);
                  setError(null);
                  setSearchParams({
                    selected_area: [], price: '0-1000000', availability: [], floor_area: '',
                    bedrooms: '', energy_label: [], construction_period: []
                  });
                   setBookingInfo({
                    email: '', firstName: '', lastName: '', phone: '', postCode: '',
                    houseNumber: '', addition: '', wantToSellHouse: null, hadFinancialConsultation: null,
                  });
                  setPriceRange([0, 1000000]);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                New Search
              </button>
            </div>
            {loading ? (
                 <div className="flex flex-col items-center justify-center p-12">
                    <Loader className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Searching for properties...</h2>
                    <p className="text-gray-600">Please wait while we find your perfect home</p>
                </div>
            ) : error ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">{error}</p>
              </div>
            ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((prop) => <PropertyCard key={prop.id} property={prop} />)}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
                    <p className="text-gray-600 mb-6">
                        We couldn't find any properties matching your criteria. Try a broader search.
                    </p>
                </div>
            )}
            
          </div>
        </div>
      </div>
    );
  }

  const progress = view === 'questionnaire' 
    ? ((step + 1) / (searchQuestions.length + 1)) * 100
    : 100;
  
  const progressText = view === 'questionnaire'
    ? `Question ${step + 1} of ${searchQuestions.length}`
    : 'Final Step: Your Information';


  return (
    <div className="min-h-screen bg-background p-6 w-full flex justify-center items-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {progressText}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {view === 'questionnaire' && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary p-3 rounded-xl">
                  <currentQuestion.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.type === 'text_input' ? (
                  <input
                    type='text'
                    value={(currentQuestion.id === 'selected_area' ? searchParams.selected_area?.join(', ') : searchParams[currentQuestion.id]) || ''}
                    onChange={(e) => handleSelection(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full p-4 rounded-xl border-2 border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-medium transition-all"
                  />
                ) : currentQuestion.type === 'slider' ? (
                    <div className="py-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg text-foreground">€{priceRange[0].toLocaleString()}</span>
                            <span className="font-semibold text-lg text-foreground">€{priceRange[1].toLocaleString()}</span>
                        </div>
                        <Slider
                            value={priceRange}
                            min={currentQuestion.min}
                            max={currentQuestion.max}
                            step={currentQuestion.step}
                            onValueChange={(value) => handleSelection(value)}
                            className="w-full"
                        />
                    </div>
                ) : currentQuestion.type === 'multiselect_checkbox' ? (
                  <div className="grid grid-cols-4 gap-2">
                    {currentQuestion.options.map((option: {value: string, label: string}) => {
                      const isSelected = searchParams[currentQuestion.id]?.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSelection(option.value)}
                          className={`p-2 rounded-lg border-2 text-center text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-input hover:border-primary/50 hover:bg-accent text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                ) : ( // Covers 'select' and 'multiselect'
                  currentQuestion.options.map((option: {value: string, label: string}) => {
                    const isSelected = currentQuestion.type === 'multiselect'
                      ? searchParams[currentQuestion.id]?.includes(option.value)
                      : searchParams[currentQuestion.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelection(option.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input hover:border-primary/50 hover:bg-accent text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

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
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
        
        {view === 'booking' && (
           <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary p-3 rounded-xl">
                        <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Your Contact Information
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={bookingInfo.firstName} onChange={(e) => handleBookingInfoChange('firstName', e.target.value)} placeholder="John" />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={bookingInfo.lastName} onChange={(e) => handleBookingInfoChange('lastName', e.target.value)} placeholder="Doe" />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={bookingInfo.email} onChange={(e) => handleBookingInfoChange('email', e.target.value)} placeholder="john.doe@example.com" />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" value={bookingInfo.phone} onChange={(e) => handleBookingInfoChange('phone', e.target.value)} placeholder="1234567890" />
                    </div>
                    <div>
                        <Label htmlFor="postCode">Postcode</Label>
                        <Input id="postCode" value={bookingInfo.postCode} onChange={(e) => handleBookingInfoChange('postCode', e.target.value)} placeholder="1234 AB" />
                    </div>
                     <div>
                        <Label htmlFor="houseNumber">House Number</Label>
                        <Input id="houseNumber" value={bookingInfo.houseNumber} onChange={(e) => handleBookingInfoChange('houseNumber', e.target.value)} placeholder="123" />
                    </div>
                    <div className="md:col-span-2">
                         <Label htmlFor="addition">Addition (optional)</Label>
                        <Input id="addition" value={bookingInfo.addition} onChange={(e) => handleBookingInfoChange('addition', e.target.value)} placeholder="A" />
                    </div>
                     <div className="md:col-span-2 space-y-2">
                        <Label>Do you want to sell your current house?</Label>
                         <div className="flex gap-2">
                            {[ { label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => (
                                <button key={String(opt.value)} onClick={() => handleBookingInfoChange('wantToSellHouse', opt.value)} className={`flex-1 p-3 rounded-lg border-2 text-sm font-semibold transition-all ${bookingInfo.wantToSellHouse === opt.value ? 'border-primary bg-primary/10' : 'border-input'}`}>{opt.label}</button>
                            ))}
                         </div>
                    </div>
                     <div className="md:col-span-2 space-y-2">
                        <Label>Have you had a financial consultation?</Label>
                         <div className="flex gap-2">
                             {[ { label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => (
                                <button key={String(opt.value)} onClick={() => handleBookingInfoChange('hadFinancialConsultation', opt.value)} className={`flex-1 p-3 rounded-lg border-2 text-sm font-semibold transition-all ${bookingInfo.hadFinancialConsultation === opt.value ? 'border-primary bg-primary/10' : 'border-input'}`}>{opt.label}</button>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
             <div className="flex gap-4">
                <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                    Back
                </button>
                <button
                    onClick={handleFindHome}
                    disabled={!isBookingFormValid()}
                    className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                    isBookingFormValid()
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Find My Home
                </button>
            </div>
           </>
        )}
      </div>
    </div>
  );
};

export default HomeFindingAgent;

    