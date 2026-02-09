# Chat components (Livestream + messaging)

This folder is a **template** for your components package. Copy it into **web-packages** under `packages/` (e.g. as `packages/chat-components/`). The package provides a single **Chat** component with a **mode** prop: `livestream` (default) or `messaging` (direct messaging UI coming later).

## What the package provides

- **Chat** – Single component. Use `mode="livestream"` or `mode="messaging"`.
  - **mode="livestream"** (default): Stream client, WebSocket connection, user connection, channel resolution, and livestream UI (message list + input). Pass `apiKey`, `token`, `user`, and `channelId`.
  - **mode="messaging"**: Direct messaging UI to be implemented later; currently shows a placeholder.
- **Styles** – Import once in the app (overlay look: semi-transparent, rounded input + send icon).

