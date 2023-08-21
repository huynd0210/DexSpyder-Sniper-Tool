
import {Connection, Signer, Transaction} from "@solana/web3.js";



//sleep function
function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//sending a transaction
export async function sendTx(connection: Connection, transaction: Transaction, signers: Array<Signer>){
  
    const hash_info = (await connection.getLatestBlockhashAndContext()).value;
    
    transaction.recentBlockhash = hash_info.blockhash
    transaction.lastValidBlockHeight = hash_info.lastValidBlockHeight
    transaction.feePayer = signers[0].publicKey
  
  
    transaction.sign(...signers);
    const rawTransaction = transaction.serialize();
  
  
    var txid:string;
    try{
      txid = await connection.sendRawTransaction(rawTransaction,{skipPreflight: true,})
    }
    catch(e){
      return 1
    }

    while (true){
      const ret = await connection.getSignatureStatus(txid, {searchTransactionHistory:true})
      try {
        //@ts-ignore
        if (ret){
          if (ret.value && ret.value.err == null){
            return 0
          } else if (ret.value && ret.value.err != null){
            return 1
          }else{
            continue
          }
        }
      } catch(e){
        return 1
      }

    }

  }