# LazyNest 🐦

**LazyNest** is an intelligent, AI-powered application designed to automate and accelerate the process of finding and booking rental properties in competitive markets. Built for the **AI GENESIS HACKATHON 2025 by lablab.ai**, this project gives users a significant competitive advantage by being the first to find and book viewings for new listings.

## What It Does: The LazyNest Advantage

LazyNest streamlines the entire property-finding journey into four simple, automated steps:

1.  **🔍 Search:** Users define their ideal property criteria through a friendly, multi-step questionnaire. This includes location, price range, size, number of bedrooms, and more.
2.  **🤖 Scan:** Our system leverages a powerful backend workflow (Opus) to continuously scan real estate platforms for new listings that match the user's criteria, 24/7.
3.  **🎯 Match:** The moment a matching property is found, it is instantly presented to the user in a clean, easy-to-review interface.
4.  **📅 Book:** Users can book viewings for individual properties or all matched properties at once with a single click. The system handles the booking request process automatically, ensuring the user is first in line.

## Key Features

- **Conversational Search**: An intuitive, multi-step form to capture detailed user preferences.
- **Automated Property Crawling**: Leverages Opus workflows to monitor real estate sites for new listings in real-time.
- **Instant Matching & Results**: Displays qualified properties directly in the app as they are found.
- **One-Click Booking**: Allows users to book viewings for one or all matched properties instantly, dramatically speeding up the application process.
- **Internationalization**: Supports both English and Dutch to cater to a wider audience.
- **Responsive & Modern UI**: A clean, user-friendly interface built with modern design principles.

## Architecture & Integrations

LazyNest is built on a modern, server-centric architecture designed for performance and scalability.

- **Frontend**: A Next.js application utilizing the App Router, Server Components, and React hooks for a fast, interactive user experience.
- **Backend Logic**: Next.js Server Actions are used to handle all server-side operations, providing a seamless bridge between the client and backend services without needing a separate API layer.
- **Workflow Automation (Integration)**: The core of our automated search and booking capabilities is powered by **Opus**. We use two primary Opus workflows:
    - **Crawler Workflow**: Initiated with the user's search criteria to continuously scan for new properties.
    - **Booking Workflow**: Triggered when a user requests to book a viewing, which then automates the communication with the real estate agent's platform.
- **AI (Genkit)**: Although currently used for type definitions, the project is set up with Genkit to potentially extend its AI capabilities, such as validating user input or summarizing property descriptions in the future.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Workflow Automation**: Opus
- **AI Toolkit**: Genkit
- **Deployment**: Firebase App Hosting

This combination of technologies allows for rapid development, a high-quality user experience, and a powerful, automated backend.
