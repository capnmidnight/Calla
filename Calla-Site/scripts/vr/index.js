import { Object3D } from "three/src/core/Object3D";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
import { getObject } from "../calla/fetching";
import { splitProgress } from "../calla/progress";
import { Application } from "./Application";
import { DebugObject } from "./DebugObject";
import { Image2DMesh } from "./Image2DMesh";
import { TextMesh } from "./TextMesh";


const app = new Application();

/** @type {Map<number, Object3D>} */
const curTransforms = new Map();

/** @type {Map<number, Station>} */
const curStations = new Map();

/** @type{Map<number, GraphEdge>} */
const curConnections = new Map();

/** @type{Map<string, AudioTrack[]>} */
const curAudioTracks = new Map();

const views = [
    ["Main", showMainMenu],
    ["Language", showLanguage],
    ["Lesson", showLesson],
    ["Activity", showActivity]
];

/**
 * @callback viewCallback
 * @param {number} id
 * @param {boolean} skipHistory
 **/

/** @type {Map<string, viewCallback>} */
const viewMap = new Map(views);

app.addEventListener("sceneclearing", () => {
    curTransforms.clear();
    curStations.clear();
    curConnections.clear();
    for (let zoneTracks of curAudioTracks.values()) {
        for (let audioTrack of zoneTracks) {
            app.audio.removeClip(audioTrack.path);
        }
    }
    curAudioTracks.clear();
});

app.addEventListener("started", () => {
    if (window.location.search.length === 0) {
        showMainMenu();
    }
    else {
        const expr = window.location.search.substring(1); // 1 removes the question mark;
        const parts = expr.split("=");
        const viewName = parts[0];
        const id = parseInt(parts[1], 10);
        const func = viewMap.get(viewName);
        func(id, true);
    }
});

app.start();

/**
 * @param {Number} soFar
 * @param {Number} total
 * @param {String?} msg
 */
function onProgress(soFar, total, msg) {
    app.onProgress(soFar, total, msg);
}


let curZone = "";
/**
 * @param {string} zone
 */
async function playAudioZone(zone) {
    if (zone !== curZone) {
        stopCurrentAudioZone();
        curZone = zone;
        await playCurrentAudioZone();
    }
}

function stopCurrentAudioZone() {
    if (curAudioTracks.has(curZone)) {
        const curTracks = curAudioTracks.get(curZone);
        for (let audioTrack of curTracks) {
            app.audio.stopClip(audioTrack.path);
        }
    }
}

async function playCurrentAudioZone() {
    if (curAudioTracks.has(curZone)) {
        const curTracks = curAudioTracks.get(curZone);
        for (let audioTrack of curTracks) {
            await app.audio.playClip(audioTrack.path, audioTrack.volume);
        }
    }
}

window.playCurrentAudioZone = playCurrentAudioZone;

async function showMainMenu(_, skipHistory = false) {
    setHistory(0, null, skipHistory, "Main");
    await showMenu("VR/Languages", (language) => showLanguage(language.id));
}

async function showLanguage(languageID, skipHistory = false) {
    setHistory(1, languageID, skipHistory, "Language");
    await showMenu(`VR/Language/${languageID}/Lessons`, (lesson) => showLesson(lesson.id));
}

async function showLesson(lessonID, skipHistory = false) {
    setHistory(2, lessonID, skipHistory, "Lesson");
    await showMenu(`VR/Lesson/${lessonID}/Activities`, (activity) => showActivity(activity.id));
}

async function showActivity(activityID, skipHistory = false) {
    setHistory(3, activityID, skipHistory, "Activity");

    await app.fadeOut();
    app.clearScene();

    const [lessonProg, assetProg] = splitProgress(onProgress, [1, 99]);

    const all = await getObject(`/VR/Activity/${activityID}`, lessonProg);
    const {
        transforms,
        stations,
        connections,
        signs,
        audioTracks
    } = all;


    const progs = splitProgress(assetProg, signs.length + audioTracks.length + 1);

    let startID = null;
    for (let station of stations) {
        curStations.set(station.transformID, station);
        if (station.isStart) {
            startID = station.transformID;
        }
    }

    for (let connection of connections) {
        if (!curConnections.has(connection.fromStationID)) {
            curConnections.set(connection.fromStationID, []);
        }

        const arr = curConnections.get(connection.fromStationID);
        arr.push(connection.toStationID);
    }

    for (let transform of transforms) {
        const obj = new Object3D();
        obj.name = transform.name;
        obj.userData.id = transform.id;
        obj.matrix.fromArray(transform.matrix);
        obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);
        curTransforms.set(transform.id, obj);
    }

    for (let transform of transforms) {
        const child = curTransforms.get(transform.id);
        if (transform.parentID === 0) {
            app.foreground.add(child);
        }
        else {
            const parent = curTransforms.get(transform.parentID);
            parent.attach(child);
        }
    }

    for (let fromStationID of curConnections.keys()) {
        const from = curTransforms.get(fromStationID),
            exits = curConnections.get(fromStationID);

        from.visible = false;

        for (let toStationID of exits) {
            const to = curTransforms.get(toStationID),
                icon = DebugObject();
            icon.position.copy(to.position);
            icon.position.sub(from.position);
            icon.position.y = 0;
            icon.position.normalize();
            icon.position.multiplyScalar(1.5);
            icon.position.y += 1;

            from.add(icon);
            icon.addEventListener("click", () => showStation(toStationID, onProgress));
        }
    }

    for (let sign of signs) {
        const transform = curTransforms.get(sign.transformID);
        const img = new Image2DMesh();
        img.name = "sign-" + sign.fileID;
        if (sign.isCallout) {
            img.addEventListener("click", () => console.log(img.name));
        }
        const prog = progs.shift();
        await img.setImage(sign.path, prog);
        transform.add(img);
    }

    const pos = new Vector3(),
        quat = new Quaternion(),
        up = new Vector3(),
        forward = new Vector3();

    for (let audioTrack of audioTracks) {
        const clip = await app.audio.addClip(
            audioTrack.path,
            audioTrack.loop,
            false,
            progs.shift(),
            audioTrack.path);

        if (!curAudioTracks.has(audioTrack.zone)) {
            curAudioTracks.set(audioTrack.zone, []);
        }

        if (audioTrack.zone !== null) {
            curAudioTracks.get(audioTrack.zone).push(audioTrack);
        }

        clip.spatializer.minDistance = audioTrack.minDistance;
        clip.spatializer.maxDistance = audioTrack.maxDistance;

        if (audioTrack.spatialize) {
            const transform = curTransforms.get(audioTrack.transformID);
            transform.getWorldPosition(pos);
            transform.getWorldQuaternion(quat);
            forward.set(0, 0, -1).applyQuaternion(quat);
            up.set(0, 1, 0).applyQuaternion(quat);
            app.audio.setClipPose(
                audioTrack.path,
                pos.x, pos.y, pos.z,
                forward.x, forward.y, forward.z,
                up.x, up.y, up.z,
                0);

            await clip.spatializer.audio.play();
            clip.spatializer.audio.pause();
        }
    }

    if (startID !== null) {
        await showStation(startID, progs.shift());
    }

    await app.fadeIn();
}

async function showStation(stationID, onProgress) {
    await app.fadeOut();

    const station = curStations.get(stationID),
        here = curTransforms.get(stationID);

    await app.skybox.setImage(station.path, onProgress);
    app.skybox.quaternion.fromArray(station.rotation);
    app.showSkybox = true;

    here.getWorldPosition(app.stage.position);

    for (let otherStationID of curStations.keys()) {
        const there = curTransforms.get(otherStationID);
        there.visible = otherStationID === stationID;
    }

    await playAudioZone(station.zone);

    await app.fadeIn();
}

window.addEventListener("popstate", (evt) => {
    const state = evt.state;
    const view = views[state.step]
    const func = view[1];
    func(state.id, true);
});

function setHistory(step, id, skipHistory, name) {
    if (!skipHistory) {
        if (id !== null) {
            const stub = `?${name}=${id}`;
            history.pushState({ step, id }, name, stub);
        }
        else {
            history.replaceState({ step }, name, "");
        }
    }
}

async function showMenu(path, onClick) {
    await app.fadeOut();

    app.clearScene();
    app.skybox.visible = false;
    app.stage.position.set(0, 0, 0);

    const items = await await getObject(path);
    const tasks = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const y = ((items.length - 1) / 2 - i) / 2 + 1.5;
        tasks.push(addMenuItem(item, y, onClick));
    }
    await Promise.all(tasks);
    await app.fadeIn();
}

async function addMenuItem(item, y, onClick) {
    const mesh = Object.assign(new TextMesh(), {
        textBgColor: item.enabled !== false
            ? "#ffffff"
            : "#a0a0a0",
        textColor: item.enabled !== false
            ? "#000000"
            : "#505050",
        textPadding: [15, 30],
        fontFamily: "Roboto",
        fontSize: 100
    });

    mesh.name = item.name;
    mesh.position.set(0, y, -5);

    await mesh.loadFontAndSetText(item.name);

    app.menu.add(mesh);
    if (item.enabled !== false) {
        mesh.addEventListener("click", () => onClick(item));
    }
}