import { once } from "../../../src/events/once.js";
import { wait } from "../../../src/events/wait.js";
import { openSideTest } from "../../testing/windowing.js";
import { TestBase } from "./TestBase.js";

const TEST_ROOM_NAME = "testroom";

export class JitsiClient1_Tests extends TestBase {

    constructor() {
        super();
    }

    async test_000_joinChannel() {
        await this.joinChannel();
    }

    async test_010_getAudioOutputDevices() {
        const devs = await this.client.getAudioOutputDevicesAsync();
        this.hasValue(devs, "Devices");
        this.isGreaterThan(devs.length, 0, "Device Count");
    }

    async test_020_getCurrentAudioOutputDevice() {
        const cur = await this.client.getCurrentAudioOutputDeviceAsync();
        this.hasValue(cur, "Audio Output");
    }

    async test_025_setCurrentAudioOutputDevice() {
        const devs = await this.client.getAudioOutputDevicesAsync(),
            cur = await this.client.getCurrentAudioOutputDeviceAsync(),
            alt = devs.filter(a => cur === null || a.groupId !== cur.groupId);

        this.isGreaterThan(alt.length, 0, "Alternate devices");

        const next = alt[0];
        this.client.setAudioOutputDeviceAsync(next);

        await wait(250);
        const now = await this.client.getCurrentAudioOutputDeviceAsync();
        this.hasValue(now, "New device");
        this.isEqualTo(now.deviceId, next.deviceId, "deviceId");
        this.isEqualTo(now.kind, next.kind, "kind");
        this.isEqualTo(now.label, next.label, "label");
    }

    async test_030_getAudioInputDevices() {
        const devs = await this.client.getAudioInputDevicesAsync();
        this.hasValue(devs, "Devices");
        this.isGreaterThan(devs.length, 0, "Device Count");
    }

    async test_040_getCurrentAudioInputDevice() {
        const cur = await this.client.getCurrentAudioInputDeviceAsync();
        this.hasValue(cur, "Audio Input");
    }

    async test_045_setCurrentAudioInputDevice() {
        const devs = await this.client.getAudioInputDevicesAsync(),
            cur = await this.client.getCurrentAudioInputDeviceAsync(),
            alt = devs.filter(a => cur === null || a.groupId !== cur.groupId);

        this.isGreaterThan(alt.length, 0, "Alternate devices");

        const next = alt[0];
        await this.client.setAudioInputDeviceAsync(next);

        const now = await this.client.getCurrentAudioInputDeviceAsync();
        this.hasValue(now, "New device");
        this.isEqualTo(now.deviceId, next.deviceId, "deviceId");
        this.isEqualTo(now.kind, next.kind, "kind");
        this.isEqualTo(now.label, next.label, "label");
    }

    async test_050_getVideoInputDevices() {
        const devs = await this.client.getVideoInputDevicesAsync();
        this.hasValue(devs, "Devices");
        this.isGreaterThan(devs.length, 0, "Device Count");
    }

    async test_060_getCurrentVideoInputDevice() {
        const cur = await this.client.getCurrentVideoInputDeviceAsync();
        this.isNull(cur, "Current Video");
    }

    async test_065_setCurrentVideoInputDevice() {
        const devs = await this.client.getVideoInputDevicesAsync(),
            cur = await this.client.getCurrentVideoInputDeviceAsync(),
            alt = devs.filter(a => cur === null || a.groupId !== cur.groupId);

        this.isGreaterThan(alt.length, 0, "Alternate devices");

        const next = alt[0];
        await this.client.setVideoInputDeviceAsync(next);

        const now = await this.client.getCurrentVideoInputDeviceAsync();
        this.hasValue(now, "New device");
        this.isEqualTo(now.deviceId, next.deviceId, "deviceId");
        this.isEqualTo(now.kind, next.kind, "kind");
        this.isEqualTo(now.label, next.label, "label");
    }

    async resetDevices() {
        const audioMuted = await this.client.setAudioMutedAsync(false);
        this.isFalse(audioMuted, "Audio muted");

        const videoMuted = await this.client.setVideoMutedAsync(true);
        this.isTrue(videoMuted, "Video not muted");

        this.success();
    }

    async test_066_resetDevices() {
        await this.resetDevices();
    }

    async test_070_toggleAudio() {
        const wasMuted = this.client.isAudioMuted;
        const isMuted = await this.client.toggleAudioMutedAsync();
        this.isNotEqualTo(isMuted, wasMuted, "Muted 1");
        this.isEqualTo(isMuted, this.client.isAudioMuted, "Muted 2");
    }

    async test_080_isAudioMuted() {
        this.isTrue(this.client.isAudioMuted, "Muted");
    }

    async test_090_setAudioMuted() {
        await wait(1000);
        const isMuted = await this.client.setAudioMutedAsync(false);
        this.isFalse(isMuted, "Muted");
    }

    async test_100_toggleVideo() {
        const wasMuted = this.client.isVideoMuted;
        const isMuted = await this.client.toggleVideoMutedAsync();
        this.isNotEqualTo(isMuted, wasMuted, "Muted 1");
        this.isEqualTo(isMuted, this.client.isVideoMuted, "Muted 2");
    }

    async test_110_isVideoMuted() {
        this.isFalse(this.client.isVideoMuted, "Muted");
    }

    async test_120_setVideoMuted() {
        await wait(1000);
        const isMuted = await this.client.setVideoMutedAsync(true);
        this.isTrue(isMuted, "Muted");
    }

    async test_125_resetDevices() {
        await this.resetDevices();
    }

    async test_130_participantJoined() {
        openSideTest();
        await this.waitForJoin();
    }

    async test_140_initUser() {
        await this.initUsers();
    }

    async test_145_sendPhotoAvatar() {
        await this.sendPhotoAvatar();
    }

    async test_146_recvPhotoAvatar() {
        await this.recvPhotoAvatar();
    }

    async test_150_sendEmoji() {
        await this.sendEmoji();
    }

    async test_160_recvEmoji() {
        await this.recvEmoji();
    }

    async test_165_sendPosition() {
        await this.sendPosition();
    }

    async test_166_recvPosition() {
        await this.recvPosition();
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

    async test_998_participantLeft() {
        const evt = await once(this.client, "participantLeft", 5000);
        this.hasValue(evt.id, "UserID");
        this.isFalse(this.client.userExists(evt.id), "Remote User");
    }

    async test_999_leaveConference() {
        const evt = await this.client.leaveAsync();
        this.isEqualTo(evt.roomName, TEST_ROOM_NAME, "Room Name");
    }
}
