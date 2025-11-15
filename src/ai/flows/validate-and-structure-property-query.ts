'use server';
/**
 * @fileOverview Validates and structures user property preferences for Funda search.
 *
 * - validateAndStructurePropertyQuery - Validates and structures the property query.
 * - ValidateAndStructurePropertyQueryInput - Input type for the function.
 * - ValidateAndStructurePropertyQueryOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateAndStructurePropertyQueryInputSchema = z.object({
  selected_area: z.string().describe('The desired location(s) for the property.'),
  price: z.string().describe('The desired price range for the property (e.g., \"300000-500000\").'),
  availability: z.string().describe('The desired availability status (e.g., \"available\").'),
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

export async function validateAndStructurePropertyQuery(
  input: ValidateAndStructurePropertyQueryInput
): Promise<ValidateAndStructurePropertyQueryOutput> {
  return validateAndStructurePropertyQueryFlow(input);
}

const validateAndStructurePropertyQueryPrompt = ai.definePrompt({
  name: 'validateAndStructurePropertyQueryPrompt',
  input: {schema: ValidateAndStructurePropertyQueryInputSchema},
  output: {schema: ValidateAndStructurePropertyQueryOutputSchema},
  prompt: `You are an expert in structuring property search queries for Funda, a Dutch real estate website.

  The user will provide their property preferences, and you must validate and structure them into a format compatible with Funda's search parameters.
  Ensure that numerical values (price, floor_area, bedrooms) are correctly formatted as strings.
  Convert list-based inputs (selected_area, availability, energy_label, construction_period) into arrays of strings.

  User Preferences:
  selected_area: {{{selected_area}}}
  price: {{{price}}}
  availability: {{{availability}}}
  floor_area: {{{floor_area}}}
  bedrooms: {{{bedrooms}}}
  energy_label: {{{energy_label}}}
  construction_period: {{{construction_period}}}

  Output the validated and structured query parameters in the format specified by the ValidateAndStructurePropertyQueryOutputSchema.
  Make sure selected_area, availability, energy_label and construction_period parameters are arrays of strings.
  If a list parameter is already an array, leave it as is.
  If construction_period is an empty string, output an empty array for construction_period.
  Do not make assumptions about the values contained in the input, simply pass it to the output.
  `,
});

const validateAndStructurePropertyQueryFlow = ai.defineFlow(
  {
    name: 'validateAndStructurePropertyQueryFlow',
    inputSchema: ValidateAndStructurePropertyQueryInputSchema,
    outputSchema: ValidateAndStructurePropertyQueryOutputSchema,
  },
  async input => {
    const {output} = await validateAndStructurePropertyQueryPrompt(input);
    return output!;
  }
);
