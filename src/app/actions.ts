
'use server';

// --- Opus Workflow Configuration ---
const CRAWLER_WORKFLOW_ID = 'RblK0hTljCNVKHhb';
const BOOKING_WORKFLOW_ID = 'UJ855z3jUzjA6RSn';
const OPUS_SERVICE_KEY = process.env.OPUS_SERVICE_KEY || '_725a31538bb686e434d64fbf5545b0a9cccfd0dc1c7ca631f71c4c85d2e866a1584dc12ac6ff883b6d6933366a646969';
const OPUS_BASE_URL = 'https://operator.opus.com';


export async function initiateOpusJob(searchParams: any) {
  if (!CRAWLER_WORKFLOW_ID || !OPUS_SERVICE_KEY) {
    throw new Error('Opus workflow ID or service key is not configured.');
  }

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
  console.log(`Opus job initiated with ID: ${jobExecutionId}`);


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
  
  console.log(`Opus job executed for ID: ${jobExecutionId}`);
  return { jobExecutionId };
}

export async function checkOpusJobStatus(jobExecutionId: string) {
    if (!OPUS_SERVICE_KEY) {
        throw new Error('Opus service key is not configured.');
    }
    
    console.log(`Checking status for job ID: ${jobExecutionId}`);
    const response = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/status`, {
      headers: { 'x-service-key': OPUS_SERVICE_KEY }
    });

    if (!response.ok) {
      throw new Error(`Failed to check Opus job status: ${await response.text()}`);
    }

    const statusData = await response.json();
    console.log(`Status for job ${jobExecutionId}: ${statusData.status || statusData.state}`);
    return { status: statusData.status || statusData.state };
}

export async function getOpusJobResults(jobExecutionId: string) {
    if (!OPUS_SERVICE_KEY) {
        throw new Error('Opus service key is not configured.');
    }

    console.log(`Fetching results for completed job ID: ${jobExecutionId}`);
    const resultsResponse = await fetch(`${OPUS_BASE_URL}/job/${jobExecutionId}/results`, {
        headers: { 'x-service-key': OPUS_SERVICE_KEY }
    });

    if (!resultsResponse.ok) {
        const errorText = await resultsResponse.text();
        console.error(`Failed to get Opus job results for ${jobExecutionId}:`, errorText);
        throw new Error(`Failed to get Opus job results: ${errorText}`);
    }

    const opusResults = await resultsResponse.json();
    console.log('Opus job raw results:', JSON.stringify(opusResults, null, 2));

    if (opusResults && opusResults.jobResultsPayloadSchema) {
        const schema = opusResults.jobResultsPayloadSchema;
        const resultKey = Object.keys(schema)[0];
        
        if (resultKey && schema[resultKey] && typeof schema[resultKey].value === 'string') {
            try {
                const parsedValue = JSON.parse(schema[resultKey].value);
                const properties = parsedValue.properties;

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
            } catch (e) {
                 console.error("Failed to parse properties from Opus result value:", e);
                 throw new Error("Could not parse property data from the search result.");
            }
        }
    }

    console.warn("Opus results received, but a valid property array was not found in the expected structure.", opusResults);
    return [];
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
    const finalStatus = await pollJobStatus(jobExecutionId);
    console.log("Booking job finished with status:", finalStatus);
    
    // Return a success message or the final status
    return { success: true, message: 'Booking request submitted successfully!', status: finalStatus };

  } catch (error) {
    console.error('Error running booking workflow:', error);
    throw error;
  }
}

async function pollJobStatus(jobExecutionId: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const { status } = await checkOpusJobStatus(jobExecutionId);
    if (status === 'COMPLETED' || status === 'completed') {
      return status;
    }
    if (status === 'FAILED' || status === 'failed') {
      console.error(`Booking job ${jobExecutionId} failed.`);
      return status;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return 'TIMED_OUT';
}
