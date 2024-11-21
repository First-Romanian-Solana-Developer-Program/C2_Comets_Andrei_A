/* eslint-disable react-hooks/rules-of-hooks */
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function SendSolanaForm() {

    const [amount, setAmount] = useState(0);
    const [destination, setDestination] = useState('');

    const { connection } = useConnection();
    const { publicKey, signTransaction, sendTransaction } = useWallet();



    function handleChangeAmount(event) {
        setAmount(event.target.value)
    }

    function handleChangeDestination(event) {
        setDestination(event.target.value)
    }

    async function handleSubmit(event) {

        event.preventDefault()

        if (!connection || !publicKey) {
            console.error("Wallet unavailable!");
            return;
        }


        const tx = new Transaction()

        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(destination),
            lamports: amount * LAMPORTS_PER_SOL
        })

        tx.add(instruction)

        const latest = await connection.getLatestBlockhash();
        tx.recentBlockhash = latest.blockhash
        tx.feePayer = publicKey

        const signedTx = await signTransaction(tx)

        const signature = await sendTransaction(signedTx, connection);

        console.log(amount, ' sol sent to ', destination, ":", signature)
    }

    return (<form onSubmit={handleSubmit}>
        <label>
            Amount:
            <input type="text" onChange={handleChangeAmount} />
        </label>

        <label>
            Destination:
            <input type="text" onChange={handleChangeDestination} />
        </label>

        <input type="submit" value="Submit" />
    </form>)
}