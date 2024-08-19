import { useEffect, useState } from "react";
import exampleAbi from "@/constants/Example";
import nftMarketplaceAbi from "@/constants/NftMarketplace";
import { useWeb3Contract } from "react-moralis";
import { Card } from "web3uikit";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import Listingmodal from "@/components/Listingmodal";

const handleBuyItemSuccess = () => {
  dispatch({
    type: "success",
    message: "Item bought!",
    title: "Item Bought",
    position: "topR",
  });
};

export default function NFTBox({
  price,
  nftAddress,
  marketplaceAddress,
  tokenId,
  seller,
}) {
  const [modelview, setmodelview] = useState("");
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: exampleAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: { index: tokenId.toString() },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });

  async function updateUI() {
    try {
      const tokenURI = await getTokenURI();
      if (tokenURI) {
        const URL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const tokenURIResponse = await (await fetch(URL)).json();
        const imageURI = tokenURIResponse.image;
        const imageURIURL = imageURI.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
        setImageURI(imageURIURL);
        setTokenName(tokenURIResponse.name);
        setTokenDescription(tokenURIResponse.description);
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account, tokenId]);

  const isOwnedByUser = seller === account;
  function handleCardClick() {
    isOwnedByUser
      ? setmodelview(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuyItemSuccess(),
        });
  }

  const hideModal = () => setmodelview(false);

  return (
    <div className="p-4">
      <Listingmodal
        isVisible={modelview}
        tokenId={tokenId}
        marketplaceAddress={marketplaceAddress}
        nftAddress={nftAddress}
        onClose={hideModal}
      />
      <Card
        title={tokenName}
        description={tokenDescription}
        onClick={handleCardClick}
        className=" "
      >
        <div className="p-10">
          {imageURI && (
            <img
              src={imageURI}
              alt={tokenName}
              className="w-full h-full object-cover mb-4"
            />
          )}
          <div className="flex flex-col items-end gap-100">
            <div className="text-lg font-bold">#{tokenId}</div>
            <div className="italic text-sm">Owned by {seller || "Unknown"}</div>
            <div className="font-bold text-xl">
              {ethers.utils.formatUnits(price, "ether")} ETH
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
