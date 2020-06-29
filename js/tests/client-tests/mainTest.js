import { TestBase } from "./baseTest.js";
import { wait } from "../../src/wait.js";

const TEST_ROOM_NAME = "testroom";

export class JitsiClient1_Tests extends TestBase {

    constructor() {
        super();
    }

    async test_000_joinChannel() {
        await this.joinChannel();
    }

    async test_010_getAudioOutputDevices() {
        const audioOutputDevices = await this.client.getAudioOutputDevices();
        this.hasValue(audioOutputDevices, "Devices");
        this.isGreaterThan(audioOutputDevices.length, 0, "Device Count");
    }

    async test_020_getCurrentAudioOutputDevice() {
        const curAudioOut = await this.client.getCurrentAudioOutputDevice();
        this.hasValue(curAudioOut, "Audio Output");
    }

    async test_025_setCurrentAudioOutputDevice() {
        const devs = await this.client.getAudioOutputDevices(),
            cur = await this.client.getCurrentAudioOutputDevice(),
            alt = devs.filter(a => cur === null || a.groupId !== cur.groupId);

        this.isGreaterThan(alt.length, 0, "Alternate devices");

        const next = alt[0];
        this.client.setAudioOutputDevice(next);

        await wait(250);
        const now = await this.client.getCurrentAudioOutputDevice();
        this.hasValue(now, "New device");
        this.isEqualTo(now.deviceId, next.deviceId, "deviceId");
        this.isEqualTo(now.kind, next.kind, "kind");
        this.isEqualTo(now.label, next.label, "label");
    }

    async test_030_getAudioInputDevices() {
        const audioInputDevices = await this.client.getAudioInputDevices();
        this.hasValue(audioInputDevices, "Devices");
        this.isGreaterThan(audioInputDevices.length, 0, "Device Count");
    }

    async test_040_getCurrentAudioInputDevice() {
        const curAudioIn = await this.client.getCurrentAudioInputDevice();
        this.hasValue(curAudioIn, "Audio Input");
    }

    async test_045_setCurrentAudioInputDevice() {
        const devs = await this.client.getAudioInputDevices(),
            cur = await this.client.getCurrentAudioInputDevice(),
            alt = devs.filter(a => cur === null || a.groupId !== cur.groupId);

        this.isGreaterThan(alt.length, 0, "Alternate devices");

        const next = alt[0];
        this.client.setAudioInputDevice(next);

        await wait(250);
        const now = await this.client.getCurrentAudioInputDevice();
        this.hasValue(now, "New device");
        this.isEqualTo(now.deviceId, next.deviceId, "deviceId");
        this.isEqualTo(now.kind, next.kind, "kind");
        this.isEqualTo(now.label, next.label, "label");
    }

    async test_050_getVideoInputDevices() {
        const videoInputDevices = await this.client.getVideoInputDevices();
        this.hasValue(videoInputDevices, "Devices");
        this.isGreaterThan(videoInputDevices.length, 0, "Device Count");
    }

    async test_060_getCurrentVideoInputDevice() {
        const curVideoIn = await this.client.getCurrentVideoInputDevice();
        this.isNull(curVideoIn, "Current Video");
    }

    async test_065_setCurrentVideoInputDevice() {
        const muted1 = await this.client.isVideoMutedAsync();
        if (muted1) {
            const unmuteTask = this.client.once("localVideoMuteStatusChanged");
            await this.client.setVideoMutedAsync(false);
            const muted2 = (await unmuteTask).muted;
            this.isFalse(muted2, "Video muted");
        }

        const devs = await this.client.getVideoInputDevices(),
            cur = await this.client.getCurrentVideoInputDevice(),
            alt = devs.filter(a => cur === null || a.groupId !== cur.groupId);

        this.isGreaterThan(alt.length, 0, "Alternate devices");

        const next = alt[0];
        this.client.setVideoInputDevice(next);

        await wait(250);
        const now = await this.client.getCurrentVideoInputDevice();
        this.hasValue(now, "New device");
        this.isEqualTo(now.deviceId, next.deviceId, "deviceId");
        this.isEqualTo(now.kind, next.kind, "kind");
        this.isEqualTo(now.label, next.label, "label");
    }

    async test_066_resetDevices() {
        const audioMuted = await this.client.isAudioMutedAsync(),
            videoMuted = await this.client.isVideoMutedAsync();

        if (audioMuted) {
            await this.client.setAudioMutedAsync(false);
        }

        if (!videoMuted) {
            await this.client.setVideoMutedAsync(true);
        }

        this.success();
    }

    async test_070_toggleAudio() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            this.client.toggleAudio());
        this.isTrue(evt.muted, "Muted");
    }

    async test_080_isAudioMuted() {
        let muted = await this.client.isAudioMutedAsync();
        this.isTrue(muted, "Muted");
    }

    async test_090_setAudioMuted() {
        await wait(1000);
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            this.client.setAudioMutedAsync(false));
        this.isFalse(evt.muted, "Muted");
    }

    async test_100_toggleVideo() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            this.client.toggleVideo());
        this.isFalse(evt.muted, "Muted");
    }

    async test_110_isVideoMuted() {
        let muted = await this.client.isVideoMutedAsync();
        this.isFalse(muted, "Muted");
    }

    async test_120_setVideoMuted() {
        await wait(1000);
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            this.client.setVideoMutedAsync(true));
        this.isTrue(evt.muted, "Muted");
    }

    async test_125_resetDevices() {
        const audioMuted = await this.client.isAudioMutedAsync(),
            videoMuted = await this.client.isVideoMutedAsync();

        if (audioMuted) {
            await this.client.setAudioMutedAsync(false);
        }

        if (!videoMuted) {
            await this.client.setVideoMutedAsync(true);
        }

        this.success();
    }

    /*

    async test_130_participantJoined() {
        const loc = new URL(document.location.href);
        loc.hash = "2";
        window.open(loc.href, "_blank", "left=10,top=10,width=800,height=1000");
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
        const evt = await this.client.once("participantLeft", 5000);
        this.hasValue(evt.id, "UserID");
        this.isFalse(this.client.otherUsers.has(evt.id), "Remote User");
    }

    async test_999_leaveConference() {
        const evt = await this.withEvt("videoConferenceLeft", () =>
            this.client.leave());
        this.isEqualTo(evt.roomName, TEST_ROOM_NAME, "Room Name");
    }
    //*/
}
