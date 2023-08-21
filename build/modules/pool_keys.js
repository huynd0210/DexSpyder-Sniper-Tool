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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPoolKeys = void 0;
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const web3_js_1 = require("@solana/web3.js");
//returns the pool keys (info and required params/program id's)
//neccessary to interact with the liquidity pool program and compute live prices and estimates.
function fetchPoolKeys(connection, poolId, version = 4) {
    return __awaiter(this, void 0, void 0, function* () {
        const serumVersion = 10;
        const marketVersion = 3;
        const programId = new web3_js_1.PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
        const serumProgramId = new web3_js_1.PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX');
        const account = yield connection.getAccountInfo(poolId);
        const { state: LiquidityStateLayout } = raydium_sdk_1.Liquidity.getLayouts(version);
        //@ts-ignore
        const fields = LiquidityStateLayout.decode(account === null || account === void 0 ? void 0 : account.data);
        const { status, baseMint, quoteMint, lpMint, openOrders, targetOrders, baseVault, quoteVault, marketId, baseDecimal, quoteDecimal, } = fields;
        let withdrawQueue, lpVault;
        if (raydium_sdk_1.Liquidity.isV4(fields)) {
            withdrawQueue = fields.withdrawQueue;
            lpVault = fields.lpVault;
        }
        else {
            withdrawQueue = web3_js_1.PublicKey.default;
            lpVault = web3_js_1.PublicKey.default;
        }
        // uninitialized
        // if (status.isZero()) {
        //   return ;
        // }
        const associatedPoolKeys = raydium_sdk_1.Liquidity.getAssociatedPoolKeys({
            version: version,
            marketVersion,
            marketId,
            baseMint: baseMint,
            quoteMint: quoteMint,
            baseDecimals: baseDecimal.toNumber(),
            quoteDecimals: quoteDecimal.toNumber(),
            programId,
            marketProgramId: serumProgramId,
        });
        const poolKeys = {
            id: poolId,
            baseMint,
            quoteMint,
            lpMint,
            version,
            programId,
            authority: associatedPoolKeys.authority,
            openOrders,
            targetOrders,
            baseVault,
            quoteVault,
            withdrawQueue,
            lpVault,
            marketVersion: serumVersion,
            marketProgramId: serumProgramId,
            marketId,
            marketAuthority: associatedPoolKeys.marketAuthority,
        };
        const marketInfo = yield connection.getAccountInfo(marketId);
        const { state: MARKET_STATE_LAYOUT } = raydium_sdk_1.Market.getLayouts(marketVersion);
        //@ts-ignore
        const market = MARKET_STATE_LAYOUT.decode(marketInfo.data);
        const { baseVault: marketBaseVault, quoteVault: marketQuoteVault, bids: marketBids, asks: marketAsks, eventQueue: marketEventQueue, } = market;
        // const poolKeys: LiquidityPoolKeys;
        return Object.assign(Object.assign({}, poolKeys), {
            marketBaseVault,
            marketQuoteVault,
            marketBids,
            marketAsks,
            marketEventQueue,
        });
    });
}
exports.fetchPoolKeys = fetchPoolKeys;
