"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_wallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = __importDefault(require("fs"));
//function to fetch the owners keypair object from config
//returns Keypair instance if valid or undefined if not 
function get_wallet(config_path) {
    var config_txt = fs_1.default.readFileSync(config_path, 'utf8');
    var config_obj = JSON.parse(config_txt);
    try {
        const secretkey = bs58_1.default.decode(config_obj.wallet);
        const ownerKeypair = web3_js_1.Keypair.fromSecretKey(secretkey);
        return ownerKeypair;
    }
    catch (_a) {
    }
}
exports.get_wallet = get_wallet;
