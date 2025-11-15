
'use server';
/**
 * @fileOverview Validates and structures user property preferences for Funda search.
 *
 * - ValidateAndStructurePropertyQueryInput - Input type for the function.
 * - ValidateAndStructurePropertyQueryOutput - Output type for the function.
 */

import {z} from 'genkit';

// This file is now used only for its type definitions.
// The AI flow is no longer directly called from the component.

const ValidateAndStructurePropertyQueryInputSchema = z.object({
  selected_area: z.union([z.string(), z.array(z.string())]).describe('The desired location(s) for the property.'),
  price: z.string().describe('The desired price range for the property (e.g., \"300000-500000\").'),
  availability: z.union([z.string(), z.array(z.string())]).describe('The desired availability status (e.g., \"available\").'),
  floor_area: z.string().describe('The desired floor area of the property (e.g., \"80-\").'),
  bedrooms: z.string().describe('The desired number of bedrooms (e.g., \"2-\").'),
  energy_label: z.array(z.string()).describe('The desired energy label(s) for the property.'),
  construction_period: z
    .union([z.string(), z.array(z.string())])
    .describe('The desired construction period(s) for the property.'),
});
export type ValidateAndStructurePropertyQueryInput = z.infer<
  typeof ValidateAndStructurePropertyQueryInputSchema
>;

const ValidateAndStructurePropertyQueryOutputSchema = z.object({
  selected_area: z.array(z.string()).describe('Validated and structured list of locations.'),
  price: z
    .string()
    .describe('Validated and structured price range (e.g., \"300000-500000\").'),
  availability: z.array(z.string()).describe('Validated and structured list of availability statuses.'),
  floor_area: z.string().describe('Validated and structured floor area (e.g., \"80-\").'),
  bedrooms: z.string().describe('Validated and structured number of bedrooms (e.g., \"2-\").'),
  energy_label: z.array(z.string()).describe('Validated and structured list of energy labels.'),
  construction_period: z
    .array(z.string())
    .describe('Validated and structured list of construction periods.'),
});
export type ValidateAndStructurePropertyQueryOutput = z.infer<
  typeof ValidateAndStructurePropertyQueryOutputSchema
>;

    