
"use server";

// --- Opus Workflow Configuration ---
const CRAWLER_WORKFLOW_ID = "P24vpwAkwbJWaZUL";
const BOOKING_WORKFLOW_ID = "UJ855z3jUzjA6RSn";
const OPUS_SERVICE_KEY =
  process.env.OPUS_SERVICE_KEY ||
  "_5bafbc4e23152c78896b8dcd50412afc30d45f876fbd9e026b8f00dbd31f900819f8d87ffcf813c26d69336574776936";

const OPUS_BASE_URL = "https://operator.opus.com";


export async function initiateOpusJob(searchParams: any) {
  if (!CRAWLER_WORKFLOW_ID || !OPUS_SERVICE_KEY) {
    throw new Error(
      "Opus crawler workflow ID or service key is not configured."
    );
  }

  // Step 1: Initiate Job
  const initiateResponse = await fetch(`${OPUS_BASE_URL}/job/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-service-key": OPUS_SERVICE_KEY,
    },
    body: JSON.stringify({
      workflowId: CRAWLER_WORKFLOW_ID,
      title: `Property Search - ${
        searchParams.selected_area[0] || "Unknown Area"
      }`,
      description: `Searching for properties with the following criteria: ${JSON.stringify(
        searchParams
      )}`,
    }),
  });

  if (!initiateResponse.ok) {
    throw new Error(
      `Failed to initiate Opus job: ${await initiateResponse.text()}`
    );
  }

  const { jobExecutionId } = await initiateResponse.json();
  console.log(`Opus job initiated with ID: ${jobExecutionId}`);

  console.log("Search params: ", searchParams);

  // Step 2: Execute Job with the correct payload structure
  const executeResponse = await fetch(`${OPUS_BASE_URL}/job/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-service-key": OPUS_SERVICE_KEY,
    },
    body: JSON.stringify({
      jobExecutionId: jobExecutionId,
      jobPayloadSchemaInstance: {
        city_list: {
          value: searchParams,
          type: "object",
        },
      },
    }),
  });

  if (!executeResponse.ok) {
    throw new Error(
      `Failed to execute Opus job: ${await executeResponse.text()}`
    );
  }

  console.log(`Opus job executed for ID: ${jobExecutionId}`);
  return { jobExecutionId };
}

export async function checkOpusJobStatus(jobExecutionId: string) {
  if (!OPUS_SERVICE_KEY) {
    throw new Error("Opus crawler service key is not configured.");
  }

  console.log(`Checking status for job ID: ${jobExecutionId}`);
  const response = await fetch(
    `${OPUS_BASE_URL}/job/${jobExecutionId}/status`,
    {
      headers: { "x-service-key": OPUS_SERVICE_KEY },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to check Opus job status: ${await response.text()}`
    );
  }

  const statusData = await response.json();
  console.log(
    `Status for job ${jobExecutionId}: ${statusData.status || statusData.state}`
  );
  return { status: statusData.status || statusData.state };
}

export async function getOpusJobResults(jobExecutionId: string) {
  if (!OPUS_SERVICE_KEY) {
    throw new Error("Opus crawler service key is not configured.");
  }

  console.log(`Fetching results for completed job ID: ${jobExecutionId}`);
  const resultsResponse = await fetch(
    `${OPUS_BASE_URL}/job/${jobExecutionId}/results`,
    {
      headers: { "x-service-key": OPUS_SERVICE_KEY },
    }
  );

  if (!resultsResponse.ok) {
    const errorText = await resultsResponse.text();
    console.error(
      `Failed to get Opus job results for ${jobExecutionId}:`,
      errorText
    );
    throw new Error(`Failed to get Opus job results: ${errorText}`);
  }

  const opusResults = await resultsResponse.json();
  console.log("Opus job raw results:", JSON.stringify(opusResults, null, 2));

  if (opusResults && opusResults.jobResultsPayloadSchema) {
    const schema = opusResults.jobResultsPayloadSchema;
    const resultKey = Object.keys(schema)[0];

    if (
      resultKey &&
      schema[resultKey] &&
      typeof schema[resultKey].value === "string"
    ) {
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
            imageUrl:
              prop.image_url ||
              `https://picsum.photos/seed/${Math.random()}/600/400`,
            features: [
              prop.rooms ? `${prop.rooms} rooms` : null,
              prop.size ? `${prop.size}` : null,
              prop.energy_label ? `Label: ${prop.energy_label}` : null,
            ].filter(Boolean),
            url: prop.url,
          }));
        }
      } catch (e) {
        console.error("Failed to parse properties from Opus result value:", e);
        throw new Error(
          "Could not parse property data from the search result."
        );
      }
    }
  }

  console.warn(
    "Opus results received, but a valid property array was not found in the expected structure.",
    opusResults
  );
  return [];
}

export async function runBookingWorkflow(bookingData: any) {
  if (!BOOKING_WORKFLOW_ID || !OPUS_SERVICE_KEY) {
    throw new Error(
      "Opus booking workflow ID or service key is not configured."
    );
  }

  try {
    console.log("Initiating booking workflow with data:", bookingData);
    const initiateResponse = await fetch(`${OPUS_BASE_URL}/job/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-key": OPUS_SERVICE_KEY,
      },
      body: JSON.stringify({
        workflowId: BOOKING_WORKFLOW_ID,
        title: `Booking Request for ${bookingData.first_name} ${bookingData.last_name}`,
        description: `Booking for property: ${bookingData.url}`,
      }),
    });

    if (!initiateResponse.ok) {
      throw new Error(
        `Failed to initiate Opus booking job: ${await initiateResponse.text()}`
      );
    }

    const { jobExecutionId } = await initiateResponse.json();
    const jobPayloadSchemaInstance = {
      "workflow_input_d0tbe2qep": {
        "value": bookingData.urls,
        "type": "array",
      },
      "workflow_input_ujl9q9ydk": {
        "value": bookingData.booking_message,
        "type": "str",
      },
      "workflow_input_hf07qbqv3": {
        "value": bookingData.email,
        "type": "str",
      },
      "workflow_input_w8y1qgser": {
        "value": bookingData.first_name,
        type: "str",
      },
      "workflow_input_pxgnp6em1": {
        "value": bookingData.last_name,
        type: "str",
      },
      "workflow_input_1viq5q1p7": {
        "value": bookingData.phone,
        type: "str",
      },
      "workflow_input_302nas4ov": {
        "value": bookingData.post_code,
        type: "str",
      },
      "workflow_input_exvtxh21n": {
        "value": bookingData.house_number,
        type: "str",
      },
      "workflow_input_09vh4rp6f": {
        "value": bookingData.addition,
        type: "str",
      },
      "workflow_input_o06e56q34": {
        "value": bookingData.want_to_sell_house,
        type: "bool",
      },
      "workflow_input_ex7vthuqe": {
        "value": bookingData.had_financial_consultation,
        type: "bool",
      },
      "workflow_input_hz10j1kp1": {
        "value": bookingData.available_days,
        type: "array",
      },
      "workflow_input_z5aqwnydy": {
        "value": bookingData.day_slots,
        type: "array",
      },
    }

    console.log("Job payload schema instance:", jobPayloadSchemaInstance);

    const executeResponse = await fetch(`${OPUS_BASE_URL}/job/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-key": OPUS_SERVICE_KEY,
      },

      

      body: JSON.stringify({
        jobExecutionId: jobExecutionId,
        jobPayloadSchemaInstance: jobPayloadSchemaInstance,
      }),
    });

    if (!executeResponse.ok) {
      throw new Error(
        `Failed to execute Opus booking job: ${await executeResponse.text()}`
      );
    }

    // We can poll here if we need to confirm the booking was processed
    await pollJobStatus(jobExecutionId, OPUS_SERVICE_KEY);
    
    // Return a simple, clean success object
    return {
      success: true,
      message: "Booking request submitted successfully!",
    };
  } catch (error) {
    console.error("Error running booking workflow:", error);
    throw error;
  }
}

async function pollJobStatus(
  jobExecutionId: string,
  serviceKey: string,
  maxAttempts = 30
) {
  for (let i = 0; i < maxAttempts; i++) {
    const { status } = await checkOpusJobStatusWithKey(
      jobExecutionId,
      serviceKey
    );
    if (status === "COMPLETED" || status === "completed") {
      return status;
    }
    if (status === "FAILED" || status === "failed") {
      console.error(`Booking job ${jobExecutionId} failed.`);
      return status;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return "TIMED_OUT";
}

export async function checkOpusJobStatusWithKey(
  jobExecutionId: string,
  serviceKey: string
) {
  if (!serviceKey) {
    throw new Error("Opus service key is not configured.");
  }

  console.log(`Checking status for job ID: ${jobExecutionId}`);
  const response = await fetch(
    `${OPUS_BASE_URL}/job/${jobExecutionId}/status`,
    {
      headers: { "x-service-key": serviceKey },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to check Opus job status: ${await response.text()}`
    );
  }

  const statusData = await response.json();
  console.log(
    `Status for job ${jobExecutionId}: ${statusData.status || statusData.state}`
  );
  return { status: statusData.status || statusData.state };
}
