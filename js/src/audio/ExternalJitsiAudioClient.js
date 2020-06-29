import { BaseAudioClient } from "./BaseAudioClient.js";

export class ExternalJitsiAudioClient extends BaseAudioClient {
    constructor(host, apiOrigin, apiWindow) {
        super();

        /** @type {string} */
        this.host = host;

        /** @type {string} */
        this.apiOrigin = apiOrigin;

        /** @type {Window} */
        this.apiWindow = apiWindow;

        window.addEventListener("message", (evt) => {
            this.rxJitsiHax(evt);
        });
    }


    /**
     * Send a message to the Calla app
     * @param {string} command
     * @param {any} value
     */
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

    /**
     * Recieve a message from the Calla app.
     * @param {MessageEvent} msg
     */
    rxJitsiHax(msg) {
        const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);
        if (msg.origin === "https://" + this.host || isLocalHost) {
            try {
                const evt = JSON.parse(msg.data);
                if (evt.hax === APP_FINGERPRINT) {
                    const evt2 = new AudioClientEvent(evt);
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

    setAudioProperties(evt) {
        this.txJitsiHax("setAudioProperties", evt);
    }

    removeUser(evt) {
        this.txJitsiHax("removeUser", evt);
    }
}

export class AudioClientEvent extends Event {
    constructor(data) {
        super(data.command);
        Event.clone(this, data.value);
    }
}