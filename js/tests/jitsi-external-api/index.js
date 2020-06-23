
import "../../src/protos.js";
import { HtmlTestOutput as TestOutput, TestCase } from "../../etc/assert.js";
import { JitsiClient } from "../../src/jitsihax-client-external-api.js";
import { P, Div, Button } from "../../src/html/tags.js";
import { style } from "../../src/html/attrs.js";
import { onClick } from "../../src/html/evts.js";

class JitsiClientTests extends TestCase {
    async test_toggleAudio() {
        const evt = client.once("audioMuteStatusChanged", null, 1000);
        client.toggleAudio();
        await evt;
        this.success("audio mute status changed");
    }

    async test_isAudioMuted() {
        let muted = await client.isAudioMutedAsync();
        this.isBoolean(muted);
    }

    async test_setAudioMuted() {
        const evt = client.once("audioMuteStatusChanged", null, 1000);
        await client.setAudioMutedAsync(false);
        await evt;
        this.success("audio mute status changed");
    }

    async test_toggleVideo() {
        const evt = client.once("videoMuteStatusChanged", null, 1000);
        client.toggleVideo();
        await evt;
        this.success("video mute status changed");
    }

    async test_isVideoMuted() {
        let muted = await client.isVideoMutedAsync();
        this.isBoolean(muted);
    }

    async test_setVideoMuted() {
        const evt = client.once("videoMuteStatusChanged", null, 1000);
        await client.setVideoMutedAsync(false);
        await evt;
        this.success("video mute status changed");
    }
}

let hash = document.location.hash.length > 0
    ? parseFloat(document.location.hash.substring(1))
    : 1,
    myID = null;

const client = new JitsiClient(),
    output = Div(
        style({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            color: "#0f0",
            pointerEvents: "none"
        })),
    spawn = Button(
        style({
            position: "absolute",
            top: 0,
            left: "calc(50% - 3.5em)",
            width: "7em",
            padding: "0.5em"
        }),
        onClick(() => {
            const loc = new URL(document.location.href);
            ++hash;
            loc.hash = "#" + hash;
            window.open(loc.href, "_blank", "width:800,height:600,screenX:10,screenY:10");
        }),
        "Spawn"),
    users = new Map(),
    cons = new TestOutput(JitsiClientTests);

async function setup(evt) {

    myID = evt.id;

    const audioOutputDevices = await client.getAudioOutputDevices(),
        audioInputDevices = await client.getAudioInputDevices(),
        videoInputDevices = await client.getVideoInputDevices(),
        curAudioOut = await client.getCurrentAudioOutputDevice(),
        curAudioIn = await client.getCurrentAudioInputDevice(),
        curVideoIn = await client.getCurrentVideoInputDevice();

    echoValue(audioOutputDevices);
    echoValue(audioInputDevices);
    echoValue(videoInputDevices);
    echoValue(curAudioOut);
    echoValue(curAudioIn);
    echoValue(curVideoIn);
}

async function runTest(evt) {
    const state = await client.userInitRequestAsync(evt.id);
    console.log("=============== GOT USER STATE");
    echoEvt(state);

    await cons.run();
}

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");

    document.head.append(...doc.head.childNodes);

    document.body.append(
        ...doc.body.childNodes,
        client.element,
        output);

    if (hash === 1) {
        document.body.append(cons.element);

        Object.assign(client.element.style, {
            bottom: undefined,
            height: "50%"
        });

        Object.assign(cons.element.style, {
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "50%"
        });

        document.body.append(spawn);
    }

    document.body.removeChild(document.body.querySelector("#login"));

    client.addEventListener("moveTo", echoEvt);
    client.addEventListener("emote", echoEvt);
    client.addEventListener("userInitRequest", echoEvt);
    client.addEventListener("userInitRequest", (evt) => {
        client.userInitResponse(evt.participantID, {
            id: myID,
            x: 0,
            y: 0
        });
    });
    client.addEventListener("userInitResponse", echoEvt);
    client.addEventListener("audioMuteStatusChanged", echoEvt);
    client.addEventListener("videoMuteStatusChanged", echoEvt);
    client.addEventListener("videoConferenceJoined", echoEvt);
    client.addEventListener("videoConferenceLeft", echoEvt);
    client.addEventListener("participantJoined", echoEvt);
    client.addEventListener("participantLeft", echoEvt);
    client.addEventListener("avatarChanged", echoEvt);
    client.addEventListener("displayNameChange", echoEvt);
    client.addEventListener("audioActivity", echoEvt);

    client.addEventListener("participantJoined", (evt) => {
        users.set(evt.id, evt.displayName);
    });

    client.addEventListener("participantLeft", (evt) => {
        users.delete(evt.id);
    });

    if (hash === 1) {
        client.addEventListener("videoConferenceJoined", setup);
        client.addEventListener("participantJoined", runTest, { once: true });
    }

    await client.joinAsync("TestRoom", "TestUser" + hash);
})();

function echoValue(value) {
    console.log("============== VALUE:", value);
    const label = P(value);
    output.appendChild(label);
    setTimeout(() => {
        output.removeChild(label);
    }, 5000);
}

function echoEvt(evt) {
    console.log(`============ ECHO EVT ${evt.type} ==============`);
    console.log(evt);
}