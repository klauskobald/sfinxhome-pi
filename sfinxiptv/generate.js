/*
create playlists for each country for all channels with status=ok
 */

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
require('dotenv').config();
const channeltool = require('./src/channel');
const helper = require('../iptv/scripts/helper');
const fs = require("fs");
const path = require('path');
let dir = path.resolve(__dirname) + "/.m3u";

const config = {
    debug: process.env.npm_config_debug || false,
    groupBlacklist: process.env.group_blacklist ? process.env.group_blacklist.split(",") : []
};

let countryLst = {};
let groupLst = {};
let channels = channeltool.allChannels();
channels = channels.sort((a, b) => {
    return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
});
console.log("generating playlists...")
channels.forEach((ch) => {
    if (ch.status !== 'ok') return;
    //console.log(ch.name);
    var chItem = helper.createChannel(ch.content);
    // workarround for bug
    chItem.name = ch.name;
    chItem.id=chItem.name;
    chItem.countryCode = ch.content.countryCode;
    chItem.country = ch.content.countryName;
    //

    let grp = ch.content.group.title;
    if(grp && config.groupBlacklist.indexOf(grp)>=0)
        return;


    let chStr=chItem.toString();
    if (countryLst[chItem.countryCode] === undefined)
        countryLst[chItem.countryCode] = [];
    countryLst[chItem.countryCode].push(chStr);

    if (grp) {
        if (groupLst[grp] === undefined)
            groupLst[grp] = [];
        groupLst[grp].push(chStr);
    }
});

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
}

var k;
ct=0;
for (k in countryLst) {
    let f = dir + "/" + k + ".m3u";
    fs.writeFileSync(f, "#EXTM3U\n\n" + countryLst[k].join("\n"));
    ct++;
}
console.log("countries",ct);

for (k in groupLst) {
    let f = dir + "/" + k + ".m3u";
    fs.writeFileSync(f, "#EXTM3U\n\n" + groupLst[k].join("\n"));
    ct++;
}
console.log("groups",ct);
console.log("done.");


