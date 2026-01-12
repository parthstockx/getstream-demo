import type { ChannelSort, ChannelFilters, ChannelOptions } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { getUser } from "../../constant";

import "stream-chat-react/dist/css/v2/index.css";

const sort: ChannelSort = { last_message_at: -1 };

const options: ChannelOptions = {
  limit: 10,
};

const App = ({ token, user }: { token: string; user: string }) => {
  const userData = getUser(user);

  const filter1: ChannelFilters = {
    type: "messaging",
    members: { $in: [userData.id] },
  };

  const filter2: ChannelFilters = {
    $or: [
      {
        type: "messaging",
        members: { $in: [userData.id] },
      },
      {
        type: "livestream",
      },
    ],
  };

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_GETSTREAM_KEY as string,
    tokenOrProvider: token,
    userData,
  });

  if (!client || !token || !userData.id)
    return <div>Setting up client & connection...</div>;

  return (
    <div id="root">
      <Chat client={client}>
        <ChannelList filters={filter2} sort={sort} options={options} />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default App;
