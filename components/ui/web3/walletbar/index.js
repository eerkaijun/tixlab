import { useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button } from "@components/ui/common";

export default function WalletBar() {
  const { requireInstall } = useWeb3();
  const { account, network } = useWalletInfo();

  return (
    <section className="text-white bg-indigo-600 rounded-lg">
      <div className="p-8">
        <h1 className="text-base xs:text-xl break-words">
          Account {account.data}
        </h1>
        <div className="flex justify-between items-center">
          <div>
            {network.hasInitialResponse && !network.isSupported && (
              <div className="bg-red-400 p-4 rounded-lg">
                <div>Connected to wrong network</div>
                <div>
                  Connect to: {` `}
                  <strong className="text-2xl">{network.target}</strong>
                </div>
              </div>
            )}
            {requireInstall && (
              <div className="bg-yellow-500 p-4 rounded-lg">
                Cannot connect to network. Please install Metamask.
              </div>
            )}
            {network.data && (
              <div>
                <span>is connected to the </span>
                <strong className="text-2xl">{network.data}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
