import { createContext, useState, useContext, useMemo, useEffect } from "react";
import axios from "axios";
import { BrowserWallet } from "@meshsdk/core";
import { PORKY_POLICY_ID, BLOCKFROST_KEY } from "../constants";
import formatIpfsUrl from "../functions/formatIpfsUrl";

const WalletContext = createContext({
  availableWallets: [],
  connectWallet: async (_walletName) => {},
  disconnectWallet: () => {},
  connecting: false,
  connected: false,
  connectedName: "",
  wallet: null,
  populatedWallet: null,
});

export default function useWallet() {
  return useContext(WalletContext);
}

export const WalletProvider = ({ children }) => {
  const [availableWallets, setAvailableWallets] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [populatedWallet, setPopulatedWallet] = useState(null);

  useEffect(() => {
    setAvailableWallets(BrowserWallet.getInstalledWallets());
  }, []);

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectedName, setConnectedName] = useState("");

  const connectWallet = async (_walletName) => {
    setConnecting(true);

    try {
      const _wallet = await BrowserWallet.enable(_walletName);

      if (_wallet) {
        const stakeKeys = await _wallet.getRewardAddresses();
        const walletAddress = await _wallet.getChangeAddress();

        const balances = await _wallet.getBalance();
        const filteredBalances = balances.filter(
          (obj) => obj.unit.indexOf(PORKY_POLICY_ID) === 0
        );

        const populatedAssets = [];
        const doNotIncludeKeys = [
          "description",
          "image",
          "mediaType",
          "name",
          "dna",
        ];

        for await (const { unit: assetId } of filteredBalances) {
          const { data } = await axios.get(
            `https://cardano-mainnet.blockfrost.io/api/v0/assets/${assetId}`,
            {
              headers: {
                project_id: BLOCKFROST_KEY,
              },
            }
          );

          const traits = {};

          Object.entries(data.onchain_metadata).forEach(([key, val]) => {
            if (!doNotIncludeKeys.includes(key)) {
              traits[key] = val;
            }
          });

          populatedAssets.push({
            assetId,
            assetName: data.onchain_metadata.name,
            assetImage: formatIpfsUrl(
              Array.isArray(data.onchain_metadata.image)
                ? data.onchain_metadata.image.join("")
                : data.onchain_metadata.image
            ),
            traits,
          });
        }

        setPopulatedWallet({
          stakeKey: stakeKeys[0],
          walletAddress,
          assets: {
            [PORKY_POLICY_ID]: populatedAssets,
          },
        });

        setWallet(_wallet);
        setConnectedName(_walletName);
        setConnected(true);
      }
    } catch (error) {
      console.error(error);
    }

    setConnecting(false);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setPopulatedWallet(null);
    setConnected(false);
    setConnectedName("");
    window.localStorage.removeItem("connected-wallet");
  };

  useEffect(() => {
    if (connected && populatedWallet) {
      const payload = {
        walletProvider: connectedName,
        stakeKey: populatedWallet.stakeKey,
      };

      window.localStorage.setItem("connected-wallet", JSON.stringify(payload));
    }
  }, [connected]);

  useEffect(() => {
    if (!connected) {
      const storageItem = window.localStorage.getItem("connected-wallet");

      if (storageItem) {
        const connectedWallet = JSON.parse(storageItem);

        connectWallet(connectedWallet.walletProvider);
      }
    }
  }, []);

  const payload = useMemo(
    () => ({
      availableWallets,
      connectWallet,
      disconnectWallet,
      connecting,
      connected,
      connectedName,
      wallet,
      populatedWallet,
    }),
    [
      availableWallets,
      connecting,
      connected,
      connectedName,
      wallet,
      populatedWallet,
    ]
  );

  return (
    <WalletContext.Provider value={payload}>{children}</WalletContext.Provider>
  );
};
