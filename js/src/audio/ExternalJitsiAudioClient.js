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