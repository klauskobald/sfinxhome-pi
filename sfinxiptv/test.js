/*
test all channels given in .env and cache result

test should be called in an infinite loop.
It will check all not ok channels every hour and all ok channels every day.
It will consolidate channels with same same and find that one which is actually working
 */

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
require('dotenv').config();
const helper = require('../iptv/scripts/helper');
const ffmpeg = require('../iptv/node_modules/fluent-ffmpeg');
const channeltool = require('./src/channel');
var internetAvailable = require("internet-available");

const config = {
    debug:        process.env.npm_config_debug || false,
    country:      process.env.npm_config_country,
    exclude:      process.env.npm_config_exclude,
    give_up_time: process.env.npm_config_inet_timeout || 1800,
    timeout:      20
};
let stats = {
    playlists: 0,
    channels:  0,
    failures:  0
};

async function test() {
    let error = false;
    const playlist = helper.parsePlaylist('../iptv/index.m3u');
    const countries = helper.filterPlaylists(playlist.items, config.country, config.exclude);
    const sessionId = new Date().getTime();
    for (let country of countries) {
        stats.playlists++;
        console.log(`Processing '${country.url}'...`);
        const playlist = helper.parsePlaylist(country.url);
        for (let item of playlist.items) {
            let wait4inet = true;
            internetAvailable({
                timeout: 4000,
                retries: 20,
            }).then(function () {
                wait4inet = false;
            }).catch(function () {
                throw("No internet");
            });

            let _t = 50;
            let giveuptime = new Date().getTime() + config.give_up_time * 1000;
            do {
                if (_t > 5000) console.log(".");
                await sleep(_t);
                if (_t < 10000) _t *= 1.2;
                if (new Date().getTime() > giveuptime) {
                    error = true;
                    wait4inet = false;
                }
            } while (wait4inet);
            if (error) break;
            await testItem(country, item, sessionId);
        }
        if (error) break;
    }
    console.log("terminated: no internet!");
    if (stats.failures === 0) {
        console.log(`OK (${stats.playlists} playlists, ${stats.channels} channels)`)
    }
    else {
        console.log(`FAILURES! (${stats.playlists} playlists, ${stats.channels} channels, ${stats.failures} failures)`);
        process.exit(1)
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function testItem(country, item, sessionId) {
    let cCode = helper.getBasename(country.url).toLowerCase();
    stats.channels++;
    console.log(new Date(), item.name, " (" + stats.channels + ")");
    if (config.debug) {
        console.log(`Checking '${item.name}'...`)
    }

    channeltool.setSessionId(sessionId);
    let ch = channeltool.loadChannel(item.name);
    let nextCheck = -60;
    let sameSession = ch.sessionId === sessionId;
    console.log("  status=" + ch.status);
    switch (ch.status) {
        case 'failed':
            if (!sameSession)
                nextCheck = 7200;
            break;
        case 'pending':
            break;
        case 'checking':
            nextCheck = 60;
            break;
        case 'ok':
            nextCheck = 86400;
            break;
    }

    let now = new Date().getTime();
    let checktime = ch.updated.getTime() + nextCheck * 1000;
    if (now >= checktime) {
        console.log('  testing ' + item.url);
        item.countryName = country.name;
        item.countryCode = cCode;
        channeltool.setContent(ch, item);
        channeltool.setStatus(ch, 'checking', true);
        await new Promise(resolve => {
            const timeout = setTimeout(() => {
                channeltool.setStatus(ch, 'failed', 1);
                resolve()
            }, config.timeout * 1000);
            ffmpeg(item.url, {timeout: 60}).ffprobe((err, d) => {
                if (err) {
                    const message = helper.parseMessage(err, item.url);
                    stats.failures++;
                    helper.writeToLog(country.url, message, item.url);
                    console.log(`${message} '${item.url}'`);
                    channeltool.setStatus(ch, 'failed', true);
                }
                else
                    channeltool.setStatus(ch, 'ok', true);

                clearTimeout(timeout);
                resolve()
            })
        })
    }
}

console.log('Test is running...');
test();
