import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Escrow } from "../target/types/escrow";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import { randomBytes } from "crypto";
import { assert } from "chai";

import { confirmTransaction, makeKeypairs } from "@solana-developers/helpers";

const TOKEN_PROGRAM: typeof TOKEN_2022_PROGRAM_ID | typeof TOKEN_PROGRAM_ID =
  TOKEN_2022_PROGRAM_ID;

export const getRandomBigNumber = (size: number = 8) => {
  return new BN(randomBytes(size));
};

describe("escrow", async () => {
  console.log("starting tests");
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.getProvider();

  const connection = provider.connection;

  const program = anchor.workspace.Escrow as Program<Escrow>;

  const accounts: Record<string, PublicKey> = {
    tokenProgram: TOKEN_PROGRAM,
  };

  const [alice, bob, tokenMintA, tokenMintB] = makeKeypairs(4);

  before(
    "Creates Alice and Bob accounts, 2 token mints, and associated token accounts for both tokens for both users",
    async () => {
      console.log("starting before");
      const [
        aliceTokenAccountA,
        aliceTokenAccountB,
        bobTokenAccountA,
        bobTokenAccountB,
      ] = [alice, bob]
        .map((keypair) =>
          [tokenMintA, tokenMintB].map((mint) =>
            getAssociatedTokenAddressSync(
              mint.publicKey,
              keypair.publicKey,
              false,
              TOKEN_PROGRAM
            )
          )
        )
        .flat();

      let minimumLamports = await getMinimumBalanceForRentExemptMint(
        connection
      );

      const sendSolInstructions: Array<TransactionInstruction> = [
        alice,
        bob,
      ].map((account) =>
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: account.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      );

      const createMintInstructions: Array<TransactionInstruction> = [
        tokenMintA,
        tokenMintB,
      ].map((mint) =>
        SystemProgram.createAccount({
          fromPubkey: provider.publicKey,
          newAccountPubkey: mint.publicKey,
          lamports: minimumLamports,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM,
        })
      );

      const mintTokensInstructions: Array<TransactionInstruction> = [
        {
          mint: tokenMintA.publicKey,
          authority: alice.publicKey,
          ata: aliceTokenAccountA,
        },
        {
          mint: tokenMintB.publicKey,
          authority: bob.publicKey,
          ata: bobTokenAccountB,
        },
      ].flatMap((mintDetails) => [
        createInitializeMint2Instruction(
          mintDetails.mint,
          6,
          mintDetails.authority,
          null,
          TOKEN_PROGRAM
        ),
        createAssociatedTokenAccountIdempotentInstruction(
          provider.publicKey,
          mintDetails.ata,
          mintDetails.authority,
          mintDetails.mint,
          TOKEN_PROGRAM
        ),
        createMintToInstruction(
          mintDetails.mint,
          mintDetails.ata,
          mintDetails.authority,
          1_000_000_000,
          [],
          TOKEN_PROGRAM
        ),
      ]);

      let tx = new Transaction();
      tx.instructions = [
        ...sendSolInstructions,
        ...createMintInstructions,
        ...mintTokensInstructions,
      ];

      const transactionSignature = await provider.sendAndConfirm(tx, [
        tokenMintA,
        tokenMintB,
        alice,
        bob,
      ]);

      accounts.maker = alice.publicKey;
      accounts.taker = bob.publicKey;
      accounts.tokenMintA = tokenMintA.publicKey;
      accounts.makerTokenAccountA = aliceTokenAccountA;
      accounts.takerTokenAccountA = bobTokenAccountA;
      accounts.tokenMintB = tokenMintB.publicKey;
      accounts.makerTokenAccountB = aliceTokenAccountB;
      accounts.takerTokenAccountB = bobTokenAccountB;
    }
  );

  const tokenAOfferedAmount = new BN(1_000_000);
  const tokenBWantedAmount = new BN(1_000_000);

  const make = async () => {
    console.log("entering make");
    const offerId = getRandomBigNumber();

    const offer = PublicKey.findProgramAddressSync(
      [
        Buffer.from("offer"),
        accounts.maker.toBuffer(),
        offerId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    )[0];

    const vault = getAssociatedTokenAddressSync(
      accounts.tokenMintA,
      offer,
      true,
      TOKEN_PROGRAM
    );

    accounts.offer = offer;
    accounts.vault = vault;

    const transactionSignature = await program.methods
      .makeOffer(offerId, tokenAOfferedAmount, tokenBWantedAmount)
      .accounts({ ...accounts })
      .signers([alice])
      .rpc();

    await confirmTransaction(connection, transactionSignature);

    const vaultBalanceResponse = await connection.getTokenAccountBalance(vault);
    const vaultBalance = new BN(vaultBalanceResponse.value.amount);
    assert(vaultBalance.eq(tokenAOfferedAmount));

    const offerAccount = await program.account.offer.fetch(offer);

    assert(offerAccount.maker.equals(alice.publicKey));
    assert(offerAccount.tokenMintA.equals(accounts.tokenMintA));
    assert(offerAccount.tokenMintB.equals(accounts.tokenMintB));
    assert(offerAccount.tokenBWantedAmount.eq(tokenBWantedAmount));
  };

  const take = async () => {
    console.log("entering take");
    const transactionSignature = await program.methods
      .takeOffer()
      .accounts({ ...accounts })
      .signers([bob])
      .rpc();

    await confirmTransaction(connection, transactionSignature);

    const bobTokenAccountBalanceAfterResponse =
      await connection.getTokenAccountBalance(accounts.takerTokenAccountA);
    const bobTokenAccountBalanceAfter = new BN(
      bobTokenAccountBalanceAfterResponse.value.amount
    );
    assert(bobTokenAccountBalanceAfter.eq(tokenAOfferedAmount));

    const aliceTokenAccountBalanceAfterResponse =
      await connection.getTokenAccountBalance(accounts.makerTokenAccountB);
    const aliceTokenAccountBalanceAfter = new BN(
      aliceTokenAccountBalanceAfterResponse.value.amount
    );
    assert(aliceTokenAccountBalanceAfter.eq(tokenBWantedAmount));
  };

  it("Puts the tokens Alice offers into the vault when Alice makes an offer", async () => {
    await make();
  });

  it("Puts the tokens from the vault into Bob's account, and gives Alice Bob's tokens, when Bob takes an offer", async () => {
    await take();
  });
});