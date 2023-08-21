import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";

const hash_key = "pleasedonotlookatstringsincodethanks"

//config interface | type
export interface config {
    webhook_url : string,
    rpc_endpoint : string,
    wallet : string,
    slippage : number,
    license: string,
}


//fetching from config
export function show_config(){

    var config_txt = fs.readFileSync('config.json','utf8');
    var config_obj:config = JSON.parse(config_txt);

    var pubkey:string;
    try{
        const secretkey = bs58.decode(config_obj.wallet);
        const ownerKeypair = Keypair.fromSecretKey(secretkey);
        var pubkey = ownerKeypair.publicKey.toBase58();
    }catch(e){
        pubkey = config_obj.wallet
    }

    console.log(`\tWallet Address: ${pubkey}`)
    console.log(`\tRPC URL: ${config_obj.rpc_endpoint}`)
    console.log(`\tWebhook URL: ${config_obj.webhook_url}`)
    console.log(`\tSlippage: ${config_obj.slippage}%`)

} 


//updating config 
//returns 0 for success and 1 for failure


export async function update_rpc(rpc:string){
    try{
        const connection = new Connection(rpc);
        const balance = await connection.getBalance(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'))
        if (balance){
            
            //reading config file
            var config_txt = fs.readFileSync('config.json','utf8');
            var config_obj:config = JSON.parse(config_txt);
        
            //updating config
            config_obj.rpc_endpoint = rpc;
        
            //writing new config
            const new_config = JSON.stringify(config_obj);
            fs.writeFileSync('config.json',new_config)
            return 0
        }else{
            return 1
        }
    }catch(e){
        return 1
    }
}

export function update_slippage(slip:string){
    try{
        const parsedSlippage = parseInt(slip);
        if (isNaN(parsedSlippage)){
            return 1
        } else if(parsedSlippage > 100 || parsedSlippage < 0){
            return 1
        } else{

        //reading config file
        var config_txt = fs.readFileSync('config.json','utf8');
        var config_obj:config = JSON.parse(config_txt);
    
        //updating config
        config_obj.slippage = parsedSlippage;
    
        //writing new config
        const new_config = JSON.stringify(config_obj);
        fs.writeFileSync('config.json',new_config);
        return 0

        }
    }catch(e){
        return 1
    }
}


export function update_wallet(wallet:string){
    var config_txt = fs.readFileSync('config.json','utf8');
    var config_obj:config = JSON.parse(config_txt);
    try{
        
        const secretkey = bs58.decode(wallet);
        const ownerKeypair = Keypair.fromSecretKey(secretkey);

        //updating config
        config_obj.wallet = wallet;
        //writing new config
        const new_config = JSON.stringify(config_obj);
        fs.writeFileSync('config.json',new_config);
        return 0;
        
    }catch(e){
        return 1
    }
}