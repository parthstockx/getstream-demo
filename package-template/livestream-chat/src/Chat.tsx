"use client";

import React, { useMemo } from "react";
import {
  Chat as StreamChat,
  Channel as StreamChannel,
  useCreateChatClient,
} from "stream-chat-react";
import type { ChannelFilters } from "stream-chat";

import { LivestreamChatUI } from "./LivestreamChatUI";
import { LivestreamChatThemeContext } from "./LivestreamChatTheme";

export type ChatMode = "livestream" | "messaging";

/**
 * Authenticated chat user. Passed directly to the Stream client.
 * Matches RFC: user { id, name?, image? }.
 */
export interface ChatUser {
  /** Unique user identifier (required). */
  id: string;
  /** Display name. */
  name?: string;
  /** Avatar URL. */
  image?: string;
}

export interface ChatProps {
  /** "livestream" | "messaging". Default "livestream". Direct messaging UI coming later. */
  mode?: ChatMode;
  /** GetStream API key (e.g. from env). */
  apiKey: string;
  /** Valid Stream authentication token for the user. Provided by the consuming application. Supports string or async provider. */
  token: string | (() => Promise<string>);
  /** Authenticated chat user (required). */
  user: ChatUser;
  /** Opens the specified channel directly. Required when mode is "livestream". */
  channelId?: string;
  /** Filters used to query channels from Stream's API. When both are set, channelId takes precedence. (For messaging mode, to be used later.) */
  channelFilters?: ChannelFilters;
  /** Channel type when using channelId; defaults to "livestream". */
  channelType?: string;
  /** Optional: custom loading UI. May receive className and style for consistency with the wrapper. */
  LoadingComponent?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  /** Optional: custom error UI (receives message). May receive className and style for consistency with the wrapper. */
  ErrorComponent?: React.ComponentType<{ message: string; className?: string; style?: React.CSSProperties }>;
  /**
   * Optional: extra class name(s) applied to the chat wrapper (the root div that contains the message list and input).
   * Combined with built-in classes so you can target this instance in your CSS, e.g. for background, size, or layout.
   * Also passed to LoadingComponent and ErrorComponent when shown.
   */
  className?: string;
  /**
   * Optional: inline styles applied to the chat wrapper (the root div that contains the message list and input).
   * Use for one-off overrides like maxWidth, height, or background without adding a CSS class.
   * Also passed to LoadingComponent and ErrorComponent when shown.
   */
  style?: React.CSSProperties;
}

/**
 * Primary abstraction for chat. Use mode="livestream" or mode="messaging" (messaging UI coming later).
 *
 * Responsible for:
 * - Initializing the Stream client
 * - Connecting the authenticated user
 * - Resolving the active channel (by channelId or channelFilters)
 * - Rendering the chat experience for the selected mode
 *
 * Consumer applications should not need to interact with Stream APIs directly.
 */
export function Chat({
  mode = "livestream",
  apiKey,
  token,
  user,
  channelId,
  channelFilters,
  channelType = "livestream",
  LoadingComponent = DefaultLoading,
  ErrorComponent = DefaultError,
  className,
  style,
}: ChatProps) {
  const theme = useMemo(() => ({ className, style }), [className, style]);
  const userData = useMemo(
    () => ({
      id: user.id,
      name: user.name ?? user.id,
      image:
        user.image ??
        `https://getstream.io/random_png/?name=${encodeURIComponent(user.id)}`,
    }),
    [user.id, user.name, user.image]
  );

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData,
  });

  const channel = useMemo(() => {
    if (!client) return null;
    if (channelId) return client.channel(channelType, channelId);
    return null;
  }, [client, channelType, channelId]);

  if (!apiKey || !user?.id) {
    return <ErrorComponent message="apiKey and user.id are required." className={className} style={style} />;
  }

  if (mode === "messaging") {
    return (
      <div className={`live-stream-chat live-stream-chat__wrapper ${className ?? ""}`.trim()} style={style}>
        <div className="live-stream-chat__loading">Direct messaging coming soon.</div>
      </div>
    );
  }

  if (!channelId) {
    return <ErrorComponent message="channelId is required for livestream channel resolution." className={className} style={style} />;
  }

  if (!client) {
    return <LoadingComponent className={className} style={style} />;
  }

  if (!channel) {
    return <LoadingComponent className={className} style={style} />;
  }

  return (
    <LivestreamChatThemeContext.Provider value={theme}>
      <StreamChat client={client}>
        <StreamChannel channel={channel}>
          <LivestreamChatUI />
        </StreamChannel>
      </StreamChat>
    </LivestreamChatThemeContext.Provider>
  );
}

function DefaultLoading({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`live-stream-chat live-stream-chat__wrapper ${className ?? ""}`.trim()} style={style}>
      <div className="live-stream-chat__header">Live chat</div>
      <div className="live-stream-chat__loading">Connecting...</div>
    </div>
  );
}

function DefaultError({ message, className, style }: { message: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`live-stream-chat live-stream-chat__wrapper ${className ?? ""}`.trim()} style={style}>
      <div className="live-stream-chat__header">Live chat</div>
      <div className="live-stream-chat__loading" style={{ color: "#ef4444" }}>
        {message}
      </div>
    </div>
  );
}
