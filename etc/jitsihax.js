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
        ALLOW_LOCAL_HOST = true,
        USE_3D_SPATIALIZATION = true;

    let USE_BASIC_AUDIO = true;


    // The rest is just implementation.

    const sources = {},
        spatialize = USE_3D_SPATIALIZATION && !!window["PannerNode"];

    let audioContext = null,
        minDistance = 2,
        maxDistance = 15,
        transitionTime = 0;

    function captureAudioElement(userId, audio) {
        if (!sources[userId]) {
            audio.volume = 0;

            if (!audioContext) {
                audioContext = new AudioContext();

                if (spatialize) {
                    const listener = audioContext.listener,
                        time = audioContext.currentTime;
                    listener.forwardX.setValueAtTime(0, time);
                    listener.forwardY.setValueAtTime(0, time);
                    listener.forwardZ.setValueAtTime(-1, time);
                    listener.upX.setValueAtTime(0, time);
                    listener.upY.setValueAtTime(1, time);
                    listener.upZ.setValueAtTime(0, time);
                }
            }

            const stream = !!audio.mozCaptureStream
                ? audio.mozCaptureStream()
                : audio.captureStream(),
                source = audioContext.createMediaStreamSource(stream);

            if (spatialize) {
                const panner = audioContext.createPanner();
                panner.panningModel = "HRTF";
                panner.distanceModel = "inverse";
                panner.refDistance = minDistance;
                panner.maxDistance = maxDistance;
                panner.rolloffFactor = 1;
                panner.coneInnerAngle = 360;
                panner.coneOuterAngle = 0;
                panner.coneOuterGain = 0;
                panner.positionY.value = 0;

                source.connect(panner);
                panner.connect(audioContext.destination);

                sources[userId] = {
                    source,
                    panner
                };
            }
            else {
                const panner = audioContext.createStereoPanner(),
                    gain = audioContext.createGain();

                source.connect(panner);
                panner.connect(gain);
                gain.connect(audioContext.destination);

                sources[userId] = {
                    source,
                    panner,
                    gain
                };
            }
        }
    }

    // helps us filter out data channel messages that don't belong to us
    const LOZYA_FINGERPRINT = "lozya",

        commands = {
            setVolume: function (evt) {
                const id = `#participant_${evt.user} audio`,
                    audio = document.querySelector(id);
                if (audio) {
                    if (USE_BASIC_AUDIO) {
                        audio.volume = evt.volume;
                    }
                    else {
                        try {
                            captureAudioElement(evt.user, audio);

                            const source = sources[evt.user];
                            const time = audioContext.currentTime + transitionTime;

                            if (spatialize) {
                                source.panner.positionX.setValueAtTime(evt.x, time);

                                // our 2D position is in X/Y coords, but our 3D position 
                                // along the horizontal plane is X/Z coords.
                                source.panner.positionZ.setValueAtTime(evt.y, time);
                            }
                            else {
                                source.panner.pan.setTargetAtTime(evt.panning, time);
                                source.gain.gain.setTargetAtTime(evt.volume, time);
                            }
                        }
                        catch (exp) {
                            console.warn("Couldn't configure advanced audio features");
                            console.error(exp);
                            USE_BASIC_AUDIO = true;
                            command.setVolume(evt);
                        }
                    }
                }
                else {
                    console.warn(`Could not find audio element for user ${evt.user}`);
                }
            },

            setAudioProperties: function (evt) {
                minDistance = evt.minDistance;
                maxDistance = evt.maxDistance;
                transitionTime = evt.transitionTime;
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
