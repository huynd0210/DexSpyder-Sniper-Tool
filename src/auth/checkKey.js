const KeyAuth = require('./KeyAuth');
const readline = require("readline");
const moment = require("moment");
const CRL = readline.createInterface({ input: process.stdin, output: process.stdout });

const KeyAuthApp = new KeyAuth(
    "DexSpyder",
    "8d7VumkIWc",
    "86342a655b33a96164cf9899837d05e20b8e568bacbd414c3a3839c21dab7eab", // Application Secret
    "1.0"
);


(async () => {
    await KeyAuthApp.Initialize();
    await KeyAuthApp.check();
    await KeyAuthApp.sleep(1200);
    var license = "";

    await CRL.question("License : ", async (lic) => {
        license = lic;
        await KeyAuthApp.license(license);
        if (KeyAuthApp.response.status == "failed") {
            console.log(KeyAuthApp.response.message);
            process.exit(0);
        }
        console.log(KeyAuthApp.response.message);
        await CRL.question("Press any key to continue...", async () => {
            console.clear();
        });
    });
})();