import { Connection } from '@solana/web3.js';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { irysStorage, isirysStorageDriver, keypairIdentity, Metaplex } from '@metaplex-foundation/js';


console.log("Connection done");

const nftData = {

    name: "SDP NFT",
    symbol: "SDP",
    description: "This is one cool NFT",
    imgPath: "./solana.png",
}

async function main() {
    const connection = new Connection("https://api.devnet.solana.com");

    const keypair = getKeypairFromEnvironment("SECRET_KEY");

    console.log(`Keypair Loaded : ${keypair.publicKey.toBase58()}`);

    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(keypair))
        .use(irysStorage({
            address: "https://devnet.bnundlr.network",
            providerUrl: "https://devnet.solana.com",
            timeout: 60000,
        }))

    console.log("Metaplex loaded");

    const uri = 
}