"use strict";

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

// TODO: move map data to requestable files
const map = [
    "11111111111111111111",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "10000000000000000001",
    "11111111111111111111"
].map(function (row) { return row.split('').map(parseFloat); }),
    mapHeight = map.length,
    mapWidth = map[0].length,
    midX = Math.floor(mapWidth / 2),
    midY = Math.floor(mapHeight / 2),
    styles = ["lightgrey", "darkgrey"];

addEventListener("resize", resize);

function resize() {
    frontBuffer.width = frontBuffer.clientWidth * devicePixelRatio;
    frontBuffer.height = frontBuffer.clientHeight * devicePixelRatio;
    TILE_COUNT_X = Math.floor(frontBuffer.width / TILE_WIDTH);
    TILE_COUNT_Y = Math.floor(frontBuffer.height / TILE_HEIGHT);
    TILE_COUNT_X_HALF = Math.floor(TILE_COUNT_X / 2);
    TILE_COUNT_Y_HALF = Math.floor(TILE_COUNT_Y / 2);
}

function startGame(evt) {
    //evt = {
    //    roomName: "string", // the room name of the conference
    //    id: "string", // the id of the local participant
    //    displayName: "string", // the display name of the local participant
    //    avatarURL: "string" // the avatar URL of the local participant
    //};

    currentRoomName = evt.roomName;

    api.addEventListener("videoConferenceLeft", endGame);

    me = new User(evt.id, evt.displayName, true);

    jitsiClient.addEventListener("moveTo", function (evt) {
        const user = userLookup[evt.participantID];
        if (!!user) {
            user.moveTo(evt.x, evt.y);
        }
    });

    jitsiClient.addEventListener("requestPosition", function (evt) {
        jitsiClient.txGameData(evt.participantID, "moveTo", { x: me.x, y: me.y });
    });

    gui.hide();
    demo.pause();
    demo.hide();
    demo.parentElement.hide();
    frontBuffer.show();
    resize();
    frontBuffer.focus();

    requestAnimationFrame(function (time) {
        lastTime = time;
        requestAnimationFrame(gameLoop);
    });
}

function gameLoop(time) {
    var dt = time - lastTime;
    lastTime = time;
    update(dt / 1000);
    render();
    if (currentRoomName !== null) {
        requestAnimationFrame(gameLoop);
    }
}

function update(dt) {

    me.update(dt);

    for (var i = 0; i < userList.length; ++i) {
        var user = userList[i];
        user.update(dt);
        me.read(user);
    }
}

function render() {
    g.resetTransform();

    g.fillStyle = "white";
    g.fillRect(0, 0, frontBuffer.width, frontBuffer.height);

    g.translate(Math.floor(TILE_COUNT_X * TILE_WIDTH / 2), Math.floor(TILE_COUNT_Y * TILE_HEIGHT / 2));
    g.translate(-me.x * TILE_WIDTH, -me.y * TILE_HEIGHT);

    g.save();
    g.translate(-midX * TILE_WIDTH, -midY * TILE_HEIGHT);
    for (var y = 0; y < map.length; ++y) {
        var row = map[y];
        for (var x = 0; x < row.length; ++x) {
            var tile = row[x];
            g.fillStyle = styles[tile];
            g.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        }
    }
    g.restore();

    for (var i = 0; i < userList.length; ++i) {
        userList[i].draw(g);
    }

    me.draw(g);
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