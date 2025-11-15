
'use server';

import { validateAndStructurePropertyQuery, type ValidateAndStructurePropertyQueryInput, type ValidateAndStructurePropertyQueryOutput } from '@/ai/flows/validate-and-structure-property-query';

export async function getStructuredQuery(input: ValidateAndStructurePropertyQueryInput): Promise<ValidateAndStructurePropertyQueryOutput> {
  console.log('Calling AI with input:', input);
  try {
    const structuredQuery = await validateAndStructurePropertyQuery(input);
    console.log('AI returned:', structuredQuery);
    return structuredQuery;
  } catch (error) {
    console.error("Error structuring query with GenAI:", error);
    throw new Error("I'm sorry, I encountered a problem processing your request. Please try again.");
  }
}
