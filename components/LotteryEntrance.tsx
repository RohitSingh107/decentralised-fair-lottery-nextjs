import { useWeb3Contract } from "react-moralis"

import { abi, contractAddresses } from "../constants"

import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

import { BigNumber, ethers } from "ethers"

interface contractAddressesInterface {
  [key: string]: string[]
}

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex!).toString()
  // const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
  const raffleAddress =
    chainId in contractAddresses
      ? (contractAddresses as contractAddressesInterface)[chainId][0]
      : null

  // let entranceFee = ""
  const [entranceFee, setEntranceFee] = useState("0")

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEnranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getEnranceFee",
    params: {},
  })

  async function updateUI() {
    const entranceFeeFromCall = (
      (await getEnranceFee()) as BigNumber
    ).toString()
    setEntranceFee(entranceFeeFromCall)
    // setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, "ether"))

    console.log(entranceFee)
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      Hi from lottery entrance{" "}
      {raffleAddress ? (
        <div>
          <button
            onClick={async () => {
              await enterRaffle()
            }}
          >
            Enter Raffle
          </button>
          Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
        </div>
      ) : (
        <div> No Raffle Address Detected </div>
      )}
    </div>
  )
}
