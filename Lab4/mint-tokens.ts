import { mintTo } from '@solana/spl-token';
import "dotenv/config";
import { getKeypairFromEnvironment , getExplorerLink } from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';



const AMOUNT = 9;
const DECIMALS = 6;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(`user account loaded ${user.publicKey.toBase58()}`);

const tokenMint = new PublicKey("4uiMW4txxDgrXukKGVQuzSnMatYJKxAgMFZEr9RkhRqW");
const destTokenAccount = new PublicKey("9dm4BpHrHmAJX88vrpXF2Q1R7jmo9oLPvRgqm9aD8iLZ");


const sig = await mintTo(connection, user, tokenMint, destTokenAccount, user, AMOUNT * 10 ** DECIMALS);

const link = getExplorerLink("tx", sig, "devnet");
console.log(`Minted ${AMOUNT} tokens ${link}`);
