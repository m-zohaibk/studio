
'use client';
import type { Property, StructuredPropertyQuery } from '@/lib/types';
import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultsDisplayProps {
  results: Property[];
  query: StructuredPropertyQuery;
  onNewSearch: () => void;
}

export default function ResultsDisplay({ results, query, onNewSearch }: ResultsDisplayProps) {
  
  const buildFundaUrl = () => {
    const baseUrl = 'https://www.funda.nl/en/zoeken/koop?';
    const params = new URLSearchParams();

    if (query.selected_area.length > 0) {
      params.append('selected_area', JSON.stringify(query.selected_area));
    }
    if (query.price) {
      params.append('price', `"${query.price}"`);
    }
    if (query.availability.length > 0) {
      params.append('availability', JSON.stringify(query.availability));
    }
    if (query.floor_area) {
      params.append('floor_area', `"${query.floor_area}"`);
    }
    if (query.bedrooms) {
      params.append('bedrooms', `"${query.bedrooms}"`);
    }
    if (query.energy_label.length > 0) {
      params.append('energy_label', JSON.stringify(query.energy_label));
    }
    if (query.construction_period.length > 0) {
      params.append('construction_period', JSON.stringify(query.construction_period));
    }

    return baseUrl + params.toString();
  };

  const fundaUrl = buildFundaUrl();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div 
      className="w-full max-w-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-headline text-center sm:text-left">Your Property Matches</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={onNewSearch}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Search
            </Button>
            <Button asChild variant="accent">
                <a href={fundaUrl} target="_blank" rel="noopener noreferrer">
                View on Funda
                <ExternalLink className="ml-2 h-4 w-4" />
                </a>
            </Button>
        </div>
      </div>

      {results.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {results.map((property) => (
            <motion.div key={property.id} variants={itemVariants}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-headline mb-2">No Properties Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any properties matching your criteria in our sample data. Try a broader search or view all results on Funda.</p>
        </div>
      )}
    </motion.div>
  );
}
