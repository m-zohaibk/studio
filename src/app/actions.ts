
'use server';
import * as cheerio from 'cheerio';

// --- Opus Workflow Configuration ---
const CRAWLER_WORKFLOW_ID = 'RblK0hTljCNVKHhb';
const BOOKING_WORKFLOW_ID = 'ZCkcThVTmzvgNkL9';
const OPUS_SERVICE_KEY = '_725a31538bb686e434d64fbf5545b0a9cccfd0dc1c7ca631f71c4c85d2e866a1584dc12ac6ff883b6d6933366a646969';
const OPUS_BASE_URL = 'https://operator.opus.com';


async function pollJobResults(jobExecutionId: string, maxAttempts = 30): Promise<any> {
  if (!OPUS_SERVICE_KEY) {
    throw new Error('Opus service key is not configured.');
  }
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/status`, {
      headers: { 'x-service-key': OPUS_SERVICE_KEY }
    });

    if (!response.ok) {
      throw new Error(`Failed to check Opus job status: ${await response.text()}`);
    }

    const status = await response.json();

    if (status.status === 'completed' || status.state === 'completed') {
      console.log('Opus job completed, fetching results...');
      const resultsResponse = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/results`, {
        headers: { 'x-service-key': OPUS_SERVICE_KEY }
      });

      if (!resultsResponse.ok) {
        throw new Error(`Failed to get Opus job results: ${await resultsResponse.text()}`);
      }
      const resultsData = await resultsResponse.json();
       console.log('Opus job raw results:', JSON.stringify(resultsData, null, 2));
      return resultsData;

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
  if (!CRAWLER_WORKFLOW_ID || !OPUS_SERVICE_KEY) {
    throw new Error('Opus workflow ID or service key is not configured.');
  }

  try {
    // Step 1: Initiate Job
    const initiateResponse = await fetch(`${OPUS_BASE_URL}/job/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': OPUS_SERVICE_KEY
      },
      body: JSON.stringify({
        workflowId: CRAWLER_WORKFLOW_ID,
        title: `Property Search - ${searchParams.selected_area[0] || 'Unknown Area'}`,
        description: `Searching for properties with the following criteria: ${JSON.stringify(searchParams)}`
      })
    });

    if (!initiateResponse.ok) {
      throw new Error(`Failed to initiate Opus job: ${await initiateResponse.text()}`);
    }

    const { jobExecutionId } = await initiateResponse.json();

    // Step 2: Execute Job with the correct payload structure
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
    
    // The result is a JSON string in the 'result' field.
    if (opusResults && typeof opusResults.result === 'string') {
        const parsedResult = JSON.parse(opusResults.result);
        const properties = parsedResult.properties;

        if (properties && Array.isArray(properties)) {
          console.log(`Found ${properties.length} properties from Opus.`);
          return properties.map((prop: any) => ({
            id: prop.url || Math.random(),
            title: prop.address,
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
        }
    }
    
    console.warn("Opus results received, but a valid property array was not found in the 'result' field.", opusResults);
    return [];


  } catch (error) {
    console.error('Error executing Opus workflow:', error);
    // Re-throw the error so the calling component knows it failed.
    throw error;
  }
}

export async function runBookingWorkflow(bookingData: any) {
  if (!BOOKING_WORKFLOW_ID || !OPUS_SERVICE_KEY) {
    throw new Error('Opus booking workflow ID or service key is not configured.');
  }

  try {
    console.log("Initiating booking workflow with data:", bookingData);
    const initiateResponse = await fetch(`${OPUS_BASE_URL}/job/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': OPUS_SERVICE_KEY
      },
      body: JSON.stringify({
        workflowId: BOOKING_WORKFLOW_ID,
        title: `Booking Request for ${bookingData.first_name} ${bookingData.last_name}`,
        description: `Booking for property: ${bookingData.url}`
      })
    });

     if (!initiateResponse.ok) {
      throw new Error(`Failed to initiate Opus booking job: ${await initiateResponse.text()}`);
    }

    const { jobExecutionId } = await initiateResponse.json();

     const executeResponse = await fetch(`${OPUS_BASE_URL}/job/execute`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-service-key': OPUS_SERVICE_KEY
        },
        body: JSON.stringify({
            jobExecutionId: jobExecutionId,
            jobPayloadSchemaInstance: {
                booking_details: {
                    value: bookingData,
                    type: 'object'
                }
            }
        })
    });

     if (!executeResponse.ok) {
      throw new Error(`Failed to execute Opus booking job: ${await executeResponse.text()}`);
    }
    
    // We can poll here if we need to confirm the booking was processed
    const finalStatus = await pollJobResults(jobExecutionId);
    console.log("Booking job finished with status:", finalStatus);
    
    // Return a success message or the final status
    return { success: true, message: 'Booking request submitted successfully!', status: finalStatus };

  } catch (error) {
    console.error('Error running booking workflow:', error);
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
          url: propertyUrl ? `https://www.funda.nl${propertyUrl}` : '#',
        });
      }
    });

    return properties;
  } catch (error) {
    console.error('Error scraping results:', error);
    throw new Error('Could not fetch results from the property service.');
  }
}

