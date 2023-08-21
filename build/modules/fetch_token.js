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
exports.get_token_amount = void 0;
const web3_js_1 = require("@solana/web3.js");
const fs_1 = __importDefault(require("fs"));
const bs58_1 = __importDefault(require("bs58"));
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
function get_token_amount(poolId, buying) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //fetching pool data
            var config_txt = fs_1.default.readFileSync('config.json', 'utf8');
            var config_obj = JSON.parse(config_txt);
            const rpc_url = config_obj.rpc_endpoint;
            const version = 4;
            const connection = new web3_js_1.Connection(rpc_url);
            const account = yield connection.getAccountInfo(new web3_js_1.PublicKey(poolId));
            const { state: LiquidityStateLayout } = raydium_sdk_1.Liquidity.getLayouts(version);
            //@ts-ignore
            const fields = LiquidityStateLayout.decode(account === null || account === void 0 ? void 0 : account.data);
            const { status, baseMint, quoteMint, lpMint, openOrders, targetOrders, baseVault, quoteVault, marketId, baseDecimal, quoteDecimal, } = fields;
            var is_valid = false;
            [quoteMint, baseMint, lpMint].forEach((e) => {
                if (e.toBase58() != '11111111111111111111111111111111') {
                    is_valid = true;
                }
            });
            if (!is_valid) {
                return -1;
            }
            //fetching token data
            const secretkey = bs58_1.default.decode(config_obj.wallet);
            const ownerKeypair = web3_js_1.Keypair.fromSecretKey(secretkey);
            const owner_address = ownerKeypair.publicKey;
            const tokenAddress = buying ? quoteMint : baseMint;
            //console.log(tokenAddress.toBase58());
            const bal = yield connection.getBalance(new web3_js_1.PublicKey(owner_address.toBase58()));
            if (bal < 0.01) {
                return -2;
            }
            if (tokenAddress.toBase58() == 'So11111111111111111111111111111111111111112') {
                return (bal / 1000000000) - 0.0099;
            }
            else {
                const tokenAccounts = yield connection.getParsedTokenAccountsByOwner(owner_address, { programId: new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') });
                for (var cand in tokenAccounts.value) {
                    if (tokenAccounts.value[cand].account.data.parsed.info.mint === tokenAddress.toBase58()) {
                        const tokenAccount = tokenAccounts.value[cand];
                        const tokenBalance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
                        return tokenBalance;
                    }
                }
                return 0;
            }
        }
        catch (e) {
            return -1;
        }
    });
}
exports.get_token_amount = get_token_amount;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield get_token_amount('AZqjt9vYMGZMuNfzSmFjMFgcMHnkBPndpTn1uprKLrq2', false);
        console.log(res);
    });
}
//test();
