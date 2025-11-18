
import Image from 'next/image';
import { BedDouble, Ruler, Zap, MapPin, CircleDollarSign, ExternalLink, CalendarPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


interface PropertyCardProps {
    property: {
        id: number;
        title: string;
        address: string;
        price: string;
        imageUrl?: string;
        features: string[];
        url?: string;
    };
    onBookViewing: () => void;
}

export default function PropertyCard({ property, onBookViewing }: PropertyCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white rounded-2xl">
      <div className="relative w-full h-48">
        {property.imageUrl ? (
            <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://picsum.photos/seed/picsum/600/400';
              target.srcset = '';
            }}
            />
        ): (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
            </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="font-bold text-lg leading-tight truncate text-gray-800">{property.title}</CardTitle>
        {property.address && (
          <CardDescription className="flex items-center gap-2 pt-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{property.address}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex items-center gap-2 font-bold text-primary text-xl mb-4">
          <CircleDollarSign className="w-5 h-5" />
          <span>{property.price}</span>
        </div>
         <div className="flex flex-wrap gap-2 text-sm">
            {property.features?.map((feature, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                    {feature}
                </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 grid grid-cols-2 gap-2">
        <Button variant="outline" asChild>
            <a
                href={property.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
            >
                View Details
                <ExternalLink className="w-4 h-4 ml-2" />
            </a>
        </Button>
         <Button onClick={onBookViewing}>
            Book Viewing
            <CalendarPlus className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}