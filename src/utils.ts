import chalk from 'chalk';

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
`

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


`


export function aff_logo() {
    for (let i = 0; i < logo.length; i++) {
        if (logo[i] == '@') {
            process.stdout.write(chalk.black(logo[i]));
        } else {
            process.stdout.write(chalk.magenta(logo[i]));
        }
    }
}

export function aff_title(){
    for (let i = 0; i < title.length; i++) {
        if (title[i] == '▓') {
            process.stdout.write(chalk.black(title[i]));
        } else {
            process.stdout.write(chalk.magenta(title[i]));
        }
    }
}

export function aff_snipe_option(){
    console.log(chalk.cyanBright('\tDisclaimer: \t- the tool will start sniping if all inputs are valid!'));
    console.log(chalk.cyanBright('\t            \t- double check the amount and pool details in the monitor'));
    console.log(chalk.cyanBright('\t            \t  to avoid miss-inputs and big price impact'));
}

export function aff_sell_option(){
    console.log(chalk.cyanBright('\tDisclaimer: \t- the tool will sell supplied balance if all inputs are valid!'));
    console.log(chalk.cyanBright('\t            \t- double check the held balance and pool details in the monitor'));
    console.log(chalk.cyanBright('\t            \t  to avoid miss-inputs and big price impact'));
}

export function aff_guide(){
    console.log(chalk.white('\tUSAGE: '))
    console.log(chalk.white('\n'))
    console.log(chalk.white('\tsniper option       \t - requires AMM pool ID and amount of token in as input'));
    console.log(chalk.white('\t                    \t - Amount in should be the Quote of the pair (from on-chain monitor)'));
    console.log(chalk.white('\t                    \t - make sure to have the supplied amount of token in or the transaction will not go through'));
    console.log(chalk.white('\n'));
    console.log(chalk.white('\texit position option\t - requires AMM pool ID and amount of token out as input'));
    console.log(chalk.white('\t                    \t - Amount in should be the Base of the pair (from on-chain monitor)'));
    console.log(chalk.white('\t                    \t - make sure to have the supplied amount of token out or the transactions will not got through'));
    console.log(chalk.white('\n'));
    console.log(chalk.white('\tdefault slippage    \t - 10%'));
    console.log(chalk.white('\tsuggested slippage  \t - between 10% and 30%'));
    console.log(chalk.white("\tRPCs                \t - Custom RPC's are highly suggested for fast transaction commitment speed"));
    console.log(chalk.white('\n'));
}

export function aff_main_menu(){
    console.log(chalk.white('\t[1] - Sniper Mode'));
    console.log(chalk.white('\t[2] - Settings'));
    console.log(chalk.white('\t[3] - Exit'));
    console.log("\n");
}

export function aff_sniper_menu(){
    console.log(chalk.blueBright('\t[1] - Snipe'));
    console.log(chalk.greenBright('\t[2] - Exit Position'));
    console.log(chalk.white('\t[3] - Usage'));
    console.log(chalk.white('\t[4] - return'));
    console.log("\n");
}

export function aff_settings_menu() {
    console.log(chalk.white('\t[1] - Change RPC'));
    console.log(chalk.white('\t[2] - Change Webhook'));
    console.log(chalk.white('\t[3] - Change Slippage'));
    console.log(chalk.white('\t[4] - Change Wallet'));
    console.log(chalk.white('\t[5] - Show Current Settings'));
    console.log(chalk.white('\t[6] - Back'));
    console.log("\n");
}

const default_export = {
    aff_logo,
    aff_title,
    aff_main_menu,
    aff_settings_menu,
    aff_sniper_menu,
    aff_snipe_option,
    aff_sell_option,
    aff_guide,
} 

export default default_export 

