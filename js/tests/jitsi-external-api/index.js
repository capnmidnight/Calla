import "../../src/protos.js";
import { HtmlTestOutput as TestOutput, TestCase } from "../../etc/assert.js";
import { JitsiClient } from "../../src/jitsihax-client-external-api.js";
import { bust } from "../../src/emoji.js";
import { wait } from "../../src/wait.js";

const TEST_ROOM_NAME = "testroom",
    userNumber = document.location.hash.length > 0
    ? parseFloat(document.location.hash.substring(1))
    : 1;

class TestBase extends TestCase {
    async joinChannel() {
        await client.joinAsync(TEST_ROOM_NAME, "TestUser" + userNumber);
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

            this.hasValue(response.userNumber);
            this.isNotEqualTo(response.userNumber, userNumber);
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
        this.isEqualTo(evt.value, bust.value);
        this.isEqualTo(evt.desc, bust.desc);
    }

    async sendAudioMuted() {
        await wait(1000);
        const evtTask = client.once("localAudioMuteStatusChanged", 5000);
        await client.setAudioMutedAsync(true);
        const evt = await evtTask;
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isTrue(evt.muted);
    }

    async sendAudioUnmuted() {
        await wait(1000);
        const evtTask = client.once("localAudioMuteStatusChanged", 5000);
        await client.setAudioMutedAsync(false);
        const evt = await evtTask;
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isFalse(evt.muted);
    }

    async recvAudioMuted() {
        let evt = await client.once("remoteAudioMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isTrue(evt.muted);
    }

    async recvAudioUnmuted() {
        let evt = await client.once("remoteAudioMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isFalse(evt.muted);
    }

    async sendVideoUnmuted() {
        await wait(1000);
        const evtTask = client.once("localVideoMuteStatusChanged", 5000);
        await client.setVideoMutedAsync(false);
        const evt = await evtTask;
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isFalse(evt.muted);
    }

    async sendVideoMuted() {
        await wait(1000);
        const evtTask = client.once("localVideoMuteStatusChanged", 5000);
        await client.setVideoMutedAsync(true);
        const evt = await evtTask;
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isTrue(evt.muted);
    }

    async recvVideoUnmuted() {
        const evt = await client.once("remoteVideoMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isFalse(evt.muted);
    }

    async recvVideoMuted() {
        const evt = await client.once("remoteVideoMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isTrue(evt.muted);
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
        const evt = client.once("localAudioMuteStatusChanged", 1000);
        client.toggleAudio();
        await evt;
        this.success("audio mute status changed");
    }

    async test_08_isAudioMuted() {
        let muted = await client.isAudioMutedAsync();
        this.isBoolean(muted);
    }

    async test_09_setAudioMuted() {
        const evt = client.once("localAudioMuteStatusChanged", 1000);
        await client.setAudioMutedAsync(false);
        await evt;
        this.success("audio mute status changed");
    }

    async test_10_toggleVideo() {
        const evt = client.once("localVideoMuteStatusChanged", 1000);
        client.toggleVideo();
        await evt;
        this.success("video mute status changed");
    }

    async test_11_isVideoMuted() {
        let muted = await client.isVideoMutedAsync();
        this.isBoolean(muted);
    }

    async test_12_setVideoMuted() {
        const evt = client.once("localVideoMuteStatusChanged", 1000);
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

    async test_17_sendAudioMuted() {
        await this.sendAudioMuted();
    }

    async test_18_recvAudioMuted() {
        await this.recvAudioMuted();
    }

    async test_19_sendAudioUnmuted() {
        await this.sendAudioUnmuted();
    }

    async test_20_recvAudioUnmuted() {
        await this.recvAudioUnmuted();
    }

    async test_21_sendVideoUnmuted() {
        await this.sendVideoUnmuted();
    }

    async test_22_recvVideoUnmuted() {
        await this.recvVideoUnmuted();
    }

    async test_23_sendVideoMuted() {
        await this.sendVideoMuted();
    }

    async test_24_recvVideoMuted() {
        await this.recvVideoMuted();
    }

    async test_98_participantLeft() {
        const evt = await client.once("participantLeft", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isFalse(client.otherUsers.has(evt.id));
    }

    async test_99_leaveConference() {
        const evtTask = client.once("videoConferenceLeft", 5000);
        client.leave();
        const evt = await evtTask;
        this.hasValue(evt);
        this.hasValue(evt.roomName);
        this.isEqualTo(evt.roomName, TEST_ROOM_NAME);
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

    async test_17_recvAudioMuted() {
        await this.recvAudioMuted();
    }

    async test_18_sendAudioMuted() {
        await this.sendAudioMuted();
    }

    async test_19_recvAudioUnmuted() {
        await this.recvAudioUnmuted();
    }

    async test_20_sendAudioUnmuted() {
        await this.sendAudioUnmuted();
    }

    async test_21_recvVideoUnmuted() {
        await this.recvVideoUnmuted();
    }

    async test_22_sendVideoUnmuted() {
        await this.sendVideoUnmuted();
    }

    async test_23_recvVideoMuted() {
        await this.recvVideoMuted();
    }

    async test_24_sendVideoMuted() {
        await this.sendVideoMuted();
    }

    async test_98_participantLeft() {
        await wait(1000);
        client.leave();
        this.success("Conference left");
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

    client.addEventListener("userMoved", echoEvt);
    client.addEventListener("emote", echoEvt);
    client.addEventListener("userInitRequest", echoEvt);
    client.addEventListener("userInitResponse", echoEvt);
    client.addEventListener("audioMuteStatusChanged", echoEvt);
    client.addEventListener("videoMuteStatusChanged", echoEvt);
    client.addEventListener("localAudioMuteStatusChanged", echoEvt);
    client.addEventListener("localVideoMuteStatusChanged", echoEvt);
    client.addEventListener("remoteAudioMuteStatusChanged", echoEvt);
    client.addEventListener("remoteVideoMuteStatusChanged", echoEvt);
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