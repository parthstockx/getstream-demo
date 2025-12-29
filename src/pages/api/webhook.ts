// Webhook endpoint to receive webhooks from GetStream Chat
// Reference: https://getstream.io/chat/docs/javascript/webhooks_overview/

import { NextApiRequest, NextApiResponse } from "next";
import { getRawBody } from "../../../utils/get-raw-body";
import { validateWebhook } from "../../../utils/validate-webhook";

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await validateWebhook(req);

    const webhookId = req.headers["x-webhook-id"] as string;

    const rawBody = await getRawBody(req);

    // Parse the JSON body
    const body = JSON.parse(rawBody);

    // Log webhook information
    // console.log("Webhook received:", {
    //   webhookId,
    //   attempt: webhookAttempt,
    //   apiKey,
    //   type: body.type,
    //   event: body.type || "unknown",
    // });

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
      // console.log("Message webhook:", body.message);
      // Return modified message if needed
      // return res.status(200).json({ message: modifiedMessage });
    }

    // // Custom Commands webhook
    // if (body.command) {
    //   console.log("Custom command:", body.command);
    //   // Handle custom command logic
    // }

    // body.message.text = "Hello, world! from our api endpoint";

    // // Return success response (200-299 status codes)
    // res.status(200).json(body);

    // await new Promise((resolve) => setTimeout(resolve, 20000));

    res.status(200).json({
      message: "Webhook received and processed",
      webhookId,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
