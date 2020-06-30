import { init } from "../../src/init.js";
import { LibJitsiMeetClient as JitsiClient } from "../../src/jitsi/LibJitsiMeetClient.js";
import { Button } from "../../src/html/tags.js";
import { style } from "../../src/html/attrs.js";
import { onClick } from "../../src/html/evts.js";
import { openSideTest } from "../../testing/windowing.js";

init("jitsi.calla.chat", new JitsiClient());

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