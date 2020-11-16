const controls = Array.prototype.reduce.call(
  document.querySelectorAll("[id]"),
  (ctrls, elem) => {
    ctrls[elem.id] = elem;
    return ctrls;
  },
  {}
);

export const JITSI_HOST = "beta.meet.jit.si";
export const JVB_HOST = JITSI_HOST;
export const JVB_MUC = "conference." + JITSI_HOST;

class User {
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
    // make sure to remove any existing video elements, first. This
    // will occur if the user changes their video input device.
    if (this._video) {
      this.container.removeChild(this._video);
      this._video = null;
    }

    this._videoStream = v;

    if (this._videoStream) {
      this._video = document.createElement("video");
      this._video.className = "userVideo";
      this.container.append(this._video);

      // a bunch of settings to make the video play right
      this._video.playsInline = true;
      this._video.autoplay = true;
      this._video.controls = false;
      this._video.muted = true;
      this._video.volume = 0;

      // now start the video
      this._video.srcObject = this._videoStream;
      this._video.play();
    }
  }

  update() {
    window.test = this.container;
    const dx =
      this.container.parentElement.clientLeft - this.container.clientWidth / 2;
    const dy =
      this.container.parentElement.clientTop - this.container.clientHeight / 2;
    this.container.style.left = 100 * this.pose.current.p.x + dx + "px";
    this.container.style.zIndex = this.pose.current.p.y;
    this.container.style.top = 100 * this.pose.current.p.z + dy + "px";
  }
}

import { CallaClient, canChangeAudioOutput } from "./calla.js";

const client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC);
const users = new Map();

(async function () {
  deviceSelector(
    true,
    controls.cams,
    await client.getVideoInputDevicesAsync(),
    await client.getPreferredVideoInputAsync(true),
    (device) => client.setVideoInputDeviceAsync(device)
  );
  deviceSelector(
    true,
    controls.mics,
    await client.getAudioInputDevicesAsync(),
    await client.getPreferredAudioInputAsync(true),
    (device) => client.setAudioInputDeviceAsync(device)
  );
  deviceSelector(
    false,
    controls.speakers,
    await client.getAudioOutputDevicesAsync(),
    await client.getPreferredAudioOutputAsync(true),
    (device) => client.setAudioOutputDeviceAsync(device)
  );
  controls.speakers.disabled = !canChangeAudioOutput;
})();

function deviceSelector(addNone, select, values, preferredDevice, onSelect) {
  if (addNone) {
    const none = document.createElement("option");
    none.text = "None";
    select.append(none);
  }
  select.append(
    ...values.map((value) => {
      const opt = document.createElement("option");
      opt.value = value.deviceId;
      opt.text = value.label;
      if (preferredDevice && preferredDevice.deviceId === value.deviceId) {
        opt.selected = true;
      }
      return opt;
    })
  );
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
controls.connect.disabled = false;

controls.connect.addEventListener("click", connect);
function connect() {
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
    return;
  }
  controls.roomName.disabled = true;
  controls.userName.disabled = true;
  controls.connect.disabled = true;
  // client.startAudio();
  client.join(roomName, userName);
}
let timer = null;

client.addEventListener("videoConferenceJoined", (evt) => {
  const { id, displayName, pose } = evt;

  controls.leave.disabled = false;

  timer = requestAnimationFrame(update);

  addUser(id, displayName, pose, true);
  setPosition(
    Math.random() * (controls.space.clientWidth - 100) + 50,
    Math.random() * (controls.space.clientHeight - 100) + 50
  );
});

controls.leave.addEventListener("click", () => client.leaveAsync());
client.addEventListener("videoConferenceLeft", () => {
  removeUser(client.localUserID);

  cancelAnimationFrame(timer);

  controls.leave.disabled = true;
  controls.connect.disabled = false;
});

client.addEventListener("participantJoined", (evt) => {
  const { id, displayName, pose } = evt;
  addUser(id, displayName, pose, false);
});
client.addEventListener("participantLeft", (evt) => {
  const { id } = evt;
  removeUser(id);
});
function addUser(id, name, pose, isLocal) {
  if (users.has(id)) {
    users.get(id).dispose();
  }

  const user = new User(id, name, pose, isLocal);

  controls.space.append(user.container);
    currentUser = name;

  users.set(id, user);
}
function removeUser(id) {
  if (users.has(id)) {
    const user = users.get(id);
    user.dispose();
    users.delete(id);
  }
}
function update() {
  timer = requestAnimationFrame(update);

  client.update();

  for (let user of users.values()) {
    user.update();
  }
}
controls.space.addEventListener("click", (evt) => {
  const x = evt.clientX - controls.space.offsetLeft;
  const y = evt.clientY - controls.space.offsetTop;
  setPosition(x, y);
});
function setPosition(x, y) {
  if (client.localUserID) {
    x /= 100;
    y /= 100;

    client.setLocalPosition(x, 0, y);
  }
}
client.addEventListener("displayNameChange", (evt) => {
  const { id, displayName } = evt;
  changeName(id, displayName);
});
function changeName(id, displayName) {
  if (users.has(id)) {
    const user = users.get(id);
    user.name = displayName;
  }
}
client.addEventListener("videoChanged", (evt) => {
  const { id, stream } = evt;
  changeVideo(id, stream);
});
function changeVideo(id, stream) {
  if (users.has(id)) {
    const user = users.get(id);
    user.videoStream = stream;
  }
}
