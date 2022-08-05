import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
//
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Decentralized Fair Lottery</title>
        <meta
          name="description"
          content="It is a dapp to participate in decentralized fair lottery"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntrance />
    </div>
  )
}

export default Home
