import { Connection,Keypair,PublicKey } from "@solana/web3.js";
import fs from "fs";
import {config} from "./config"; 
import bs58 from "bs58";
import { Liquidity} from "@raydium-io/raydium-sdk";


export async function get_token_amount(poolId:string, buying:boolean){

    try{
        
        //fetching pool data
        var config_txt = fs.readFileSync('config.json','utf8');
        var config_obj:config = JSON.parse(config_txt);

        const rpc_url = config_obj.rpc_endpoint;


        const version :  4 | 5 = 4


        const connection = new Connection(rpc_url); 

        const account = await connection.getAccountInfo(new PublicKey(poolId));
        const { state: LiquidityStateLayout }  = Liquidity.getLayouts(version)
      
        //@ts-ignore
        const fields = LiquidityStateLayout.decode(account?.data);

        const { status, baseMint, quoteMint, lpMint, openOrders, targetOrders, baseVault, quoteVault, marketId, baseDecimal, quoteDecimal, } = fields;
        
        var is_valid:boolean = false;

        [quoteMint,baseMint,lpMint].forEach((e)=>{
            if (e.toBase58() != '11111111111111111111111111111111'){
                is_valid = true;
            }
        })
        if (!is_valid){return -1}
        
        //fetching token data
        const secretkey = bs58.decode(config_obj.wallet);
        const ownerKeypair = Keypair.fromSecretKey(secretkey);

        const owner_address = ownerKeypair.publicKey;

        
        const tokenAddress = buying?quoteMint:baseMint

        //console.log(tokenAddress.toBase58());

        const bal = await connection.getBalance(new PublicKey(owner_address.toBase58()));

        if (bal < 0.01){
            return -2
        }
        
        if (tokenAddress.toBase58() == 'So11111111111111111111111111111111111111112'){
            return (bal / 1000000000) - 0.0099 
        }else{

            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner_address, { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')});
        
            for (var cand in tokenAccounts.value){
                if (tokenAccounts.value[cand].account.data.parsed.info.mint === tokenAddress.toBase58()){
                    const tokenAccount = tokenAccounts.value[cand];
                    const tokenBalance:number = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
                    return tokenBalance
                }
            }
            return 0

        }

    }catch(e){
        return -1
    }

}


async function test(){
    const res = await get_token_amount('AZqjt9vYMGZMuNfzSmFjMFgcMHnkBPndpTn1uprKLrq2',false);
    console.log(res);
}

//test();
