
import type { Property, StructuredPropertyQuery } from './types';
import { PlaceHolderImages } from './placeholder-images';

const sampleTitles = [
  "Modern Apartment", "Charming Canal House", "Spacious Family Home", "Cozy Studio", "Luxury Penthouse", "Renovated Loft"
];

const sampleCities = [
  "Amsterdam", "Rotterdam", "Utrecht", "The Hague", "Eindhoven", "Groningen"
];

const sampleStreets = [
  "Kerkstraat", "Hoofdstraat", "Molenweg", "Dorpsstraat", "Nieuwstraat", "Prinsengracht"
];

const energyLabels = ["A", "B", "C", "D", "E", "F", "G"];

function getRandomElement<T>(arr: T[]): T {
  // The Math.random() function returns a floating-point, pseudo-random number in the range 0 to less than 1
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDummyProperties(count: number, query?: StructuredPropertyQuery): Property[] {
  const properties: Property[] = [];
  const baseProperties: Property[] = Array.from({ length: 50 }, (_, i) => {
    const city = getRandomElement(sampleCities);
    const image = PlaceHolderImages[i % PlaceHolderImages.length];
    return {
      id: `prop-${i + 1}-${Date.now()}`,
      title: `${getRandomElement(sampleTitles)} in ${city}`,
      address: `${getRandomElement(sampleStreets)} ${getRandomNumber(1, 200)}, ${city}`,
      price: getRandomNumber(150000, 1800000),
      bedrooms: getRandomNumber(1, 6),
      area: getRandomNumber(40, 280),
      imageUrl: image.imageUrl,
      imageHint: image.imageHint,
      energyLabel: getRandomElement(energyLabels),
    };
  });

  if (!query) {
    return baseProperties.slice(0, count);
  }

  const [minPrice, maxPrice] = query.price.split('-').map(Number);
  const minArea = parseInt(query.floor_area);
  const minBedrooms = parseInt(query.bedrooms);

  const filteredProperties = baseProperties.filter(p => {
    const priceMatch = p.price >= minPrice && (maxPrice ? p.price <= maxPrice : true);
    const areaMatch = p.area >= minArea;
    const bedroomMatch = p.bedrooms >= minBedrooms;
    const energyMatch = query.energy_label.length === 0 || query.energy_label.includes(p.energyLabel);
    
    // For simplicity, we assume location and construction period match if specified.
    // A real implementation would need more complex logic here.

    return priceMatch && areaMatch && bedroomMatch && energyMatch;
  });

  return filteredProperties.slice(0, count);
}
