import readline from 'readline';
import graph_menu from './utils';
import chalk from 'chalk';
import {update_slippage,update_rpc,update_wallet,show_config, config} from "./modules/config"
import fs from "fs";
import spinner from "cli-spinners";
import {get_token_amount} from "./modules/fetch_token"
import {get_wallet} from "./modules/get_keypair"
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { fetchPoolKeys } from './modules/pool_keys';
import {compute} from "./modules/compute";
import {swap} from "./modules/swap";
import { getTokenAccountsByOwner } from "./modules/get_accounts";


//control variables
var choice = 0;

//key auth instance

//spinner function

const Spinner = spinner.dots4;
let i = 0;
let animationInterval;

const updateSpinner = () => {
    const frame = Spinner.frames[i % Spinner.frames.length];
    process.stdout.cursorTo(0);
    process.stdout.write('\t'+frame);
    i++;
  };


const startSpinner = () => {
  animationInterval = setInterval(updateSpinner, Spinner.interval);
};

const stopSpinner = () => {
    clearInterval(animationInterval);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  };

//creating interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//clearing-resetting screen
function clear_screen() {
    console.clear();
}

//sleep function
function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//program start

//initial authentication

//(async () => {
//
//    startSpinner()
//    stopSpinner()
//
//    var config_txt = fs.readFileSync('config.json','utf8');
//    var config_obj:config = JSON.parse(config_txt);
//    const license = config_obj.license;
//    if (license != ''){
//        await verify_license(license)
//    }else{
//        rl.question("\tLicense : ", async (lic) => {
//        await verify_license(lic);
//        });
//    }
//})();

main()


async function start_swapping(
    connection:Connection,
    is_snipe:boolean,
    amount_in:number,
    pool:string,
    slip:number,
    owner:Keypair
)
{

    console.log(chalk.greenBright('\tinputs valid\n'));
    console.log(chalk.white(`\t[1] - ${chalk.blueBright(is_snipe?'Snipe':'Sell')}`));
    console.log(chalk.white('\t[2] - Return'));

    rl.question(`\n\t${is_snipe?'[Sniper]':'[Exit Position]'} - choice: `, async (answer) => {

        const ans = parseInt(answer);
        if (ans == 1){
            finished = false;
            const SwapSpinner = spinner.dots4;
            let i = 0;
            let animationInterval;

            const updateSwapSpinner = () => {
                const frame = Spinner.frames[i % Spinner.frames.length];
                process.stdout.cursorTo(0);
                process.stdout.write(chalk.blueBright('\tSwapping'+frame));
                i++;
              };
          
          
            const startSwapSpinner = () => {
              animationInterval = setInterval(updateSwapSpinner, SwapSpinner.interval);
            };
        
            const stopSwapSpinner = () => {
                clearInterval(animationInterval);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
              };
          
            startSpinner();
            var finished:boolean = false;
            const pool_keys = await fetchPoolKeys(connection, new PublicKey(pool));
          
             var token_in_key:PublicKey;
             var token_out_key:PublicKey;
          
             if(is_snipe){
                token_in_key = pool_keys.quoteMint;
                token_out_key = pool_keys.baseMint;
             }else{
                token_in_key = pool_keys.baseMint;
                token_out_key = pool_keys.quoteMint;
             }
         
             while(!finished){
            
                const computation:any = await compute(connection,pool_keys,token_in_key,token_out_key,amount_in,slip);
            
                const amountOut = computation[0];

                const minAmountOut = computation[1];

                const currentPrice = computation[2];

                const executionPrice = computation[3];

                const priceImpact = computation[4];
            
                const fee = computation[5];

                const amountIn = computation[6];
            
                stopSpinner();
            
            
                console.log(`\n\tAmount out: ${amountOut.toFixed()},\n\tMin Amount out: ${minAmountOut.toFixed()}`)
                if (priceImpact.toFixed() > 5){
                   console.log(chalk.red(`\tpriceImpact: ${priceImpact.toFixed()}`))
                }else if(priceImpact.toFixed() < 5 && priceImpact.toFixed() > 1){
                   console.log(chalk.yellowBright(`\tpriceImpact: ${priceImpact.toFixed()}`))
                }else{
                   console.log(chalk.green(`\tpriceImpact: ${priceImpact.toFixed()}`))
                }
            
            
                console.log('\n')

                startSwapSpinner()
                const token_accounts = await getTokenAccountsByOwner(connection, owner.publicKey);
            
                const swap_status = await swap(connection,pool_keys,owner,token_accounts,is_snipe,amountIn,minAmountOut);
                stopSwapSpinner()
            
                if (swap_status == 0){
                    console.log(chalk.greenBright('\tSwap successful!'))
                    rl.question("\tpress enter to return..", async () => {
                        snipe_menu();
                    });
                    break
                }else{
                    console.log(chalk.red('\tSwap failed, retrying...'))
                    continue
                }
             }

        }else if(ans == 2){
            snipe_menu();
        }else{
            console.log(chalk.red("\n\tInvalid choice"));
            await sleep(1000);
            snipe_menu();
        }

    })
}

async function snipe_choice(){
    clear_screen();
    graph_menu.aff_logo();
    graph_menu.aff_title();
    graph_menu.aff_snipe_option();
    
    const owner = get_wallet('config.json');
    var config_txt = fs.readFileSync('config.json','utf8');
    var config_obj:config = JSON.parse(config_txt);
    const slip = config_obj.slippage;
    const connection = new Connection(config_obj.rpc_endpoint);
    
    rl.question("\n\tPool ID: ", async (answer) => {

        const pool:string  = answer;

        rl.question("\n\tAmount in(enter 'MAX' for max amount): ", async(answer)=>{

            console.log('\n\t');
            startSpinner();


            var res:number; 
            const amount_in = parseFloat(answer);
            const is_max = answer;
            const token_amount= await get_token_amount(pool,true);

            stopSpinner()

            if (token_amount == -1){
                console.log(chalk.red("\n\tInvalid Pool ID or an error has occured."));
                await sleep(1000);
                snipe_menu();
            }else if(token_amount == -2){
                console.log(chalk.red("\n\tSol Balance less than 0.01"));
                await sleep(1000);
                snipe_menu();
            }else if(token_amount == 0){
                console.log(chalk.red("\n\tNo balance found."));
                await sleep(1000);
                snipe_menu();
            }else{
                if (is_max.toUpperCase() == 'MAX'){
                    if (token_amount < 0.00001){
                        console.log(chalk.red("\n\tInput too small."));
                        await sleep(1000);
                        snipe_menu();
                    }else{
                        await start_swapping(connection,true,token_amount,pool,slip,owner);
                    }
                }else if(isNaN(amount_in)){
                    console.log(chalk.red("\n\tInvalid Input."));
                    await sleep(1000);
                    snipe_menu();
                }else{
                    if (amount_in > token_amount){
                        console.log(chalk.red("\n\tinsufficient balance."));
                        await sleep(1000);
                        snipe_menu();
                    }else{
                        if (amount_in < 0.00001){
                            console.log(chalk.red("\n\tInput too small."));
                            await sleep(1000);
                            snipe_menu();
                        }else{
                            await start_swapping(connection,true,amount_in,pool,slip,owner);                            
                        }
                    }
                }
            }
        })
    });
}


async function sell_choice(){
    clear_screen();
    graph_menu.aff_logo();
    graph_menu.aff_title();
    graph_menu.aff_sell_option();

    const owner = get_wallet('config.json');
    var config_txt = fs.readFileSync('config.json','utf8');
    var config_obj:config = JSON.parse(config_txt);
    const slip = config_obj.slippage;
    const connection = new Connection(config_obj.rpc_endpoint);

    rl.question("\n\tPool ID: ", async (answer) => {

        const pool:string  = answer;

        rl.question("\n\tAmount in(enter 'MAX' for max amount): ", async(answer)=>{

            console.log('\n\t');
            startSpinner();


            var res:number; 
            const amount_in = parseFloat(answer);
            const is_max = answer;
            const token_amount= await get_token_amount(pool,false);

            stopSpinner()

            if (token_amount == -1){
                console.log(chalk.red("\n\tInvalid Pool ID or an error has occured."));
                await sleep(1000);
                snipe_menu();
            }else if(token_amount == -2){
                console.log(chalk.red("\n\tSol Balance less than 0.01"));
                await sleep(1000);
                snipe_menu()
            }else if(token_amount == 0){
                console.log(chalk.red("\n\tNo balance found."));
                await sleep(1000);
                snipe_menu()
            }else{
                if (is_max.toUpperCase() == 'MAX'){
                    await start_swapping(connection,false,token_amount,pool,slip,owner);
                }else if(isNaN(amount_in)){
                    console.log(chalk.red("\n\tInvalid Input."));
                    await sleep(1000);
                    snipe_menu()
                }else{
                    if (amount_in > token_amount){
                        console.log(chalk.red("\n\tinsufficient balance."));
                        await sleep(1000);
                        snipe_menu()
                    }else{
                        await start_swapping(connection,false,amount_in,pool,slip,owner);
                    }
                }
            }
        })
    });
}

function usage(){
    clear_screen();
    graph_menu.aff_logo();
    graph_menu.aff_title();
    graph_menu.aff_guide()

    rl.question("\n\tpress enter to return..", async () => {
        snipe_menu();
    });
}

//sniper menu’t miss your chance to claim the title and make history! Join us at Keymasters 2023:


async function snipe_menu(){
    var config_txt = fs.readFileSync('config.json','utf8');
    var config_obj:config = JSON.parse(config_txt);

    const wallet = config_obj.wallet;
    if (wallet === 'None'){
        console.log(chalk.red("\n\tPlease add a wallet in settings"));
        await sleep(1500);
        main();
    }else{
        clear_screen();
        graph_menu.aff_logo();
        graph_menu.aff_title();
        graph_menu.aff_sniper_menu();

        rl.question(chalk.white('\t[Sniper Mode] - Choice: '), async(answer) => {
            choice = parseInt(answer);
            if (choice == 1){
                snipe_choice();
            }else if(choice == 2 ){
                sell_choice();
            }else if(choice == 3 ){
                usage();
            }else if (choice == 4){
                main();
            }else{
                console.log(chalk.red("\tInvalid choice."));
                await sleep(1500);
                snipe_menu();
            }
        })
    }

}

//settings menu
function settings_menu(){
    clear_screen();
    graph_menu.aff_logo();
    graph_menu.aff_title();
    graph_menu.aff_settings_menu();
    rl.question(chalk.white('\t[Settings] - Choice: '), async(answer) => {
        choice = parseInt(answer);
        if (choice == 1) {
            
            rl.question(chalk.white('\t[Settings] - New RPC Endpoint: '),async (answer)=>{

                const res = await update_rpc(answer);
                await sleep(1000);

                if (res === 1){
                    console.log(chalk.red('\tInvalid RPC Value'));
                    await sleep(1000);
                    settings_menu();
                }else{
                    console.log('\tRPC Updated');
                    await sleep(1000);
                    settings_menu();
                }

            })
        } else if (choice == 2) {

        } else if (choice == 3) {

            rl.question(chalk.white('\t[Settings] - New Slippage(0-100): '),async (answer)=>{

                const res = update_slippage(answer);

                if (res === 1){
                    console.log(chalk.red('\tInvalid Slippage Value'));
                    await sleep(1000);
                    settings_menu();
                }else{
                    console.log('\tSlippage Updated!');
                    await sleep(1000);
                    settings_menu();
                }

            })

        } else if (choice == 4) {
            rl.question(chalk.white('\t[Settings] - Enter Private Key: '),async (answer)=>{

                const res = update_wallet(answer);

                if (res === 1){
                    console.log(chalk.red('\tInvalid Input or Wallet Not Found'));
                    await sleep(1000);
                    settings_menu();
                }else{
                    console.log('\tWallet Updated!');
                    await sleep(1000);
                    settings_menu();
                }
            })

        } else if(choice == 5){
            clear_screen();
            graph_menu.aff_logo();
            graph_menu.aff_title();
            show_config()
            rl.question(chalk.white('\n\tpress enter to return..'),(answer)=>{
                settings_menu();
            })

    
        }else if(choice == 6){
            main();
            
        }else {
            console.log(chalk.red("\tInvalid choice."));
            await sleep(1500);
            settings_menu();
        }
    });
}


//main menu
function main() {
    console.clear();
    graph_menu.aff_logo();
    graph_menu.aff_title();
    graph_menu.aff_main_menu();
    rl.question(chalk.white('\t[Main] - Choice: '), async (answer) => {
        choice = parseInt(answer);
        if (choice == 1) {
            snipe_menu();
        } else if (choice == 2) {
            settings_menu();
        } else if (choice == 3) {
            process.exit();
        } else {
            console.log(chalk.red("\tInvalid choice."));
            await sleep(1500);
            main();
        }
    });
}


module.exports = {
    main
}