var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const KeyAuth = require('./KeyAuth');
const readline = require("readline");
const moment = require("moment");
const CRL = readline.createInterface({ input: process.stdin, output: process.stdout });
const KeyAuthApp = new KeyAuth("DexSpyder", "8d7VumkIWc", "86342a655b33a96164cf9899837d05e20b8e568bacbd414c3a3839c21dab7eab", // Application Secret
"1.0");
(() => __awaiter(this, void 0, void 0, function* () {
    yield KeyAuthApp.Initialize();
    yield KeyAuthApp.check();
    yield KeyAuthApp.sleep(1200);
    var license = "";
    yield CRL.question("License : ", (lic) => __awaiter(this, void 0, void 0, function* () {
        license = lic;
        yield KeyAuthApp.license(license);
        if (KeyAuthApp.response.status == "failed") {
            console.log(KeyAuthApp.response.message);
            process.exit(0);
        }
        console.log(KeyAuthApp.response.message);
        yield CRL.question("Press any key to continue...", () => __awaiter(this, void 0, void 0, function* () {
            console.clear();
        }));
    }));
}))();
