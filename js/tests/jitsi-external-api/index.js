import "../../src/protos.js";
import { HtmlTestOutput as TestOutput, TestCase } from "../../etc/assert.js";
import { JitsiClient } from "../../src/jitsihax-client-external-api.js";
import { bust } from "../../src/emoji.js";
import { wait } from "../../src/wait.js";

const userNumber = document.location.hash.length > 0
    ? parseFloat(document.location.hash.substring(1))
    : 1;

class TestBase extends TestCase {
    async joinChannel() {
        await client.joinAsync("TestRoom", "TestUser" + userNumber);
        const evt = await client.once("videoConferenceJoined");
        this.hasValue(evt);
        this.isEqualTo(evt.id, client.localUser);
    }

    async waitForJoin() {
        if (client.otherUsers.size === 0) {
            await client.once("participantJoined", 5000);
        }

        this.isGreaterThan(client.otherUsers.size, 0);
        for (let id of client.otherUsers.keys()) {
            this.hasValue(id);
        }
    }

    async initUsers() {
        const requests = [];
        for (let id of client.otherUsers.keys()) {
            requests.push(client.userInitRequestAsync(id));
        }
        const responses = await Promise.all(requests);
        this.hasValue(responses);
        this.isGreaterThan(responses.length, 0);

        for (let response of responses) {
            this.hasValue(response.id);
            this.isNotEqualTo(response.id, client.localUser);

            this.hasValue(response.data);
            this.hasValue(response.data.userNumber);
            this.isNotEqualTo(response.data.userNumber, userNumber);
        }
    }

    async sendEmoji() {
        await wait(1000);
        client.emote(bust);
        this.success("Emoji sent");
    }

    async recvEmoji() {
        const evt = await client.once("emote", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.hasValue(evt.data);
        this.isEqualTo(evt.data.value, bust.value);
        this.isEqualTo(evt.data.desc, bust.desc);
    }
}

class JitsiClient1_Tests extends TestBase {
    async test_00_joinChannel() {
        await this.joinChannel();
    }

    async test_01_getAudioOutputDevices() {
        const audioOutputDevices = await client.getAudioOutputDevices();
        this.hasValue(audioOutputDevices);
        this.isGreaterThan(audioOutputDevices.length, 0);
    }

    async test_02_getCurrentAudioOutputDevice() {
        const curAudioOut = await client.getCurrentAudioOutputDevice();
        this.hasValue(curAudioOut);
    }

    async test_03_getAudioInputDevices() {
        const audioInputDevices = await client.getAudioInputDevices();
        this.hasValue(audioInputDevices);
        this.isGreaterThan(audioInputDevices.length, 0);
    }

    async test_04_getCurrentAudioInputDevice() {
        const curAudioIn = await client.getCurrentAudioInputDevice();
        this.hasValue(curAudioIn);
    }

    async test_05_getVideoInputDevices() {
        const videoInputDevices = await client.getVideoInputDevices();
        this.hasValue(videoInputDevices);
        this.isGreaterThan(videoInputDevices.length, 0);
    }

    async test_06_getCurrentVideoInputDevice() {
        const curVideoIn = await client.getCurrentVideoInputDevice();
        this.isNull(curVideoIn);
    }

    async test_07_toggleAudio() {
        const evt = client.once("audioMuteStatusChanged", 1000);
        client.toggleAudio();
        await evt;
        this.success("audio mute status changed");
    }

    async test_08_isAudioMuted() {
        let muted = await client.isAudioMutedAsync();
        this.isBoolean(muted);
    }

    async test_09_setAudioMuted() {
        const evt = client.once("audioMuteStatusChanged", 1000);
        await client.setAudioMutedAsync(false);
        await evt;
        this.success("audio mute status changed");
    }

    async test_10_toggleVideo() {
        const evt = client.once("videoMuteStatusChanged", 1000);
        client.toggleVideo();
        await evt;
        this.success("video mute status changed");
    }

    async test_11_isVideoMuted() {
        let muted = await client.isVideoMutedAsync();
        this.isBoolean(muted);
    }

    async test_12_setVideoMuted() {
        const evt = client.once("videoMuteStatusChanged", 1000);
        await client.setVideoMutedAsync(false);
        await evt;
        this.success("video mute status changed");
    }

    async test_13_participantJoined() {
        const loc = new URL(document.location.href);
        loc.hash = "#" + (userNumber + 1);
        window.open(loc.href, "_blank", "screenX:10,screenY:10,width:400,height:600");
        await this.waitForJoin();
    }

    async test_14_initUser() {
        await this.initUsers();
    }

    async test_15_recvEmoji() {
        await this.recvEmoji();
    }

    async test_16_sendEmoji() {
        await this.sendEmoji();
    }

    async test_99_participantLeft() {
        const evt = await client.once("participantLeft", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isFalse(client.otherUsers.has(evt.id));
    }
}

class JitsiClient2_Tests extends TestBase {
    async test_00_joinChannel() {
        await this.joinChannel();
    }

    async test_13_participantJoined() {
        await this.waitForJoin();
    }

    async test_14_initUser() {
        await this.initUsers();
    }

    async test_15_sendEmoji() {
        await this.sendEmoji();
    }

    async test_16_recvEmoji() {
        await this.recvEmoji();
    }

    async test_99_participantLeft() {
        window.close();
    }
}

const client = new JitsiClient(),
    cons = new TestOutput(
        userNumber === 1
            ? JitsiClient1_Tests
            : JitsiClient2_Tests);

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");

    document.head.append(...doc.head.childNodes);

    document.body.append(
        ...doc.body.childNodes,
        client.element,
        cons.element);

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

    document.body.removeChild(document.body.querySelector("#login"));

    client.addEventListener("moveTo", echoEvt);
    client.addEventListener("emote", echoEvt);
    client.addEventListener("userInitRequest", echoEvt);
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

    client.addEventListener("userInitRequest", (evt) => {
        client.userInitResponse(evt.id, { userNumber });
    });


    cons.run();
})();

function echoEvt(evt) {
    console.log(`============ ECHO EVT ${evt.type} ==============`);
    console.log(evt);
}