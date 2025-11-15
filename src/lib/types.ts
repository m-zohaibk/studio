
export interface PropertyQuery {
  selected_area: string;
  price: string;
  availability: string;
  floor_area: string;
  bedrooms: string;
  energy_label: string[];
  construction_period: string[];
}

export interface StructuredPropertyQuery {
  selected_area: string[];
  price: string;
  availability: string[];
  floor_area: string;
  bedrooms: string;
  energy_label: string[];
  construction_period: string[];
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  area: number;
  imageUrl: string;
  imageHint: string;
  energyLabel: string;
}
