import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../../../constants.js";
import { CallaClient, canChangeAudioOutput, InterpolatedPose } from "../../../js/Calla.js";
import { userNumber } from "../../testing/userNumber.js";
import { openSideTest } from "../../testing/windowing.js";

// Find all the named elements
const controls = findNamedElements();

/** 
 *  Keep track of who "we" are.
 *  @type {string} */
let localUserId = null;

/** 
 *  Keep track of the user's preferred device.
 *  @type {MediaDeviceInfo} */
let camPref = null;

/**
 *  Keep track of the user's preferred device.
 *  @type {MediaDeviceInfo} */
let micPref = null;

/**
 *  Keep track of the user's preferred device.
 *  @type {MediaDeviceInfo} */
let speakersPref = null;

/** 
 *  The animation timer handle, used for later stopping animation.
 *  @type {number} */
let timer = null;

const client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC);
/** @type {Map<string, User>} */
const users = new Map();
class User {
    /**
     * @param {string} id
     * @param {string} name
     * @param {InterpolatedPose} pose
     */
    constructor(id, name, pose) {
        /** @type {string} */
        this._name = null;

        /** @type {HTMLDivElement} */
        this._nameEl = null;

        /** @type {MediaStream} */
        this._videoStream = null;

        /** @type {HTMLVideoElement} */
        this._video = null;

        this.container = document.createElement("div");
        this.container.className = "user";
        if (id === localUserId) {
            this.container.className += " localUser";
            name += " (Me)";
        }

        this.id = id;
        this.name = name;
        this.pose = pose;
    }

    dispose() {
        this.container.parentElement.removeChild(this.container);
    }

    get name() {
        return this._name;
    }

    set name(v) {
        if (this._nameEl) {
            this.container.removeChild(this._nameEl);
            this._nameEl = null;
        }
        this._name = v;
        this._nameEl = document.createElement("div");
        this._nameEl.className = "userName";
        this._nameEl.append(document.createTextNode(this.name));
        this.container.append(this._nameEl);
    }

    get videoStream() {
        return this._videoStream;
    }

    set videoStream(v) {
        if (this._video) {
            this.container.removeChild(this._video);
            this._video = null;
        }
        this._videoStream = v;
        if (this._videoStream) {
            this._video = document.createElement("video");
            this._video.playsInline = true;
            this._video.autoplay = true;
            this._video.controls = false;
            this._video.muted = true;
            this._video.volume = 0;
            this._video.srcObject = this._videoStream;
            this._video.className = "userVideo";
            this.container.append(this._video);
            this._video.play();
        }
    }

    update() {
        const dx = this.container.parentElement.clientLeft - this.container.clientWidth / 2;
        const dy = this.container.parentElement.clientTop - this.container.clientHeight / 2;
        this.container.style.left = (100 * this.pose.current.p.x + dx) + "px";
        this.container.style.zIndex = this.pose.current.p.y;
        this.container.style.top = (100 * this.pose.current.p.z + dy) + "px";
    }
}

controls.connect.addEventListener("click", async () => {
    client.startAudio();

    const roomName = controls.roomName.value;
    const userName = controls.userName.value;

    let message = "";
    if (roomName.length === 0) {
        message += "\n   Room name is required";
    }
    if (userName.length === 0) {
        message += "\n   User name is required";
    }

    if (message.length > 0) {
        message = "Required fields missing:" + message;
        alert(message);
    }
    else {
        controls.roomName.disabled = true;
        controls.userName.disabled = true;
        controls.connect.disabled = true;

        client.join(roomName, userName);
    }
});

controls.leave.addEventListener("click", async () => {
    await client.leaveAsync();
});

client.addEventListener("videoConferenceJoined", async (evt) => await startGame(evt.id, evt.displayName, evt.pose));
/**
 * 
 * @param {string} id
 * @param {string} name
 * @param {InterpolatedPose} pose
 */
async function startGame(id, name, pose) {
    console.log("startGame", id, name, pose);
    timer = requestAnimationFrame(update);
    controls.leave.disabled = false;
    localUserId = id;
    addUser(id, name, pose);
    setPosition(
        Math.random() * controls.space.clientWidth,
        Math.random() * controls.space.clientHeight);
    client.preferredVideoInputID = camPref && camPref.deviceId || client.preferredVideoInputID;
    client.preferredAudioInputID = micPref && micPref.deviceId || client.preferredAudioInputID;
    client.preferredAudioInputID = speakersPref && speakersPref.deviceId || client.preferredAudioOutputID;
    await client.setPreferredDevicesAsync();
}

function setPosition(x, y) {
    if (localUserId) {
        x /= 100;
        y /= 100;
        client.setLocalPosition(x, 0, y);
    }
}

function update() {
    timer = requestAnimationFrame(update);
    client.audio.update();
    for (let user of users.values()) {
        user.update();
    }
}

client.addEventListener("videoConferenceLeft", stopGame);
function stopGame() {
    console.log("stopGame");
    cancelAnimationFrame(timer);
    removeUser(localUserId);
    controls.leave.disabled = true;
    controls.connect.disabled = false;
}

client.addEventListener("participantJoined", (evt) => addUser(evt.id, evt.displayName, evt.pose));
function addUser(id, name, pose) {
    console.log("addUser", id, name, pose);
    const user = new User(id, name, pose);
    if (users.has(id)) {
        users.get(id).dispose();
    }
    users.set(id, user);
    controls.space.append(user.container);
}

client.addEventListener("participantLeft", (evt) => removeUser(evt.id));
function removeUser(id) {
    console.log("removeUser", id);
    if (users.has(id)) {
        const user = users.get(id);
        user.dispose();
        users.delete(id);
    }
}

client.addEventListener("videoChanged", (evt) => setUserVideo(evt.id, evt.stream));
function setUserVideo(id, stream) {
    console.log("setUserVideo", id, stream);
    if (users.has(id)) {
        const user = users.get(id);
        user.videoStream = stream;
    }
}

client.addEventListener("displayNameChange", (evt) => setUserName(evt.id, evt.displayName));
function setUserName(id, name) {
    if (users.has(id)) {
        const user = users.get(id);
        user.name = name;
    }
}

controls.space.addEventListener("click", (evt) => {
    setPosition(
        evt.clientX,
        evt.clientY);
});

(async function () {
    camPref = await client.getPreferredVideoInputAsync(true);
    micPref = await client.getPreferredAudioInputAsync(true);
    speakersPref = await client.getPreferredAudioOutputAsync(true);

    deviceSelector(
        true,
        controls.cams,
        await client.getVideoInputDevicesAsync(),
        camPref,
        async (device) => {
            camPref = device;
            await client.setVideoInputDeviceAsync(device);
        });
    deviceSelector(
        true,
        controls.mics,
        await client.getAudioInputDevicesAsync(),
        micPref,
        async (device) => {
            micPref = device;
            await client.setAudioInputDeviceAsync(device);
        });

    controls.speakers.disabled = !canChangeAudioOutput;
    deviceSelector(
        false,
        controls.speakers,
        await client.getAudioOutputDevicesAsync(),
        speakersPref,
        async (device) => {
            speakersPref = device;
            await client.setAudioOutputDeviceAsync(device);
        });

    controls.connect.disabled = false;

})().catch((exp) => {
    console.error(exp);
});


/**
 * @callback mediaDeviceSelectCallback
 * @param {MediaDeviceInfo} device
 * @returns {void}
 */

/**
 * @param {boolean} addNone
 * @param {HTMLSelectElement} select
 * @param {MediaDeviceInfo[]} values
 * @param {MediaDeviceInfo} preferredDevice
 * @param {mediaDeviceSelectCallback} onSelect
 */
function deviceSelector(addNone, select, values, preferredDevice, onSelect) {
    if (addNone) {
        const none = document.createElement("option");
        none.text = "None";
        select.append(none);
    }
    select.append(...values.map((value) => {
        const opt = document.createElement("option");
        opt.value = value.deviceId;
        opt.text = value.label;
        if (preferredDevice && preferredDevice.deviceId === value.deviceId) {
            opt.selected = true;
        }
        return opt;
    }));
    select.addEventListener("input", () => {
        let idx = select.selectedIndex;
        if (addNone) {
            --idx;
        }
        if (0 <= idx && idx < values.length) {
            const value = values[idx];
            onSelect(value);
        }
        else {
            onSelect(null);
        }
    });
}

/**
 * Gets all the named elements in the document so we can
 * setup event handlers on them.
 * @returns {object}
 **/
function findNamedElements() {
    const controls = Array.prototype.reduce.call(
        document.querySelectorAll("[id]"),
        (ctrls, elem) => {
            ctrls[elem.id] = elem;
            return ctrls;
        }, {});

    setupTestControl(controls);
    return controls;
}

/**
 * Sets up testing windows.
 * @param {any} controls
 */
function setupTestControl(controls) {
    if (userNumber === 1) {
        controls.sideTest.addEventListener("click", openSideTest);
    }
    controls.roomName.value = "TestRoom";
    controls.userName.value = `TestUser${userNumber}`;
}