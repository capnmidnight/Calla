"use strict";

// TODO: move map data to requestable files
const map = TileMap.DEFAULT,
    userLookup = {},
    userList = [],
    g = frontBuffer.getContext("2d");

let AUDIO_DISTANCE_DELTA = AUDIO_DISTANCE_MAX - AUDIO_DISTANCE_MIN,
    AUDIO_DISTANCE_MIN_SQ = AUDIO_DISTANCE_MIN * AUDIO_DISTANCE_MIN,
    AUDIO_DISTANCE_MAX_SQ = AUDIO_DISTANCE_MAX * AUDIO_DISTANCE_MAX,

    TILE_COUNT_X = 0,
    TILE_COUNT_X_HALF = 0,
    TILE_COUNT_Y = 0,
    TILE_COUNT_Y_HALF = 0,

    lastTime = 0,
    currentRoomName = null,
    me = null;

addEventListener("resize", resize);

function resize() {
    frontBuffer.width = frontBuffer.clientWidth * devicePixelRatio;
    frontBuffer.height = frontBuffer.clientHeight * devicePixelRatio;
    TILE_COUNT_X = Math.floor(frontBuffer.width / map.tileWidth);
    TILE_COUNT_Y = Math.floor(frontBuffer.height / map.tileHeight);
    TILE_COUNT_X_HALF = Math.floor(TILE_COUNT_X / 2);
    TILE_COUNT_Y_HALF = Math.floor(TILE_COUNT_Y / 2);
}

function registerGameListeners(api) {
    api.addEventListener("videoConferenceLeft", endGame);
    api.addEventListener("participantJoined", addUser);
    api.addEventListener("participantLeft", removeUser);
    api.addEventListener("endpointTextMessageReceived", jitsiClient.rxGameData);
}

function startGame(evt) {
    //evt = {
    //    roomName: "string", // the room name of the conference
    //    id: "string", // the id of the local participant
    //    displayName: "string", // the display name of the local participant
    //    avatarURL: "string" // the avatar URL of the local participant
    //};

    currentRoomName = evt.roomName;

    me = new User(evt.id, evt.displayName, true);
    userList.push(me);

    jitsiClient.addEventListener("moveTo", function (evt) {
        const user = userLookup[evt.participantID];
        if (!!user) {
            user.moveTo(evt.x, evt.y);
        }
    });

    jitsiClient.addEventListener("userInitResponse", function (evt) {
        jitsiClient.txGameData(evt.participantID, "moveTo", { x: me.x, y: me.y });
    });

    frontBuffer.show();
    resize();
    frontBuffer.focus();

    requestAnimationFrame(function (time) {
        lastTime = time;
        requestAnimationFrame(gameLoop);
    });
}

function addUser(evt) {
    //evt = {
    //    id: "string", // the id of the participant
    //    displayName: "string" // the display name of the participant
    //};
    if (userLookup[evt.id]) {
        removeUser(evt);
    }
    const user = new User(evt.id, evt.displayName, false);
    userLookup[evt.id] = user;
    userList.unshift(user);
}

function removeUser(evt) {
    //evt = {
    //    id: "string" // the id of the participant
    //};
    const user = userLookup[evt.id];
    if (!!user) {
        delete userLookup[evt.id];

        const userIndex = userList.indexOf(user);
        if (userIndex >= 0) {
            userList.splice(userIndex, 1);
        }
    }
}

function gameLoop(time) {
    if (currentRoomName !== null) {
        requestAnimationFrame(gameLoop);
    }
    const dt = time - lastTime;
    lastTime = time;
    update(dt / 1000);
    render();
}

function update(dt) {
    for (let user of userList) {
        user.readInput(dt);
    }
    for (let user of userList) {
        user.update(dt);
    }
    for (let user of userList) {
        me.readUser(user);
    }
}

function render() {
    g.resetTransform();

    g.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
    g.translate(TILE_COUNT_X_HALF * map.tileWidth, TILE_COUNT_Y_HALF * map.tileHeight);
    g.translate(-me.x * map.tileWidth, -me.y * map.tileHeight);

    map.draw(g);

    for (let user of userList) {
        user.draw(g, map, userList);
    }
}

function endGame(evt) {
    //evt = {
    //    roomName: string // the room name of the conference
    //};

    if (evt.roomName === currentRoomName) {
        currentRoomName = null;
        showLogin();
    }
}