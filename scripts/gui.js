"use strict";

const jitsiContainer = document.querySelector("#jitsi"),
    frontBuffer = document.querySelector("#frontBuffer"),
    demoVideo = document.querySelector("#demo > video"),
    gui = document.querySelector("#gui"),
    roomNameInput = document.querySelector("#room"),
    userNameInput = document.querySelector("#user"),
    connectButton = document.querySelector("#connect");

let api = null,
    iframe = null;

roomNameInput.addEventListener("enter", userNameInput.focus.bind(userNameInput));
userNameInput.addEventListener("enter", login);

showLogin();

if (location.hash.length > 0) {
    roomNameInput.value = location.hash.substr(1);
    userNameInput.focus();
}
else {
    roomNameInput.focus();
}

function shrink(targetID) {
    const target = document.querySelector(targetID),
        isOpen = target.className === "menu-open",
        ui = !!me ? frontBuffer : gui

    target.className = isOpen ? "menu-closed" : "menu-open";;

    if (isOpen) {
        ui.hide();
    }
    else {
        ui.show();
    }
}

function showLogin() {
    connectButton.innerHTML = "Connect";
    connectButton.unlock();
    roomNameInput.unlock();
    userNameInput.unlock();

    jitsiContainer.hide();
    frontBuffer.hide();
    demoVideo.parentElement.show();
    demoVideo.show();
    demoVideo.play();
    gui.show();
}

function login() {
    connectButton.innerHTML = "Connecting...";
    connectButton.lock();
    roomNameInput.lock();
    userNameInput.lock();
    const roomName = roomNameInput.value.trim(),
        userName = userNameInput.value.trim();

    if (roomName.length > 0
        && userName.length > 0) {
        startConference(roomName, userName);
    }
    else {
        showLogin();

        if (roomName.length === 0) {
            roomNameInput.value = "";
            roomNameInput.focus();
        }
        else if (userName.length === 0) {
            userNameInput.value = "";
            userNameInput.focus();
        }
    }
}

function startConference(roomName, userName) {
    jitsiContainer.show();

    location.hash = roomName;

    api = new JitsiMeetExternalAPI(JITSI_HOST, {
        noSSL: false,
        disableThirdPartyRequests: true,
        parentNode: jitsiContainer,
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
    });
    api.executeCommand("displayName", userName);
    registerGameListeners(api);
    api.addEventListener("videoConferenceJoined", function (evt) {
        gui.hide();
        demoVideo.pause();
        demoVideo.hide();
        demoVideo.parentElement.hide();
        startGame(evt);
    });

    addEventListener("unload", () => api.dispose());
}

function conferenceLoaded(evt) {
    iframe = api.getIFrame();
}