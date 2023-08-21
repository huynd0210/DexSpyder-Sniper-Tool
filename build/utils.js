"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aff_settings_menu = exports.aff_sniper_menu = exports.aff_main_menu = exports.aff_guide = exports.aff_sell_option = exports.aff_snipe_option = exports.aff_title = exports.aff_logo = void 0;
const chalk_1 = __importDefault(require("chalk"));
const logo = `
\t                                                                                
\t                                                                                
\t                                   (            &                               
\t                                  %               %                             
\t                               & %                 &                            
\t                              &&/      &****&       &                           
\t                              % %     (*****./     .(                           
\t                              %      ./ ((((((,(   *(                           
\t                              % %   %///(           (                           
\t          &&&.*//////**//     % *   .,/ ./     *   / /,,/((#          /         
\t          *             (//*.. & /    */(   .#  ,.*/((                          
\t                             ***  ,    /&(   / *((                              
\t                              ,  .,*,./, .,*,/%#//(#    #*#                     
\t                           */*#    &*,  /( &/  .(            *                  
\t                       ./        * /%      (&, (#/                              
\t                    (        (,(      /      /(    %,/#                         
\t                           ,/%                         /,/                      
\t                           (                             .(                     
\t                         ((                               ,                     
\t                                                          ,                     
\t                         (                                /                     
\t                                                                                
`;
const title = `
\t▓█████▄ ▓█████ ▒██   ██▒  ██████  ██▓███ ▓██   ██▓▓█████▄ ▓█████  ██▀███  
\t▒██▀ ██▌▓█   ▀ ▒▒ █ █ ▒░▒██    ▒ ▓██░  ██▒▒██  ██▒▒██▀ ██▌▓█   ▀ ▓██ ▒ ██▒
\t░██   █▌▒███   ░░  █   ░░ ▓██▄   ▓██░ ██▓▒ ▒██ ██░░██   █▌▒███   ▓██ ░▄█ ▒
\t░▓█▄   ▌▒▓█  ▄  ░ █ █ ▒   ▒   ██▒▒██▄█▓▒ ▒ ░ ▐██▓░░▓█▄   ▌▒▓█  ▄ ▒██▀▀█▄  
\t░▒████▓ ░▒████▒▒██▒ ▒██▒▒██████▒▒▒██▒ ░  ░ ░ ██▒▓░░▒████▓ ░▒████▒░██▓ ▒██▒
\t ▒▒▓  ▒ ░░ ▒░ ░▒▒ ░ ░▓ ░▒ ▒▓▒ ▒ ░▒▓▒░ ░  ░  ██▒▒▒  ▒▒▓  ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░
\t ░ ▒  ▒  ░ ░  ░░░   ░▒ ░░ ░▒  ░ ░░▒ ░     ▓██ ░▒░  ░ ▒  ▒  ░ ░  ░  ░▒ ░ ▒░
\t ░ ░  ░    ░    ░    ░  ░  ░  ░  ░░       ▒ ▒ ░░   ░ ░  ░    ░     ░░   ░ 
\t   ░       ░  ░ ░    ░        ░           ░ ░        ░       ░  ░   ░     
\t ░                                        ░ ░      ░                      


`;
function aff_logo() {
    for (let i = 0; i < logo.length; i++) {
        if (logo[i] == '@') {
            process.stdout.write(chalk_1.default.black(logo[i]));
        }
        else {
            process.stdout.write(chalk_1.default.magenta(logo[i]));
        }
    }
}
exports.aff_logo = aff_logo;
function aff_title() {
    for (let i = 0; i < title.length; i++) {
        if (title[i] == '▓') {
            process.stdout.write(chalk_1.default.black(title[i]));
        }
        else {
            process.stdout.write(chalk_1.default.magenta(title[i]));
        }
    }
}
exports.aff_title = aff_title;
function aff_snipe_option() {
    console.log(chalk_1.default.cyanBright('\tDisclaimer: \t- the tool will start sniping if all inputs are valid!'));
    console.log(chalk_1.default.cyanBright('\t            \t- double check the amount and pool details in the monitor'));
    console.log(chalk_1.default.cyanBright('\t            \t  to avoid miss-inputs and big price impact'));
}
exports.aff_snipe_option = aff_snipe_option;
function aff_sell_option() {
    console.log(chalk_1.default.cyanBright('\tDisclaimer: \t- the tool will sell supplied balance if all inputs are valid!'));
    console.log(chalk_1.default.cyanBright('\t            \t- double check the held balance and pool details in the monitor'));
    console.log(chalk_1.default.cyanBright('\t            \t  to avoid miss-inputs and big price impact'));
}
exports.aff_sell_option = aff_sell_option;
function aff_guide() {
    console.log(chalk_1.default.white('\tUSAGE: '));
    console.log(chalk_1.default.white('\n'));
    console.log(chalk_1.default.white('\tsniper option       \t - requires AMM pool ID and amount of token in as input'));
    console.log(chalk_1.default.white('\t                    \t - Amount in should be the Quote of the pair (from on-chain monitor)'));
    console.log(chalk_1.default.white('\t                    \t - make sure to have the supplied amount of token in or the transaction will not go through'));
    console.log(chalk_1.default.white('\n'));
    console.log(chalk_1.default.white('\texit position option\t - requires AMM pool ID and amount of token out as input'));
    console.log(chalk_1.default.white('\t                    \t - Amount in should be the Base of the pair (from on-chain monitor)'));
    console.log(chalk_1.default.white('\t                    \t - make sure to have the supplied amount of token out or the transactions will not got through'));
    console.log(chalk_1.default.white('\n'));
    console.log(chalk_1.default.white('\tdefault slippage    \t - 10%'));
    console.log(chalk_1.default.white('\tsuggested slippage  \t - between 10% and 30%'));
    console.log(chalk_1.default.white("\tRPCs                \t - Custom RPC's are highly suggested for fast transaction commitment speed"));
    console.log(chalk_1.default.white('\n'));
}
exports.aff_guide = aff_guide;
function aff_main_menu() {
    console.log(chalk_1.default.white('\t[1] - Sniper Mode'));
    console.log(chalk_1.default.white('\t[2] - Settings'));
    console.log(chalk_1.default.white('\t[3] - Exit'));
    console.log("\n");
}
exports.aff_main_menu = aff_main_menu;
function aff_sniper_menu() {
    console.log(chalk_1.default.blueBright('\t[1] - Snipe'));
    console.log(chalk_1.default.greenBright('\t[2] - Exit Position'));
    console.log(chalk_1.default.white('\t[3] - Usage'));
    console.log(chalk_1.default.white('\t[4] - return'));
    console.log("\n");
}
exports.aff_sniper_menu = aff_sniper_menu;
function aff_settings_menu() {
    console.log(chalk_1.default.white('\t[1] - Change RPC'));
    console.log(chalk_1.default.white('\t[2] - Change Webhook'));
    console.log(chalk_1.default.white('\t[3] - Change Slippage'));
    console.log(chalk_1.default.white('\t[4] - Change Wallet'));
    console.log(chalk_1.default.white('\t[5] - Show Current Settings'));
    console.log(chalk_1.default.white('\t[6] - Back'));
    console.log("\n");
}
exports.aff_settings_menu = aff_settings_menu;
const default_export = {
    aff_logo,
    aff_title,
    aff_main_menu,
    aff_settings_menu,
    aff_sniper_menu,
    aff_snipe_option,
    aff_sell_option,
    aff_guide,
};
exports.default = default_export;
