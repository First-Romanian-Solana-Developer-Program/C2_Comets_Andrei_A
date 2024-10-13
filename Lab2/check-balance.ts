import "dotenv/config";
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { airdropIfRequired } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"),"confirmed");
console.log("Connected to devnet", connection.rpcEndpoint);

const pubkey = new PublicKey("EbbTRFUhCZ2YpfbEW9LnbqZdEoVHLk1UzvYUTBbq1mgJ");

const balanceInLamports = await connection.getBalance(pubkey);
console.log("Done! pubkey's balance in lamports:", balanceInLamports);

console.log("Airdropping 1 SOL to pubkey...");

await airdropIfRequired(
    connection,
    pubkey,
    2 * LAMPORTS_PER_SOL,
    1 * LAMPORTS_PER_SOL
);
// await connection.requestAirdrop(pubkey, 2 * LAMPORTS_PER_SOL)

console.log("Done! Airdropped 1 Sol to pubkey")

console.log("Done! pubkey's balance in lamports:", balanceInLamports);