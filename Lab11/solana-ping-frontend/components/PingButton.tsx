import { FC } from "react";
import styles from "../styles/PingButton.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

export const PingButton: FC = () => {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = async () => {
    if (!connection || !publicKey) {
      console.error("Wallet unavailable!");
      return;
    }

    const pingProgramId = new PublicKey( "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa");
    const pingProgramDataAccount = new PublicKey( "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod");

    const tx = new Transaction();
    const ix = new TransactionInstruction({
      keys: [ {pubkey: pingProgramDataAccount, isSigner: false, isWritable: true}], programId: pingProgramId
    });

    tx.add(ix);

    const sig = await sendTransaction(tx, connection);

    console.log("Succesfully sent tx with sig: ", sig)
  };

  return (
    <div className={styles.buttonContainer} onClick={onClick}>
      <button className={styles.button}>Ping!</button>
    </div>
  );
};
