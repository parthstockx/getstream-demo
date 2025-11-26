import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";
import { buyer_user, seller_user } from "../../../constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const { query } = req;

  const channelName = query.name as string;

  const serverClient = getGetStreamInstance();

  const channel = serverClient.channel("messaging", {
    members: [buyer_user.id, seller_user.id],
    created_by: buyer_user,
  });

  // enabled pending messages for a channel
  // await serverClient.updateChannelType("messaging", {
  //   mark_messages_pending: false,
  // });

  await channel.create();

  await channel.updatePartial({
    set: {
      name: channelName,
    },
  });

  res.status(200).json({ message: "Channel created successfully" });
}
