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
        ALT_FRONT_END_SERVER = FRONT_END_SERVER,
        ALLOW_LOCAL_HOST = true;



    // The rest is just implementation.

    // helps us filter out data channel messages that don't belong to us
    const LOZYA_FINGERPRINT = "lozya",
        userLookup = {};

    let audioContext = null,
        availableAudioModes = (window["StereoPannerNode"] && 1)
            | (window["PannerNode"] && 2),

        // these values will get overwritten when the user sets their audio properties
        minDistance = 2,
        maxDistance = 15,
        transitionTime = 0,        
        audioMode = 0, // 0 - basic volume scaling, 1 - stereo panning, 2 - spatialized audio

        use3D = false,
        useStereo = false;

    function setAudioProperties(evt) {
        minDistance = evt.minDistance;
        maxDistance = evt.maxDistance;
        transitionTime = evt.transitionTime;
        audioMode = Math.max(0, Math.min(2, evt.audioMode));

        updateAudioProperties();
    }

    function getUserAudio(userId) {
        if (!userLookup[userId]) {
            const audio = document.querySelector(id);
            userLookup[userId] = {
                audio,
                source = null,
                panner = null,
                gain = null
            };
        }

        const user = userLookup[userId];
        console.log(userId, user.audio.parentElement);
        return user;
    }

    function setUserAudioProperties(user) {

        if (use3D) {
            if (!!user.gain) {
                user.gain.disconnect(audioContext.destination);
                user.panner.disconnect(user.gain);
                user.gain = null;
                user.panner = null;
            }
            else if (!user.source) {
                const stream = !!audio.mozCaptureStream
                    ? audio.mozCaptureStream()
                    : audio.captureStream();
                user.source = audioContext.createMediaStreamSource(stream);
            }

            if (!user.panner) {
                user.panner = audioContext.createPanner();
                user.panner.panningModel = "HRTF";
                user.panner.distanceModel = "inverse";
                user.panner.rolloffFactor = 1;
                user.panner.coneInnerAngle = 360;
                user.panner.coneOuterAngle = 0;
                user.panner.coneOuterGain = 0;
                user.panner.positionY.value = 0;

                user.source.connect(user.panner);
                user.panner.connect(audioContext.destination);
            }

            user.panner.refDistance = minDistance;
            user.panner.maxDistance = maxDistance;
        }
        else if (useStereo) {
            if (!!user.panner && !user.gain) {
                user.panner.disconnect(audioContext.destination);
                user.panner = null;
            }
            else if (!user.source) {
                const stream = !!audio.mozCaptureStream
                    ? audio.mozCaptureStream()
                    : audio.captureStream();
                user.source = audioContext.createMediaStreamSource(stream);
            }

            if (!user.panner) {
                user.panner = audioContext.createStereoPanner();
                user.gain = audioContext.createGain();

                user.source.connect(user.panner);
                user.panner.connect(user.gain);
                user.gain.connect(audioContext.destination);
            }
        }
        else {
            if (!!user.source) {
                user.source.disconnect(user.panner);
                user.source = null;
            }

            if (!!user.gain) {
                user.gain.disconnect(audioContext.destination);
                user.panner.disconnect(user.gain);
                user.gain = null;
                user.panner = null;
            }
            else if (!!user.panner) {
                user.panner.disconnect(audioContext.destination);
                user.panner = null;
            }
        }
    }

    function setVolume(evt) {
        const id = `#participant_${evt.user} audio`,
            user = getUserAudio(id);

        setUserAudioProperties(user);

        if (!use3D && !useStereo) {
            user.audio.volume = evt.volume;
        }
        else {
            user.audio.volume = 0;

            try {
                const time = audioContext.currentTime + transitionTime;

                if (use3D) {
                    user.panner.positionX.setValueAtTime(evt.x, time);

                    // our 2D position is in X/Y coords, but our 3D position 
                    // along the horizontal plane is X/Z coords.
                    user.panner.positionZ.setValueAtTime(evt.y, time);
                }
                else {
                    user.panner.pan.setTargetAtTime(evt.panning, time);
                    user.gain.gain.setTargetAtTime(evt.volume, time);
                }
            }
            catch (exp) {
                console.warn("Couldn't configure advanced audio features");
                console.error(exp);

                // disable the current audio mode from being re-used during
                // the current session.
                availableAudioModes &= ~audioMode;

                // downgrade audio mode
                --audioMode;

                updateAudioProperties();

                // retry
                setVolume(evt);
            }
        }
    }

    const availableAudioModes = [
        "Mono",
        "Mono | Stereo",
        "Mono | 3D",
        "Mono | Stereo | 3D"
    ];

    function updateAudioProperties() {
        console.info("Available audio modes: " + audioModes[availableAudioModes]);

        use3D = (audioMode & availableAudioModes) === 2;
        useStereo = (audioMode & availableAudioModes) === 1;

        const useBasic = !use3D && !useStereo;

        if (!useBasic && !audioContext) {
            audioContext = new AudioContext();
            if (use3D) {
                const listener = audioContext.listener, time = audioContext.currentTime;
                listener.forwardX.setValueAtTime(0, time);
                listener.forwardY.setValueAtTime(0, time);
                listener.forwardZ.setValueAtTime(-1, time);
                listener.upX.setValueAtTime(0, time);
                listener.upY.setValueAtTime(1, time);
                listener.upZ.setValueAtTime(0, time);
            }
        }

        for (let id in userLookup) {
            const user = getUserAudio(id);
            if (!user) {
                delete userLookup[id];
            }
            else {
                setUserAudioProperties(user);
            }
        }

        if (useBasic && !!audioContext) {
            delete audioContext;
        }
    }

    const commands = {
        setVolume,
        setAudioProperties
    };

    addEventListener("message", function (evt) {
        const isLocalHost = evt.origin.match(/^https?:\/\/localhost\b/);

        if (evt.origin === FRONT_END_SERVER
            || evt.origin === ALT_FRONT_END_SERVER
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
