
'use server';
import * as cheerio from 'cheerio';

// --- Opus Workflow Configuration ---
const OPUS_WORKFLOW_ID = 'RblK0hTljCNVKHhb';
const OPUS_SERVICE_KEY = '_ad3f2057d8bc4969f93641046bfd16601a79b7932436929d5c2636ce8933cbcf2e2f585b65dd5f2c6d6931757175636e';
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


export async function runOpusWorkflow(searchParams: any) {
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

    // Step 2: Execute Job with the correct payload structure for the new workflow
    const executeResponse = await fetch(`${OPUS_BASE_URL}/job/execute`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-service-key': OPUS_SERVICE_KEY
        },
        body: JSON.stringify({
            jobExecutionId: jobExecutionId,
            jobPayloadSchemaInstance: {
                city_list: {
                    value: searchParams,
                    type: 'object'
                }
            }
        })
    });


    if (!executeResponse.ok) {
      throw new Error(`Failed to execute Opus job: ${await executeResponse.text()}`);
    }
    
    // Step 3: Poll for results
    const opusResults = await pollJobResults(jobExecutionId);

    let properties = null;

    // Handle case where result is a JSON string
    if (opusResults.result && typeof opusResults.result === 'string') {
        try {
            const parsedResult = JSON.parse(opusResults.result);
            properties = parsedResult.properties || null;
        } catch (e) {
            console.error("Could not parse result string from Opus", e);
        }
    } 
    // Handle case where result is an object
    else if (opusResults.result && opusResults.result.properties) {
        properties = opusResults.result.properties;
    }
    // Fallback for other possible structures
    else if (opusResults.properties) {
        properties = opusResults.properties;
    }


    if (properties && Array.isArray(properties)) {
      // The API returns objects with keys like "address", "size", "rooms".
      // We need to normalize them for our PropertyCard.
      return properties.map((prop: any) => ({
        id: prop.url || Math.random(),
        title: prop.address, // Use address as title
        address: prop.address,
        price: prop.price,
        imageUrl: prop.image_url || `https://picsum.photos/seed/${Math.random()}/600/400`,
        features: [
            prop.rooms ? `${prop.rooms} rooms` : null, 
            prop.size ? `${prop.size}` : null,
            prop.energy_label ? `Label: ${prop.energy_label}`: null,
        ].filter(Boolean),
        url: prop.url
      }));
    } else {
        console.warn("Opus results received, but a valid property array is missing.", opusResults);
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
      const propertyUrl = $(el).find('a').attr('href');
      
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
          features,
          url: propertyUrl ? `https://www.funda.nl${propertyUrl}` : url,
        });
      }
    });

    return properties;
  } catch (error) {
    console.error('Error scraping Funda:', error);
    throw new Error('Could not fetch results from Funda.');
  }
}
