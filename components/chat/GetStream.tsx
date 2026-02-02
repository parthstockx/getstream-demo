import type { ChannelSort, ChannelFilters, ChannelOptions } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  useMessageInputContext,
  MessageList,
  Thread,
  Window,
  useMessageContext,
  useMessageComposer,
  Message,
  MessageSimple,
  MessageText,
  Attachment,
  MessageTimestamp,
  MessageStatus,
  ReactionsList,
  Avatar,
} from "stream-chat-react";
import { GoArrowUp } from "react-icons/go";



import { useMemo } from "react";

import type { SendButtonProps } from "stream-chat-react";
import {
  MessageActions,
  defaultMessageActionSet,
  DefaultDropdownActionButton,
} from "stream-chat-react/experimental";



const customRules = { disallow: [] as string[] };

const CustomMessageActions = () => {
  const customMessageActionSet = useMemo(() => {
    return [
      ...defaultMessageActionSet.filter((a) => a.type !== 'reply'),
      // ...defaultMessageActionSet,
      { type: 'reply', placement: 'quick' as const, Component: CustomReplyAction },


      // your other custom actions...
      // {
      //   type: "myCustomTypeQuick",
      //   placement: "quick" as const,
      //   Component: () => <button>sa</button>,
      // },
    ].filter(
      (action) => !customRules.disallow.includes(action.type) && action.placement === "quick",
    );
  }, []);

  return (
    <MessageActions
      disableBaseMessageActionSetFilter
      messageActionSet={customMessageActionSet}
    />
  );
};

function ReplyArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="25" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );
}

function CustomReplyAction() {
  const { message } = useMessageContext();
  const messageComposer = useMessageComposer();

  const handleQuoteReply = () => {
    messageComposer.setQuotedMessage(message);
  };

  return (
    <button
      type="button"
      className="str-chat__message-reply-in-thread-button str-chat__reply-arrow-button"
      onClick={handleQuoteReply}
      aria-label="Reply"
    >
      <ReplyArrowIcon className="str-chat__message-action-icon" />
    </button>
  );
}

function CustomSendButton({ sendMessage, ...rest }: SendButtonProps) {
  return (
    <button
      type="button"
      className="str-chat__send-arrow-button"
      onClick={(e) => sendMessage(e)}
      aria-label="Send"
      {...rest}
    >
      <GoArrowUp size={20} fill="white" className="str-send-button-icon" />
    </button>
  );
}
const CustomMessageText = () => {
  const { message } = useMessageContext();

  return (
    <>
      {message.quoted_message && (
        <div className="custom-quoted-message-inside">
          <div className="quoted-user-name">
            {message.quoted_message.user?.name || 'User'}
          </div>
          <div className="quoted-message-text">
            {message.quoted_message.text}
          </div>
        </div>
      )}
      <MessageText />
    </>
  );
};


// const CustomMessage = () => {
//   const { 
//     message, 
//     isMyMessage,
//   } = useMessageContext();

//   const isMine = isMyMessage();

//   return (
//     <div className={`str-chat__message str-chat__message-simple ${isMine ? 'str-chat__message--me' : ''}`}>
//       {/* Avatar (for other users' messages) */}
//       {!isMine && (
//         <Avatar 
//           image={message.user?.image} 
//           name={message.user?.name || message.user?.id}
//         />
//       )}

//       <div className="str-chat__message-inner">
//         {/* Message Actions (reply, delete, etc.) */}
//         <MessageActions />

//         <div className="str-chat__message-bubble">
//           {/* USER NAME (for other users' messages) */}
//           {!isMine && (
//             <div className="str-chat__message-sender-name">
//               {message.user?.name || message.user?.id}
//             </div>
//           )}

//           {/* YOUR CUSTOM QUOTED MESSAGE - INSIDE THE BUBBLE */}
//           {message.quoted_message && (
//             <div className="custom-quoted-message-inside">
//               <div className="quoted-user-name">
//                 {message.quoted_message.user?.name || 'User'}
//               </div>
//               <div className="quoted-message-text">
//                 {message.quoted_message.text}
//               </div>
//             </div>
//           )}

//           {/* MESSAGE TEXT */}
//           <MessageText />

//           {/* ATTACHMENTS */}
//           {message.attachments && message.attachments.length > 0 && (
//             <Attachment attachments={message.attachments} />
//           )}

//           {/* REACTIONS */}
//           <ReactionsList />

//           {/* TIMESTAMP & STATUS */}
//           <div className="str-chat__message-data str-chat__message-simple-data">
//             <MessageTimestamp />
//             {isMine && <MessageStatus />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Usage:









const sort: ChannelSort = { last_message_at: -1 };

const options: ChannelOptions = {
  limit: 10,
};

const App = ({ token, user }: { token: string; user: string }) => {
  const userData = {
    id: user,
    name: user,
    image: `https://getstream.io/random_png/?name=${user}`,
  };

  const messagingFilter: ChannelFilters = {
    type: "messaging",
    members: { $in: [userData.id] },
  };

  const messagingAndLivestreamFilter: ChannelFilters = {
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
  
  const MessageWithCustomText = (props: any) => (
    <MessageSimple {...props} MessageText={CustomMessageText} />
  );
  return (
    <div id="root">
      <Chat client={client}>
        <ChannelList filters={messagingFilter} sort={sort} options={options} />


// In your App component:
        <Channel
          MessageActions={CustomMessageActions}
          SendButton={CustomSendButton}
          Message={MessageWithCustomText} // Pass the wrapper here instead of MessageText
        >
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          {/* <Thread /> */}
        </Channel>
      </Chat>
    </div>
  );
};

export default App;
