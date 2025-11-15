
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { getStructuredQuery } from '@/app/actions';
import { generateDummyProperties } from '@/lib/funda-data';
import {
  CONSTRUCTION_PERIODS,
  ENERGY_LABELS,
  TOTAL_STEPS,
} from '@/lib/constants';
import type { Property, PropertyQuery, StructuredPropertyQuery } from '@/lib/types';
import ResultsDisplay from './ResultsDisplay';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Home,
  CircleDollarSign,
  Ruler,
  BedDouble,
  Zap,
  Building,
} from 'lucide-react';

const formSchema = z.object({
  selected_area: z.string().min(1, 'Please enter a location'),
  price: z.string().default('200000-750000'),
  floor_area: z.string().default('50-'),
  bedrooms: z.string().default('1-'),
  energy_label: z.array(z.string()).default([]),
  construction_period: z.array(z.string()).default([]),
  availability: z.string().default('available'),
});

const STORAGE_KEY = 'funda-finder-query';

export default function FundaFinder() {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Property[] | null>(null);
  const [structuredQuery, setStructuredQuery] = useState<StructuredPropertyQuery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [initialValues, setInitialValues] = useState<PropertyQuery | null>(null);

  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem(STORAGE_KEY);
      if (savedQuery) {
        setInitialValues(JSON.parse(savedQuery));
      }
    } catch (error) {
      console.warn("Could not load saved query:", error);
    }
  }, []);
  
  const form = useForm<PropertyQuery>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selected_area: '',
      price: '200000-750000',
      floor_area: '50-',
      bedrooms: '1-',
      energy_label: [],
      construction_period: [],
      availability: 'available',
    },
    values: initialValues || undefined,
  });

  const { control, handleSubmit, trigger, getValues, watch } = form;

  const watchedValues = watch();
  
  useEffect(() => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedValues));
    } catch (error) {
        console.warn("Could not save query:", error);
    }
  }, [watchedValues]);


  const onSubmit = async (data: PropertyQuery) => {
    setIsLoading(true);
    setStep(TOTAL_STEPS); // Move to a dedicated loading step
    try {
      const query = {
        ...data,
      };
      const structured = await getStructuredQuery(query);
      setStructuredQuery(structured);
      setResults(generateDummyProperties(8));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message || 'Failed to get results. Please try again.',
      });
      setIsLoading(false);
      setStep(TOTAL_STEPS - 1); // Go back to the last form step on error
    }
  };
  
  const handleNewSearch = () => {
    setResults(null);
    setStructuredQuery(null);
    setIsLoading(false);
    setStep(0);
  };

  const nextStep = async () => {
    const fields: (keyof PropertyQuery)[] = [
        [],
        ['selected_area'],
        ['price'],
        ['floor_area', 'bedrooms'],
        ['energy_label', 'construction_period'],
        ['availability'],
    ][step] as (keyof PropertyQuery)[];
    
    const isValid = await trigger(fields);
    if(isValid) setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  };
  
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const priceValue = watch('price').split('-').map(Number);
  const areaValue = [parseInt(watch('floor_area'))];
  const bedroomsValue = [parseInt(watch('bedrooms'))];

  const renderStepContent = () => {
    const stepVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };
    
    const motionProps = {
        key: step,
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        variants: stepVariants,
        transition: { type: "tween", ease: "easeInOut", duration: 0.4 },
        className: "w-full"
    };
    
    const { key, ...restMotionProps } = motionProps;

    switch (step) {
      case 0:
        return (
          <motion.div key={key} {...restMotionProps} className="text-center">
            <Home className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Welcome to Funda Finder</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">Let's find your dream home. We'll ask a few questions to tailor the search for you.</p>
            <Button size="lg" onClick={nextStep}>
              Start Searching <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        );
      case 1:
        return (
          <motion.div key={key} {...restMotionProps}>
            <Label htmlFor="selected_area" className="text-xl font-medium mb-4 flex items-center gap-2"><Home className="w-6 h-6 text-primary"/>What city or area are you interested in?</Label>
            <Controller
              name="selected_area"
              control={control}
              render={({ field }) => (
                <Input id="selected_area" placeholder="e.g., Amsterdam" {...field} className="text-lg p-6"/>
              )}
            />
            {form.formState.errors.selected_area && <p className="text-destructive mt-2">{form.formState.errors.selected_area.message}</p>}
          </motion.div>
        );
      case 2:
        return (
            <motion.div key={key} {...restMotionProps}>
                <Label className="text-xl font-medium mb-12 flex items-center gap-2"><CircleDollarSign className="w-6 h-6 text-primary"/>What is your price range?</Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <div>
                        <Slider
                          defaultValue={[200000, 750000]}
                          min={50000}
                          max={2000000}
                          step={10000}
                          value={priceValue}
                          onValueChange={(value) => field.onChange(value.join('-'))}
                        />
                        <div className="flex justify-between mt-4 text-lg font-semibold">
                            <span>€{priceValue[0].toLocaleString('nl-NL')}</span>
                            <span>€{priceValue[1].toLocaleString('nl-NL')}</span>
                        </div>
                    </div>
                  )}
                />
            </motion.div>
        );
      case 3:
        return (
            <motion.div key={key} {...restMotionProps} className="space-y-12">
                <div>
                    <Label className="text-xl font-medium mb-12 flex items-center gap-2"><Ruler className="w-6 h-6 text-primary"/>Minimum floor area?</Label>
                    <Controller
                    name="floor_area"
                    control={control}
                    render={({ field }) => (
                        <div>
                        <Slider
                            defaultValue={[50]}
                            min={20}
                            max={300}
                            step={5}
                            value={areaValue}
                            onValueChange={(value) => field.onChange(`${value[0]}-`)}
                        />
                        <div className="text-center mt-4 text-lg font-semibold">{areaValue[0]}+ m²</div>
                        </div>
                    )}
                    />
                </div>
                <div>
                    <Label className="text-xl font-medium mb-12 flex items-center gap-2"><BedDouble className="w-6 h-6 text-primary"/>Minimum number of bedrooms?</Label>
                    <Controller
                    name="bedrooms"
                    control={control}
                    render={({ field }) => (
                        <div>
                        <Slider
                            defaultValue={[1]}
                            min={1}
                            max={6}
                            step={1}
                            value={bedroomsValue}
                            onValueChange={(value) => field.onChange(`${value[0]}-`)}
                        />
                        <div className="text-center mt-4 text-lg font-semibold">{bedroomsValue[0]}+ bedrooms</div>
                        </div>
                    )}
                    />
                </div>
            </motion.div>
        );
      case 4:
        return (
            <motion.div key={key} {...restMotionProps} className="space-y-8">
                <div>
                    <Label className="text-xl font-medium mb-4 flex items-center gap-2"><Zap className="w-6 h-6 text-primary"/>Preferred energy labels?</Label>
                    <Controller
                        name="energy_label"
                        control={control}
                        render={({ field }) => (
                            <div className="grid grid-cols-4 gap-2">
                                {ENERGY_LABELS.map(label => (
                                    <div key={label} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`energy_${label}`}
                                            checked={field.value?.includes(label)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...field.value, label])
                                                : field.onChange(field.value?.filter((value) => value !== label))
                                            }}
                                        />
                                        <label htmlFor={`energy_${label}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </div>
                <div>
                    <Label className="text-xl font-medium mb-4 flex items-center gap-2"><Building className="w-6 h-6 text-primary"/>Construction period?</Label>
                    <Controller
                        name="construction_period"
                        control={control}
                        render={({ field }) => (
                             <Select onValueChange={(value) => field.onChange(value ? [value] : [])} defaultValue={field.value?.[0]}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Any period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(CONSTRUCTION_PERIODS).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </motion.div>
        );
      case 5:
        return (
            <motion.div key={key} {...restMotionProps}>
                <h2 className="text-3xl font-headline mb-8 text-center">Ready to find your home?</h2>
                <div className="flex justify-center">
                    <Button type="submit" size="lg" variant="accent" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : "Find Properties" }
                    </Button>
                </div>
            </motion.div>
        );
      default:
        return null;
    }
  };

  if (isLoading && !results) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[550px]">
            <LoaderCircle className="w-16 h-16 animate-spin text-primary mb-6" />
            <h1 className="text-3xl font-headline mb-2">Finding Properties...</h1>
            <p className="text-muted-foreground">Our AI is analyzing your preferences.</p>
        </div>
    );
  }

  if (results && structuredQuery) {
    return <ResultsDisplay results={results} query={structuredQuery} onNewSearch={handleNewSearch} />;
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          {step > 0 && (
            <>
              <Progress value={(step / (TOTAL_STEPS - 1)) * 100} className="w-full mb-4" />
              <CardTitle className="font-headline text-2xl">Funda Finder</CardTitle>
              <CardDescription>Step {step} of {TOTAL_STEPS - 1}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                {renderStepContent()}
            </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : <div></div>}
          {step > 0 && step < TOTAL_STEPS - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
          {step === TOTAL_STEPS - 1 && (
            <Button type="submit" variant="accent" disabled={isLoading}>
              {isLoading ? (
                  <>
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : "Find Properties" }
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

    