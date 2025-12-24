import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";

// get messageId from query params

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const messageId = req.query.messageId as string;

  const serverClient = getGetStreamInstance();

  await serverClient.commitMessage(messageId);

  console.log("Commiting message", messageId);

  res.status(200).json({ message: "Message committed successfully" });
}
