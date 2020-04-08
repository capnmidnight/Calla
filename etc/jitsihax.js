(function () {
    "use strict";

    /*
     * This file is not part of the front-end code. It is
     * meant to be included in the Jitsi Meet server
     * installation. This is typically /usr/share/jitsi-meet.
     * 
     * Once installed in the Jitsi Meet server, edit
     * Jitsi Meet's index.html to include jitsihax.js.
     * 
     * Don't forget to also edit FRONT_END_SERVER below
     * to the server you are setting up to use the
     * Jitsi Meet External API:
     *   https://github.com/jitsi/jitsi-meet/blob/master/doc/api.md
     */

    const FRONT_END_SERVER = "https://meet.primrosevr.com",
        ALLOW_LOCAL_HOST = true;

    var audioCtxts = {};
    var gainNodes = {};
    var panNodes = {};

    function captureAudioElement(userId, audio) {
        if(!audioCtxts.hasOwnProperty(userId)) {
            audio.volume = 0;

            var audioCtxt = new window.AudioContext();

            var st = audio.mozCaptureStream ? audio.mozCaptureStream() : audio.captureStream();

            var source = audioCtxt.createMediaStreamSource(st);
            var gainNode = audioCtxt.createGain();
            var panNode = audioCtxt.createStereoPanner();

            source.connect(panNode);
            panNode.connect(gainNode);
            gainNode.connect(audioCtxt.destination);

            audioCtxts[userId] = audioCtxt;
            gainNodes[userId] = gainNode;
            panNodes[userId] = panNode;
        }
        else {
            console.warn(`Audio element for user ${userId} already grabbed.`);
        }
    }

    // helps us filter out data channel messages that don't belong to us
    const LOZYA_FINGERPRINT = "lozya",

        commands = {
            setVolume: function (evt) {
                const id = `#participant_${evt.user} audio`,
                    audio = document.querySelector(id);
                if (audio) {
                    if (!audioCtxts.hasOwnProperty(evt.user)) {
                        captureAudioElement(evt.user, audio);
                    }

                    panNodes[evt.user].pan.value = evt.panning;
                    gainNodes[evt.user].gain.value = evt.volume;
                }
                else {
                    console.warn(`Could not find audio element for user ${userNameInput}`);
                }
            }
        };

    addEventListener("message", function (evt) {
        const isLocalHost = evt.origin.match(/^https?:\/\/localhost\b/);

        if (evt.origin === FRONT_END_SERVER
            || ALLOW_LOCAL_HOST && isLocalHost) {
            try {
                const data = JSON.parse(evt.data),
                    isJitsiHax = data.hax === LOZYA_FINGERPRINT,
                    cmd = commands[data.command];

                if (isJitsiHax && !!cmd) {
                    cmd(data);
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
    });
})();
