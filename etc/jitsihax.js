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
        BUFFER_SIZE = 1024;

    // The rest is just implementation.

    function ensureContext() {
        if (!audioContext) {
            audioContext = new AudioContext();
            const time = audioContext.currentTime,
                listener = audioContext.listener;
            listener.positionX.setValueAtTime(0, time);
            listener.positionY.setValueAtTime(0, time);
            listener.positionZ.setValueAtTime(0, time);
            listener.forwardX.setValueAtTime(0, time);
            listener.forwardY.setValueAtTime(0, time);
            listener.forwardZ.setValueAtTime(-1, time);
            listener.upX.setValueAtTime(0, time);
            listener.upY.setValueAtTime(1, time);
            listener.upZ.setValueAtTime(0, time);
            requestAnimationFrame(updater);
            window.audioContext = audioContext;
        }
    }

    class User {
        constructor(userID, audio) {
            this.id = userID;
            this.lastAudible = true;
            this.activityCounter = 0;
            this.wasActive = false;

            this.audio = audio;

            const stream = !!audio.mozCaptureStream
                ? audio.mozCaptureStream()
                : audio.captureStream();

            this.source = audioContext.createMediaStreamSource(stream);
            this.panner = audioContext.createPanner();
            this.analyser = audioContext.createAnalyser();
            this.buffer = new Float32Array(BUFFER_SIZE);

            this.audio.volume = 0;

            this.panner.panningModel = "HRTF";
            this.panner.distanceModel = "inverse";
            this.panner.rolloffFactor = 1;
            this.panner.coneInnerAngle = 360;
            this.panner.coneOuterAngle = 0;
            this.panner.coneOuterGain = 0;
            this.panner.positionY.setValueAtTime(0, audioContext.currentTime);

            this.analyser.fftSize = 2 * BUFFER_SIZE;
            this.analyser.smoothingTimeConstant = 0.2;


            this.source.connect(this.analyser);
            this.source.connect(this.panner);
            this.panner.connect(audioContext.destination);
        }

        setPosition(evt) {
            console.log(evt);
            const time = audioContext.currentTime + transitionTime;
            // our 2D position is in X/Y coords, but our 3D position
            // along the horizontal plane is X/Z coords.
            this.panner.positionX.linearRampToValueAtTime(evt.data.x, time);
            this.panner.positionZ.linearRampToValueAtTime(evt.data.y, time);
            this.panner.refDistance = minDistance;
            this.panner.rolloffFactor = rolloff;
        }

        update() {
            const listener = audioContext.listener,
                distX = this.panner.positionX.value - listener.positionX.value,
                distZ = this.panner.positionZ.value - listener.positionZ.value,
                dist = Math.sqrt(distX * distX + distZ * distZ),
                range = clamp(project(dist, minDistance, maxDistance), 0, 1),
                audible = range < 1;

            if (audible !== this.lastAudible) {
                this.lastAudible = audible;
                if (audible) {
                    this.source.connect(this.panner);
                }
                else {
                    this.source.disconnect(this.panner);
                }
            }

            this.analyser.getFloatFrequencyData(this.buffer);

            const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                this.activityCounter++;
            } else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                this.activityCounter--;
            }

            const isActive = this.activityCounter > activityCounterThresh;
            if (this.wasActive !== isActive) {
                this.wasActive = isActive;
                txJitsiHax("audioActivity", {
                    participantID: this.id,
                    isActive
                });
            }
        }
    }

    function getUser(userID) {
        if (!userLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                userLookup[userID] = new User(userID, audio);
                userList.push(userLookup[userID]);
            }
        }

        const user = userLookup[userID];
        if (!user) {
            console.warn(`no audio for user ${userID}`);
        }
        return user;
    }

    function updater() {
        requestAnimationFrame(updater);
        for (let user of userList) {
            user.update();
        }
    }

    function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz) {
        const sampleRate = analyser.context.sampleRate,
            start = frequencyToIndex(minHz, sampleRate),
            end = frequencyToIndex(maxHz, sampleRate),
            count = end - start
        let sum = 0
        for (let i = start; i < end; ++i) {
            sum += frequencies[i];
        }
        return count === 0 ? 0 : (sum / count);
    }

    function frequencyToIndex(frequency, sampleRate) {
        var nyquist = sampleRate / 2
        var index = Math.round(frequency / nyquist * BUFFER_SIZE)
        return clamp(index, 0, BUFFER_SIZE)
    }

    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    function project(v, min, max) {
        return (v - min) / (max - min);
    }

    function setUserPosition(evt) {
        const user = getUser(evt.participantID);
        if (!user) {
            return;
        }

        user.setPosition(evt);
    }

    function setLocalPosition(evt) {
        ensureContext();
        const time = audioContext.currentTime + transitionTime,
            listener = audioContext.listener;
        listener.positionX.linearRampToValueAtTime(evt.x, time);
        listener.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    function setAudioProperties(evt) {
        origin = evt.origin;
        minDistance = evt.minDistance;
        maxDistance = evt.maxDistance;
        transitionTime = evt.transitionTime;
        rolloff = evt.rolloff;

        ensureContext();
    }

    function txJitsiHax(command, obj) {
        if (!!origin) {
            obj.hax = APP_FINGERPRINT;
            obj.command = command;
            const msg = JSON.stringify(obj);
            window.parent.postMessage(msg, origin);
        }
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
            setUserPosition,
            setAudioProperties
        },
        activityCounterMin = 0,
        activityCounterMax = 60,
        activityCounterThresh = 5;

    let audioContext = null,

        // these values will get overwritten when the user sets their audio properties
        minDistance = 1,
        maxDistance = 10,
        rolloff = 5,
        transitionTime = 0.125,
        origin = null;

    addEventListener("message", rxJitsiHax);
})();
