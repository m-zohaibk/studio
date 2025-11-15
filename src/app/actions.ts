
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
    // It's often better to throw the error to be handled by the calling UI component
    // This allows for more specific error messages to the user.
    throw new Error("I'm sorry, I encountered a problem processing your request. Please try again.");
  }
}

    