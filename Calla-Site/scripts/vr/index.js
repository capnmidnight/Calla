import { Object3D } from "three/src/core/Object3D";
import { Vector3 } from "three/src/math/Vector3";
import { arrayClear } from "../calla/arrays/arrayClear";
import { once } from "../calla/events/once";
import { getObject } from "../calla/fetching";
import { setRightUpFwdPos } from "../calla/math/setRightUpFwd";
import { splitProgress } from "../calla/progress";
import { isString } from "../calla/typeChecks";
import { Application } from "./Application";
import { DebugObject } from "./DebugObject";
import { Image2DMesh } from "./Image2DMesh";
import { TextMesh } from "./TextMesh";

const R = new Vector3();
const U = new Vector3();
const F = new Vector3();
const P = new Vector3();
const app = new Application();

/** @type {Map<number, Object3D>} */
const curTransforms = new Map();

/** @type {Map<number, Station>} */
const curStations = new Map();

/** @type{Map<number, GraphEdge>} */
const curConnections = new Map();

/** @type{AudioTrack[]} */
const curAudioTracks = [];

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
    for (let audioTrack of curAudioTracks) {
        app.audio.removeClip(audioTrack.path);
    }
    arrayClear(curAudioTracks);
    curZone = null;
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


/** @type {string} */
let curZone = null;
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
    for (let audioTrack of curAudioTracks) {
        if (audioTrack.zone === curZone);
        app.audio.stopClip(audioTrack.path);
    }
}

async function playCurrentAudioZone() {
    for (let audioTrack of curAudioTracks) {
        if (audioTrack.zone === curZone) {
            await app.audio.playClip(audioTrack.path, audioTrack.volume);
        }
    }
}

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
    app.clearScene();
    await showMenu(`VR/Lesson/${lessonID}/Activities`, (activity) => showActivity(activity.id));
}

async function showActivity(activityID, skipHistory = false) {
    if (!app.audio.ready) {
        showMenu([{
            id: activityID,
            name: "Start Activity"
        }], async (activity) => {
            await once(app.audio, "audioready");
            showActivity(activity.id, skipHistory);
        });
    }
    else {
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

        for (let audioTrack of audioTracks) {
            const clip = await app.audio.createClip(
                audioTrack.path,
                audioTrack.loop,
                false,
                audioTrack.spatialize,
                progs.shift(),
                audioTrack.path);

            curAudioTracks.push(audioTrack);
            clip.spatializer.minDistance = audioTrack.minDistance;
            clip.spatializer.maxDistance = audioTrack.maxDistance;

            if (audioTrack.spatialize) {
                const transform = curTransforms.get(audioTrack.transformID);
                transform.add(DebugObject(0x0000ff));
                setRightUpFwdPos(transform.matrixWorld, R, U, F, P);
                app.audio.setClipPose(
                    audioTrack.path,
                    P.x, P.y, P.z,
                    R.x, R.y, R.z,
                    F.x, F.y, F.z,
                    0);
            }

            if (audioTrack.playbackTransformID > 0) {
                const playbackButton = DebugObject(0x00ff00);
                playbackButton.addEventListener("click", async () => {
                    stopCurrentAudioZone();
                    app.audio.playClip(audioTrack.path, audioTrack.volume)
                    await once(clip.spatializer.audio, "ended");
                    playCurrentAudioZone();
                });

                const transform = curTransforms.get(audioTrack.playbackTransformID);
                transform.add(playbackButton);
            }
        }

        if (startID !== null) {

            await showStation(startID, progs.shift());
        }

        await app.fadeIn();
    }
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

async function showMenu(pathOrItems, onClick) {
    await app.fadeOut();

    app.menu.remove(...app.menu.children);
    app.skybox.visible = false;
    app.stage.position.set(0, 0, 0);

    const items = isString(pathOrItems)
        ? await getObject(pathOrItems)
        : pathOrItems;
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
    const button = Object.assign(new TextMesh(), {
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

    button.name = item.name;
    button.position.set(0, y, -5);

    await button.loadFontAndSetText(item.name);

    app.menu.add(button);
    button.disabled = item.enabled === false;
    button.addEventListener("click", () => {
        if (!button.disabled) {
            onClick(item);
        }
    });
}