import type { ChannelSort, ChannelFilters, ChannelOptions, LocalMessage } from "stream-chat";
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
  useMessageContext,
  useMessageComposer,
  useChannelActionContext,
  useChatContext,
  useChannelStateContext,
  useTranslationContext,
  useComponentContext,
  Message,
  MessageSimple,
  MessageText,
  Attachment as DefaultAttachment,
  MessageTimestamp,
  MessageStatus,
  ReactionsList,
  Avatar,
  Poll,
  useDialog,
  renderText as defaultRenderText,
  useMessageComposerHasSendableData,
  defaultReactionOptions
} from "stream-chat-react";
import { GoArrowUp } from "react-icons/go";



import React, { useRef, useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";

import type { ReactionSelectorProps, SendButtonProps } from "stream-chat-react";
import {
  MessageActions,
  defaultMessageActionSet,
  DefaultDropdownActionButton,

} from "stream-chat-react/experimental";
import { HiOutlineEmojiHappy } from "react-icons/hi";



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
  const hasSendableData = useMessageComposerHasSendableData();
  return (
    <button
      type="button"
      className="str-chat__send-arrow-button"
      onClick={(e) => sendMessage(e)}
      aria-label="Send"
      disabled={!hasSendableData}
      {...rest}
    >
      <GoArrowUp size={20} fill="white" className="str-send-button-icon" />
    </button>
  );
}



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

const QUICK_REACTIONS = (() => {
  const byType: Record<string, (typeof defaultReactionOptions)[0]> = {};
  defaultReactionOptions.forEach((r) => { byType[r.type] = r; });
  return ['like', 'love', 'haha', 'wow', 'sad'].map((type) => byType[type]).filter(Boolean);
})();
const QUICK_4 = QUICK_REACTIONS.slice(0, 4);

const EXTENDED_EMOJI: Array<{ type: string; char: string }> = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '🤟', '🤘', '🤙', '👌', '🤌', '🤏', '✌', '🤝', '🙌', '👏', '🤲', '🙏', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸'
].map((char, i) => ({ type: `emoji_${i}`, char }));

const reactionOptions = [
  ...defaultReactionOptions,
  ...EXTENDED_EMOJI.map(({ type, char }) => ({
    type,
    Component: () => <>{char}</>,
    name: char,
  })),
];
const CustomReactionSelector = React.forwardRef<HTMLDivElement, ReactionSelectorProps>(
  function CustomReactionSelector(_props, ref) {
    const { handleReaction, message, closeReactionSelectorOnClick } = useMessageContext();
    const dialogId = `reaction-selector--${message.id}`;
    const dialog = useDialog({ id: dialogId });
    const [showMore, setShowMore] = useState(false);

    const onPick = useCallback(
      (type: string, e: React.BaseSyntheticEvent) => {
        handleReaction(type, e);
        if (closeReactionSelectorOnClick) dialog.close();
        setShowMore(false);
      },
      [handleReaction, closeReactionSelectorOnClick, dialog]
    );

    if (showMore) {
      return (
        <div ref={ref} className="str-chat__reaction-selector str-chat__message-reaction-selector">
          <div
            className="str-chat__message-reactions-list str-chat__message-reactions-options"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 4,
              maxHeight: 280,
              overflowY: 'auto',
              padding: 8,
            }}
          >
            {EXTENDED_EMOJI.map(({ type, char }) => (
              <button
                key={type}
                type="button"
                className="str-chat__message-reactions-list-item str-chat__message-reactions-option"
                aria-label={`Reaction ${char}`}
                onClick={(e) => onPick(type, e)}
                style={{ fontSize: 24, padding: 4, border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="str-chat__reaction-selector str-chat__message-reaction-selector str-chat-react__message-reaction-selector">
        <ul className="str-chat__message-reactions-list str-chat__message-reactions-options">
          {QUICK_4.map(({ Component, name, type }) => (
            <li key={type}>
              <button
                type="button"
                className="str-chat__message-reactions-list-item str-chat__message-reactions-option"
                aria-label={`Select Reaction: ${name || type}`}
                data-testid="select-reaction-button"
                onClick={(e) => onPick(type, e)}
              >
                <span className="str-chat__message-reaction-emoji">
                  <Component />
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="str-chat__message-reactions-list-item str-chat__message-reactions-option"
              aria-label="More reactions"
              onClick={() => setShowMore(true)}
              style={{ fontSize: 18 }}
            >
              <HiOutlineEmojiHappy style={{ fontSize: 20 }} />
            </button>
          </li>
        </ul>
      </div>
    );
  }
);







const LIVESTREAM_CHANNEL_ID = "test-livestream-channel";

// Live chat UI (Twitch/YouTube style) – used when mode is "livestream"
function LiveStreamChat() {
  const { messages = [], channel, loading } = useChannelStateContext("LiveStreamChat");
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages?.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !channel) return;
    setInput("");
    try {
      await channel.sendMessage({ text });
    } catch {
      setInput(text);
    }
  };

  if (loading && (!messages || messages.length === 0)) {
    return (
      <div className="live-stream-chat live-stream-chat__wrapper">
        <div className="live-stream-chat__header">Live chat</div>
        <div className="live-stream-chat__loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="live-stream-chat live-stream-chat__wrapper">
      <div className="live-stream-chat__header">Live chat</div>
      <div className="live-stream-chat__list" ref={listRef}>
        {(messages || []).map((msg) => {
          if (msg.deleted_at || msg.type === "deleted") return null;
          const name = msg.user?.name || msg.user?.id || "Someone";
          const image = msg.user?.image;
          const text = typeof msg.text === "string" ? msg.text : "";
          return (
            <div key={msg.id} className="live-stream-chat__message">
              <div
                className="live-stream-chat__avatar"
                style={image ? { backgroundImage: `url(${image})` } : undefined}
              >
                {!image && (name?.charAt(0) || "?").toUpperCase()}
              </div>
              <div className="live-stream-chat__bubble">
                <span className="live-stream-chat__sender-name">{name}</span>
                <p className="live-stream-chat__text">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form className="live-stream-chat__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="live-stream-chat__input"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Message"
        />
        <button type="submit" className="live-stream-chat__send" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

// Renders LiveStreamChat for livestream channels, otherwise DM Window (MessageList + MessageInput)
function ChannelContent() {
  const { channel } = useChannelStateContext("ChannelContent");
  const isLivestream = channel?.type === "livestream";
  if (isLivestream) return <LiveStreamChat />;
  return (
    <Window>
      <ChannelHeader />
      <MessageList />
      <MessageInput />
    </Window>
  );
}

type ChatMode = "messaging" | "livestream";

const App = ({
  token,
  user,
  mode = "messaging",
}: {
  token: string;
  user: string;
  mode?: ChatMode;
}) => {
  const userData = useMemo(
    () => ({
      id: user,
      name: user,
      image: `https://getstream.io/random_png/?name=${user}`,
    }),
    [user]
  );

  const messagingFilter: ChannelFilters = {
    type: "messaging",
    members: { $in: [userData.id] },
  };

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_GETSTREAM_KEY as string,
    tokenOrProvider: token,
    userData,
  });

  const livestreamChannel = useMemo(() => {
    if (!client || mode !== "livestream") return null;
    return client.channel("livestream", LIVESTREAM_CHANNEL_ID);
  }, [client, mode]);

  const channelReactionOptions = useMemo(() => reactionOptions, []);

  if (!client || !token || !userData.id)
    return <div>Setting up client & connection...</div>;

  if (mode === "livestream") {
    if (!livestreamChannel)
      return <div>Preparing livestream...</div>;
    return (
      <div id="root">
        <Chat client={client}>
          <Channel channel={livestreamChannel}>
            <LiveStreamChat />
          </Channel>
        </Chat>
      </div>
    );
  }

  // mode === "messaging" – direct messages with channel list







  // function CustomQuotedMessage() {
  //   const { message } = useMessageContext();
  //   const { jumpToMessage } = useChannelActionContext();
  //   const { client } = useChatContext();
  //   const { t, userLanguage } = useTranslationContext();
  //   const { Attachment: ContextAttachment = DefaultAttachment } = useComponentContext("QuotedMessage");
  //   const { renderText: contextRenderText } = useMessageContext();
  //   const renderText = contextRenderText ?? defaultRenderText;
  //   const { quoted_message } = message;

  //   const poll = quoted_message?.poll_id && client.polls.fromState(quoted_message.poll_id);
  //   const quotedMessageDeleted = quoted_message?.deleted_at || quoted_message?.type === "deleted";
  //   const quotedMessageText = quotedMessageDeleted
  //     ? t("This message was deleted...")
  //     : quoted_message?.i18n?.[`${userLanguage}_text`] ?? quoted_message?.text ?? "";
  //   const quotedMessageAttachment =
  //     quoted_message?.attachments?.length && !quotedMessageDeleted
  //       ? quoted_message.attachments[0]
  //       : null;
  //   const renderedText = useMemo(
  //     () => renderText(quotedMessageText, quoted_message?.mentioned_users),
  //     [quotedMessageText, quoted_message?.mentioned_users, renderText]
  //   );

  //   if (!quoted_message) return null;
  //   if (!quoted_message.poll && !quotedMessageText && !quotedMessageAttachment) return null;

  //   return (
  //     <>
  //       <div
  //         className="custom-quoted-preview"
  //         data-testid="quoted-message"
  //         onClickCapture={(e) => {
  //           e.stopPropagation();
  //           e.preventDefault();
  //           jumpToMessage(quoted_message.id);
  //         }}
  //       >
  //         <div className="custom-quoted-bubble" data-testid="quoted-message-contents">
  //           {poll ? (
  //             <Poll isQuoted poll={poll} />
  //           ) : (
  //             <>
  //               {quotedMessageAttachment && (
  //               <ContextAttachment attachments={[quotedMessageAttachment]} isQuoted />
  //               )}
  //               <div className="custom-quoted-text" data-testid="quoted-message-text">
  //                 {renderedText}
  //               </div>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </>
  //   );
  // }




  // In your Channel:

  function CustomQuotedMessage() {
    const { message } = useMessageContext();
    const { jumpToMessage } = useChannelActionContext();
    const { client } = useChatContext();
    const { t, userLanguage } = useTranslationContext();
    const { Attachment: ContextAttachment = DefaultAttachment } = useComponentContext("QuotedMessage");
    const { renderText: contextRenderText } = useMessageContext();
    const renderText = contextRenderText ?? defaultRenderText;
    const { quoted_message } = message;

    // Refs and state for the connecting line
    const previewRef = useRef<HTMLDivElement>(null);
    const [linePath, setLinePath] = useState<string>('');

    const poll = quoted_message?.poll_id && client.polls.fromState(quoted_message.poll_id);
    const quotedMessageDeleted = quoted_message?.deleted_at || quoted_message?.type === "deleted";
    const quotedMessageText = quotedMessageDeleted
      ? t("This message was deleted...")
      : quoted_message?.i18n?.[`${userLanguage}_text`] ?? quoted_message?.text ?? "";
    const quotedMessageAttachment =
      quoted_message?.attachments?.length && !quotedMessageDeleted
        ? quoted_message.attachments[0]
        : null;
    const renderedText = useMemo(
      () => renderText(quotedMessageText, quoted_message?.mentioned_users),
      [quotedMessageText, quoted_message?.mentioned_users, renderText]
    );
    // Calculate the line path after render (use SVG's parent so coordinates match)
    const updateLinePath = useCallback(() => {
      if (!previewRef.current) return;
      const svgParent = previewRef.current.parentElement;
      const bubble = previewRef.current.closest('.str-chat__message-bubble');
      if (!svgParent || !bubble) return;
      const quotedBubble = previewRef.current.querySelector('.custom-quoted-bubble');
      const replyBubble = bubble.querySelector('.str-chat__message-text-inner > div:last-child');
      if (!quotedBubble || !replyBubble) return;

      const parentRect = svgParent.getBoundingClientRect();
      const quotedRect = quotedBubble.getBoundingClientRect();
      const replyRect = replyBubble.getBoundingClientRect();

      const quotedMiddleY = quotedRect.top + quotedRect.height / 2 - parentRect.top;
      const quotedLeftX = quotedRect.left - parentRect.left;
      const replyMiddleY = replyRect.top + replyRect.height / 2 - parentRect.top;
      const replyLeftX = replyRect.left - parentRect.left;

      const bubbleGap = 4;
      const spineOffset = 9;
      const cornerRadius = 9;
      const spineX = Math.min(quotedLeftX, replyLeftX) - spineOffset;

      const path = [
        `M ${quotedLeftX - bubbleGap} ${quotedMiddleY}`,
        `L ${spineX + cornerRadius} ${quotedMiddleY}`,
        `Q ${spineX} ${quotedMiddleY} ${spineX} ${quotedMiddleY + cornerRadius}`,
        `L ${spineX} ${replyMiddleY - cornerRadius}`,
        `Q ${spineX} ${replyMiddleY} ${spineX + cornerRadius} ${replyMiddleY}`,
        `L ${replyLeftX - bubbleGap} ${replyMiddleY}`,
      ].join(' ');

      setLinePath(path);
    }, []);

    useLayoutEffect(() => {
      updateLinePath();
    }, [quotedMessageText, renderedText, updateLinePath]);

    useLayoutEffect(() => {
      if (!previewRef.current) return;
      const svgParent = previewRef.current.parentElement;
      const bubble = previewRef.current.closest('.str-chat__message-bubble');
      if (!svgParent || !bubble) return;
      const quotedBubble = previewRef.current.querySelector('.custom-quoted-bubble');
      const replyBubble = bubble.querySelector('.str-chat__message-text-inner > div:last-child');
      if (!quotedBubble || !replyBubble) return;

      const ro = new ResizeObserver(() => updateLinePath());
      ro.observe(quotedBubble);
      ro.observe(replyBubble);
      ro.observe(svgParent);
      return () => ro.disconnect();
    }, [updateLinePath]);

    if (!quoted_message) return null;
    if (!quoted_message.poll && !quotedMessageText && !quotedMessageAttachment) return null;

    return (
      <>
        {/* SVG connecting line */}
        {linePath && (
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <path
              d={linePath}
              stroke="rgba(225, 221, 221, 0.38) "
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}

        <div
          ref={previewRef}
          className="custom-quoted-preview"
          data-testid="quoted-message"
          onClickCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
            jumpToMessage(quoted_message.id);
          }}
        >
          <div className="custom-quoted-bubble" data-testid="quoted-message-contents">
            {poll ? (
              <Poll isQuoted poll={poll} />
            ) : (
              <>
                {quotedMessageAttachment && (
                  <ContextAttachment attachments={[quotedMessageAttachment]} isQuoted />
                )}
                <div className="custom-quoted-text" data-testid="quoted-message-text">
                  {renderedText}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }


  // function CustomMessageTimestamp({ message: propMessage }: { message?: LocalMessage }) {
  //   const { message: ctxMessage } = useMessageContext();
  //   const message = propMessage ?? ctxMessage;
  //   if (!message?.created_at) return null;

  //   const d = new Date(message.created_at);
  //   const formatted = d.toLocaleString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //   });


  //   return (
  //     <span className="str-chat__message-simple-timestamp">{formatted}</span>
  //   );
  // }

  // In your Channel:




  return (
    <div id="root">
      <Chat client={client} theme="dark" >
        <ChannelList filters={messagingFilter} sort={sort} options={options} />
        <Channel
          reactionOptions={channelReactionOptions}
          MessageActions={CustomMessageActions}
          SendButton={CustomSendButton}
          QuotedMessage={CustomQuotedMessage}
          ReactionSelector={CustomReactionSelector}
        >
          <ChannelContent />
          {/* <Thread /> */}
        </Channel>
      </Chat>
    </div>
  );
};

export default App;


// Check if message was deleted
