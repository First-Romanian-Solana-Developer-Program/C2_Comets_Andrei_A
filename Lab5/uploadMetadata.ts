import { Metaplex , toMetaPlexFile } from '@metaplex-foundation/js';
import fs from 'fs';

export async function uploadMetadata(
    metaplex: Metaplex,
    data: any
) {
    const buffer = await fs.readFileSync("./src/", data.imgPath);

    const 



}