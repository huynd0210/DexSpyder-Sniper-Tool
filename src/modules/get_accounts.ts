import { SPL_ACCOUNT_LAYOUT, TOKEN_PROGRAM_ID, TokenAccount } from "@raydium-io/raydium-sdk";
import { Connection, PublicKey } from "@solana/web3.js";

//fetching token accounts
export async function getTokenAccountsByOwner(
    connection: Connection,
    owner: PublicKey,
  ) {
    const tokenResp = await connection.getTokenAccountsByOwner(
      owner,
      {
        programId: TOKEN_PROGRAM_ID
      },
    );
  
    const accounts: TokenAccount[] = [];
  
    for (const { pubkey, account } of tokenResp.value) {
      accounts.push({
        pubkey,
        accountInfo:SPL_ACCOUNT_LAYOUT.decode(account.data)
      });
    }
  
    return accounts;
  }