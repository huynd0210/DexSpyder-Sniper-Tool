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
exports.sendTx = void 0;
//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//sending a transaction
function sendTx(connection, transaction, signers) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash_info = (yield connection.getLatestBlockhashAndContext()).value;
        transaction.recentBlockhash = hash_info.blockhash;
        transaction.lastValidBlockHeight = hash_info.lastValidBlockHeight;
        transaction.feePayer = signers[0].publicKey;
        transaction.sign(...signers);
        const rawTransaction = transaction.serialize();
        var txid;
        try {
            txid = yield connection.sendRawTransaction(rawTransaction, { skipPreflight: true, });
        }
        catch (e) {
            return 1;
        }
        while (true) {
            const ret = yield connection.getSignatureStatus(txid, { searchTransactionHistory: true });
            try {
                //@ts-ignore
                if (ret) {
                    if (ret.value && ret.value.err == null) {
                        return 0;
                    }
                    else if (ret.value && ret.value.err != null) {
                        return 1;
                    }
                    else {
                        continue;
                    }
                }
            }
            catch (e) {
                return 1;
            }
        }
    });
}
exports.sendTx = sendTx;
