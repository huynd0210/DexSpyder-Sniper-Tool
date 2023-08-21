"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_wallet = exports.update_slippage = exports.update_rpc = exports.show_config = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = __importDefault(require("fs"));
const hash_key = "pleasedonotlookatstringsincodethanks";
//fetching from config
function show_config() {
    var config_txt = fs_1.default.readFileSync('config.json', 'utf8');
    var config_obj = JSON.parse(config_txt);
    var pubkey;
    try {
        const secretkey = bs58_1.default.decode(config_obj.wallet);
        const ownerKeypair = web3_js_1.Keypair.fromSecretKey(secretkey);
        var pubkey = ownerKeypair.publicKey.toBase58();
    }
    catch (e) {
        pubkey = config_obj.wallet;
    }
    console.log(`\tWallet Address: ${pubkey}`);
    console.log(`\tRPC URL: ${config_obj.rpc_endpoint}`);
    console.log(`\tWebhook URL: ${config_obj.webhook_url}`);
    console.log(`\tSlippage: ${config_obj.slippage}%`);
}
exports.show_config = show_config;
//updating config 
//returns 0 for success and 1 for failure
function update_rpc(rpc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = new web3_js_1.Connection(rpc);
            const balance = yield connection.getBalance(new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'));
            if (balance) {
                //reading config file
                var config_txt = fs_1.default.readFileSync('config.json', 'utf8');
                var config_obj = JSON.parse(config_txt);
                //updating config
                config_obj.rpc_endpoint = rpc;
                //writing new config
                const new_config = JSON.stringify(config_obj);
                fs_1.default.writeFileSync('config.json', new_config);
                return 0;
            }
            else {
                return 1;
            }
        }
        catch (e) {
            return 1;
        }
    });
}
exports.update_rpc = update_rpc;
function update_slippage(slip) {
    try {
        const parsedSlippage = parseInt(slip);
        if (isNaN(parsedSlippage)) {
            return 1;
        }
        else if (parsedSlippage > 100 || parsedSlippage < 0) {
            return 1;
        }
        else {
            //reading config file
            var config_txt = fs_1.default.readFileSync('config.json', 'utf8');
            var config_obj = JSON.parse(config_txt);
            //updating config
            config_obj.slippage = parsedSlippage;
            //writing new config
            const new_config = JSON.stringify(config_obj);
            fs_1.default.writeFileSync('config.json', new_config);
            return 0;
        }
    }
    catch (e) {
        return 1;
    }
}
exports.update_slippage = update_slippage;
function update_wallet(wallet) {
    var config_txt = fs_1.default.readFileSync('config.json', 'utf8');
    var config_obj = JSON.parse(config_txt);
    try {
        const secretkey = bs58_1.default.decode(wallet);
        const ownerKeypair = web3_js_1.Keypair.fromSecretKey(secretkey);
        //updating config
        config_obj.wallet = wallet;
        //writing new config
        const new_config = JSON.stringify(config_obj);
        fs_1.default.writeFileSync('config.json', new_config);
        return 0;
    }
    catch (e) {
        return 1;
    }
}
exports.update_wallet = update_wallet;
