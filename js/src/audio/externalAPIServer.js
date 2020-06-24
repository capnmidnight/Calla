import { Manager } from "./manager.js";

const FRONT_END_SERVER = "https://www.calla.chat",
    ALLOW_LOCAL_HOST = true,
    APP_FINGERPRINT = "Calla",
    manager = new Manager();

manager.addEventListener("audioActivity", (evt) => {
    txJitsiHax("audioActivity", {
        id: evt.id,
        isActive: evt.isActive
    });
});

function txJitsiHax(command, value) {
    if (manager.origin !== null) {
        const evt = {
            hax: APP_FINGERPRINT,
            command,
            value
        }
        window.parent.postMessage(JSON.stringify(evt), manager.origin);
    }
}

window.addEventListener("message", (msg) => {
    const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);

    if (msg.origin === FRONT_END_SERVER
        || ALLOW_LOCAL_HOST && isLocalHost) {
        try {
            const evt = JSON.parse(msg.data),
                isJitsiHax = evt.hax === APP_FINGERPRINT;

            if (isJitsiHax && !!manager[evt.command]) {
                manager[evt.command](evt.value);
            }
        }
        catch (exp) {
            console.error(exp);
        }
    }
});
