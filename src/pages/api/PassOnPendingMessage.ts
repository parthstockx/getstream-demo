import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // wait for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Passing on pending message", req.body);

  res.status(200).json({ message: "Message passed on" });
}
