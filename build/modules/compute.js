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
exports.compute = void 0;
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
//computes live estimates of the swap and returns details for transaction building or display on UI.
//returns a list containing trade details (fees,price impact,expected amount out etc..)
function compute(connection, poolKeys, curr_in, curr_out, amount_in, slip) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const poolInfo = yield raydium_sdk_1.Liquidity.fetchInfo({ connection, poolKeys });
            //setting up decimals
            var in_decimal;
            var out_decimal;
            if (curr_in.toBase58() === poolKeys.baseMint.toBase58()) {
                in_decimal = poolInfo.baseDecimals;
                out_decimal = poolInfo.quoteDecimals;
            }
            else {
                out_decimal = poolInfo.baseDecimals;
                in_decimal = poolInfo.quoteDecimals;
            }
            //priming and computing
            const amountIn = new raydium_sdk_1.TokenAmount(new raydium_sdk_1.Token(curr_in, in_decimal), amount_in, false);
            const currencyOut = new raydium_sdk_1.Token(curr_out, out_decimal);
            const slippage = new raydium_sdk_1.Percent(slip, 100);
            const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee, } = raydium_sdk_1.Liquidity.computeAmountOut({ poolKeys, poolInfo, amountIn, currencyOut, slippage });
            return [
                amountOut,
                minAmountOut,
                currentPrice,
                executionPrice,
                priceImpact,
                fee,
                amountIn,
            ];
        }
        catch (e) {
            console.log(e);
            return 1;
        }
    });
}
exports.compute = compute;
