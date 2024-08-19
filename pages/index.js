import Image from "next/image";
import { Inter } from "next/font/google";
import { GET_ACTIVE_ITEMS } from "@/constants/subgraphquries";
import { useQuery } from "@apollo/client";
import NFTBox from "@/components/NFTBox";
import { useMoralis } from "react-moralis";
import backgroundImage from "@/images/backgroundimage.jpg"; // Import the image

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!listedNfts || !listedNfts.activeItems) return <div>No NFTs listed</div>;

  return (
    <div className="min-h-screen flex flex-col items-center p-10 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="z-[-1]" // Ensure background is behind other content
        />
      </div>

      <div className="relative w-full max-w-5xl mx-auto bg-opacity-70 bg-gray-800 p-8 rounded-lg">
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          NFT Marketplace
        </h1>
        <div className="flex overflow-x-auto space-x-8 py-4">
          {isWeb3Enabled ? (
            listedNfts.activeItems.map((nft) => {
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress="0x021344a6d1d1cD9D5776a7D8A38607E0563E87E6"
                  seller={seller}
                  key={`${nftAddress}-${tokenId}`}
                />
              );
            })
          ) : (
            <div className="text-white">Please Connect Your Wallet</div>
          )}
        </div>
      </div>
    </div>
  );
}
