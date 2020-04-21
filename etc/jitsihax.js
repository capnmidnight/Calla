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
        ALT_FRONT_END_SERVER = "https://www.calla.chat",
        ALLOW_LOCAL_HOST = true,
        BUFFER_SIZE = 16,
        AVERAGING_FRAMES = 10;

    // The rest is just implementation.

    function ensureContext() {
        if (!audioContext) {
            audioContext = new AudioContext();
            const listener = audioContext.listener;
            listener.positionX.value = 0;
            listener.positionY.value = 0;
            listener.positionZ.value = 0;
            listener.forwardX.value = 0;
            listener.forwardY.value = 0;
            listener.forwardZ.value = -1;
            listener.upX.value = 0;
            listener.upY.value = 1;
            listener.upZ.value = 0;
            requestAnimationFrame(updater);
            window.audioContext = audioContext;
        }
    }

    function getUserAudio(userID) {
        if (!userLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                const stream = !!audio.mozCaptureStream
                    ? audio.mozCaptureStream()
                    : audio.captureStream(),
                    source = audioContext.createMediaStreamSource(stream),
                    panner = audioContext.createPanner(),
                    analyser = audioContext.createAnalyser(),
                    buffer = new Float32Array((2 + AVERAGING_FRAMES) * BUFFER_SIZE);

                audio.volume = 0;

                panner.panningModel = "HRTF";
                panner.distanceModel = "inverse";
                panner.rolloffFactor = 1;
                panner.coneInnerAngle = 360;
                panner.coneOuterAngle = 0;
                panner.coneOuterGain = 0;
                panner.positionY.value = 0;

                analyser.fftSize = 2 * BUFFER_SIZE;

                source.connect(analyser);
                source.connect(panner);
                panner.connect(audioContext.destination);

                userLookup[userID] = {
                    id: userID,
                    x: 0,
                    y: 0,
                    lastVolume: 0,
                    volume: 1,
                    audio,
                    source,
                    panner,
                    analyser,
                    buffer
                };

                userList.push(userLookup[userID]);
            }
        }

        const user = userLookup[userID];
        if (!user) {
            console.warn(`no audio for user ${userID}`);
        }
        return user;
    }

    function updateUserAudio(user) {
        const time = audioContext.currentTime + transitionTime;
        // our 2D position is in X/Y coords, but our 3D position 
        // along the horizontal plane is X/Z coords.
        user.panner.positionX.linearRampToValueAtTime(user.x, time);
        user.panner.positionZ.linearRampToValueAtTime(user.y, time);
        if (user.volume !== user.lastVolume) {
            if (user.volume === 0) {
                user.source.disconnect(user.panner);
            }
            else {
                user.source.connect(user.panner);
            }
        }

        user.lastVolume = user.volume;
    }

    function setVolume(evt) {
        const user = getUserAudio(evt.participantID);
        if (!user) {
            return;
        }

        user.x = evt.x;
        user.y = evt.y;
        user.lastVolume = user.volume;
        user.volume = evt.volume;

        updateUserAudio(user);
    }

    function setLocalPosition(evt) {
        ensureContext();
        const time = audioContext.currentTime + transitionTime,
            listener = audioContext.listener;
        listener.positionX.linearRampToValueAtTime(evt.x, time);
        listener.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    function setAudioProperties(evt) {
        minDistance = evt.minDistance;
        maxDistance = evt.maxDistance;
        transitionTime = evt.transitionTime;

        ensureContext();

        for (let user of userList) {
            user.panner.refDistance = minDistance;
            user.panner.rolloffFactor = Math.sqrt(maxDistance + minDistance);
            updateUserAudio(user);
        }
    }

    function updater() {
        requestAnimationFrame(updater);
        for (let user of userList) {
            const lastAvg = user.buffer.length - BUFFER_SIZE,
                avg = user.buffer.length - 2 * BUFFER_SIZE,
                lastValue = user.buffer.length - 3 * BUFFER_SIZE;

            for (let i = user.buffer.length - 1; i >= BUFFER_SIZE; --i) {
                user.buffer[i] = user.buffer[i - BUFFER_SIZE];
            }

            user.analyser.getFloatFrequencyData(user.buffer);

            let totalDelta = 0;
            for (let i = 0; i < BUFFER_SIZE; ++i) {
                const delta = (user.buffer[i] - user.buffer[lastValue + i]) / AVERAGING_FRAMES;
                user.buffer[avg + i] = user.buffer[lastAvg + i] + delta;
                totalDelta += delta;
            }

            sendAudioActivity(user.id, totalDelta > 0);
        }
    }

    function sendAudioActivity(userID, active) {
        txJitsiHax("audioActivity", {
            participantID: userID,
            isActive: active
        });
    }

    function txJitsiHax(command, obj) {
        obj.hax = APP_FINGERPRINT;
        obj.command = command;
        postMessage(JSON.stringify(obj), location.origin);
    }

    function rxJitsiHax(evt) {
        const isLocalHost = evt.origin.match(/^https?:\/\/localhost\b/);

        if (evt.origin === FRONT_END_SERVER
            || evt.origin === ALT_FRONT_END_SERVER
            || ALLOW_LOCAL_HOST && isLocalHost) {
            try {
                const data = JSON.parse(evt.data),
                    isJitsiHax = data.hax === APP_FINGERPRINT,
                    cmd = commands[data.command];

                if (isJitsiHax && !!cmd) {
                    cmd(data);
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
    }


    // helps us filter out data channel messages that don't belong to us
    const APP_FINGERPRINT = "Calla",
        userLookup = {},
        userList = [],
        commands = {
            setLocalPosition,
            setVolume,
            setAudioProperties
        };

    let audioContext = null,

        // these values will get overwritten when the user sets their audio properties
        minDistance = 2,
        maxDistance = 15,
        transitionTime = 0;

    Object.assign(window, {
        userLookup,
        userList
    });

    addEventListener("message", rxJitsiHax);
})();
