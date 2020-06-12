import { JitsiClient, Game } from "./package/calla.min.js";
(async function () {
    await import(`https://${JITSI_HOST}/libs/external_api.min.js`);
    const jitsiClient = new JitsiClient(
        JitsiMeetExternalAPI,
        document.querySelector("#jitsi"));
    window.game = new Game(jitsiClient);
})();