import { Keypair } from "@solana/web3.js";
import { config } from "./config";
import bs58 from "bs58";
import fs from "fs"

//function to fetch the owners keypair object from config
//returns Keypair instance if valid or undefined if not 
export function get_wallet(config_path:string):Keypair|undefined{

    var config_txt = fs.readFileSync(config_path,'utf8');
    var config_obj:config = JSON.parse(config_txt);
    try{
        
        const secretkey = bs58.decode(config_obj.wallet);
        const ownerKeypair = Keypair.fromSecretKey(secretkey);
        
        return ownerKeypair
    }catch{

    }
    
}