"use strict";

const jitsi = document.querySelector("#jitsi"),
    frontBuffer = document.querySelector("#frontBuffer"),
    demo = document.querySelector("#demo > video"),
    gui = document.querySelector("#gui"),
    room = document.querySelector("#room"),
    user = document.querySelector("#user"),
    connect = document.querySelector("#connect");

let api = null,
    iframe = null;

room.addEventListener("enter", user.focus.bind(user));
user.addEventListener("enter", login);

showLogin();

if (location.hash.length > 0) {
    room.value = location.hash.substr(1);
    user.focus();
}
else {
    room.focus();
}

function shrink(targetID) {
    var target = document.querySelector(targetID);
    var isOpen = target.className === "menu-open";
    target.className = isOpen ? "menu-closed" : "menu-open";
    var ui = me ? frontBuffer : gui;
    if (isOpen) {
        ui.hide();
    }
    else {
        ui.show();
    }
}

function showLogin() {
    connect.innerHTML = "Connect";
    connect.unlock();
    room.unlock();
    user.unlock();

    jitsi.hide();
    frontBuffer.hide();
    demo.parentElement.show();
    demo.show();
    demo.play();
    gui.show();
}

function login() {
    connect.innerHTML = "Connecting...";
    connect.lock();
    room.lock();
    user.lock();
    var roomName = room.value.trim(),
        userName = user.value.trim();

    if (roomName.length > 0
        && userName.length > 0) {
        startConference(roomName, userName);
    }
    else {
        showLogin();

        if (roomName.length === 0) {
            room.value = "";
            room.focus();
        }
        else if (userName.length === 0) {
            user.value = "";
            user.focus();
        }
    }
}

function startConference(roomName, userName) {
    jitsi.show();

    location.hash = roomName;

    var domain = JITSI_HOST,
        options = {
            noSSL: false,
            disableThirdPartyRequests: true,
            parentNode: jitsi,
            width: "100%",
            height: "100%",
            configOverwrite: {
                startAudioOnly: true
            },
            interfaceConfigOverwrite: {
                DISABLE_VIDEO_BACKGROUND: true
            },
            roomName: roomName,
            onload: conferenceLoaded
        };

    api = new JitsiMeetExternalAPI(domain, options);
    api.executeCommand("displayName", userName);
    registerGameListeners(api);
    api.addEventListener("videoConferenceJoined", function (evt) {
        gui.hide();
        demo.pause();
        demo.hide();
        demo.parentElement.hide();
        startGame(evt);
    });

    addEventListener("unload", () => api.dispose());
}

function conferenceLoaded(evt) {
    iframe = api.getIFrame();
}