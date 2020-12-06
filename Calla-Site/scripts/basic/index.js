// Import the configuration parameters.
import { canChangeAudioOutput, CallaClient } from "../lib/calla";
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../constants";
// Sets up a convenient button for opening multiple
// windows for testing.
import { userNumber } from "../testing/userNumber";
import { openSideTest } from "../testing/windowing";

// Gets all the named elements in the document so we can
// setup event handlers on them.
const controls = Array.prototype.reduce.call(
    document.querySelectorAll("[id]"),
    (ctrls, elem) => {
        ctrls[elem.id] = elem;
        return ctrls;
    }, {});

/**
 * The animation timer handle, used for later stopping animation.
 * @type {number} */
let timer = null;

/**
 * The Calla interface, through which teleconferencing sessions and
 * user audio positioning is managed.
 **/
const client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC);

/**
 * A place to stow references to our users.
 * @type {Map<string, User>}
 **/
const users = new Map();

/**
 * Calla will provide a managed object for the user's position, but we
 * are responsible in our application code for displaying that position
 * in some way. This User class helps encapsulate that representation.
 **/
class User {
    /**
     * Creates a new User object.
     * @param {string} id
     * @param {string} name
     * @param {InterpolatedPose} pose
     * @param {boolean} isLocal
     */
    constructor(id, name, pose, isLocal) {
        /**
         * The user's name.
         * @type {string} 
         **/
        this._name = null;

        /**
         * An HTML element to display the user's name.
         * @type {HTMLDivElement} 
         **/
        this._nameEl = null;

        /**
         * Calla will eventually give us a video stream for the user.
         * @type {MediaStream}
         **/
        this._videoStream = null;

        /**
         * An HTML element for displaying the user's video.
         * @type {HTMLVideoElement}
         **/
        this._video = null;

        /**
         * An HTML element for showing the user name and video together.
         **/
        this.container = document.createElement("div");
        this.container.className = "user";
        if (isLocal) {
            this.container.className += " localUser";
            name += " (Me)";
        }

        this.id = id;
        this.name = name;
        this.pose = pose;
    }

    /**
     * Removes the user from the page.
     **/
    dispose() {
        this.container.parentElement.removeChild(this.container);
    }

    /**
     * Gets the user's name.
     **/
    get name() {
        return this._name;
    }

    /**
     * Sets the user's name, and updates the display of it.
     **/
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

    /**
     * Gets the user's video stream.
     **/
    get videoStream() {
        return this._videoStream;
    }

    /**
     * Sets the user's video stream, deleting any previous stream that may have existed,
     * and updates the display of the user to have the new video stream.
     **/
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

    /**
     * Moves the user's graphics element to the latest position that Calla has
     * calculated for it.
     **/
    update() {
        const dx = this.container.parentElement.clientLeft - this.container.clientWidth / 2;
        const dy = this.container.parentElement.clientTop - this.container.clientHeight / 2;
        this.container.style.left = (100 * this.pose.current.p.x + dx) + "px";
        this.container.style.zIndex = this.pose.current.p.y;
        this.container.style.top = (100 * this.pose.current.p.z + dy) + "px";
    }
}

/**
 * We need a "user gesture" to create AudioContext objects. The user clicking
 * on the login button is the most natural place for that.
 **/
function connect() {
    const roomName = controls.roomName.value;
    const userName = controls.userName.value;

    // Validate the user input values...
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
        return;
    }

    controls.roomName.disabled = true;
    controls.userName.disabled = true;
    controls.connect.disabled = true;

    // and start the connection.
    client.join(roomName, userName);
}

/**
 * When the video conference has started, we can start 
 * displaying content.
 * @param {string} id
 * @param {string} displayName
 * @param {InterpolatedPose} pose
 */
function startGame(id, displayName, pose) {
    // Enable the leave button once the user has connected
    // to a conference.
    controls.leave.disabled = false;

    // Start the renderer
    timer = requestAnimationFrame(update);

    // Create a user graphic for the local user.
    addUser(id, displayName, pose, true);

    // For testing purposes, we place the user at a random location 
    // on the page. Ideally, you'd have a starting location for users
    // so you could design a predictable onboarding path for them.
    setPosition(Math.random() * (controls.space.clientWidth - 100) + 50, Math.random() * (controls.space.clientHeight - 100) + 50);
}

/**
 * Create the graphic for a new user.
 * @param {string} id
 * @param {string} displayName
 * @param {InterpolatedPose} pose
 * @param {boolean} isLocal
 */
function addUser(id, name, pose, isLocal) {
    const user = new User(id, name, pose, isLocal);
    if (users.has(id)) {
        users.get(id).dispose();
    }
    users.set(id, user);
    currentUser = name;
    controls.space.append(user.container);
}

/**
 * Remove the graphic for a user that has left.
 * @param {string} id
 */
function removeUser(id) {
    if (users.has(id)) {
        const user = users.get(id);
        user.dispose();
        users.delete(id);
    }
}

/**
 * Give Calla the local user's position. Calla will
 * transmit the new value to all the other users, and will
 * perform a smooth transition of the value so users
 * don't pop around.
 * @param {any} x
 * @param {any} y
 */
function setPosition(x, y) {
    if (client.localUserID) {
        x /= 100;
        y /= 100;
        client.setLocalPosition(x, 0, y);
    }
}

/**
 * In Jitsi, users may not have names right away. They need to
 * join a conference before they can set their name, so we need
 * to wait for change notifications and update the display of the
 * user names.
 * @param {string} id
 * @param {string} displayName
 */
function changeName(id, displayName) {
    if (users.has(id)) {
        const user = users.get(id);
        user.name = displayName;
    }
}

/**
 * When a user enables or disables video, Calla will give us a
 * notification. Users that add video will have a stream available
 * to then create an HTML Video element. Users that remove video
 * will send `null` as their video stream.
 * @param {string} id
 * @param {MediaStream} stream
 */
function changeVideo(id, stream) {
    if (users.has(id)) {
        const user = users.get(id);
        user.videoStream = stream;
    }
}

/**
 * Calla's audio processing system needs an animation pump,
 * which we need also because the user graphics need to 
 * be moved.
 **/
function update() {
    timer = requestAnimationFrame(update);
    client.update();
    for (let user of users.values()) {
        user.update();
    }
}

/**
 * Calla needs to cleanup the audio and video tracks if
 * the user decides they want to leave the conference.
 * 
 * NOTE: Don't call the leave function on page unload,
 * as it leads to ghost users being left in the conference.
 * This appears to be a bug in Jitsi.
 **/
async function leave() {
    await client.leaveAsync();
}

/**
 * If the user has left the conference (or been kicked
 * by a moderator), we need to shut down the rendering.
 **/
function left() {
    removeUser(client.localUserID);
    cancelAnimationFrame(timer);
    controls.leave.disabled = true;
    controls.connect.disabled = false;
}

// =========== BEGIN Wire up events ================
controls.connect.addEventListener("click", connect);
controls.leave.addEventListener("click", leave);
controls.space.addEventListener("click", (evt) => {
    const x = evt.clientX - controls.space.offsetLeft;
    const y = evt.clientY - controls.space.offsetTop;
    setPosition(x, y);
});

client.addEventListener("videoConferenceJoined", (evt) => {
    const { id, displayName, pose } = evt;
    startGame(id, displayName, pose);
});

client.addEventListener("videoConferenceLeft", left);

client.addEventListener("participantJoined", (evt) => {
    const { id, displayName, pose } = evt;
    addUser(id, displayName, pose, false);
});

client.addEventListener("participantLeft", (evt) =>
    removeUser(evt.id));

client.addEventListener("videoChanged", (evt) => {
    const { id, stream } = evt;
    changeVideo(id, stream);
});

client.addEventListener("displayNameChange", (evt) => {
    const { id, displayName } = evt;
    changeName(id, displayName);
});

// =========== END Wire up events ================

// Setup the device lists.
(async function () {

    // If we want to create sessions that default to having 
    // no video enabled, we can change`getPreferredVideoInputAsync(true)`
    // to `getPreferredVideoInputAsync(false)`.
    deviceSelector(
        true,
        controls.cams,
        await client.getVideoInputDevicesAsync(),
        await client.getPreferredVideoInputAsync(true),
        (device) => client.setVideoInputDeviceAsync(device));

    // If we want to create sessions that default to having 
    // no video enabled, we can change`getPreferredVideoInputAsync(true)`
    // to `getPreferredVideoInputAsync(false)`.
    deviceSelector(
        true,
        controls.mics,
        await client.getAudioInputDevicesAsync(),
        await client.getPreferredAudioInputAsync(true),
        (device) => client.setAudioInputDeviceAsync(device));

    // There is no way to set "no" audio output, so we don't
    // allow a selection of "none" here. Also, it's a good idea
    // to always start off with an audio output device, so always
    // call `getPreferredAudioOutputAsync(true)`.
    deviceSelector(
        false,
        controls.speakers,
        await client.getAudioOutputDevicesAsync(),
        await client.getPreferredAudioOutputAsync(true),
        (device) => client.setAudioOutputDeviceAsync(device));

    // Chromium is pretty much the only browser that can change
    // audio outputs at this time, so disable the control if we
    // detect there is no option to change outputs.
    controls.speakers.disabled = !canChangeAudioOutput;
})();

/**
 * @callback mediaDeviceSelectCallback
 * @param {MediaDeviceInfo} device
 * @returns {void}
 */

/**
 * Binds a device list to a select box.
 * @param {boolean} addNone - whether a vestigial "none" item should be added to the front of the list.
 * @param {HTMLSelectElement} select - the select box to add items to.
 * @param {MediaDeviceInfo[]} values - the list of devices to control.
 * @param {MediaDeviceInfo} preferredDevice - 
 * @param {mediaDeviceSelectCallback} onSelect
 */
function deviceSelector(addNone, select, values, preferredDevice, onSelect) {

    // Add a vestigial "none" item?
    if (addNone) {
        const none = document.createElement("option");
        none.text = "None";
        select.append(none);
    }

    // Create the select box options.
    select.append(...values.map((value) => {
        const opt = document.createElement("option");
        opt.value = value.deviceId;
        opt.text = value.label;
        if (preferredDevice && preferredDevice.deviceId === value.deviceId) {
            opt.selected = true;
        }
        return opt;
    }));

    // Respond to a user selection. We use "input" instead
    // of "change" because "change" events don't fire if the
    // user clicks an option that is already selected.
    select.addEventListener("input", () => {
        let idx = select.selectedIndex;

        // Skip the vestigial "none" item.
        if (addNone) {
            --idx;
        }

        const value = values[idx];
        onSelect(value || null);
    });

    onSelect(preferredDevice);
}

// At this point, everything is ready, so we can let 
// the user attempt to connect to the conference now.
controls.connect.disabled = false;









if (userNumber === 1) {
    controls.sideTest.addEventListener("click", openSideTest);
}
controls.roomName.value = "CS101";
controls.userName.value = `Student${userNumber}`;