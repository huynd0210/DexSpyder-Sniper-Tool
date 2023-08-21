import { Liquidity, Percent, Token, TokenAccount, TokenAmount } from "@raydium-io/raydium-sdk";
import {Connection,Keypair,Transaction,} from "@solana/web3.js";
import { sendTx } from "./send_transaction";

  
export async function swap(connection: Connection, poolKeys: any, ownerKeypair: Keypair, tokenAccounts: TokenAccount[],is_snipe:boolean,amountIn:any,minAmountOut:any){
  
    const owner = ownerKeypair.publicKey
    
    const inst = await Liquidity.makeSwapInstructionSimple({
      connection:connection,
      poolKeys:poolKeys,
      userKeys:{
          tokenAccounts,
          owner,
      },
      amountIn,
      amountOut:minAmountOut,
      fixedSide:'in',
      config:{}
    })


    //@ts-ignore
    //const instructions = inst.innerTransactions[0].instructions[0];
    //console.log(inst.innerTransactions);
    //console.log(inst.innerTransactions[0]);
    //console.log(inst.innerTransactions[0].signers)

    const tx = new Transaction()
    const signers:Keypair[] = [ownerKeypair]

    inst.innerTransactions[0].instructions.forEach(e=>{
      tx.add(e);
    })

    inst.innerTransactions[0].signers.forEach(e=>{
      signers.push(e);
    })

    
    const res:number = await sendTx(connection, tx, signers);
    return res;

}
    
  