import { createMint } from '@solana/spl-token';
import "dotenv/config";
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { getKeypairFromEnvironment , getExplorerLink } from "@solana-developers/helpers";


const DECIMALS = 6;

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(`user account loaded ${user.publicKey.toBase58()}`);

const tokenMint = await createMint(connection, user, user.publicKey, null, DECIMALS);

const link = getExplorerLink("address", tokenMint.toBase58(), "devnet");
console.log(`Link is : ${link}`);