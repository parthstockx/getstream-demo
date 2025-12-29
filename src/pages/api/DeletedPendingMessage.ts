import type { NextApiRequest, NextApiResponse } from "next";
import { validateWebhook } from "../../../utils/validate-webhook";

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

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting pending message:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
