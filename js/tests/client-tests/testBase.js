import { TestCase } from "../../testing/TestCase.js";
import { bust } from "../../src/emoji.js";
import { userNumber } from "./userNumber.js";

const TEST_ROOM_NAME = "testroom";

export class TestBase extends TestCase {

    constructor() {
        super();
        this.client = null;
    }

    async withEvt(name, action) {
        const evtTask = this.client.once(name, 5000);
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
            this.client.joinAsync(
                "jitsi.calla.chat",
                TEST_ROOM_NAME,
                "TestUser" + userNumber));
        this.isEqualTo(evt.id, this.client.localUser);
    }

    async waitForJoin() {
        if (this.client.otherUsers.size === 0) {
            await this.client.once("participantJoined", 5000);
        }

        this.isGreaterThan(this.client.otherUsers.size, 0);
        for (let id of this.client.otherUsers.keys()) {
            this.hasValue(id);
        }
    }

    async initUsers() {
        const requests = [];
        for (let id of this.client.otherUsers.keys()) {
            requests.push(this.client.userInitRequestAsync(id));
        }
        const responses = await Promise.all(requests);
        this.hasValue(responses);
        this.isGreaterThan(responses.length, 0);

        for (let response of responses) {
            this.hasValue(response.id);
            this.isNotEqualTo(response.id, this.client.localUser);

            this.hasValue(response.userNumber);
            this.isNotEqualTo(response.userNumber, userNumber);
        }
    }

    async sendEmoji() {
        this.client.emote(bust);
        this.success("Emoji sent");
    }

    async recvEmoji() {
        const evt = await this.client.once("emote", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(this.client.otherUsers.has(evt.id));
        this.isEqualTo(evt.value, bust.value);
        this.isEqualTo(evt.desc, bust.desc);
    }

    async sendAudioMuted() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            this.client.setAudioMutedAsync(true));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, this.client.localUser);
        this.isTrue(evt.muted);
    }

    async sendAudioUnmuted() {
        const evt = await this.withEvt("localAudioMuteStatusChanged", () =>
            this.client.setAudioMutedAsync(false));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, this.client.localUser);
        this.isFalse(evt.muted);
    }

    async recvAudioMuted() {
        const evt = await this.client.once("remoteAudioMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(this.client.otherUsers.has(evt.id));
        this.isTrue(evt.muted);
    }

    async recvAudioUnmuted() {
        const evt = await this.client.once("remoteAudioMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(this.client.otherUsers.has(evt.id));
        this.isFalse(evt.muted);
    }

    async sendVideoUnmuted() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            this.client.setVideoMutedAsync(false));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, this.client.localUser);
        this.isFalse(evt.muted);
    }

    async sendVideoMuted() {
        const evt = await this.withEvt("localVideoMuteStatusChanged", () =>
            this.client.setVideoMutedAsync(true));
        this.hasValue(evt.id);
        this.isEqualTo(evt.id, this.client.localUser);
        this.isTrue(evt.muted);
    }

    async recvVideoUnmuted() {
        const evt = await this.client.once("remoteVideoMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(this.client.otherUsers.has(evt.id));
        this.isFalse(evt.muted);
    }

    async recvVideoMuted() {
        const evt = await this.client.once("remoteVideoMuteStatusChanged", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(this.client.otherUsers.has(evt.id));
        this.isTrue(evt.muted);
    }

    async sendPosition() {
        const x = ((userNumber - 1) * 2 - 1) * 5;
        this.client.setPosition({ id: this.client.localUser, x, y: 0 });
        this.success("Position sent");
    }

    async recvPosition() {
        const x = ((userNumber - 1) * 2 - 1) * -5;
        const evt = await this.client.once("userMoved", 5000);
        this.hasValue(evt);
        this.hasValue(evt.id);
        this.isTrue(this.client.otherUsers.has(evt.id));
        this.isEqualTo(evt.x, x);
        this.isEqualTo(evt.y, 0);
    }
}