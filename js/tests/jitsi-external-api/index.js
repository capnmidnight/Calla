import { HtmlTestOutput as TestOutput, TestCase } from "../../etc/assert.js";
import { bust } from "../../src/emoji.js";
import "../../src/protos.js";
import { wait } from "../../src/wait.js";
import { ExternalJitsiClient as JitsiClient } from "../../src/jitsi/jitsihax-client-external-api.js";

const TEST_ROOM_NAME = "testroom",
    userNumber = document.location.hash.length > 0
        ? parseFloat(document.location.hash.substring(1))
        : 1;

class TestBase extends TestCase {

    async withEvt(name, action) {
        const evtTask = client.once(name, 5000);
        this.hasValue(evtTask);
        this.isTrue(evtTask instanceof Promise);

        const actionResult = action();
        if (actionResult instanceof Promise) {
            await actionResult;
        }

        const evt = await evtTask;
        this.hasValue(evt);

        return evt;
    }


    async joinChannel() {
        const evt = await this.withEvt("videoConferenceJoined", () =>
            client.joinAsync(TEST_ROOM_NAME, "TestUser" + userNumber));
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
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            client.setAudioMutedAsync(true));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isTrue(evt.muted);
    }

    async sendAudioUnmuted() {
        await wait(1000);
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            client.setAudioMutedAsync(false));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isFalse(evt.muted);
    }

    async recvAudioMuted() {
        const evt = await client.once("remoteAudioMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isTrue(evt.muted);
    }

    async recvAudioUnmuted() {
        const evt = await client.once("remoteAudioMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isFalse(evt.muted);
    }

    async sendVideoUnmuted() {
        await wait(1000);
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            client.setVideoMutedAsync(false));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, client.localUser);
        this.isFalse(evt.muted);
    }

    async sendVideoMuted() {
        await wait(1000);
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            client.setVideoMutedAsync(true));
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

    async sendPosition() {
        const x = ((userNumber - 1) * 2 - 1) * 5;
        await wait(1000);
        client.setPosition({ id: client.localUser, x, y: 0 });
        this.success("Position sent");
    }

    async recvPosition() {
        const x = ((userNumber - 1) * 2 - 1) * -5;
        const evt = await client.once("userMoved", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(client.otherUsers.has(evt.id));
        this.isEqualTo(evt.x, x);
        this.isEqualTo(evt.y, 0);
    }
}

class JitsiClient1_Tests extends TestBase {
    async test_000_joinChannel() {
        await this.joinChannel();
    }

    async test_010_getAudioOutputDevices() {
        const audioOutputDevices = await client.getAudioOutputDevices();
        this.hasValue(audioOutputDevices);
        this.isGreaterThan(audioOutputDevices.length, 0);
    }

    async test_020_getCurrentAudioOutputDevice() {
        const curAudioOut = await client.getCurrentAudioOutputDevice();
        this.hasValue(curAudioOut);
    }

    async test_030_getAudioInputDevices() {
        const audioInputDevices = await client.getAudioInputDevices();
        this.hasValue(audioInputDevices);
        this.isGreaterThan(audioInputDevices.length, 0);
    }

    async test_040_getCurrentAudioInputDevice() {
        const curAudioIn = await client.getCurrentAudioInputDevice();
        this.hasValue(curAudioIn);
    }

    async test_050_getVideoInputDevices() {
        const videoInputDevices = await client.getVideoInputDevices();
        this.hasValue(videoInputDevices);
        this.isGreaterThan(videoInputDevices.length, 0);
    }

    async test_060_getCurrentVideoInputDevice() {
        const curVideoIn = await client.getCurrentVideoInputDevice();
        this.isNull(curVideoIn);
    }

    async test_070_toggleAudio() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            client.toggleAudio());
        this.isTrue(evt.muted);
    }

    async test_080_isAudioMuted() {
        let muted = await client.isAudioMutedAsync();
        this.isTrue(muted);
    }

    async test_090_setAudioMuted() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            client.setAudioMutedAsync(false));
        this.isFalse(evt.muted);
    }

    async test_100_toggleVideo() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            client.toggleVideo());
        this.isFalse(evt.muted);
    }

    async test_110_isVideoMuted() {
        let muted = await client.isVideoMutedAsync();
        this.isFalse(muted);
    }

    async test_120_setVideoMuted() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            client.setVideoMutedAsync(true));
        this.isTrue(evt.muted);
    }

    async test_125_resetDevices() {
        const audioMuted = await client.isAudioMutedAsync(),
            videoMuted = await client.isVideoMutedAsync();

        if (audioMuted) {
            await client.setAudioMutedAsync(false);
        }

        if (!videoMuted) {
            await client.setVideoMutedAsync(true);
        }

        this.success("Devices normalized");
    }

    async test_130_participantJoined() {
        const loc = new URL(document.location.href);
        loc.hash = "2";
        await this.waitForJoin();
    }

    //*
    async test_140_initUser() {
        await this.initUsers();
    }

    async test_150_recvEmoji() {
        await this.recvEmoji();
    }

    async test_160_sendEmoji() {
        await this.sendEmoji();
    }

    async test_170_sendAudioMuted() {
        await this.sendAudioMuted();
    }

    async test_180_recvAudioMuted() {
        await this.recvAudioMuted();
    }

    async test_190_sendAudioUnmuted() {
        await this.sendAudioUnmuted();
    }

    async test_200_recvAudioUnmuted() {
        await this.recvAudioUnmuted();
    }

    async test_210_sendVideoUnmuted() {
        await this.sendVideoUnmuted();
    }

    async test_220_recvVideoUnmuted() {
        await this.recvVideoUnmuted();
    }

    async test_230_sendVideoMuted() {
        await this.sendVideoMuted();
    }

    async test_240_recvVideoMuted() {
        await this.recvVideoMuted();
    }

    async test_250_sendPosition() {
        await this.sendPosition();
    }

    async test_260_recvPosition() {
        await this.recvPosition();
    }

    async test_998_participantLeft() {
        const evt = await client.once("participantLeft", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isFalse(client.otherUsers.has(evt.id));
    }

    async test_999_leaveConference() {
        const evt = await this.withEvt("videoConferenceLeft", () =>
            client.leave());
        this.hasValue(evt.roomName);
        this.isEqualTo(evt.roomName, TEST_ROOM_NAME);
    }
    //*/
}

class JitsiClient2_Tests extends TestBase {
    async test_000_joinChannel() {
        await this.joinChannel();
    }

    async test_130_participantJoined() {
        await this.waitForJoin();
    }

    async test_140_initUser() {
        await this.initUsers();
    }

    async test_150_sendEmoji() {
        await this.sendEmoji();
    }

    async test_160_recvEmoji() {
        await this.recvEmoji();
    }

    async test_170_recvAudioMuted() {
        await this.recvAudioMuted();
    }

    async test_180_sendAudioMuted() {
        await this.sendAudioMuted();
    }

    async test_190_recvAudioUnmuted() {
        await this.recvAudioUnmuted();
    }

    async test_200_sendAudioUnmuted() {
        await this.sendAudioUnmuted();
    }

    async test_210_recvVideoUnmuted() {
        await this.recvVideoUnmuted();
    }

    async test_220_sendVideoUnmuted() {
        await this.sendVideoUnmuted();
    }

    async test_230_recvVideoMuted() {
        await this.recvVideoMuted();
    }

    async test_240_sendVideoMuted() {
        await this.sendVideoMuted();
    }

    async test_250_recvPosition() {
        await this.recvPosition();
    }

    async test_260_sendPosition() {
        await this.sendPosition();
    }

    async test_980_participantLeft() {
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