import { CallaEvent } from "../events.js";

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
            this.apiWindow.postMessage(JSON.stringify(evt), this.apiOrigin);
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
        this.txJitsiHax("setLocalPosition", evt);
    }

    setUserPosition(evt) {
        this.txJitsiHax("setUserPosition", evt);
    }

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        this.txJitsiHax("setAudioProperties", {
            origin,
            transitionTime,
            minDistance,
            maxDistance,
            rolloff
        });
    }
}