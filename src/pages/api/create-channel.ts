import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";
import { buyer_user, getUser, seller_user } from "../../../constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  // const { query } = req;

  // const channelName = query.name as string;

  const serverClient = getGetStreamInstance();

  const channel = serverClient.channel("messaging", {
    members: [buyer_user.id, seller_user.id],
    created_by: getUser(buyer_user.id),
  });

  await channel.create();

  res.status(200).json({ message: "Channel created successfully" });
}
