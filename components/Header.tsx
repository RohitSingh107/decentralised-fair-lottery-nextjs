import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex-row">
      <h1 className="py-4 bx-4 font-blog text-3xl">
        Decentralized Fair Lottery
      </h1>
      <div className="ml-auto py-2 px-4"></div>
      <ConnectButton moralisAuth={false} />
    </div>
  )
}
