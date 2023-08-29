import { raydiumAmmProgram } from "../src";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { CustomWallet } from "./utils/wallet";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import keypairFile from "./keypair.json";

(async () => {
  const wallet = Keypair.fromSecretKey(
    Uint8Array.from(keypairFile.slice(0, 64))
  );
  const connection = new Connection("https://api.devnet.solana.com");
  const provider = new AnchorProvider(
    connection,
    new CustomWallet(wallet),
    AnchorProvider.defaultOptions()
  );
  const ammProgram = raydiumAmmProgram({
    provider: provider,
    programId: new PublicKey("AMMjRTfWhP73x9fM6jdoXRfgFJXR97NFRkV8fYJUrnLE"),
  });

  // Query mainnet pool info from rpc https://api.raydium.io/v2/sdk/liquidity/mainnet.json.
  // The pool information below is on devnet.
  const accounts = {
    id: "HPL5LFbtpTh9weuXN5qYxoz5trz2uw9E9WeW6Xu3hSVd",
    baseMint: "8qcbzW9R6AQjbB9au4DQsUyAgBVxaTERctf5VK1fhZG9",
    quoteMint: "9riEQbfLX5hSDBkAbv4jFKYAHq83qSmfmptHnCGM3Ewr",
    lpMint: "HVeyxt2K3fBBgjZjVJzyhE6Vr3SCQhVqfnaNDQ6ccmhV",
    programId: "AMMjRTfWhP73x9fM6jdoXRfgFJXR97NFRkV8fYJUrnLE",
    authority: "C94dgABc4T1AisH4QDTrd7xkHK2VTuy8CUQXUsMGULCM",
    openOrders: "7mMgN9quWxcmdNimirmdrYfasKthm1mvknLdHc3xwqaJ",
    targetOrders: "BcHLBRrA4218YKZB3zA2HLCiesJNp33VaYcQZqhpWou9",
    baseVault: "BQviZQciaoaCHwwCS7VteFWqFj5mU7oo5ZAvJEd6nbK1",
    quoteVault: "5bUrLohrJQEm3cNjh2DfuNneJVdSfgv9vEFPqMXyQ7s5",
    withdrawQueue: "364yesUy8h2STJVBtjooC8zgx9QMZhfYfnfEibobcycJ",
    lpVault: "EumtSiiRvEyDsoXeH63G2vNgzYKZf1V5Yuhp44CgRiQP",
    marketProgramId: "EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj",
    marketId: "5jjKoPK1C6weRxiCbvNEo34AhfE4ScqndNGSUhq136fo",
    marketAuthority: "HPQU5JAc1faWA21KUkTbTWc2pLKZtzUnJ9gL4Qp3rXcF",
    marketBaseVault: "J6C5vymW8DAoqZW83k5yiTtpDpkt1tePqY158xZWgUmT",
    marketQuoteVault: "5VFWwwdgjnF5SgH5VpwLi9UjRtY3HPN2Z88Mid24sPtG",
    marketBids: "FcMgHYt5sYWD52sWC6z67F9ujXgs3ct4jJR8tJe3Af1",
    marketAsks: "GBaskvipw6aSjQCe8Si4rL2e5KgdzECH333LYeMypbb1",
    marketEventQueue: "HBkfqZEPJ9kSoS39Kqmwydx8K9MUfTp7AwLMGkuZKJUb",
  };

  const coinMint = new PublicKey(accounts.baseMint);
  const pcMint = new PublicKey(accounts.quoteMint);
  const uerSourceTokenAccount = getAssociatedTokenAddressSync(
    coinMint,
    wallet.publicKey
  );
  const uerDestinationTokenAccount = getAssociatedTokenAddressSync(
    pcMint,
    wallet.publicKey
  );
  const tx = await ammProgram.methods
    .swapBaseIn(new BN(10000), new BN(0))
    .accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      amm: new PublicKey(accounts.id),
      ammAuthority: new PublicKey(accounts.authority),
      ammOpenOrders: new PublicKey(accounts.openOrders),
      ammTargetOrders: new PublicKey(accounts.targetOrders),
      poolCoinTokenAccount: new PublicKey(accounts.baseVault),
      poolPcTokenAccount: new PublicKey(accounts.quoteVault),
      serumProgram: new PublicKey(accounts.marketProgramId),
      serumMarket: new PublicKey(accounts.marketId),
      serumBids: new PublicKey(accounts.marketBids),
      serumAsks: new PublicKey(accounts.marketAsks),
      serumEventQueue: new PublicKey(accounts.marketEventQueue),
      serumCoinVaultAccount: new PublicKey(accounts.marketBaseVault),
      serumPcVaultAccount: new PublicKey(accounts.marketQuoteVault),
      serumVaultSigner: new PublicKey(accounts.marketAuthority),
      uerSourceTokenAccount: uerSourceTokenAccount,
      uerDestinationTokenAccount: uerDestinationTokenAccount,
      userSourceOwner: wallet.publicKey,
    })
    .rpc({ skipPreflight: true });

  console.log("swapBaseIn tx:", tx);

  const tx2 = await ammProgram.methods
    .swapBaseOut(new BN(10000), new BN(10))
    .accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      amm: new PublicKey(accounts.id),
      ammAuthority: new PublicKey(accounts.authority),
      ammOpenOrders: new PublicKey(accounts.openOrders),
      ammTargetOrders: new PublicKey(accounts.targetOrders),
      poolCoinTokenAccount: new PublicKey(accounts.baseVault),
      poolPcTokenAccount: new PublicKey(accounts.quoteVault),
      serumProgram: new PublicKey(accounts.marketProgramId),
      serumMarket: new PublicKey(accounts.marketId),
      serumBids: new PublicKey(accounts.marketBids),
      serumAsks: new PublicKey(accounts.marketAsks),
      serumEventQueue: new PublicKey(accounts.marketEventQueue),
      serumCoinVaultAccount: new PublicKey(accounts.marketBaseVault),
      serumPcVaultAccount: new PublicKey(accounts.marketQuoteVault),
      serumVaultSigner: new PublicKey(accounts.marketAuthority),
      uerSourceTokenAccount: uerSourceTokenAccount,
      uerDestinationTokenAccount: uerDestinationTokenAccount,
      userSourceOwner: wallet.publicKey,
    })
    .rpc({ skipPreflight: true });

  console.log("swapBaseOut tx:", tx2);
})();
