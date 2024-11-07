export async function createNft(
    metaplex: Metaplex,
    uri: string,
    nftData: any,
) {
    const nft = await metaplex.nfts().createNft({
        uri: uri,
        name: nftData.name,
        sellerFeeBasisPoints: 500,
        symbol: nftData.symbol,
    }, {commitment: "finalized"});

    console.log(`NFT Created : ${nft.address.toBase58()}`);


    return nft;
}