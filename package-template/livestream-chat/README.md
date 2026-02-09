# Chat components (Livestream + messaging)

This folder is a **template** for your components package. Copy it into **web-packages** under `packages/` (e.g. as `packages/chat-components/`). The package provides a single **Chat** component with a **mode** prop: `livestream` (default) or `messaging` (direct messaging UI coming later).

## What the package provides

- **Chat** – Single component. Use `mode="livestream"` or `mode="messaging"`.
  - **mode="livestream"** (default): Stream client, WebSocket connection, user connection, channel resolution, and livestream UI (message list + input). Pass `apiKey`, `token`, `user`, and `channelId`.
  - **mode="messaging"**: Direct messaging UI to be implemented later; currently shows a placeholder.
- **Styles** – Import once in the app (overlay look: semi-transparent, rounded input + send icon).

## Setup in web-packages

1. In **web-packages**, create a new folder under `packages/`, e.g. `packages/chat-components/`.
2. Copy the contents of this template into that folder (src/, styles.css, package.json, tsconfig.json).
3. In `package.json`, set `"name": "@your-org/chat-components"` to match your other packages.
4. From web-packages root: `pnpm install` then `pnpm build`.

See **docs/ADD_PACKAGE_TO_WEB_PACKAGES.md** in getstream-demo1 for the full step-by-step.

## Consumer usage

One component: **Chat** with a **mode** prop. Consumers do **not** use `stream-chat-react`'s `Chat`, `Channel`, or `useCreateChatClient` directly.

```bash
pnpm add @your-org/chat-components stream-chat stream-chat-react
```

```tsx
import { Chat } from "@your-org/chat-components";
import "@your-org/chat-components/styles.css";

// Livestream (default)
<Chat
  mode="livestream"
  apiKey={process.env.NEXT_PUBLIC_GETSTREAM_KEY}
  token={token}
  user={{ id: "alice", name: "Alice" }}
  channelId="my-livestream-channel"
/>

// Direct messaging (placeholder for now)
<Chat mode="messaging" apiKey={...} token={token} user={user} />
```

Consumers obtain the token from their backend and pass it in; the package handles client, WebSocket connection, channel, and UI.

## Customizing appearance (background, size, etc.)

**Option 1: `className` and `style` props**

Pass your own class or inline styles; they are applied to the chat wrapper so you can override background, size, and layout:

```tsx
<Chat
  mode="livestream"
  className="my-live-chat"
  style={{ maxWidth: 500, height: "80vh" }}
  apiKey={...}
  token={token}
  user={user}
  channelId={channelId}
/>
```

In your CSS:

```css
.my-live-chat {
  background: rgba(0, 0, 0, 0.6) !important;
  max-width: 500px !important;
  height: 80vh;
  border-radius: 12px;
}
```

**Option 2: CSS custom properties (no prop needed)**

Set these variables on a parent (e.g. a wrapper div or `:root`) to theme the chat. The component uses them for the wrapper.

| Variable | Default | Description |
|----------|---------|-------------|
| `--livestream-chat-bg` | `rgba(0, 0, 0, 0.35)` | Background of the chat panel |
| `--livestream-chat-max-width` | `400px` | Max width |
| `--livestream-chat-min-height` | `280px` | Min height |
| `--livestream-chat-max-height` | `100vh` | Max height |
| `--livestream-chat-border-radius` | `0` | Panel border radius |
| `--livestream-chat-backdrop-blur` | `8px` | Backdrop blur amount |

```css
.my-page .live-stream-chat__wrapper {
  --livestream-chat-bg: rgba(0, 0, 0, 0.5);
  --livestream-chat-max-width: 360px;
  --livestream-chat-border-radius: 12px;
}
```

Wrap the component in a div with class `my-page` so the variables apply.
