
import Image from 'next/image';
import { BedDouble, Ruler, Zap, MapPin, CircleDollarSign, CalendarPlus, ExternalLink } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        address: string;
        price: string;
        imageUrl?: string;
        rooms?: string;
        size?: string;
        energyLabel?: string;
        url?: string;
    };
    onBookViewing: () => void;
}

const Feature = ({ icon: Icon, value, label }: { icon: React.ElementType, value?: string, label: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon className="w-4 h-4 text-gray-500"/>
            <span>{value} <span className="hidden sm:inline">{label}</span></span>
        </div>
    )
}

export default function PropertyCard({ property, onBookViewing }: PropertyCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white rounded-2xl border-2 hover:border-primary/50">
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
                  target.src = `https://picsum.photos/seed/${property.id}/600/400`;
                  target.srcset = '';
                }}
            />
        ): (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
            </div>
        )}
         {property.energyLabel && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-foreground font-bold">
               <Zap className="w-3 h-3 mr-1 text-yellow-500"/> Label {property.energyLabel}
            </Badge>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="font-bold text-lg leading-tight truncate text-gray-800">{property.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1 text-gray-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{property.address.replace(property.title, '').replace(/^,/, '').trim()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex items-center gap-2 font-bold text-primary text-2xl mb-4">
          <span>{property.price}</span>
        </div>
        <div className="flex items-center justify-start gap-4">
            <Feature icon={BedDouble} value={property.rooms} label="rooms" />
            {property.rooms && property.size && <Separator orientation="vertical" className="h-4"/>}
            <Feature icon={Ruler} value={property.size} label="m²" />
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50/50 flex-col sm:flex-row gap-2">
         <Button onClick={onBookViewing} className="w-full">
            <CalendarPlus className="w-4 h-4 mr-2" /> Book Viewing
        </Button>
         <Button asChild variant="outline" className="w-full">
            <a
                href={property.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                View on Funda <ExternalLink className="w-4 h-4 ml-2" />
            </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
