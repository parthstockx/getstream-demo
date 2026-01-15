import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const serverClient = getGetStreamInstance();

  const channel = serverClient.channel("messaging", {
    members: ["buyer_test", "seller_test"],
    created_by: {
      id: "admin",
      name: "Admin",
      image: "https://getstream.io/random_png/?name=Admin",
    },
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
