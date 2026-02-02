# What This Repo Is For — Full Explanation

This repository is a **Next.js app that adds real-time chat to your site** using **Stream Chat** (from GetStream). You don’t build your own chat backend or real-time layer — Stream hosts it. Your app only handles “who is this user?” and “give me a token,” then renders Stream’s chat UI.

---

## 1. The Big Picture

### What is Stream Chat (GetStream)?

- **GetStream** → company
- **Stream Chat** → their chat product: hosted API + React UI kit

You use:

- **`stream-chat`** — low-level JS SDK to talk to Stream’s API (users, channels, messages, tokens).
- **`stream-chat-react`** — React components (channel list, message list, input, threads, etc.).

Your app never stores chat messages or manages WebSockets for chat. Stream does that. You only:

1. Identify the user (e.g. by `?user=alice` or your own auth).
2. Call your own API to get a **token** for that user.
3. Render the Stream React components with that token and user id.

---

## 2. How Users Get Into Chat

### URL convention

The app expects a **user id** in the URL:

```
http://localhost:3000?user=alice
```

- `?user=alice` → “this page is for user **alice**”.
- No `?user=...` → the home page still runs `getServerSideProps` and tries to get a token for `undefined` → you get errors (e.g. serializing `undefined`). So in practice you must open the app with `?user=<some_id>`.

### Flow when you open `/?user=alice`

1. **Browser** requests `http://localhost:3000/?user=alice`.
2. **Next.js** runs `getServerSideProps` on the server for that request.
3. **`getServerSideProps`** (in `src/pages/index.tsx`) calls your API:

   ```ts
   fetch(`http://localhost:3000/api/get-token?user=alice`)
   ```

4. **`/api/get-token`** (in `src/pages/api/get-token.ts`):
   - Reads `user=alice`.
   - Uses the **server-side Stream client** (from `library/get-stream.tsx`) to:
     - `upsertUser({ id: "alice" })` — create/update that user in Stream.
     - `createToken("alice")` — create a short-lived token that allows the frontend to act as “alice”.
   - Returns `{ token: "…" }`.
5. **`getServerSideProps`** puts that token into **props** and passes them to the page.
6. The **Home** page renders `<GetStream token={token} user="alice" />`.
7. **GetStream** uses that token + user id to connect to Stream and show the chat UI.

So: **“who is the user?”** is determined by **`?user=...`** in the URL; **“can they use chat?”** is determined by the **token** your `/api/get-token` returns.

---

## 3. Project Structure and What Each Part Does

### Entry and layout

- **`src/pages/_app.tsx`**  
  Wraps every page, injects global CSS. No chat logic.

- **`src/pages/_document.tsx`**  
  Custom `Document` for HTML shell. Not shown in the snippets above but it’s part of the app shell.

- **`src/pages/index.tsx`**  
  The only “page” you care about for chat:
  - **`getServerSideProps`**:
    - Reads `context.query.user` (e.g. `"alice"`).
    - Fetches `http://localhost:3000/api/get-token?user=<user_id>`.
    - Returns `{ props: { token: data.token } }`.
  - **Home component**:
    - Reads `token` from props and `user` from `router.query.user`.
    - Renders `<GetStream token={token} user={user} />`.

So the **page** is just: “get a token for the user in the URL, then show the Stream chat UI.”

---

### Server-side Stream client (the “backend” for Stream)

- **`library/get-stream.tsx`**  
  Creates the **server** Stream client:

  - Reads `NEXT_PUBLIC_GETSTREAM_KEY` and `GETSTREAM_SECRET` from env.
  - Uses `StreamChat.getInstance(api_key, api_secret)` and returns that instance.

  This client is used only on the server (API routes, `getServerSideProps` if you ever called it from there). It can create users, create tokens, create channels, etc. The **secret** must stay on the server.

---

### API routes (your backend)

All under `src/pages/api/`. Next.js exposes them as `/api/<filename>`.

| Route | File | Purpose |
|-------|------|--------|
| **GET** `/api/get-token?user=<id>` | `get-token.ts` | Upsert user `<id>` in Stream, create a token for them, return `{ token }`. Used by the home page before rendering chat. |
| **POST** `/api/create-channel` | `create-channel.ts` | Create a Stream channel. Body can specify: |
| | | - `channelKind: "LIVESTREAM"` → livestream channel (needs `channelId`, `name`, `createdBy`, etc.). |
| | | - `channelKind: "DIRECT_MESSAGE"` → DM channel (needs `members[]`, `createdBy`). |
| **GET** `/api/create-livestream-channel?name=...` | `create-livestream-channel.ts` | Creates a livestream channel with id `"test-livestream-channel"` and the given `name`. |
| **GET** `/api/commitMessage?messageId=...` | `commitMessage.ts` | Calls Stream’s `commitMessage(messageId)` (e.g. to confirm a message was handled). |
| **POST** `/api/webhook` | `webhook.ts` | Stream can send webhooks to this URL (message events, etc.). Validates signature, parses body, returns 200. Most logic is commented out; it’s the hook for you to add “on new message” / “on message deleted” logic. |
| **POST** `/api/PassOnPendingMessage` | `PassOnPendingMessage.ts` | Webhook-style endpoint: validates webhook, returns “Message passed on”. Used when Stream sends “pending message passed” events. |
| **POST** `/api/DeletedPendingMessage` | `DeletedPendingMessage.ts` | Webhook-style endpoint: validates webhook, returns “Message deleted”. Used when Stream sends “pending message deleted” events. |

So:

- **`get-token`** = “log this user into Stream and give the frontend a token.”
- **`create-channel` / `create-livestream-channel`** = “create chat channels (DMs or livestream) from the backend.”
- **`commitMessage`** = “tell Stream a message is committed.”
- **`webhook` + PassOn / Deleted** = “receive and validate Stream webhooks; placeholders for your logic.”

---

### Frontend chat UI

- **`components/chat/GetStream.tsx`**  
  The only real “screen” for chat:

  1. Builds `userData = { id, name, image }` from the `user` prop (id = name = `user`, image = getstream random avatar).
  2. Uses **`useCreateChatClient`** from `stream-chat-react` with:
     - `apiKey`: `NEXT_PUBLIC_GETSTREAM_KEY`
     - `tokenOrProvider`: the `token` from the page
     - `userData`
  3. Until the client and token are ready, it shows: “Setting up client & connection...”.
  4. When ready, it renders Stream’s UI:
     - **`<Chat client={client}>`** — provider for the rest.
     - **`<ChannelList filters={messagingFilter} ... />`** — lists “messaging” channels where this user is a member.
     - **`<Channel>`** — wraps the active channel.
     - **`<Window>`** — layout for header + list + input.
     - **`<ChannelHeader />`, `<MessageList />`, `<MessageInput />`** — Stream’s built-in components.
     - **`<Thread />** — for thread replies.

  So the **whole chat experience** (channels, messages, typing, threads) comes from `stream-chat-react`; this file only wires token + user and chooses filters (e.g. “messaging” channels this user is in).

---

### Webhooks and verification

- **`utils/get-raw-body.ts`**  
  Reads the raw request body (needed so the webhook signature is computed on the exact bytes Stream sent).

- **`utils/validate-webhook.ts`**  
  Uses the **server** Stream client’s `verifyWebhook(rawBody, signature)` and the `x-signature` header to ensure the request really came from Stream. Used by `webhook.ts`, `PassOnPendingMessage.ts`, and `DeletedPendingMessage.ts`.

- **`next.config.ts`**  
  `allowedDevOrigins: ["*.ngrok-free.app"]` is for when you expose the dev server (e.g. via ngrok) so Stream can reach your webhook URL.

---

## 4. Data Flow Summary

```
User opens:   http://localhost:3000?user=alice

1. Next.js runs getServerSideProps for "/"
2. getServerSideProps calls GET /api/get-token?user=alice
3. get-token uses library/get-stream (server client) to:
   - upsertUser({ id: "alice" })
   - createToken("alice")
   - return { token }
4. Page receives props: { token }
5. Home renders <GetStream token={token} user="alice" />
6. GetStream passes token + user to useCreateChatClient
7. Stream Chat SDK connects to Stream; Stream UI (ChannelList, MessageList, MessageInput, etc.) renders
```

Creating a channel (e.g. from a backend or admin tool):

```
POST /api/create-channel
Body: { channelKind: "DIRECT_MESSAGE", members: ["alice","bob"], createdBy: "alice" }
→ Server uses getGetStreamInstance().channel("messaging", { members, ... }).create()
→ Stream creates the channel; "alice" and "bob" see it in their ChannelList when they load the app with ?user=alice or ?user=bob
```

Stream sending you events:

```
Stream → POST https://your-domain/api/webhook (or PassOnPendingMessage / DeletedPendingMessage)
Your handler validates x-signature with validateWebhook(req), then does whatever you add (logging, DB, etc.)
```

---

## 5. Environment Variables You Need

- **`NEXT_PUBLIC_GETSTREAM_KEY`**  
  Stream Chat API key (public; used by the browser to talk to Stream).

- **`GETSTREAM_SECRET`**  
  Stream secret (server-only). Used in `library/get-stream.tsx` and in webhook verification. Never expose it to the client.

Set these in `.env.local` (or your deployment env). Without them, token creation and webhook verification break.

---

## 6. What You’re Supposed to Get When It Works

1. **Open**  
   `http://localhost:3000?user=alice` (or whatever port the dev server uses, e.g. 3001 if 3000 is busy).

2. **You should see**  
   Either “Setting up client & connection...” briefly, then the Stream Chat UI:  
   - Left: list of channels (messaging channels containing “alice”).  
   - Right: active channel with header, message list, and input.  
   - Ability to open threads, etc.

3. **To see a conversation**  
   - Create a channel, e.g.  
     `POST /api/create-channel` with  
     `{ channelKind: "DIRECT_MESSAGE", members: ["alice", "bob"], createdBy: "alice" }`.  
   - Then open `?user=alice` and `?user=bob` in two tabs/browsers; each will see that channel and can send messages.

So in one sentence: **this repo is a Next.js app that uses Stream Chat to add real-time messaging to your product, with token-based “login” driven by `?user=<id>` and your `/api/get-token` endpoint.**
