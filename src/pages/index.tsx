import GetStream from "@/components/chat/GetStream";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

export default function Home({ token }: { token: string }) {
  const router = useRouter();

  const user = router.query.user as string;

  return <GetStream token={token} user={user} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  const user_id = query.user as string;

  const data = await fetch(
    `http://localhost:3000/api/get-token?user=${user_id}`
  ).then((res) => res.json());

  return {
    props: {
      token: data.token,
    },
  };
}
