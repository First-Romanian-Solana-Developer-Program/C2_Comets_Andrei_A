import "dotenv/config";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";


const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(`user account loaded ${user.publicKey.toBase58()}`);

const tokenMint = new PublicKey("4uiMW4txxDgrXukKGVQuzSnMatYJKxAgMFZEr9RkhRqW");
const destPubKey = new PublicKey("C6patyc3iSkqdV8GX8CgNJoMVbzcePPhkvcmdNaJWRdC");

const destTokenAccount = await getOrCreateAssociatedTokenAccount(connection, user, tokenMint, destPubKey);
console.log(`Token Account created : ${destTokenAccount.address}`);
