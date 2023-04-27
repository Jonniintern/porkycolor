import { useRouter } from "next/router";
import Link from "next/link";
import { PORKY_POLICY_ID } from "../constants";
import useWallet from "../contexts/WalletContext";

const SelectPorky = () => {
  const { disconnectWallet, populatedWallet } = useWallet();
  const router = useRouter();

  return (
    <div className="nftSelector">
      <button
        style={{ margin: "0 auto", backgroundColor: "#444444" }}
        onClick={disconnectWallet}
      >
        Disconnect Wallet
      </button>

      {populatedWallet.assets[PORKY_POLICY_ID].length ? (
        <h1>Select</h1>
      ) : (
        <Link
          href="https://www.jpg.store/collection/porkyisland"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: "1rem",
            color: "unset",
            fontSize: "1.2rem",
            display: "block",
          }}
        >
          yu niid tu bai porky from d jeypeg
        </Link>
      )}

      {populatedWallet.assets[PORKY_POLICY_ID].length ? (
        <div className="nftSelectorContainer">
          {populatedWallet.assets[PORKY_POLICY_ID].map(
            ({ assetId, assetName, assetImage }) => (
              <button
                className="porkyChoice"
                key={`porky_${assetId}`}
                onClick={() => router.push(`/${assetName.split("#")[1]}`)}
              >
                <img
                  src={assetImage}
                  alt={assetName}
                  width={150}
                  height={150}
                />
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SelectPorky;
