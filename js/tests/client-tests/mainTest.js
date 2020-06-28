import { TestBase } from "./baseTest.js";

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
        this.hasValue(audioOutputDevices);
        this.isGreaterThan(audioOutputDevices.length, 0);
    }

    //*
    async test_020_getCurrentAudioOutputDevice() {
        const curAudioOut = await this.client.getCurrentAudioOutputDevice();
        this.hasValue(curAudioOut);
    }

    async test_030_getAudioInputDevices() {
        const audioInputDevices = await this.client.getAudioInputDevices();
        this.hasValue(audioInputDevices);
        this.isGreaterThan(audioInputDevices.length, 0);
    }

    async test_040_getCurrentAudioInputDevice() {
        const curAudioIn = await this.client.getCurrentAudioInputDevice();
        this.hasValue(curAudioIn);
    }

    async test_050_getVideoInputDevices() {
        const videoInputDevices = await this.client.getVideoInputDevices();
        this.hasValue(videoInputDevices);
        this.isGreaterThan(videoInputDevices.length, 0);
    }

    async test_060_getCurrentVideoInputDevice() {
        const curVideoIn = await this.client.getCurrentVideoInputDevice();
        this.isNull(curVideoIn);
    }

    async test_070_toggleAudio() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            this.client.toggleAudio());
        this.isTrue(evt.muted);
    }

    async test_080_isAudioMuted() {
        let muted = await this.client.isAudioMutedAsync();
        this.isTrue(muted);
    }

    async test_090_setAudioMuted() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            this.client.setAudioMutedAsync(false));
        this.isFalse(evt.muted);
    }

    async test_100_toggleVideo() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            this.client.toggleVideo());
        this.isFalse(evt.muted);
    }

    async test_110_isVideoMuted() {
        let muted = await this.client.isVideoMutedAsync();
        this.isFalse(muted);
    }

    async test_120_setVideoMuted() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            this.client.setVideoMutedAsync(true));
        this.isTrue(evt.muted);
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

    async test_130_participantJoined() {
        const loc = new URL(document.location.href);
        loc.hash = "2";
        window.open(loc.href, "_blank", "screenX:10,screenY:10,width:400,height:600");
        await this.waitForJoin();
    }

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
        const evt = await this.client.once("participantLeft", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isFalse(this.client.otherUsers.has(evt.id));
    }

    async test_999_leaveConference() {
        const evt = await this.withEvt("videoConferenceLeft", () =>
            this.client.leave());
        this.hasValue(evt.roomName);
        this.isEqualTo(evt.roomName, TEST_ROOM_NAME);
    }
    //*/
}
