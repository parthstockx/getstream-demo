import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ token: string }>
) {
  const { query } = req;

  const user_id = query.user as string;

  const serverClient = getGetStreamInstance();

  const updateResponse = await serverClient.upsertUser({
    id: user_id,
  });

  console.log({ updateResponse }, "user created / updated");

  const token = serverClient.createToken(user_id);

  res.status(200).json({ token: token });
}
