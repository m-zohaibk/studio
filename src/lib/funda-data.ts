
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
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDummyProperties(count: number, query?: StructuredPropertyQuery): Property[] {
  const properties: Property[] = [];
  const usedImageIndices = new Set<number>();

  while (properties.length < 50) {
    let imageIndex = getRandomNumber(0, PlaceHolderImages.length - 1);
    while (usedImageIndices.has(imageIndex)) {
      imageIndex = getRandomNumber(0, PlaceHolderImages.length - 1);
    }
    usedImageIndices.add(imageIndex);

    const city = getRandomElement(sampleCities);
    const image = PlaceHolderImages[imageIndex];
    properties.push({
      id: `prop-${properties.length + 1}-${Date.now()}`,
      title: `${getRandomElement(sampleTitles)} in ${city}`,
      address: `${getRandomElement(sampleStreets)} ${getRandomNumber(1, 200)}, ${city}`,
      price: getRandomNumber(150000, 1800000),
      bedrooms: getRandomNumber(1, 6),
      area: getRandomNumber(40, 280),
      imageUrl: image.imageUrl,
      imageHint: image.imageHint,
      energyLabel: getRandomElement(energyLabels),
    });
  }


  if (!query) {
    return properties.slice(0, count);
  }

  const [minPrice, maxPrice] = query.price.split('-').map(p => p ? parseInt(p) : null);
  const minArea = parseInt(query.floor_area) || 0;
  const minBedrooms = parseInt(query.bedrooms) || 0;

  const filteredProperties = properties.filter(p => {
    const priceMatch = p.price >= (minPrice ?? 0) && (maxPrice ? p.price <= maxPrice : true);
    const areaMatch = p.area >= minArea;
    const bedroomMatch = p.bedrooms >= minBedrooms;
    const energyMatch = query.energy_label.length === 0 || query.energy_label.includes(p.energyLabel);
    const locationMatch = query.selected_area.length === 0 || query.selected_area.some(area => p.address.toLowerCase().includes(area.toLowerCase()));

    // For simplicity, we assume construction period match if specified.
    // A real implementation would need more complex logic here.

    return priceMatch && areaMatch && bedroomMatch && energyMatch && locationMatch;
  });

  return filteredProperties.slice(0, count);
}

    