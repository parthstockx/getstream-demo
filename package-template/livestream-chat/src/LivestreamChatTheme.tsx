import React, { createContext, useContext } from "react";

export interface LivestreamChatThemeContextValue {
  className?: string;
  style?: React.CSSProperties;
}

export const LivestreamChatThemeContext = createContext<LivestreamChatThemeContextValue>({});

export function useLivestreamChatTheme() {
  return useContext(LivestreamChatThemeContext);
}
