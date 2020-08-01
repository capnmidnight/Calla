import { bust } from "../../../src/emoji/index.js";
import { once } from "../../../src/events/once.js";
import { when } from "../../../src/events/when.js";
import { LibJitsiMeetClient } from "../../../src/LibJitsiMeetClient";
import { wait } from "../../../src/wait.js";
import { TestCase } from "../../testing/TestCase.js";
import { userNumber } from "../../testing/userNumber.js";

const TEST_ROOM_NAME = "testroom";

export class TestBase extends TestCase {

    constructor() {
        super();

        /** @type {LibJitsiMeetClient} */
        this.client = null;
    }


    async joinChannel() {
        const testUserName = "TestUser" + userNumber,
            evt = await this.client.joinAsync(
                TEST_ROOM_NAME,
                testUserName);
        this.isEqualTo(evt.displayName, testUserName);
        this.isEqualTo(evt.roomName, TEST_ROOM_NAME, "RoomName");
        this.isEqualTo(evt.id, this.client.localUser, "UserID");
    }

    async waitForJoin() {
        if (this.client.userIDs().length === 0) {
            await once(this.client, "participantJoined", 5000);
        }

        this.isGreaterThan(this.client.userIDs().length, 0, "No users found");
        for (let id of this.client.userIDs()) {
            this.hasValue(id, "UserID");
        }
    }

    async initUsers() {
        const requests = [];
        for (let id of this.client.userIDs()) {
            requests.push(this.client.userInitRequestAsync(id));
        }
        const responses = await Promise.all(requests);
        this.hasValue(responses, "Response");
        this.isGreaterThan(responses.length, 0, "No responses");

        for (let response of responses) {
            this.hasValue(response.id, "UserID");
            this.isNotEqualTo(response.id, this.client.localUser, "other user ID overlaps local user ID");

            this.hasValue(response.x, "User parameter");
            this.isNotEqualTo(response.x, userNumber, "Wrong user parameter");
        }
    }

    async sendEmoji() {
        await wait(1000);
        this.client.emote(bust);
        this.success();
    }

    async recvEmoji() {
        const evt = await once(this.client, "emote", 5000);
        this.hasValue(evt.id, "Other User ID");
        this.hasValue(evt.value, "Emoji value");
        this.hasValue(evt.desc, "Emoji description");
        this.isTrue(this.client.userExists(evt.id), "User exists");
        this.isEqualTo(evt.value, bust.value, "Emoji value");
        this.isEqualTo(evt.desc, bust.desc, "Emoji desc");
    }

    async sendAudioMuted() {
        await wait(1000);
        const isMuted = await this.client.setAudioMutedAsync(true);
        this.isTrue(isMuted, "Muted");
    }

    taskOf(evtName) {
        return when(this.client, evtName, (evt) => evt.id !== this.client.localUser, 5000);
    }

    async recvAudioMuted() {
        const evt = await this.taskOf("audioMuteStatusChanged");
        this.hasValue(evt.id, "UserID");
        this.isTrue(this.client.userExists(evt.id), "Remote User");
        this.isTrue(evt.muted, "Muted");
    }

    async sendAudioUnmuted() {
        await wait(1000);
        const isMuted = await this.client.setAudioMutedAsync(false);
        this.isFalse(isMuted, "Muted");
    }

    async recvAudioUnmuted() {
        const evt = await this.taskOf("audioMuteStatusChanged");
        this.hasValue(evt.id, "UserID");
        this.isTrue(this.client.userExists(evt.id), "Remote User");
        this.isFalse(evt.muted, "Muted");
    }

    async sendVideoUnmuted() {
        await wait(1000);
        const isMuted = await this.client.setVideoMutedAsync(false);
        this.isFalse(isMuted, "Muted");
    }

    async recvVideoUnmuted() {
        const evt = await this.taskOf("videoMuteStatusChanged");
        this.hasValue(evt.id, "UserID");
        this.isTrue(this.client.userExists(evt.id), "Remote User");
        this.isFalse(evt.muted, "Muted");
    }

    async sendVideoMuted() {
        await wait(1000);
        const isMuted = await this.client.setVideoMutedAsync(true);
        this.isTrue(isMuted, "Muted");
    }

    async recvVideoMuted() {
        const evt = await this.taskOf("videoMuteStatusChanged");
        this.hasValue(evt.id, "UserID");
        this.isTrue(this.client.userExists(evt.id), "Remote User");
        this.isTrue(evt.muted, "Muted");
    }

    async sendPosition() {
        await wait(1000);
        this.client.startAudio();
        const x = ((userNumber - 1) * 2 - 1) * 5;
        this.client.setLocalPosition(x, 0, 0);
        this.success();
    }

    async recvPosition() {
        const x = ((userNumber - 1) * 2 - 1) * -5;
        const evt = await once(this.client, "userMoved", 5000);
        this.hasValue(evt.id, "UserID");
        this.isTrue(this.client.userExists(evt.id), "Remote User");
        this.isEqualTo(evt.x, x);
        this.isEqualTo(evt.y, 0);
    }

    async sendPhotoAvatar() {
        await wait(1000);
        this.client.avatarURL = "https://www.seanmcbeth.com/2015-05.min.jpg";
        this.success();
    }

    async recvPhotoAvatar() {
        const evt = await once(this.client, "avatarChanged", 5000);
        this.hasValue(evt.id, "UserID");
        this.isTrue(this.client.userExists(evt.id), "Remote User");
        this.isEqualTo(evt.url, "https://www.seanmcbeth.com/2015-05.min.jpg", "Avatar URL");
    }
}