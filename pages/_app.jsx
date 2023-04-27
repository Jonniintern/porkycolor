import Head from "next/head";
import Link from "next/link";
import React, { Fragment } from "react";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "../contexts/WalletContext";
import "../styles/index.css";
import MusicPlayer from "../components/MusicPlayer";

const App = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/myIcon.ico" type="image/x-icon" />

        <title>Porky Island</title>
      </Head>

      <Toaster />

      <header>
        <MusicPlayer />
        <img src="/images/EDN_logo.png" height={250} />
      </header>

      <main style={{ minHeight: "70vh" }}>
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </main>

      <footer>
        <p>
          Questions? -{" "}
          <Link
            href="https://discord.gg/9dgKAQn83a"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "unset" }}
          >
            Discord
          </Link>
        </p>
        <p>&copy; Porky Island {new Date().getFullYear()}</p>
      </footer>
    </Fragment>
  );
};

export default App;
