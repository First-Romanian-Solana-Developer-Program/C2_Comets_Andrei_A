import "dotenv/config";
import { Connection, PublicKey, SIGNATURE_LENGTH_IN_BYTES, clusterApiUrl } from '@solana/web3.js';
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const AMOUNT = 5;
const DECIMALS = 6;

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(`user account loaded ${user.publicKey.toBase58()}`);

const sourceTokenAccount = new PublicKey("AkVdFX8fjYoEdbdnBbCTmaR71fQMDQNs1xgybfA8GoGv")
const tokenMint = new PublicKey("4uiMW4txxDgrXukKGVQuzSnMatYJKxAgMFZEr9RkhRqW");
const destPubKey = new PublicKey("C6patyc3iSkqdV8GX8CgNJoMVbzcePPhkvcmdNaJWRdC");

const destTokenAccount = await getOrCreateAssociatedTokenAccount(connection, user, tokenMint, destPubKey);
console.log("Token account created : ", destTokenAccount.address.toBase58());

const sig = await transfer(connection, user, sourceTokenAccount, destTokenAccount.address, user, AMOUNT * 10 ** DECIMALS);
console.log("Token transferred :", sig);

const link = getExplorerLink("tx", sig, "devnet");
console.log( "Token minted :", link);

// Token minted : https://explorer.solana.com/tx/4uDsMFxYw994GQj96aUG9CVnFCXsDFd55o22AmVWGLbxrpYn5gR2AGXevLvN8hXkyDwtUkeBqb4x3sdPptHf89Ye?cluster=devnet