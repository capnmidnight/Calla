import { CallaEvent, copy } from "../events.js";

const evtSetPosition = Object.seal({
    id: null,
    x: null,
    y: null
}),
    evtSetAudioProperties = Object.seal({
        origin: null,
        transitionTime: null,
        minDistance: null,
        maxDistance: null,
        rolloff: null
    }),
    evtRemoveUser = Object.seal({
        id: null
    });

export class ExternalJitsiAudioClient extends EventTarget {
    constructor(host, apiOrigin, apiWindow) {
        super();
        this.host = host;
        this.apiOrigin = apiOrigin;
        this.apiWindow = apiWindow;
        window.addEventListener("message", (evt) => {
            this.rxJitsiHax(evt);
        });
    }


    /// Send a Calla message to the jitsihax.js script
    txJitsiHax(command, value) {
        if (this.apiWindow) {
            const evt = {
                hax: APP_FINGERPRINT,
                command: command,
                value: value
            };
            try {
                this.apiWindow.postMessage(JSON.stringify(evt), this.apiOrigin);
            }
            catch (exp) {
                console.error(exp);
            }
        }
    }

    rxJitsiHax(msg) {
        const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);
        if (msg.origin === "https://" + this.host || isLocalHost) {
            try {
                const evt = JSON.parse(msg.data);
                if (evt.hax === APP_FINGERPRINT) {
                    const evt2 = new CallaEvent(evt);
                    this.dispatchEvent(evt2);
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
    }

    setLocalPosition(evt) {
        this.txJitsiHax("setLocalPosition", copy(evtSetPosition, evt));
    }

    setUserPosition(evt) {
        this.txJitsiHax("setUserPosition", copy(evtSetPosition, evt));
    }

    setAudioProperties(evt) {
        this.txJitsiHax("setAudioProperties", copy(evtSetAudioProperties, evt));
    }

    removeUser(evt) {
        this.txJitsiHax("removeUser", copy(evtRemoveUser, evt));
    }
}