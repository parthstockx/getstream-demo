// Webhook endpoint to receive webhooks from GetStream Chat
// Reference: https://getstream.io/chat/docs/javascript/webhooks_overview/

import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(req);

    // Get signature from headers
    const signature = req.headers["x-signature"] as string;
    const webhookId = req.headers["x-webhook-id"] as string;
    const webhookAttempt = req.headers["x-webhook-attempt"] as string;
    const apiKey = req.headers["x-api-key"] as string;

    // Verify signature
    const serverClient = getGetStreamInstance();
    const isValid = serverClient.verifyWebhook(rawBody, signature);

    if (!isValid) {
      console.error("Invalid webhook signature", {
        webhookId,
        attempt: webhookAttempt,
        apiKey,
      });
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Parse the JSON body
    const body = JSON.parse(rawBody);

    // Log webhook information
    console.log("Webhook received:", {
      webhookId,
      attempt: webhookAttempt,
      apiKey,
      type: body.type,
      event: body.type || "unknown",
    });

    // // Handle different webhook types
    // // Push webhook - contains event data
    // if (body.type) {
    //   console.log("Event type:", body.type);
    //   console.log("Event data:", JSON.stringify(body, null, 2));

    //   // Process the event based on type
    //   // Examples: message.new, message.updated, message.deleted, etc.
    //   // You can add your custom logic here
    // }

    // Before Message Send webhook - can modify message
    if (body.message) {
      console.log("Message webhook:", body.message);
      // Return modified message if needed
      // return res.status(200).json({ message: modifiedMessage });
    }

    // // Custom Commands webhook
    // if (body.command) {
    //   console.log("Custom command:", body.command);
    //   // Handle custom command logic
    // }

    // Return success response (200-299 status codes)
    res.status(200).json({
      message: "Webhook received and processed",
      webhookId,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 500 to trigger retry, or 200 if you don't want retries
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
