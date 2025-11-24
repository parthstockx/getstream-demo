import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";
import {
  buyer_user,
  buyer_user_2,
  seller_user,
  seller_user_2,
} from "../../../constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const { query } = req;

  const channelName = query.name as string;

  const serverClient = getGetStreamInstance();

  const channel = serverClient.channel("messaging", null, {
    members: [buyer_user_2.id, seller_user_2.id],
    created_by: buyer_user_2,
  });

  await channel.create();

  await channel.updatePartial({
    name: channelName,
  });

  res.status(200).json({ message: "Channel created successfully" });
}
