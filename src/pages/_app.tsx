import type { AppProps } from "next/app";
import "../../globals.css";
import "../../style.scss";
import "../../package-template/livestream-chat/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
