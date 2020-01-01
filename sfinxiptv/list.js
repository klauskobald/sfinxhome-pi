/*
display list of cached channels
 */

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
require('dotenv').config();
const channeltool=require('./src/channel');

const config = {
    debug:   process.env.npm_config_debug || false,
};

channeltool.allChannels().forEach((ch)=>{
    console.log(ch.updated,ch.status.padStart(7),ch.name);
});
