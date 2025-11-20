
'use client';
import React, { useState, useEffect } from 'react';
import { initiateOpusJob, checkOpusJobStatus, getOpusJobResults, runBookingWorkflow } from '@/app/actions';
import { Home, MapPin, DollarSign, Calendar, Bed, Maximize, Zap, CheckCircle, ExternalLink, Loader, Mail, User, Phone, Briefcase, Repeat, Plus, Mailbox, Search, BookMarked, FileScan, Target, Building } from 'lucide-react';
import PropertyCard from '@/components/search/PropertyCard';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BookingDialog from '@/components/search/BookingDialog';
import { useToast } from "@/hooks/use-toast"
import BookingConfirmation from '@/components/search/BookingConfirmation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BookingProgress from '@/components/search/BookingProgress';

type View = 'questionnaire' | 'booking' | 'results' | 'confirmation' | 'booking-progress';

const SearchQuestion = ({ question, value, onSelection, priceRange, onPriceChange }: any) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <question.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{question.question}</h3>
            </div>
            <div className="space-y-3">
                {question.type === 'textarea' ? (
                   <textarea
                    value={value}
                    onChange={(e) => onSelection(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    rows={4}
                    className="w-full p-4 rounded-xl border-2 border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-medium transition-all"
                  />
                ) : question.type === 'text_input' ? (
                  <input
                    type='text'
                    value={(question.id === 'selected_area' ? value?.join(', ') : value) || ''}
                    onChange={(e) => onSelection(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    className="w-full p-4 rounded-xl border-2 border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring text-foreground font-medium transition-all"
                    autoFocus
                  />
                ) : question.type === 'slider' ? (
                    <div className="py-4 px-2">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg text-foreground">€{priceRange[0].toLocaleString()}</span>
                            <span className="font-semibold text-lg text-foreground">€{priceRange[1].toLocaleString()}</span>
                        </div>
                        <Slider
                            value={priceRange}
                            min={question.min}
                            max={question.max}
                            step={question.step}
                            onValueChange={onPriceChange}
                            className="w-full"
                        />
                    </div>
                ) : question.type === 'multiselect_checkbox' ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {question.options.map((option: {value: string, label: string}) => {
                      const isSelected = value?.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => onSelection(question.id, option.value, true)}
                          className={`p-3 rounded-lg border-2 text-center text-sm font-semibold transition-all ${
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
                  question.options.map((option: {value: string, label: string}) => {
                    const isSelected = question.type === 'multiselect'
                      ? value?.includes(option.value)
                      : value === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => onSelection(question.id, option.value, question.type === 'multiselect')}
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
    )
}


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
  const [userPriority, setUserPriority] = useState('');
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
  const [pollingStatus, setPollingStatus] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [isBookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const { toast } = useToast();
  const [confirmationStats, setConfirmationStats] = useState({
    propertiesScanned: 0,
    perfectMatches: 0,
    viewingsBooked: 0,
  });
  const [isBookingAll, setIsBookingAll] = useState(false);
  const [propertiesToBook, setPropertiesToBook] = useState<any[]>([]);


  // New states for the loading screen
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [scannedProperties, setScannedProperties] = useState(0);
  const [bestMatches, setBestMatches] = useState(0);
  
  const searchQuestionGroups = [
    [
        {
          id: 'selected_area',
          question: "Which area(s) are you interested in?",
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
    ],
    [
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
    ],
    [
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
            id: 'energy_label',
            question: "Preferred energy efficiency rating?",
            icon: Zap,
            type: 'multiselect_checkbox',
            options: [
              { value: 'A%2B%2B%2B%2B%2B', label: 'A+++++' }, { value: 'A%2B%2B%2B%2B', label: 'A++++' }, { value: 'A%2B%2B%2B', label: 'A+++' },
              { value: 'A%2B%2B', label: 'A++' }, { value: 'A%2B', label: 'A+' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' },
              { value: 'C', label: 'C' }, { value: 'D', label: 'D' }, { value: 'E', label: 'E' }, { value: 'F', label: 'F' }, { value: 'G', label: 'G' }
            ]
        },
        {
            id: 'construction_period',
            question: "Preferred construction period?",
            icon: Building,
            type: 'multiselect',
            options: [
              { value: 'before_1906', label: 'Before 1906' }, { value: 'from_1906_to_1930', label: '1906 - 1930' },
              { value: 'from_1931_to_1944', label: '1931 - 1944' }, { value: 'from_1945_to_1959', label: '1945 - 1959' },
              { value: 'from_1960_to_1970', label: '1960 - 1970' }, { value: 'from_1971_to_1980', label: '1971 - 1980' },
              { value: 'from_1981_to_1990', label: '1981 - 1990' }, { value: 'from_1991_to_2000', label: '1991 - 2000' },
              { value: 'from_2001_to_2010', label: '2001 - 2010' }, { value: 'from_2011_to_2020', label: '2011 - 2020' },
              { value: 'from_2021', label: '2021 onwards' }
            ]
        },
    ],
    [
        {
            id: 'user_priority',
            question: "What is most important to you?",
            icon: Target,
            type: 'textarea',
            placeholder: 'e.g., a large garden, close to the city center, a quiet street...'
        }
    ]
  ];

  const currentGroup = searchQuestionGroups[step];
  
  const handleSelection = (questionId: string, value: any, isMultiselect = false) => {
      if (questionId === 'user_priority') {
          setUserPriority(value);
          return;
      }
      
      if (questionId === 'selected_area') {
        const locations = value.split(',').map((loc: string) => loc.trim().toLowerCase()).filter(Boolean);
        setSearchParams({ ...searchParams, [questionId]: locations });
      } else if (isMultiselect) {
          const currentValues = searchParams[questionId] || [];
          const newValues = currentValues.includes(value)
            ? currentValues.filter((v: string) => v !== value)
            : [...currentValues, value];
          setSearchParams({ ...searchParams, [questionId]: newValues });
      } else {
          setSearchParams({ ...searchParams, [questionId]: value });
      }
  };

  const handlePriceChange = (value: number[]) => {
      setPriceRange(value);
      const priceString = `${value[0]}-${value[1]}`;
      setSearchParams({ ...searchParams, price: priceString });
  }

  const handleBookingInfoChange = (field: keyof typeof bookingInfo, value: string | boolean | null) => {
    if (field === 'postCode' && typeof value === 'string') {
        const formattedPostcode = value.replace(/\s/g, '').toUpperCase();
        setBookingInfo(prev => ({ ...prev, [field]: formattedPostcode }));
    } else {
        setBookingInfo(prev => ({ ...prev, [field]: value }));
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

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    if (loading) {
      setLoadingProgress(0);
      setScannedProperties(0);
      setBestMatches(0);
      
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
             if(progressInterval) clearInterval(progressInterval);
            return prev;
          }
          return prev + 1;
        });

        setScannedProperties(prev => prev + Math.floor(Math.random() * 5) + 1);

      }, 400);
    } else {
        setLoadingProgress(100);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [loading]);


  const pollJob = async (jobExecutionId: string, attempts = 0) => {
    const maxAttempts = 90;
    if (attempts >= maxAttempts) {
        setError("Search timed out. Please try again later.");
        setPollingStatus("Search timed out.");
        setLoading(false);
        return;
    }

    try {
        const { status } = await checkOpusJobStatus(jobExecutionId);
        setPollingStatus(`Job status: ${status || 'In Progress'}`);

        if (status === 'completed' || status === 'COMPLETED') {
            setPollingStatus('Fetching results...');
            const results = await getOpusJobResults(jobExecutionId);
            setProperties(results);
            setBestMatches(results.length);
            setConfirmationStats(prev => ({ ...prev, propertiesScanned: scannedProperties, perfectMatches: results.length }));
            setLoading(false);
        } else if (status === 'failed' || status === 'FAILED') {
            setError("Search failed. Please check your criteria and try again.");
            setPollingStatus("Job failed.");
            setLoading(false);
        } else {
            // If not completed or failed, poll again after a delay
            setTimeout(() => pollJob(jobExecutionId, attempts + 1), 3000);
        }
    } catch (e: any) {
        setError(e.message || "An error occurred while checking job status.");
        setLoading(false);
    }
  };

  const handleFindHome = async () => {
    setLoading(true);
    setError(null);
    setProperties([]);
    setPollingStatus('Initializing search...');
    setView('results');

    const fundaUrl = buildFundaUrl();

    try {
      const { jobExecutionId } = await initiateOpusJob(fundaUrl, userPriority);
      setPollingStatus('Job initiated, waiting for completion...');
      pollJob(jobExecutionId); // Start polling
    } catch (e: any) {
      console.error("Failed to initiate search job.", e.message);
      setError('Could not start the search. Please try again later.');
      setLoading(false);
    }
  };


  const handleNext = () => {
    if (step < searchQuestionGroups.length - 1) {
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
  
  const openBookingDialog = (property: any) => {
    setSelectedProperty(property);
    setIsBookingAll(false);
    setBookingDialogOpen(true);
  };
  
  const openBookAllDialog = () => {
    if (properties.length === 0) return;
    setSelectedProperty(null);
    setIsBookingAll(true);
    setBookingDialogOpen(true);
  };


  const handleBookViewing = async (bookingDetails: {
    booking_message: string;
    available_days: string[];
    day_slots: string[];
  }) => {
    let urlsToBook: string[] = [];
    if (isBookingAll) {
        urlsToBook = properties.map(p => p.url).filter(Boolean);
        setPropertiesToBook(properties);
    } else if (selectedProperty) {
        urlsToBook = [selectedProperty.url];
        setPropertiesToBook([selectedProperty]);
    } else {
        toast({
            variant: "destructive",
            title: "No properties selected",
            description: "Something went wrong, no properties were selected for booking.",
        });
        return { success: false };
    }
    
    if (urlsToBook.length === 0) {
        toast({
            variant: "destructive",
            title: "No properties to book",
            description: "There are no valid properties to book.",
        });
        return { success: false };
    }

    const finalBookingData = {
      urls: urlsToBook,
      booking_message: bookingDetails.booking_message,
      email: bookingInfo.email,
      first_name: bookingInfo.firstName,
      last_name: bookingInfo.lastName,
      phone: bookingInfo.phone,
      post_code: bookingInfo.postCode,
      house_number: bookingInfo.houseNumber,
      addition: bookingInfo.addition,
      want_to_sell_house: bookingInfo.wantToSellHouse,
      had_financial_consultation: bookingInfo.hadFinancialConsultation,
      available_days: bookingDetails.available_days,
      day_slots: bookingDetails.day_slots,
    };

    // Don't await the workflow, fire-and-forget
    runBookingWorkflow(finalBookingData).catch(e => {
        console.error("Booking workflow failed in the background:", e);
        // Optionally, you could implement a global error notification system here
    });

    setConfirmationStats(prev => ({ ...prev, viewingsBooked: prev.viewingsBooked + urlsToBook.length }));
    
    // Close the dialog first, then change the view
    setBookingDialogOpen(false);
    setView('booking-progress');
    
    setSelectedProperty(null);
    setIsBookingAll(false);

    return { success: true };
  };

  const isCurrentStepValid = () => {
    return currentGroup.every(q => {
        if (q.id === 'user_priority' || q.id === 'price') return true;
        const value = q.id === 'user_priority' ? userPriority : searchParams[q.id];
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
    })
  };
   
  const isBookingFormValid = () => {
    const { email, firstName, lastName, phone, postCode, houseNumber, wantToSellHouse, hadFinancialConsultation } = bookingInfo;
    const postcodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/;
    return email && firstName && lastName && phone && postcodeRegex.test(postCode) && houseNumber && wantToSellHouse !== null && hadFinancialConsultation !== null;
  };
  
  const resetSearch = () => {
      setView('questionnaire');
      setStep(0);
      setProperties([]);
      setError(null);
      setLoading(false);
      setPollingStatus('');
      setSearchParams({
        selected_area: [], price: '0-1000000', availability: [], floor_area: '',
        bedrooms: '', energy_label: [], construction_period: []
      });
      setUserPriority('');
        setBookingInfo({
        email: '', firstName: '', lastName: '', phone: '', postCode: '',
        houseNumber: '', addition: '', wantToSellHouse: null, hadFinancialConsultation: null,
      });
      setPriceRange([0, 1000000]);
      setConfirmationStats({ propertiesScanned: 0, perfectMatches: 0, viewingsBooked: 0 });
  }

  const autofillForm = () => {
    setSearchParams({
      selected_area: ['amsterdam'],
      price: '300000-700000',
      availability: ['available'],
      floor_area: '80-',
      bedrooms: '2-',
      energy_label: ['A', 'B'],
      construction_period: ['from_2001_to_2010', 'from_2011_to_2020'],
    });
    setPriceRange([300000, 700000]);
    setUserPriority('A quiet street with a lot of green, preferably a garden.');
    setBookingInfo({
        email: 'test.user@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '0612345678',
        postCode: '1012AB',
        houseNumber: '123',
        addition: 'A',
        wantToSellHouse: false,
        hadFinancialConsultation: true,
    });
  };

  if (view === 'booking-progress') {
    return (
      <BookingProgress 
        properties={propertiesToBook}
        onComplete={() => setView('confirmation')}
      />
    );
  }

  if (view === 'confirmation') {
    return (
        <BookingConfirmation 
            stats={confirmationStats}
            onStartNewSearch={resetSearch}
            onViewMyBookings={() => setView('results')}
        />
    );
  }

  if (view === 'results') {
    return (
      <div className="min-h-screen bg-background p-6 w-full flex items-center justify-center">
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={() => {
            setBookingDialogOpen(false);
            setSelectedProperty(null);
            setIsBookingAll(false);
          }}
          onSubmit={handleBookViewing}
          property={selectedProperty}
          isBookingAll={isBookingAll}
          propertyCount={properties.length}
        />
        <div className="max-w-7xl mx-auto w-full">
            {loading ? (
                 <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="bg-primary/10 rounded-full p-4 mb-6">
                          <Search className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">AI is Working For You</h2>
                        <p className="text-gray-600 mb-8">Analyzing thousands of properties to find your perfect match</p>
                        
                        <div className="w-full text-left mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                  <FileScan className="w-4 h-4"/> Scanning available properties...
                                </span>
                                <span className="text-sm font-bold text-primary">{loadingProgress}%</span>
                            </div>
                            <Progress value={loadingProgress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="bg-primary/5 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-primary">{scannedProperties}</p>
                                <p className="text-sm text-muted-foreground">Properties Scanned</p>
                            </div>
                            <div className="bg-primary/5 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-primary">{bestMatches}</p>
                                <p className="text-sm text-muted-foreground">Best Matches</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : error ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <p className="text-destructive font-semibold mb-4">{error}</p>
                 <Button onClick={resetSearch} className="mt-4">
                    Try Again
                </Button>
              </div>
            ) : properties.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Search Results
                      </h2>
                      <p className="text-gray-600">Here are the top matches we found for you</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={resetSearch}
                        variant="outline"
                      >
                        New Search
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {properties.map((prop) => <PropertyCard key={prop.id} property={prop} onBookViewing={() => openBookingDialog(prop)} />)}
                  </div>
                  <Button
                    onClick={openBookAllDialog}
                    disabled={loading || properties.length === 0}
                    size="lg"
                    className="w-full py-6 text-lg font-semibold"
                  >
                    <BookMarked className="mr-2 w-6 h-6" /> Book All {properties.length} Viewings Automatically
                  </Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
                    <p className="text-gray-600 mb-6">
                        We couldn't find any properties matching your criteria. Try a broader search.
                    </p>
                     <Button onClick={resetSearch}>
                        Start New Search
                    </Button>
                </div>
            )}
        </div>
      </div>
    );
  }

  const totalSteps = searchQuestionGroups.length + 1; // +1 for booking info
  const progress = view === 'questionnaire' 
    ? ((step + 1) / totalSteps) * 100
    : 100;
  
  const progressText = view === 'questionnaire'
    ? `Step ${step + 1} of ${searchQuestionGroups.length}`
    : 'Final Step: Your Information';


  return (
    <div className="min-h-screen bg-background p-6 w-full flex justify-center items-center">
      <div className="max-w-2xl mx-auto w-full">
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-24 right-6">
            <Button variant="outline" onClick={autofillForm}>
              Autofill for Dev
            </Button>
          </div>
        )}
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
              {currentGroup.map(q => (
                <SearchQuestion 
                    key={q.id}
                    question={q}
                    value={q.id === 'user_priority' ? userPriority : searchParams[q.id]}
                    onSelection={handleSelection}
                    priceRange={priceRange}
                    onPriceChange={handlePriceChange}
                />
              ))}
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
                {step === searchQuestionGroups.length - 1 ? 'Next' : 'Next'}
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
                        <Input id="postCode" value={bookingInfo.postCode} onChange={(e) => handleBookingInfoChange('postCode', e.target.value)} placeholder="1234AB" maxLength={6} />
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
                                <button key={String(opt.value)} onClick={() => handleBookingInfoChange('wantToSellHouse', opt.value)} className={`flex-1 p-3 rounded-lg border-2 text-sm font-semibold transition-all ${bookingInfo.wantToSellHouse === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-input text-foreground'}`}>{opt.label}</button>
                            ))}
                         </div>
                    </div>
                     <div className="md:col-span-2 space-y-2">
                        <Label>Have you had a financial consultation?</Label>
                         <div className="flex gap-2">
                             {[ { label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => (
                                <button key={String(opt.value)} onClick={() => handleBookingInfoChange('hadFinancialConsultation', opt.value)} className={`flex-1 p-3 rounded-lg border-2 text-sm font-semibold transition-all ${bookingInfo.hadFinancialConsultation === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-input text-foreground'}`}>{opt.label}</button>
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

export default function SearchPage() {
    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 pt-24">
            <HomeFindingAgent />
        </main>
    )
}
