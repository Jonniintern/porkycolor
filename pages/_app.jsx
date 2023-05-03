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
      <div className="body">
        <header>
          <img src="/images/EDN_logo.png" height={200} />
        </header>
        <MusicPlayer />

        <main style={{ minHeight: "50vh" }}>
          <WalletProvider>
            <Component {...pageProps} />
          </WalletProvider>
        </main>

        <Link
          href="https://porkyisland.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "unset" }}
        >
          <img className="piLink" src="./images/PI_logo_com.png" alt="" />
        </Link>
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
        </footer>
        <p>&copy; Porky Island {new Date().getFullYear()}</p>
      </div>
    </Fragment>
  );
};

export default App;
