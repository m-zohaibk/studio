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

interface PropertyCardProps {
    property: {
        id: number;
        title: string;
        address: string;
        price: string;
        imageUrl?: string;
        features: string[];
    }
}

export default function PropertyCard({ property }: PropertyCardProps) {
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
            />
        ): (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
            </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="font-bold text-lg leading-tight truncate text-gray-800">{property.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{property.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex items-center gap-2 font-bold text-blue-600 text-xl">
          <CircleDollarSign className="w-5 h-5" />
          <span>{property.price}</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-4">
        {property.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-1 text-gray-700">
                <span>{feature}</span>
            </div>
        ))}
      </CardFooter>
    </Card>
  );
}
