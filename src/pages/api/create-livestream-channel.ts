import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const { query } = req;

  const channelName = query.name as string;

  const serverClient = getGetStreamInstance();

  const channel = serverClient.channel(
    "livestream",
    "test-livestream-channel",
    {
      name: channelName,
      created_by: {
        id: "admin",
        name: "Admin",
        image: "https://getstream.io/random_png/?name=Admin",
      },
    }
  );

  console.log({ channel });

  await channel.create();

  res.status(200).json({ message: "livestream channel created successfully" });
}
