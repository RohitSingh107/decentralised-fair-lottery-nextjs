import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { BigNumber, ethers, ContractTransaction } from "ethers"
import { useNotification } from "@web3uikit/core"

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
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification()

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
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

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  })
  async function updateUI() {
    const entranceFeeFromCall = (
      (await getEnranceFee()) as BigNumber
    ).toString()

    const recentWinnerFromCall = (await getRecentWinner()) as string
    const numPlayersFromCall = (
      (await getNumberOfPlayers()) as BigNumber
    ).toString()

    setEntranceFee(entranceFeeFromCall)
    setRecentWinner(recentWinnerFromCall)
    setNumPlayers(numPlayersFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleSucess = async (tx: ContractTransaction) => {
    await tx.wait(1)
    handleNewNotification()
    updateUI()
  }
  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      // icon: "bell",
    })
  }

  return (
    <div className="p-5">
      Hi from lottery entrance{" "}
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover: bg-blue 700 text-white font-bold py-2 px-4 round"
            onClick={async () => {
              await enterRaffle({
                onSuccess: (tx) => handleSucess(tx as ContractTransaction),
                onError: (error) => console.log(error),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>

          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
          </div>

          <div>Number of Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div> No Raffle Address Detected </div>
      )}
    </div>
  )
}
