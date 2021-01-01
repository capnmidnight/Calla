# Tutorial

Calla is a library that encapsulates using [Jitsi Meet](https://meet.jit.si/) for custom teleconferencing apps that experiment in audio process and visual representation.

The following tutorial describes how to use Calla, by walking through Calla's own application initialization process. [View a live version of this tutorial app](https://www.calla.chat/basic/).

## Overview

Calla is designed around event-driven programming. It takes the responsibility of managing audio and video streams (and the processing thereof), and you provide the user interface for making sense of it all. As such, there are a number of interfaces that you'll have to implement, and a few with which you'll need to integrate.

## User Interface
You'll need to create at least a basic HTML interface for a user to be able to join your conference. Here, I show a very basic one that provides the user a means of controlling the spatialization effect.

<img src="https://raw.githubusercontent.com/capnmidnight/Calla/master/Calla/doc/basic/tutorial1.png">

First of all, comply with standards
```html
<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
```

Then, set a fixed viewport so that mobile users don't get some crazy scrolling
```html
    <meta name="viewport" content="width=device-width, shrink-to-fit=0, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
```

Give your page a title
```html
    <title>Minimum Calla Setup</title>
```

And import your script module that will setup the conference session
```html
    <script type="module" src="index.js"></script>
```

This very basic example attempts to have a clean interface, so I have a few things setup in a stylesheet
```html
    <style type="text/css">
```

First, some resets. These aren't strictly necessary.
```css
* {
    box-sizing: border-box;
}

/* a few more resets */
html, body {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
```

Any browser that supports WebRTC also supports CSS Grid these days.
```css
body {
    display: grid;
    grid-template-rows: 1fr auto auto auto;
    grid-row-gap: 1em;
    grid-column-gap: 1em;
    row-gap: 1em;
    column-gap: 1em;
    padding: 1em;
}

#controls {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 0.5em;
    column-gap: 0.5em;
}
```

Make the configuration controls line up nice.
```css
    #controls > label {
        text-align: right;
    }

    #controls > select {
        width: 100%;
    }
```

Make the clickable space of the page visible to the user.
```css
#space {
    position: relative;
    background-color: #ccc;
    border: inset 2px;
    overflow: hidden;
}
```

Every user is going to have their own DIV with their user name and video displayed in it.
```css
.user {
```

We want the user blocks to be clipped by the space container, and positioned inside of it.
```css
    position: absolute;
```

Don't make user blocks too large or the motion doesn't feel right.
```css
    width: 10em;
```

Add some visual appeal.
```css
    border-width: 2px;
    border-style: solid;
    border-color: #888;
    background-color: #eee;
    box-shadow: rgba(0,0,0,0.5) 5px 5px 10px;
    padding: 5px;
}

.userName {
    text-align: center;
}

.userVideo {
    max-width: 100%;
}

```

Higlight the local user's own video element.
```css
.localUser {
    border-color: #383;
    background-color: #8e8;
}
```

Flip the local user's own video element horizontally so it feels more like a mirror.
```css
.localUser > .userVideo {
    transform: scaleX(-1);
}
```
```html
    </style>
```

And that's it for the header. Now we can start the body.
```html
</head>
<body>
```

This is where our user blocks will go
```html
    <div id="space"></div>
```

I have all of the user input controls in a single block, but you'll probably want to create
a better signup form, and an options dialog, instead of just leaving them on the page.

By using a form for the input controls, we can trigger the browser's own autocompletion when the user returns to the page.
```html
    <form id="controls" autocomplete="on">
```

First, we need to know what room the user wants to join.
```html
        <label for="roomName">Room:</label>
        <input id="roomName" type="text" placeholder="(Required)" value="TestRoom">
```

Next, what will the user call themselves.
```html
        <label for="userName">User:</label>
        <input id="userName" placeholder="(Required)" type="text" value="TestUser">
```

Provide a selector in case the user has multiple cameras connected to their device. This is typical on smartphones with a "front" and "back" camera.
```html
        <label for="cams">Video:</label>
        <select id="cams"></select>
```

Provide a selctor in case the user has multiple microphones connected to their device. This is typical for people using a mic'd headset on a laptop.
```html
        <label for="mics">Microphone:</label>
        <select id="mics"></select>
```

Finally, some browsers (Basically just Google Chrome and its derivatives, for now) allow scripts to change the destination for the audio. On other browsers, we'll later disable this selector.
```html
        <label for="speakers">Speakers:</label>
        <select id="speakers"></select>
    </form>
```

Some buttons to control the connection and then we're all done.
```html
    <div>
        <button type="button" id="connect" disabled>Connect</button>
        <button type="button" id="leave" disabled>Leave</button>
        <button type="button" id="sideTest">Open side test</button>
    </div>
</body>
</html>
```

In my script module, I then capture these controls using a simple aggregator.
```javascript
const controls = Array.prototype.reduce.call(
    document.querySelectorAll("[id]"),
    (ctrls, elem) => {
        ctrls[elem.id] = elem;
        return ctrls;
    }, {});
```

## Configuration

Before you can create a teleconferencing session, you need to know 3 pieces of information:
* The host name at which your Jitsi installation is running. Because we're running a significantly altered client interface from standard Jitsi Meet, it's best to setup your own server instead of using [meet.jit.si](https://meet.jit.si). Follow Jitsi's own documentation for [setting up your own Jitsi server](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart).
* The host name for the Jitsi Video Bridge. By default, this should be the same as the URL for your Jitsi installation. If you have configured your Jitsi installation differently, I'm assuming you know what to set here.
* The host name for the [Multi-User Chat](https://xmpp.org/about/technology-overview.html#muc) server in your Jitsi installation. This is usually the same as your Jitsi installation host name with `conference.` prefexed to it. For example, if your Jitsi installation is at `www.example.com`, then the MUC address is `conference.www.example.com`.

I find it convenient to store these in a module.
```javascript
export const JITSI_HOST = "tele.calla.chat";
export const JVB_HOST = JITSI_HOST;
export const JVB_MUC = "conference." + JITSI_HOST;
```

So that I can later import them as such:
```javascript
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../../../constants.js";
```

## Users


It's convenient to create a class for your User, so you can keep track of related elements
```javascript
class User {
```

Calla will provide a managed object for the user's position, but we are responsible in our application code for displaying that position in some way. Calla provides:
* A user id - a randomized string
* A name for the user - this is set by the user, though may not be immediately available. We'll need to respond to changes in the users' names later.
* A position and orientation tracking object - Calla animates the user's pose to provide smooth motion and audio transitions without popping. User poses include both position and orientation in 3D, though in this example we'll only be using 2D position and won't modify the orientation.

I've also added a parameter for indicating when the user is the local user, so we can give it a slightly different visual representation.
```javascript
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
```

Whenever a user leave the conference, we will need to remove its graphic from the display
```javascript
    dispose() {
        this.container.parentElement.removeChild(this.container);
    }
```

Get/set the user's name
```javascript
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
```

Get/set the user's video stream. Strictly speaking, the getter is not required.
```javascript
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
```

The pose property will automatically update, we just need to read it and move the user's graphics element to the latest position that Calla has calculated for it.
```javascript
    update() {
        const dx = this.container.parentElement.clientLeft - this.container.clientWidth / 2;
        const dy = this.container.parentElement.clientTop - this.container.clientHeight / 2;
        this.container.style.left = (100 * this.pose.current.p.x + dx) + "px";
        this.container.style.zIndex = this.pose.current.p.y;
        this.container.style.top = (100 * this.pose.current.p.z + dy) + "px";
    }
```

And that's it for the User class
```javascript
}
```

## Initialization
Let's start setting up an application.

### Import Calla
Strictly speaking, only importing the `CallaClient` is necessary, but there are some other, useful elements as well.
```javascript
import {
  CallaClient, // required
  canChangeAudioOutput // Will be use to enable/disable the audio output selector
} from "calla";
```

### Initialize Calla
Construct the Calla API object. It manages most aspects of the teleconferencing session, as well as spatializing audio. All you need to do is render graphics and tell Calla when the local user has moved.
```javascript
const client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC);
```

### Keep track of users
We need to keep a collection of users so we can iterate through updating their graphics.
```javascript
const users = new Map();
```

### Setup device lists
Setup the device lists in an asynchronous function.
```javascript
(async function () {
```

If we want to create sessions that default to having  no video enabled, we can change`getPreferredVideoInputAsync(true)` to `getPreferredVideoInputAsync(false)`.
```javascript
    deviceSelector(
        true,
        controls.cams,
        await client.getVideoInputDevicesAsync(),
        await client.getPreferredVideoInputAsync(true),
        (device) => client.setVideoInputDeviceAsync(device));
```

If we want to create sessions that default to having no audio enabled, we can change`getPreferredAudioInputAsync(true)` to `getPreferredAudioInputAsync(false)`.
```javascript
    deviceSelector(
        true,
        controls.mics,
        await client.getAudioInputDevicesAsync(),
        await client.getPreferredAudioInputAsync(true),
        (device) => client.setAudioInputDeviceAsync(device));
```

There is no way to set "no" audio output, so we don't allow a selection of "none" here. Also, it's a good idea to always start off with an audio output device, so always call `getPreferredAudioOutputAsync(true)`.
```javascript
    deviceSelector(
        false,
        controls.speakers,
        await client.getAudioOutputDevicesAsync(),
        await client.getPreferredAudioOutputAsync(true),
        (device) => client.setAudioOutputDeviceAsync(device));
```

Chromium is pretty much the only browser that can change audio outputs at this time, so disable the control if we detect there is no option to change outputs.
```javascript
    controls.speakers.disabled = !canChangeAudioOutput;
})();
```

The device selectors setup previously use the following function for creating the options in the select boxes. It accepts the following parameters
* addNone - whether a vestigial "none" item should be added to the front of the list.
* select - the HTMLSelectElement box to add items to.
* values - An array of MediaDeviceInfo objects to bind to the control.
* preferredDevice - A best-guess at the correct media device to use.
* onSelect - a callback for handling the user's selection of device.
```javascript
function deviceSelector(addNone, select, values, preferredDevice, onSelect) {
```

Add a vestigial "none" item?
```javascript
    if (addNone) {
        const none = document.createElement("option");
        none.text = "None";
        select.append(none);
    }
```

Create the select box options.
```javascript
    select.append(...values.map((value) => {
        const opt = document.createElement("option");
        opt.value = value.deviceId;
        opt.text = value.label;
        if (preferredDevice && preferredDevice.deviceId === value.deviceId) {
            opt.selected = true;
        }
        return opt;
    }));
```

Respond to a user selection. We use "input" instead of "change" because "change" events don't fire if the user clicks an option that is already selected.
```javascript
    select.addEventListener("input", () => {
        let idx = select.selectedIndex;

        // Skip the vestigial "none" item.
        if (addNone) {
            --idx;
        }

        const value = values[idx];
        onSelect(value || null);
    });
```

And fire a provisional "selection" for that best-guess media device.
```javascript
    onSelect(preferredDevice);
}
```

### Initialization complete
At this point, everything is ready, so we can let the user attempt to connect to the conference now. This should go at the very end of your script.
```javascript
controls.connect.disabled = false;
```

## Operations

There is a pretty strict workflow on how to handle connecting to and living through a conference session. The main operations are:
* Connecting - start opening a connection to Jitsi, and joining a room.
* Connected - once you're connected and in a room, you can start your graphics animation.
* Local user leaving - start disconnecting from the room and Jitsi.
* Local user left - finish tearing down the animation.
* Remote user joined - add a graphic for the user to the animation.
* Remote user left - remove their graphics from the animation.
* Creating user graphics - for both the local and remote users.
* Removing user graphics - for both the local and remote users.
* Updating the animation - for this demo, this is just moving the video blocks around.
* User changing name - The first time a user joins a conference, their name won't be set, so we need to wait to see what their name will be.
* User changing video - When the user has their camera enabled, we need to display the video. We also need to remove the video if they disable their camera.
* Moving the local user - Engage spatialization circuits at maximum power!~

### Connecting
The follow click event handler does double-duty. Foremost, it validates the user's input room and name and starts the conference connection. But we also need a "user gesture" to create AudioContext objects. The user clicking on the login button is the most natural place for that.
```javascript
controls.connect.addEventListener("click", connect);
function connect() {
```
Validate the user input values...
```javascript
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
```

Keep the user from double-clicking the connect button, or changing the room or their name after they've started connecting.
```javascript
    controls.roomName.disabled = true;
    controls.userName.disabled = true;
    controls.connect.disabled = true;
```

The following two operations are done separately in case you have extra setup you want to do before actually joining the conference. Always start the audio from a "user gesture", e.g. a button click.

Initialize the audio *first*.
```javascript
    client.startAudio();
```

And *then* start the connection.
```javascript
    client.join(roomName, userName);
}
```

### Connected
Once you're connected, you can start animating.

Create a handle for your animation timer, so you can cancel it later
```javascript
let timer = null;
```

Calla provides the local user's ID, the name the user provided when they joined the conference, and the managed pose object it will use to animate the user's position
```javascript
client.addEventListener("videoConferenceJoined", (evt) => {
    const { id, displayName, pose } = evt;
```
Enable the leave button once the user has connected to a conference.
```javascript
    controls.leave.disabled = false;
```
Start the renderer
```javascript
    timer = requestAnimationFrame(update);
```

Create a user graphic for the local user (see below).
```javascript
    addUser(id, displayName, pose, true);
```

For testing purposes, we place the user at a random location  on the page. Ideally, you'd have a starting location for users so you could design a predictable onboarding path for them (see below).
```javascript
    setPosition(
      Math.random() * (controls.space.clientWidth - 100) + 50,
      Math.random() * (controls.space.clientHeight - 100) + 50);
});
```

### Local user leaving
Calla needs to cleanup the audio and video tracks if the user decides they want to leave the conference. NOTE: Don't call the leave function on page unload, as it leads to ghost users being left in the conference. This appears to be a bug in Jitsi.

Leaving is really simple.
```javascript
controls.leave.addEventListener("click", () => client.leaveAsync());
```

### Local user left
The user does not always leave of their own volition, so we can't just wait for the `leaveAsync` task to resolve. For example, the user might have been kicked by a moderator. So we need to listen for leaving the conference separately from choosing to leave the conference, and then shut down the rendering.

```javascript
client.addEventListener("videoConferenceLeft", () => {
```

Remove the graphic for the local user
```javascript
    removeUser(client.localUser);
```

Stop the animation
```javascript
    cancelAnimationFrame(timer);
```

And reset the login controls.
```javascript
    controls.leave.disabled = true;
    controls.connect.disabled = false;
});
```

### Remote user joined

When a remote user joins, we really just need to create a graphic for that user
```javascript
client.addEventListener("participantJoined", (evt) => {
    const { id, displayName, pose } = evt;
    addUser(id, displayName, pose, false);
});
```

### Remote user left
There isn't much to do. Other event handlers will have already cleaned up the video and audio streams. We just need to remove the graphic for the user.
```javascript
client.addEventListener("participantLeft", (evt) => {
    const { id } = evt;
    removeUser(id);
});
```

### Creating user graphics
Both the local and remote users joining the conference use the same routine for creating their graphics.
```javascript
function addUser(id, name, pose, isLocal) {
```

Delete any existing graphics, just in case there was some kind of weird error (there isn't).
```javascript
    if (users.has(id)) {
        users.get(id).dispose();
    }
```

Create the graphic
```javascript
    const user = new User(id, name, pose, isLocal);
```

Add the graphic to the display area
```javascript
    controls.space.append(user.container);
```

And keep track of the user.
```javascript
    users.set(id, user);
}
```

### Removing user graphics
This is also very simple. We just need to tell our app to stop keeping track of a user.
```javascript
function removeUser(id) {
    if (users.has(id)) {
        const user = users.get(id);
        user.dispose();
        users.delete(id);
    }
}
```

### Updating the animation
Calla's audio processing system needs an animation pump, which we need also because the user graphics need to be moved.
```javascript
function update() {
```

Ask the browser for another animation update
```javascript
    timer = requestAnimationFrame(update);
```

Tell Calla it's now time to update
```javascript
    client.update();
```

And update all the graphics
```javascript
    for (let user of users.values()) {
        user.update();
    }
}
```

### Moving the local user
We're going to respond to click events on an HTML element, so we need to do some calculation to figure out where the click happened *inside* the element.
```javascript
controls.space.addEventListener("click", (evt) => {
    const x = evt.clientX - controls.space.offsetLeft;
    const y = evt.clientY - controls.space.offsetTop;
    setPosition(x, y);
});
```

Then, we need to give Calla the desired position. Calla will transmit the new value to all the other users, and will perform a smooth transition of the value so users don't pop around.
```javascript
function setPosition(x, y) {
```

Don't respond to clicks if we aren't in a conference yet.
```javascript
    if (client.localUser) {
```

User position units are ostensibly in "meters", so we need to scale the click's pixel value to something smaller so we get an actual spatialization effect.
```javascript
        x /= 100;
        y /= 100;
```

And finally, tell Calla where to move the user. The user won't move there instantaneously. Calla will use the position as a target and smoothly animate the change in position.
```javascript
        client.setLocalPosition(x, 0, y);
    }
}
```

### User changing name

In Jitsi, users may not have names right away. They need to join a conference before they can set their name, so we need to wait for change notifications and update the display of the user names.
```javascript
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
```

### User changing video
When a user enables or disables video, Calla will give us a notification. Users that add video will have a stream available to then create an HTML Video element. Users that remove video will send `null` as their video stream.
```javascript
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
```

## Results

Once you've set everything up and you and a few users have joined a conference, you should have something that looks like this:
<img src="https://raw.githubusercontent.com/capnmidnight/Calla/master/Calla/doc/basic/tutorial2.png">