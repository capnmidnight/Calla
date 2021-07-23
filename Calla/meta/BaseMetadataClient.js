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
}
//# sourceMappingURL=BaseMetadataClient.js.map