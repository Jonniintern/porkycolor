import useWallet from "../contexts/WalletContext";
import ConnectWallet from "../components/ConnectWallet";
import SelectPorky from "../components/SelectPorky";

function Page() {
  const { connecting, connected } = useWallet();

  if (connecting) {
    return (
      <div>
        <p style={{ textAlign: "center" }}>Connecting...</p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div>
      <SelectPorky />
    </div>
  );
}

export default Page;
