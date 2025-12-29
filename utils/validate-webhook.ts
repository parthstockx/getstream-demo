import { NextApiRequest } from "next";
import { getGetStreamInstance } from "../library/get-stream";
import { getRawBody } from "./get-raw-body";

export const validateWebhook = async (req: NextApiRequest) => {
  try {
    const rawBody = await getRawBody(req);
    const serverClient = getGetStreamInstance();

    // Get signature from headers
    const signature = req.headers["x-signature"] as string;
    const webhookId = req.headers["x-webhook-id"] as string;
    const webhookAttempt = req.headers["x-webhook-attempt"] as string;
    const apiKey = req.headers["x-api-key"] as string;

    const isValid = serverClient.verifyWebhook(rawBody, signature);

    if (!isValid) {
      console.error("Invalid webhook signature", {
        webhookId,
        attempt: webhookAttempt,
        apiKey,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating webhook:", error);
    throw new Error("Error validating webhook");
  }
};
