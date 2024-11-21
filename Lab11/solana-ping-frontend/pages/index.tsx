import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { AppBar } from "../components/AppBar";
import Head from "next/head";
import { PingButton } from "../components/PingButton";
import WalletContextProvider from "../components/WalletContextProvider";
import { useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sign } from "crypto";
import { SendSolanaForm } from "../components/SendSolana";

const Home: NextPage = (props) => {

  return (
    <div className={styles.App}>
      <Head>
        <title>Wallet-Adapter Example</title>
        <meta name="description" content="Wallet-Adapter Example" />
      </Head>

      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <SendSolanaForm />
        </div>
      </WalletContextProvider>
    </div>
  );
};

export default Home;

