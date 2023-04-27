import { Fragment } from "react";
import useWallet from "../contexts/WalletContext";

const ConnectWallet = () => {
  const {
    availableWallets,
    connectWallet,
    connecting,
    connected,
    connectedName,
    populatedWallet,
  } = useWallet();

  return (
    <div>
      {connected ? (
        <p style={{ textAlign: "center" }}>
          You&apos;ve succesfully connected with {connectedName}:<br />
          <span>{populatedWallet?.stakeKey}</span>
        </p>
      ) : (
        <Fragment>
          {availableWallets.length == 0 ? (
            <p style={{ textAlign: "center" }}>No wallets installed...</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {availableWallets.map((wallet, idx) => (
                <button
                  key={`connect-wallet-${wallet.name}`}
                  onClick={() => connectWallet(wallet.name)}
                  disabled={connecting || connected}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    width={35}
                    height={35}
                  />
                  {wallet.name}
                </button>
              ))}

              <p>
                <u>Disclaimer</u>: Connecting your wallet does not require a
                password. It&apos;s a read-only process.
              </p>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ConnectWallet;
