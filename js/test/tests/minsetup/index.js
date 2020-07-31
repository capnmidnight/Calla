import { style } from "../../../src/html/attrs.js";
import { onClick } from "../../../src/html/evts.js";
import { Button } from "../../../src/html/tags.js";
import { init } from "../../../src/init.js";
import { LibJitsiMeetClient as JitsiClient } from "../../../src/jitsi/LibJitsiMeetClient.js";
import { userNumber } from "../../testing/userNumber.js";
import { openSideTest } from "../../testing/windowing.js";
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../../constants.js";

const { login } = init(new JitsiClient(JITSI_HOST, JVB_HOST, JVB_MUC));

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