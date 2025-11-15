
import Image from 'next/image';
import { BedDouble, Ruler, Zap, MapPin, CircleDollarSign } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="relative w-full h-48">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint={property.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight truncate">{property.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="truncate">{property.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 font-bold text-primary text-lg">
          <CircleDollarSign className="w-5 h-5" />
          <span>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(property.price)}</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-4 text-sm bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-primary" />
          <span className="font-medium">{property.bedrooms}</span>
          <span className="sr-only">bedrooms</span>
        </div>
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-primary" />
          <span className="font-medium">{property.area} m²</span>
          <span className="sr-only">area in square meters</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <Badge variant="outline" className="border-primary/50 text-primary font-bold">{property.energyLabel}</Badge>
          <span className="sr-only">energy label</span>
        </div>
      </CardFooter>
    </Card>
  );
}
