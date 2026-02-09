/**
 * Test page: uses Chat from package-template (same code that will go to web-packages).
 * Visit /livestream-package-test?user=alice to test before publishing the package.
 */
import { Chat } from "../../package-template/livestream-chat/src";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

const LIVESTREAM_CHANNEL_ID = "test-livestream-channel";

export default function LivestreamPackageTestPage({ token }: { token: string }) {
  const router = useRouter();
  const user = router.query.user as string;

  if (!user) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        Add <code>?user=alice</code> to the URL (e.g. /livestream-package-test?user=alice)
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GETSTREAM_KEY;
  if (!apiKey) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif", color: "red" }}>
        NEXT_PUBLIC_GETSTREAM_KEY is not set.
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: `url(https://images.prismic.io/contrary-research/Zmvczpm069VX1vdB_StockXcover-1-.png?auto=format,compress) `, minWidth: "100%" }}>
      <Chat
      className="livestream-chat-wrapper"
        mode="livestream"
        apiKey={apiKey}
        token={token}
        user={{ id: user, name: user }}
        channelId={LIVESTREAM_CHANNEL_ID}
        channelType="livestream"
      />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user_id = (context.query.user as string) || "alice";
  const data = await fetch(
    `http://localhost:3000/api/get-token?user=${user_id}`
  ).then((res) => res.json());

  return {
    props: {
      token: data.token ?? "",
    },
  };
}
