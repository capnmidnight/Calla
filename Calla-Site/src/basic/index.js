// Chromium-based browsers give the user the option of changing
// the output audio device. This flag indicates whether or not
// we are in a browser that supports such a feature, without
// hardcoding the project to a specific browser.
import { canChangeAudioOutput } from "calla/audio/canChangeAudioOutput";
// Strictly speaking, this is the only class that needs to be
// imported, if you are consuming Calla through a vanilla
// JavaScript project.
import { Calla } from "calla/Calla";
// Calla provides a convient means of pumping animation events.
import { RequestAnimationFrameTimer } from "kudzu/timers/RequestAnimationFrameTimer";
// Import the configuration parameters.
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../constants";
// Gets all the named elements in the document so we can
// setup event handlers on them.
const controls = {
    roomName: document.getElementById("roomName"),
    userName: document.getElementById("userName"),
    connect: document.getElementById("connect"),
    leave: document.getElementById("leave"),
    space: document.getElementById("space"),
    cams: document.getElementById("cams"),
    mics: document.getElementById("mics"),
    speakers: document.getElementById("speakers")
};
/**
 * The Calla interface, through which teleconferencing sessions and
 * user audio positioning is managed.
 **/
const client = new Calla();
/**
 * A place to stow references to our users.
 **/
const users = new Map();
/**
 * The animation timer handle, used for later stopping animation.
 **/
const timer = new RequestAnimationFrameTimer();
/**
 * We need a "user gesture" to create AudioContext objects. The user clicking
 * on the login button is the most natural place for that.
 **/
async function connect() {
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
    await client.join(roomName);
    await client.identify(userName);
}
/**
 * When the video conference has started, we can start
 * displaying content.
 */
function startGame(id, pose) {
    // Enable the leave button once the user has connected
    // to a conference.
    controls.leave.disabled = false;
    // Start the renderer
    timer.start();
    // Create a user graphic for the local user.
    addUser(id, controls.userName.value, pose, true);
    // For testing purposes, we place the user at a random location 
    // on the page. Ideally, you'd have a starting location for users
    // so you could design a predictable onboarding path for them.
    setPosition(Math.random() * (controls.space.clientWidth - 100) + 50, Math.random() * (controls.space.clientHeight - 100) + 50);
}
/**
 * Create the graphic for a new user.
 */
function addUser(id, displayName, pose, isLocal) {
    let user = users.get(id);
    if (user) {
        user.dispose();
        user = null;
    }
    user = new User(id, displayName, pose, isLocal);
    users.set(id, user);
    controls.space.append(user.container);
    if (!isLocal) {
        const local = users.get(client.localUserID);
        if (local) {
            const { p, f, u } = local.pose.end;
            client.setLocalPoseImmediate(p[0], p[1], p[2], f[0], f[1], f[2], u[0], u[1], u[2]);
        }
    }
}
/**
 * Remove the graphic for a user that has left.
 */
function removeUser(id) {
    const user = users.get(id);
    if (user) {
        user.dispose();
        users.delete(id);
    }
}
/**
 * In Jitsi, users may not have names right away. They need to
 * join a conference before they can set their name, so we need
 * to wait for change notifications and update the display of the
 * user names.
 */
function changeName(id, displayName) {
    const user = users.get(id);
    if (user) {
        user.name = displayName;
    }
}
/**
 * When a user enables or disables video, Calla will give us a
 * notification. Users that add video will have a stream available
 * to then create an HTML Video element. Users that remove video
 * will send `null` as their video stream.
 */
function changeVideo(id, stream) {
    const user = users.get(id);
    if (user) {
        user.videoStream = stream;
    }
}
/**
 * Give Calla the local user's position. Calla will
 * transmit the new value to all the other users, and will
 * perform a smooth transition of the value so users
 * don't pop around.
 */
function setPosition(x, y) {
    if (client.localUserID) {
        x /= 100;
        y /= 100;
        client.setLocalPose(x, 0, y, 0, 0, -1, 0, 1, 0);
    }
}
/**
 * Calla's audio processing system needs an animation pump,
 * which we need also because the user graphics need to
 * be moved.
 **/
function update() {
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
    await client.leave();
}
/**
 * Calla will provide a managed object for the user's position, but we
 * are responsible in our application code for displaying that position
 * in some way. This User class helps encapsulate that representation.
 **/
class User {
    /**
     * Creates a new User object.
     */
    constructor(id, name, pose, isLocal) {
        this.id = id;
        this.pose = pose;
        // The user's name.
        this._name = null;
        // An HTML element to display the user's name.
        this._nameEl = null;
        // Calla will eventually give us a video stream for the user.
        this._videoStream = null;
        // An HTML element for displaying the user's video.
        this._video = null;
        this.container = document.createElement("div");
        this.container.className = "user";
        if (isLocal) {
            this.container.className += " localUser";
            name += " (Me)";
        }
        this.name = name;
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
        // Make sure to remove any existing video elements, first. This
        // will occur if the user changes their video input device.
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
        const { p } = this.pose.current;
        this.container.style.left = (100 * p[0] + dx) + "px";
        this.container.style.zIndex = p[1].toFixed(3);
        this.container.style.top = (100 * p[2] + dy) + "px";
    }
}
// =========== BEGIN Wire up events ================
controls.connect.addEventListener("click", connect);
controls.leave.addEventListener("click", leave);
controls.space.addEventListener("click", (evt) => {
    const x = evt.clientX - controls.space.offsetLeft;
    const y = evt.clientY - controls.space.offsetTop;
    setPosition(x, y);
});
client.addEventListener("conferenceJoined", (evt) => startGame(evt.id, evt.pose));
/**
 * If the user has left the conference (or been kicked
 * by a moderator), we need to shut down the rendering.
 **/
client.addEventListener("conferenceLeft", (evt) => {
    removeUser(evt.id);
    timer.stop();
    controls.leave.disabled = true;
    controls.connect.disabled = false;
});
client.addEventListener("participantJoined", (evt) => addUser(evt.id, evt.displayName, evt.source.pose, false));
client.addEventListener("participantLeft", (evt) => removeUser(evt.id));
client.addEventListener("videoAdded", (evt) => changeVideo(evt.id, evt.stream));
client.addEventListener("videoRemoved", (evt) => changeVideo(evt.id, null));
client.addEventListener("userNameChanged", (evt) => changeName(evt.id, evt.displayName));
timer.addEventListener("tick", update);
/**
 * Binds a device list to a select box.
 * @param addNone - whether a vestigial "none" item should be added to the front of the list.
 * @param select - the select box to add items to.
 * @param values - the list of devices to control.
 * @param preferredDeviceID - the ID of the device that should be selected first, if any.
 * @param onSelect - a callback that fires when the user selects an item in the list.
 */
function deviceSelector(addNone, select, values, preferredDeviceID, onSelect) {
    // Add a vestigial "none" item?
    if (addNone) {
        const none = document.createElement("option");
        none.text = "None";
        select.append(none);
    }
    let preferredDevice = null;
    // Create the select box options.
    select.append(...values.map((value) => {
        const opt = document.createElement("option");
        opt.value = value.deviceId;
        opt.text = value.label;
        if (preferredDeviceID === value.deviceId) {
            preferredDevice = value;
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
    if (preferredDevice) {
        onSelect(preferredDevice);
    }
}
// Setup the device lists.
(async function () {
    // Chromium is pretty much the only browser that can change
    // audio outputs at this time, so disable the control if we
    // detect there is no option to change outputs.
    controls.speakers.disabled = !canChangeAudioOutput;
    await client.getMediaPermissions();
    deviceSelector(true, controls.cams, await client.getVideoInputDevices(true), client.preferredVideoInputID, (device) => client.setVideoInputDevice(device));
    deviceSelector(true, controls.mics, await client.getAudioInputDevices(true), client.preferredAudioInputID, (device) => client.setAudioInputDevice(device));
    deviceSelector(false, controls.speakers, await client.getAudioOutputDevices(true), client.preferredAudioOutputID, (device) => client.setAudioOutputDevice(device));
    await client.prepare(JITSI_HOST, JVB_HOST, JVB_MUC);
    await client.connect();
    // At this point, everything is ready, so we can let 
    // the user attempt to connect to the conference now.
    controls.connect.disabled = false;
})();
// ===================================================
// The following is just some testing code for running
// locally and testing multiple connections. It can
// safely be ignored.
// ===================================================
import { userNumber } from "kudzu/testing/userNumber";
import { openSideTest } from "kudzu/testing/windowing";
const sideTest = document.getElementById("sideTest");
if (userNumber === 1) {
    sideTest.addEventListener("click", openSideTest);
}
else {
    sideTest.style.display = "none";
}
controls.roomName.value = "TestRoom";
controls.userName.value = `TestUser${userNumber}`;
window.client = client;
//# sourceMappingURL=index.js.map