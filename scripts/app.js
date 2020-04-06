"use strict";

// TODO: move map data to requestable files
const map = TileMap.DEFAULT,
    keys = [],
    userLookup = {},
    userList = [],
    g = frontBuffer.getContext("2d"),
    CAMERA_LERP = 0.01,
    CAMERA_ZOOM_MAX = 8,
    CAMERA_ZOOM_MIN = 0.1,
    CAMERA_ZOOM_SHAPE = 1 / 4,
    CAMERA_ZOOM_SPEED = 0.005,
    game = new Game();

let gridOffsetX = 0,
    gridOffsetY = 0,

    lastTime = 0,
    mouseX = 0,
    mouseY = 0,
    cameraX = 0,
    cameraY = 0,
    cameraZ = 1,
    targetCameraZ = 1,
    currentRoomName = null,
    me = null;

addEventListener("resize", resize);
frontBuffer.addEventListener("wheel", zoom);

addEventListener("keydown", (evt) => {
    const keyIndex = keys.indexOf(evt.key);
    if (keyIndex < 0) {
        keys.push(evt.key);
    }
});

addEventListener("keyup", (evt) => {
    const keyIndex = keys.indexOf(evt.key);
    if (keyIndex >= 0) {
        keys.splice(keyIndex, 1);
    }
});

frontBuffer.addEventListener("mousemove", (evt) => {
    mouseX = evt.offsetX * devicePixelRatio;
    mouseY = evt.offsetY * devicePixelRatio;
});

frontBuffer.addEventListener("click", (evt) => {
    mouseX = evt.offsetX * devicePixelRatio;
    mouseY = evt.offsetY * devicePixelRatio;
    if (!!me) {
        const tile = getMouseTile();
        me.moveTo(tile.x, tile.y);
    }
});

function resize() {
    frontBuffer.width = frontBuffer.clientWidth * devicePixelRatio;
    frontBuffer.height = frontBuffer.clientHeight * devicePixelRatio;
}

function zoom(evt) {
    evt.preventDefault();
    // Chrome and Firefox report scroll values in completely different ranges.
    const deltaZ = evt.deltaY * (isFirefox ? 1 : 0.02),
        a = project(targetCameraZ, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
        b = Math.pow(a, CAMERA_ZOOM_SHAPE),
        c = b - deltaZ * CAMERA_ZOOM_SPEED,
        d = clamp(c, 0, 1),
        e = Math.pow(d, 1 / CAMERA_ZOOM_SHAPE);

    targetCameraZ = unproject(e, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
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

function endGame(evt) {
    //evt = {
    //    roomName: string // the room name of the conference
    //};

    if (evt.roomName === currentRoomName) {
        currentRoomName = null;
        showLogin();
    }
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
    game.render();
}

function update(dt) {
    gridOffsetX = Math.floor(0.5 * frontBuffer.width / map.tileWidth) * map.tileWidth;
    gridOffsetY = Math.floor(0.5 * frontBuffer.height / map.tileHeight) * map.tileHeight;
    for (let user of userList) {
        user.readInput(dt, keys, MOVE_REPEAT);
    }
    for (let user of userList) {
        user.update(dt, map, userList);
    }
    for (let user of userList) {
        me.readUser(user, AUDIO_DISTANCE_MIN, AUDIO_DISTANCE_MAX);
    }
}

function drawMouse() {
    const tile = getMouseTile();
    g.strokeStyle = "red";
    g.strokeRect(
        tile.x * map.tileWidth,
        tile.y * map.tileHeight,
        map.tileWidth,
        map.tileHeight);
}

function getMouseTile() {
    const imageX = mouseX - gridOffsetX,
        imageY = mouseY - gridOffsetY,
        zoomX = imageX / cameraZ,
        zoomY = imageY / cameraZ,
        mapX = zoomX - cameraX,
        mapY = zoomY - cameraY,
        mapWidth = map.tileWidth,
        mapHeight = map.tileHeight,
        gridX = Math.floor(mapX / mapWidth),
        gridY = Math.floor(mapY / mapHeight),
        tile = { x: gridX, y: gridY};
    return tile;
}