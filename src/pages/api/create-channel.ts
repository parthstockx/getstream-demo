import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";
import {
  buyer_user,
  moderator_user,
  seller_user,
  seller_user_3,
} from "../../../constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const { query } = req;

  const channelName = query.name as string;

  const serverClient = getGetStreamInstance();

  const channel = serverClient.channel("messaging", {
    members: ["buyer_3", "seller_3"],
    created_by: seller_user_3,
  });

  // enabled pending messages for a channel
  // await serverClient.updateChannelType("messaging", {
  //   mark_messages_pending: false,
  // });

  await channel.create();

  // await channel.updatePartial({
  //   set: {
  //     name: channelName,
  //   },
  // });

  // await channel.addModerators([moderator_user.id]);

  res.status(200).json({ message: "Channel created successfully" });
}
