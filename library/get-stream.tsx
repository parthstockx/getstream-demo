import { StreamChat } from "stream-chat";

const getGetStreamInstance = (): StreamChat => {
  const api_key = process.env.NEXT_PUBLIC_GETSTREAM_KEY;
  const api_secret = process.env.GETSTREAM_SECRET;

  const serverClient = StreamChat.getInstance(
    api_key as string,
    api_secret as string
  );

  return serverClient;
};

export { getGetStreamInstance };
