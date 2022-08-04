import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
    </div>
  )
}
