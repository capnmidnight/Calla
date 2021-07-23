import { TypedEventBase } from "kudzu/events/EventBase";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
export class BaseMetadataClient extends TypedEventBase {
    async getNext(evtName, userID) {
        return new Promise((resolve) => {
            const getter = (evt) => {
                if (evt instanceof CallaUserEvent
                    && evt.userID === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };
            this.addEventListener(evtName, getter);
        });
    }
    get isConnected() {
        return this.metadataState === ConnectionState.Connected;
    }
    setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callInternal("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    tellLocalPose(userid, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callInternalSingle(userid, "userPosedSingle", px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.callInternal("userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setAvatarEmoji(emoji) {
        this.callInternal("setAvatarEmoji", emoji);
    }
    tellAvatarEmoji(userid, emoji) {
        this.callInternalSingle(userid, "setAvatarEmoji", emoji);
    }
    setAvatarURL(url) {
        this.callInternal("setAvatarURL", url);
    }
    tellAvatarURL(userid, url) {
        this.callInternalSingle(userid, "setAvatarURL", url);
    }
    emote(emoji) {
        this.callInternal("emote", emoji);
    }
    chat(text) {
        this.callInternal("chat", text);
    }
}
//# sourceMappingURL=BaseMetadataClient.js.map