import type {
  User,
  ChannelSort,
  ChannelFilters,
  ChannelOptions,
} from "stream-chat";
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

import "stream-chat-react/dist/css/v2/index.css";
import { getUser } from "../../constant";

const sort: ChannelSort = { last_message_at: -1 };

const options: ChannelOptions = {
  limit: 10,
};

const App = ({ token, user }: { token: string; user: string }) => {
  const userData = getUser(user);

  const filters: ChannelFilters = {
    type: "messaging",
    members: { $in: [userData.id] },
  };

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_GETSTREAM_KEY as string,
    tokenOrProvider: token,
    userData,
  });

  if (!client || !token || !userData.id)
    return <div>Setting up client & connection...</div>;

  return (
    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;
