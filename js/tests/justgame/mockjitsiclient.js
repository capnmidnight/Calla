import { JitsiClient } from "../../package/src/jitsihax-client.js";
import { randomPerson } from "../../package/src/emoji.js";

export class MockJitsiClient extends JitsiClient {
    constructor(ApiClass, parentNode) {
        super(ApiClass, parentNode);
    }

    mockRxGameData(command, id, data) {
        data = Object.assign({},
            data,
            {
                hax: "Calla",
                command
            });

        const text = JSON.stringify(data);

        this.rxGameData({
            data: {
                senderInfo: {
                    id
                },
                eventData: {
                    text
                }
            }
        });
    }

    txGameData(id, msg, data) {
        if (msg === "userInitRequest") {
            const user = game.userLookup[id];
            if (!!user) {
                user.avatarEmoji = randomPerson().value;
                this.mockRxGameData("userInitResponse", id, user);
            }
        }
    }

    toggleAudio() {
        super.toggleAudio();
        this.mockRxGameData("audioMuteStatusChanged", game.me.id, { muted: this.api.audioMuted });
    }

    toggleVideo() {
        super.toggleVideo();
        this.mockRxGameData("videoMuteStatusChanged", game.me.id, { muted: this.api.videoMuted });
    }

    setAvatarURL(url) {
        super.setAvatarURL(url);
        this.mockRxGameData("avatarChanged", game.me.id, { avatarURL: url });
    }
}