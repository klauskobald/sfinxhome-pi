/**
 * User: klausk
 * Date: 2019-12-30
 * Time: 11:18
 */

const crypto = require('crypto');
const fs = require("fs");
const path = require('path');
let dir = path.resolve(__dirname) + "/../.channels";
let sessionId = 0;

class ChannelTool {

    static setSessionId(id) {
        sessionId = id;
    }

    static loadChannel(name, path = null) {
        //console.log(this._path(name));
        let ch;
        try {
            ch = fs.readFileSync(path ? dir + "/" + path : this._path(name),
                {encoding: "utf8"});
        } catch (e) {
        }
        if (ch === undefined) {
            ch = {
                name,
                status:    'pending',
                updated:   new Date(),
                sessionId: sessionId,
                content:   null
            };
            return ch;
        }
        else {
            ch = JSON.parse(ch);
            ch.updated = new Date(ch.updated);
            return ch;
        }
    }

    static setStatus(ch, s, savenow = false) {
        ch.status = s;
        ch.sessionId = sessionId;
        ch.updated = new Date();
        if (savenow) {
            console.log(ch.name,"new status:",s);
            this.saveChannel(ch);
        }
    }

    static setContent(ch, c, savenow = false) {
        ch.updated = new Date();
        ch.content = c;
        if (savenow)
            this.saveChannel(ch);

    }

    static saveChannel(ch) {
        fs.writeFileSync(this._path(ch.name), JSON.stringify(ch));
    }

    static allChannels() {
        let r = [];
        let lst = fs.readdirSync(dir);
        for (var i = 0; i < lst.length; i++)
            r.push(this.loadChannel(null, lst[i]));
        return r;

    }

    static _path(name) {
        name = crypto.createHash('md5').update(name).digest("hex");
        return path.resolve(__dirname) + `/../.channels/${name}.json`;
    }

}

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
}

module.exports = ChannelTool;