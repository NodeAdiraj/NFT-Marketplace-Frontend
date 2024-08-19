import { ConnectButton } from "web3uikit";
import Link from "next/link";
export default function Navigation() {
  return (
    <nav className="bg-[#2A3439] text-[#E5E4E2] p-3 flex justify-between items-center shadow-md transition-all duration-300 h-12">
      <div className="flex items-center space-x-6 ml-4">
        <h1 className="text-lg font-bold text-[#E5E4E2]">CryptoCanvas</h1>{" "}
        {/* Marketplace name */}
        <div className="flex space-x-6">
          <Link
            href="/"
            className="relative text-[#E5E4E2] text-sm font-medium before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-[#d0d0d0] before:transform before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100"
          >
            HOME
          </Link>
          <Link
            href="/sell-nft"
            className="relative text-[#E5E4E2] text-sm font-medium before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-[#d0d0d0] before:transform before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100"
          >
            SELL NFT
          </Link>
        </div>
      </div>
      <ConnectButton />
    </nav>
  );
}
