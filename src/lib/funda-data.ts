
import type { Property } from './types';
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

export function generateDummyProperties(count: number): Property[] {
  const properties: Property[] = [];

  for (let i = 0; i < count; i++) {
    const city = getRandomElement(sampleCities);
    const image = getRandomElement(PlaceHolderImages);
    const property: Property = {
      id: `prop-${i + 1}-${Date.now()}`,
      title: `${getRandomElement(sampleTitles)} in ${city}`,
      address: `${getRandomElement(sampleStreets)} ${getRandomNumber(1, 200)}, ${city}`,
      price: getRandomNumber(250000, 1500000),
      bedrooms: getRandomNumber(1, 5),
      area: getRandomNumber(50, 250),
      imageUrl: image.imageUrl,
      imageHint: image.imageHint,
      energyLabel: getRandomElement(energyLabels),
    };
    properties.push(property);
  }

  return properties;
}
