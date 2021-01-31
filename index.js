const mstdn = require('mastodon-api');
const mreq = require('request');

console.log("\x1b[36m╭────────────────────────────────────────────────────────────────╮");
console.log("\x1b[36m│                                                                │");
console.log("\x1b[36m│                  Kiebot - made by CptOuaf                      │");
console.log("\x1b[36m│                Hosted on kiechen.me instance                   │");
console.log("\x1b[36m│                                                                │");
console.log("\x1b[36m╰────────────────────────────────────────────────────────────────╯");
console.log("\x1b[0m");

const M = new mstdn({
    client_key: 'insert client key here',
    client_secret: 'insert client secret here',
    access_token: 'insert access token here',
    timeout_ms: 60 * 1000,
    api_url: 'put api URL here',
});

//Run toots function at app startup
toots();
//Run toots function every hours
setInterval(toots, 3600000);

function toots() {
    console.log("Start function");
    //Get BTC > EUR DATA
    mreq('https://api.uphold.com/v0/ticker/BTCEUR', {json: true}, (err, res, body) => {
        console.log(body);
        //Get BTC > USD DATA
        mreq('https://api.uphold.com/v0/ticker/BTCUSD', {json: true}, (err2, res2, body2) => {
            console.log(body2);
            //Stringify and parse json for BTC > EUR
            const eurdata = JSON.stringify(body);
            const eurfdata = JSON.parse(eurdata);
            console.log(eurfdata);

            //Stringify and parse json for BTC > USD
            const usddata = JSON.stringify(body2);
            const usdfdata = JSON.parse(usddata);
            console.log(usdfdata);

            //Get current BID value and down it to 2 digits behind dot
            let eurbid = Math.round(eurfdata['bid'] * 1000) / 1000;
            let usdbid = Math.round(usdfdata['bid'] * 1000) / 1000;

            let date = new  Date().toUTCString();

            //Build params to send as toot
            const params = {
                status: `1 bitcoin (₿) equal to: \n\n⏵ ${eurbid} euros (€) \n⏵ ${usdbid} US dollars ($) \n\n⏰ ${date}`
            };

            //send toot
            M.post('statuses', params, (error) => {
                if(error) {
                    console.error(error);
                } else {
                    console.log(`Toots was send at ${date}`)
                }
            });
        });
    });
}