"use client";

import { useRef, useState, useEffect } from "react";
import { useChannelStateContext } from "stream-chat-react";
import { useLivestreamChatTheme } from "./LivestreamChatTheme";

const AVATAR_COLORS = [
  "#8b9dc3", /* light purplish-blue */
  "#d4a574", /* reddish-brown / peach */
  "#7cb083", /* light green */
  "#6ba3c4", /* light blue */
  "#c97b9a", /* dusty pink */
  "#9b8bc4", /* light purple */
  "#5fb3a1", /* teal */
  "#c9a66b", /* tan/gold */
];

function hashToIndex(str: string): number {
  let n = 0;
  for (let i = 0; i < str.length; i++) n = ((n << 5) - n + str.charCodeAt(i)) | 0;
  return Math.abs(n);
}

/**
 * Internal: livestream message list + input only.
 * Styled for overlay on live video (semi-transparent, rounded input with send icon).
 */
export function LivestreamChatUI() {
  const { messages = [], channel, loading } = useChannelStateContext("LivestreamChatUI");
  const { className, style } = useLivestreamChatTheme();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const wrapperClassName = `live-stream-chat live-stream-chat__wrapper${className ? ` ${className}` : ""}`;

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
      <div className={wrapperClassName} style={style}>
        <div className="live-stream-chat__loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className={wrapperClassName} style={style}>
      <div className="live-stream-chat__list" ref={listRef}>
        {(messages || []).map((msg) => {
          if (msg.deleted_at || msg.type === "deleted") return null;
          const name = msg.user?.name || msg.user?.id || "Someone";
          const image = msg.user?.image;
          const text = typeof msg.text === "string" ? msg.text : "";
          const avatarColor = AVATAR_COLORS[hashToIndex(msg.user?.id ?? name) % AVATAR_COLORS.length];
          return (
            <div key={msg.id} className="live-stream-chat__message">
              <div
                className="live-stream-chat__avatar"
                style={
                  image
                    ? { backgroundImage: `url(${image})` }
                    : { backgroundColor: avatarColor, backgroundImage: "none" }
                }
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
       
      </form>
    </div>
  );
}


