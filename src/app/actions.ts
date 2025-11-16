
'use server';
import * as cheerio from 'cheerio';

// --- Opus Workflow Configuration ---
const OPUS_WORKFLOW_ID = 'qwqiKchRBgg0qQV9';
const OPUS_SERVICE_KEY = '_80a7138936bc5b76cf677386bd32ba226a68bb763fed9af54027a699fa7412e2f5b4835f457bebad6d69316c6a686a64';
const OPUS_BASE_URL = 'https://operator.opus.com';


async function pollJobResults(jobExecutionId: string, maxAttempts = 30): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/status`, {
      headers: { 'x-service-key': OPUS_SERVICE_KEY }
    });

    if (!response.ok) {
      throw new Error(`Failed to check Opus job status: ${await response.text()}`);
    }

    const status = await response.json();

    if (status.status === 'completed' || status.state === 'completed') {
      const resultsResponse = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/results`, {
        headers: { 'x-service-key': OPUS_SERVICE_KEY }
      });

      if (!resultsResponse.ok) {
        throw new Error(`Failed to get Opus job results: ${await resultsResponse.text()}`);
      }
      return await resultsResponse.json();

    } else if (status.status === 'failed' || status.state === 'failed') {
      const results = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/results`, {
        headers: { 'x-service-key': OPUS_SERVICE_KEY }
      });
      const errorDetails = await results.json();
      console.error('Opus job failed:', errorDetails);
      throw new Error(`Opus job failed: ${JSON.stringify(errorDetails)}`);
    }

    // Wait 2 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Opus job timed out after ' + maxAttempts * 2 + ' seconds.');
};


export async function runOpusWorkflow(searchParams: any, fundaUrl: string) {
  try {
    // Step 1: Initiate Job
    const initiateResponse = await fetch(`${OPUS_BASE_URL}/job/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': OPUS_SERVICE_KEY
      },
      body: JSON.stringify({
        workflowId: OPUS_WORKFLOW_ID,
        title: `Funda Property Search - ${searchParams.selected_area[0] || 'Unknown Area'}`,
        description: `Searching for properties with the following criteria: ${JSON.stringify(searchParams)}`
      })
    });

    if (!initiateResponse.ok) {
      throw new Error(`Failed to initiate Opus job: ${await initiateResponse.text()}`);
    }

    const { jobExecutionId } = await initiateResponse.json();

    // Step 2: Execute Job
    const executeResponse = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': OPUS_SERVICE_KEY
      },
      body: JSON.stringify({
        location: searchParams.selected_area[0] || 'Amsterdam',
        budget: searchParams.price || '0-1000000',
        availability: searchParams.availability || [],
        energy_label: searchParams.energy_label || [],
        minimum_bedrooms: parseInt(searchParams.bedrooms?.replace('-', '') || '1'),
        minimum_floor_area: parseInt(searchParams.floor_area?.replace('-', '') || '50'),
        construction_period: searchParams.construction_period || [],
        funda_url: fundaUrl
      })
    });

    if (!executeResponse.ok) {
      throw new Error(`Failed to execute Opus job: ${await executeResponse.text()}`);
    }
    
    // Step 3: Poll for results
    const opusResults = await pollJobResults(jobExecutionId);

    // Handle various possible output structures from Opus
    let properties = null;
    if (opusResults.properties) {
        properties = opusResults.properties;
    } else if (opusResults.display_property_listings) {
        properties = opusResults.display_property_listings;
    } else if (opusResults.output && opusResults.output.properties) {
        properties = opusResults.output.properties;
    } else if (opusResults.result && opusResults.result.properties) {
        properties = opusResults.result.properties;
    }

    if (properties && Array.isArray(properties)) {
      // The API sometimes returns objects with keys like "Property Title"
      // We need to normalize them to camelCase like "title" for our PropertyCard
      return properties.map((prop: any) => ({
        id: prop.id || Math.random(),
        title: prop.title || prop['Property Title'],
        address: prop.address || prop['Address'],
        price: prop.price || prop['Price'],
        imageUrl: prop.imageUrl || prop['Image URL'] || prop.image,
        features: prop.features || [prop.bedrooms, prop.area].filter(Boolean)
      }));
    } else {
        console.warn("Opus results received, but a valid 'properties' array is missing.", opusResults);
        return [];
    }

  } catch (error) {
    console.error('Error executing Opus workflow:', error);
    // Re-throw the error so the calling component knows it failed.
    throw error;
  }
}


export async function fetchFundaResults(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const properties: any[] = [];
    $('[data-test-id="search-result-item"]').each((i, el) => {
      const title = $(el).find('[data-test-id="street-name-house-number"]').text().trim();
      const address = $(el).find('[data-test-id="postal-code-city"]').text().trim();
      const price = $(el).find('[data-test-id="price-wrapper"]').text().trim().replace(/\s/g, '');
      const imageUrl = $(el).find('.search-result-image img').attr('src');
      
      const features: string[] = [];
       $(el).find('[data-test-id="property-features"] li').each((i, featureEl) => {
            features.push($(featureEl).text().trim());
       });


      if (title && address && price) {
        properties.push({
          id: i,
          title,
          address,
          price,
          imageUrl,
          features
        });
      }
    });

    return properties;
  } catch (error) {
    console.error('Error scraping Funda:', error);
    throw new Error('Could not fetch results from Funda.');
  }
}
