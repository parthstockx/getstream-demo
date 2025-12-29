import type { NextApiRequest, NextApiResponse } from "next";
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

    res.status(200).json({ message: "Message passed on" });
  } catch (error) {
    console.error("Error passing on pending message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
