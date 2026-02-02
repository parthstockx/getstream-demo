import { NextApiRequest, NextApiResponse } from "next";
import { getGetStreamInstance } from "../../../library/get-stream";

type CreateChannelRequest =
  | {
      channelKind: "LIVESTREAM";
      name: string;
      channelId: string;
      createdBy: string;
      metadata?: Record<string, unknown>;
    }
  | {
      channelKind: "DIRECT_MESSAGE";
      members: string[]; // required
      name?:null;
      createdBy: string;
      metadata?: Record<string, unknown>;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body as CreateChannelRequest;
    const { channelKind, createdBy, metadata = {}, name } = body;

    if (channelKind === "LIVESTREAM") {
      const { channelId } = body;
      if (!channelId) {
        return res
          .status(400)
          .json({ error: "channelId is required for livestream" });
      }

      const serverClient = getGetStreamInstance();

      // Create livestream with a specific channel ID
      const channel = serverClient.channel("livestream", channelId, {
        created_by_id: createdBy,
        name: name as string,
        ...metadata,
      });

      await channel.create();

      return res.status(201).json({
        success: true,
        type: "livestream",
        channelId,
      });
    }

    if (channelKind === "DIRECT_MESSAGE") {
      const { members } = body;
      if (!Array.isArray(members) || members.length < 2) {
        return res.status(400).json({
          error: "Direct messages require at least 2 member IDs",
        });
      }

      const serverClient = getGetStreamInstance();

      // Create a DM channel *without a channelId*, so Stream generates one
      const channel = serverClient.channel("messaging", {
        members,
        created_by_id: createdBy,
        ...metadata,
      });

      

      await channel.create();

      return res.status(201).json({
        success: true,
        type: "direct_message",
        members,
      });
    }

    return res.status(400).json({ error: "Invalid channelKind" });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error instanceof Error ? error.message : error,
    });
  }
}
