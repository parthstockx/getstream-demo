import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";
import { buyer_user_test, seller_user_test } from "../../../constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const { query } = req;

  const channelName = query.name as string;

  const serverClient = getGetStreamInstance();

  // const createOrUpdateUsers = await serverClient.upsertUsers([
  //   test_buyer,
  //   test_seller,
  // ]);

  const channel = serverClient.channel("messaging", {
    members: ["buyer_test", "seller_test"],
    created_by: buyer_user_test,
  });

  // enabled pending messages for a channel
  await serverClient.updateChannelType("messaging", {
    mark_messages_pending: false,
  });

  await channel.create();

  // await channel.updatePartial({
  //   set: {
  //     name: channelName,
  //   },
  // });

  res.status(200).json({ message: "Channel created / updated successfully" });
}
