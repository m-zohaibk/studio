# Funda Finder

This is a Next.js application designed to help users find real estate properties. It features a multi-step, conversational questionnaire to gather user preferences, fetches live data from a major real estate platform, and displays the results directly within the app.

## Core Technologies

- **Next.js:** Used for the React framework, including Server Components and Server Actions.
- **Tailwind CSS & shadcn/ui:** For styling and UI components.
- **Genkit (AI):** For validating and structuring user input into a searchable query.
- **Cheerio:** For server-side web scraping of the search results.
- **TypeScript:** For type safety.

## Project Structure and Key Functions

### `src/app/page.tsx`

The main entry point of the application. It simply renders the primary `HomeFindingAgent` component.

### `src/components/search/HomeFindingAgent.tsx`

This is the core component of the user interface. It is responsible for:
- **Multi-Step Questionnaire:** Manages a series of questions to gather user preferences for location, price, size, etc.
- **State Management:** Uses React's `useState` hook to keep track of the user's answers, the current step in the questionnaire, loading state, and final search results.
- **URL Construction:** Contains the `buildFundaUrl` function, which dynamically constructs the precise URL needed to perform a search based on the user's selections.
- **Data Fetching Trigger:** Calls the `fetchFundaResults` server action to initiate the scraping process.
- **Displaying Results:** Renders the `PropertyCard` components for each found property or shows a "No properties found" message.

### `src/components/search/PropertyCard.tsx`

A presentational component that displays a single property listing. It takes a `property` object as a prop and renders its details—such as image, title, address, and price—in a styled card.

### `src/app/actions.ts`

This file contains Next.js Server Actions that run exclusively on the server.

- **`fetchFundaResults(url: string)`:**
  - This asynchronous function is the heart of the data-gathering process.
  - It takes the generated search URL as input.
  - It uses `fetch` to get the HTML content of the search results page, spoofing a user agent to prevent being blocked.
  - It then uses the `cheerio` library to parse the HTML and scrape the data for each property listing, targeting specific `data-test-id` attributes to ensure stability.
  - It returns an array of property objects that can be displayed by the frontend.

### `src/ai/flows/validate-and-structure-property-query.ts`

This file defines a Genkit AI flow used for processing user input.

- **`validateAndStructurePropertyQuery(...)`:**
  - This flow takes the raw user input from the form.
  - It uses a GenAI model to validate, clean, and structure the data into a searchable query format.
  - For example, it ensures that a comma-separated string of locations like `"amsterdam, utrecht"` is correctly converted into an array `["amsterdam", "utrecht"]`.
  - While not currently used in the final URL building step, it demonstrates how AI can be used to normalize complex user input.
