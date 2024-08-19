import Head from "next/head";
import { Form, useNotification, Button } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import nftAbi from "@/constants/Example";
import nftMarketplaceAbi from "@/constants/NftMarketplace";
import { useEffect, useState } from "react";
import backgroundImage from "@/images/background.png"; // Import the image

export default function Home() {
  const { chainId, account, isWeb3Enabled } = useMoralis();
  const nftAddress = "0x95bb49556ea259495AC32aA06e03c45a50E21Eef";
  const marketplaceAddress = "0x021344a6d1d1cD9D5776a7D8A38607E0563E87E6";
  const dispatch = useNotification();
  const [proceeds, setProceeds] = useState("0");

  const { runContractFunction } = useWeb3Contract();

  async function approveAndList(data) {
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
      onError: (error) => {
        console.log(error);
      },
    });
  }

  async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
    await tx.wait();
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (error) => console.log(error),
    });
  }

  async function handleListSuccess() {
    dispatch({
      type: "success",
      message: "NFT listing successful",
      title: "NFT Listed",
      position: "topR",
    });
  }

  const handleWithdrawSuccess = () => {
    dispatch({
      type: "success",
      message: "Proceeds withdrawn successfully",
      title: "Withdrawal Successful",
      position: "topR",
    });
  };

  async function setupUI() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    });
    if (returnedProceeds) {
      setProceeds(ethers.utils.formatEther(returnedProceeds));
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      setupUI();
    }
  }, [proceeds, account, isWeb3Enabled, chainId]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage.src})`, // Use the imported image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="Sell and manage your NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute top-1/4 w-full flex justify-center">
        <div className>
          <div className="w-full flex justify-center mb-2">
            {" "}
            {/* Reduced margin bottom */}
            <h1 className="text-xl font-bold text-center">Sell Your NFT</h1>
          </div>
          <Form
            onSubmit={approveAndList}
            data={[
              {
                name: "NFT Address",
                type: "text",
                inputWidth: "100%",
                value: "",
                key: "nftAddress",
                validation: { required: true },
              },
              {
                name: "Token ID",
                type: "number",
                value: "",
                key: "tokenId",
                validation: { required: true },
              },
              {
                name: "Price (in ETH)",
                type: "number",
                value: "",
                key: "price",
                validation: { required: true },
              },
            ]}
            title="Sell Your NFT!"
            id="Main Form"
            className="mb-4"
            customStyles={{ form: "space-y-4" }} // Adjust spacing between fields
          />

          <div className="flex justify-between items-center mb-2">
            {" "}
            {/* Reduced margin bottom */}
            <span className="text-lg font-semibold">Withdraw Proceeds</span>
            {proceeds !== "0" ? (
              <Button
                onClick={() => {
                  runContractFunction({
                    params: {
                      abi: nftMarketplaceAbi,
                      contractAddress: marketplaceAddress,
                      functionName: "withdrawProceeds",
                      params: {},
                    },
                    onError: (error) => console.log(error),
                    onSuccess: handleWithdrawSuccess,
                  });
                }}
                text="Withdraw"
                type="button"
                className="py-2 px-4 text-white bg-black-500 hover:bg-blue-600 rounded-md"
              />
            ) : (
              <span>No proceeds detected</span>
            )}
          </div>
          {proceeds !== "0" && (
            <div className="text-lg font-medium text-center">
              Current Proceeds: {proceeds} ETH
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
