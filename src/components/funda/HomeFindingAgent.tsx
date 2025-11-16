
'use client';
import React, { useState } from 'react';
import { Home, MapPin, DollarSign, Calendar, Bed, Maximize, Zap, CheckCircle, ExternalLink, Loader } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

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
      type: 'multiselect',
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

  const handleSelection = (value) => {
    const questionId = currentQuestion.id;
    
    if (currentQuestion.type === 'text_input') {
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
      fetchProperties();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const buildFundaUrl = () => {
    const parts = [];
    
    if (searchParams.selected_area.length > 0) {
      parts.push(`selected_area=${JSON.stringify(searchParams.selected_area)}`);
    }
    if (searchParams.price) {
      parts.push(`price="${searchParams.price}"`);
    }
    if (searchParams.availability.length > 0) {
      parts.push(`availability=${JSON.stringify(searchParams.availability)}`);
    }
    if (searchParams.floor_area) {
      parts.push(`floor_area="${searchParams.floor_area}"`);
    }
    if (searchParams.bedrooms) {
      parts.push(`bedrooms="${searchParams.bedrooms}"`);
    }
    if (searchParams.energy_label.length > 0) {
      parts.push(`energy_label=${JSON.stringify(searchParams.energy_label)}`);
    }
    if (searchParams.construction_period.length > 0) {
      parts.push(`construction_period=${JSON.stringify(searchParams.construction_period)}`);
    }

    return `https://www.funda.nl/en/zoeken/koop?${parts.join('&')}`;
  };

  // Opus Configuration
  const OPUS_WORKFLOW_ID = 'qwqiKchRBgg0qQV9';
  const OPUS_SERVICE_KEY = '_80a7138936bc5b76cf677386bd32ba226a68bb763fed9af54027a699fa7412e2f5b4835f457bebad6d69316c6a686a64';
  const OPUS_BASE_URL = 'https://operator.opus.com';
  const USE_OPUS_WORKFLOW = true; // Opus is now enabled!
  
  const initiateOpusJob = async (searchParams, fundaUrl) => {
    // Step 1: Initiate Job
    const initiateResponse = await fetch(`${OPUS_BASE_URL}/job/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': OPUS_SERVICE_KEY
      },
      body: JSON.stringify({
        workflowId: OPUS_WORKFLOW_ID,
        title: `Funda Property Search - ${searchParams.selected_area[0]}`,
        description: `Search for properties in ${searchParams.selected_area[0]} with filters`
      })
    });
    
    if (!initiateResponse.ok) {
      const errorText = await initiateResponse.text();
      throw new Error(`Failed to initiate Opus job: ${errorText}`);
    }
    
    const { jobExecutionId } = await initiateResponse.json();
    
    // Step 2: Execute Job (you'll need to implement this based on your workflow's jobPayloadSchema)
    // The payload structure depends on your workflow's input configuration
    const executeResponse = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': OPUS_SERVICE_KEY
      },
      body: JSON.stringify({
        // Map your data to workflow inputs based on jobPayloadSchema
        // Example (adjust based on your actual workflow inputs):
        searchParams: searchParams,
        fundaUrl: fundaUrl
      })
    });
    
    if (!executeResponse.ok) {
      const errorText = await executeResponse.text();
      throw new Error(`Failed to execute Opus job: ${errorText}`);
    }
    
    // Step 3: Poll for results or wait for completion
    return await pollJobResults(jobExecutionId);
  };
  
  const pollJobResults = async (jobExecutionId, maxAttempts = 30) => {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/status`, {
        headers: {
          'x-service-key': OPUS_SERVICE_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check job status');
      }
      
      const status = await response.json();
      
      if (status.status === 'completed') {
        // Get job results
        const resultsResponse = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/results`, {
          headers: {
            'x-service-key': OPUS_SERVICE_KEY
          }
        });
        
        if (!resultsResponse.ok) {
          throw new Error('Failed to get job results');
        }
        
        return await resultsResponse.json();
      } else if (status.status === 'failed') {
        throw new Error('Job failed');
      }
      
      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Job timed out');
  };
  
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fundaUrl = buildFundaUrl();
      
      // Try Opus workflow first (if configured)
      if (USE_OPUS_WORKFLOW && OPUS_SERVICE_KEY) {
        try {
          const opusResults = await initiateOpusJob(searchParams, fundaUrl);
          
          // Extract properties from Opus results
          // Adjust based on your workflow's output structure
          if (opusResults && opusResults.properties && Array.isArray(opusResults.properties)) {
            setProperties(opusResults.properties);
            setShowResults(true);
            return;
          }
        } catch (opusErr) {
          console.log('Opus workflow failed, trying fallback methods...', opusErr);
        }
      }
      
      // Fallback Method 1: Direct scraping with CORS proxy
      const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(fundaUrl))
        .catch(() => null);
      
      if (response && response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const propertyCards = doc.querySelectorAll('[data-test-id="search-result-item"]');
        
        if (propertyCards.length === 0) {
          const altCards = doc.querySelectorAll('.search-result, [class*="search-result"]');
          if (altCards.length > 0) {
            parseProperties(altCards, fundaUrl);
            return;
          }
        } else {
          parseProperties(propertyCards, fundaUrl);
          return;
        }
      }
      
      // Fallback Method 2: Claude API with web tools
      const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `Use web search and browsing to find properties from: ${fundaUrl}

Search for "funda ${searchParams.selected_area[0]} properties for sale" and extract property listings.

For each property found, return JSON with:
- title: full address
- price: exact price (e.g., "€ 350,000 k.k.")
- bedrooms: number or "N/A"
- area: size in m² or "N/A"
- image: image URL
- url: full property URL on funda.nl

Return ONLY valid JSON array: [{"title":"...","price":"...","bedrooms":"...","area":"...","image":"...","url":"..."}]`
          }],
          tools: [{
            type: "web_search_20250305",
            name: "web_search"
          }]
        })
      });

      const data = await apiResponse.json();
      
      if (data.content) {
        let textContent = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n');
        
        textContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = textContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
        
        if (jsonMatch) {
          try {
            const parsedProperties = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsedProperties) && parsedProperties.length > 0) {
              setProperties(parsedProperties);
              setShowResults(true);
              return;
            }
          } catch (parseErr) {
            console.error('JSON parse error:', parseErr);
          }
        }
      }
      
      setError('Unable to fetch property data from Funda. Please use the "View All Results on Funda.nl" button to see properties directly on their website.');
      setProperties([]);
      setShowResults(true);
      
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Unable to connect to Funda. Please try again or use the "View All Results on Funda.nl" button below.');
      setProperties([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const parseProperties = (cards, baseUrl) => {
    const extracted = [];
    
    cards.forEach((card, index) => {
      if (index >= 12) return; // Limit to 12 properties
      
      try {
        // Try multiple selector strategies
        const titleEl = card.querySelector('[data-test-id="street-name-house-number"]') || 
                        card.querySelector('h2') || 
                        card.querySelector('[class*="address"]');
        
        const priceEl = card.querySelector('[data-test-id="price-sale"]') || 
                        card.querySelector('[class*="price"]');
        
        const imageEl = card.querySelector('img');
        
        const linkEl = card.querySelector('a[href*="/koop/"]') || 
                       card.querySelector('a');
        
        // Extract bedroom info
        const bedroomEl = card.querySelector('[title*="slaapkamer"]') || 
                          card.querySelector('[class*="bedroom"]');
        
        // Extract area info
        const areaEl = card.querySelector('[title*="m²"]') || 
                       card.querySelector('[class*="surface"]');
        
        if (titleEl && priceEl) {
          const property = {
            title: titleEl.textContent.trim(),
            price: priceEl.textContent.trim(),
            bedrooms: bedroomEl ? bedroomEl.textContent.trim().replace(/\D/g, '') : 'N/A',
            area: areaEl ? areaEl.textContent.trim() : 'N/A',
            image: imageEl ? (imageEl.src || imageEl.dataset.src) : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
            url: linkEl ? (linkEl.href.startsWith('http') ? linkEl.href : 'https://www.funda.nl' + linkEl.href) : baseUrl
          };
          
          extracted.push(property);
        }
      } catch (err) {
        console.error('Error parsing property card:', err);
      }
    });
    
    if (extracted.length > 0) {
      setProperties(extracted);
      setShowResults(true);
    } else {
      throw new Error('No properties extracted');
    }
  };

  const isCurrentStepValid = () => {
    const questionId = currentQuestion.id;
    const value = searchParams[questionId];
    
    if (currentQuestion.type === 'text_input') {
      return value && value.length > 0 && value[0] !== '';
    }
    if (currentQuestion.type === 'multiselect') {
      return value && value.length > 0;
    }
    return value !== '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Searching for properties...</h2>
          <p className="text-gray-600">Please wait while we find your perfect home</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {properties.length > 0 ? `Found ${properties.length} Properties` : 'Search Results'}
                </h2>
                <p className="text-gray-600">Based on your search criteria</p>
              </div>
              <button
                onClick={() => {
                  setShowResults(false);
                  setStep(0);
                  setProperties([]);
                  setError(null);
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
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                New Search
              </button>
            </div>

            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <a
                href={buildFundaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                View All Results on Funda.nl
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {property.price}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      {property.bedrooms && property.bedrooms !== 'N/A' && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                      )}
                      {property.area && property.area !== 'N/A' && (
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{property.area}</span>
                        </div>
                      )}
                    </div>
                    <a
                      href={property.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold text-center hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't retrieve property listings. Please click the button above to view results directly on Funda.nl
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const Icon = currentQuestion.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
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
                value={searchParams[currentQuestion.id]?.[0] || ''}
                onChange={(e) => handleSelection(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:outline-none text-gray-700 font-medium transition-all"
              />
            ) : (
              currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === 'multiselect'
                  ? searchParams[currentQuestion.id]?.includes(option.value)
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
