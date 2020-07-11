import { haxClass, haxFunction } from "../../testing/hax.js";

//haxClass(window, EventTarget, ["addEventListener", "dispatchEvent"]);


const OldPromise = Promise;
window.Promise = class NewPromise extends OldPromise {
    constructor(callback, ...rest) {
        console.log("Promise", callback, ...rest);
        const injectedCallback = (resolve, reject) => {
            console.log("Promise callback", resolve, reject);
            try {
                return callback(resolve, (exp) => {
                    console.error("NEW PROMISE", exp);
                    return reject(exp);
                });
            }
            catch (exp) {
                console.error("Promise callback", exp);
            }
        };
        super(injectedCallback);
    }
};

import { init } from "../../src/init.js";
import { LibJitsiMeetClient as JitsiClient } from "../../src/jitsi/LibJitsiMeetClient.js";
import { Button } from "../../src/html/tags.js";
import { style } from "../../src/html/attrs.js";
import { onClick } from "../../src/html/evts.js";
import { openSideTest } from "../../testing/windowing.js";
import { userNumber } from "../../testing/userNumber.js";

const { login } = init("jitsi.calla.chat", new JitsiClient());

if (userNumber === 1) {
    document.body.append(
        Button(
            "Open Side Test",
            style({
                position: "absolute",
                top: 0,
                left: "calc(50% - 6em)",
                right: "calc(50% - 6em)",
            }),
            onClick(openSideTest)));
}

login.roomName = "TestRoom";
login.userName = `TestUser${userNumber}`;