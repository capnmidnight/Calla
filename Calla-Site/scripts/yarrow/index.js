import { arrayClear } from "../calla/arrays/arrayClear";
import { once } from "../calla/events/once";
import { getObject } from "../calla/fetching";
import { splitProgress } from "../calla/progress";
import { isString } from "../calla/typeChecks";
import { CallaAudioSource } from "../calla/vr/CallaAudioSource";
import { door } from "../emoji/emojis";
import { loadFont, makeFont } from "../graphics2d/fonts";
import { EmojiIconMesh } from "../graphics3d/EmojiIconMesh";
import { TextMesh } from "../graphics3d/TextMesh";
import { Object3D } from "../lib/three.js/src/core/Object3D";
import { Vector3 } from "../lib/three.js/src/math/Vector3";
import { Application } from "../vr/Application";
import { NavIcon } from "./NavIcon";
import { PlaybackButton } from "./PlaybackButton";
import { Sign } from "./Sign";

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

const menuItemFont = {
    fontFamily: "Roboto",
    fontSize: 100
};

const emojiFont = {
    fontFamily: "Segoe UI Emoji",
    fontSize: 100
};

/** @type {EmojiIconMesh} */
let homeIcon = null;

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
        app.audio.removeClip(audioTrack.fileName);
    }
    arrayClear(curAudioTracks);
    curZone = null;
});

app.addEventListener("started", async () => {

    await Promise.all([
        loadFont(makeFont(menuItemFont)),
        loadFont(makeFont(emojiFont))]);

    homeIcon = new EmojiIconMesh("homeButton", door.value);
    homeIcon.position.set(0, 0, -1);
    homeIcon.lookAt(0, 1.75, 0);

    homeIcon.addEventListener("click", () => {
        history.back();
    });

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
        app.audio.stopClip(audioTrack.fileName);
    }
}

async function playCurrentAudioZone() {
    for (let audioTrack of curAudioTracks) {
        if (audioTrack.zone === curZone) {
            await app.audio.playClip(audioTrack.fileName, audioTrack.volume);
        }
    }
}

async function showMainMenu(_, skipHistory = false) {
    setHistory(0, null, skipHistory, "Main");
    await showMenu("VR/Languages", false, (language) => showLanguage(language.id));
}

async function showLanguage(languageID, skipHistory = false) {
    setHistory(1, languageID, skipHistory, "Language");
    await showMenu(`VR/Language/${languageID}/Lessons`, true, (lesson) => showLesson(lesson.id));
}

async function showLesson(lessonID, skipHistory = false) {
    setHistory(2, lessonID, skipHistory, "Lesson");
    app.clearScene();
    await showMenu(`VR/Lesson/${lessonID}/Activities`, true, (activity) => showActivity(activity.id));
}

async function showActivity(activityID, skipHistory = false) {
    if (!app.audio.ready) {
        showMenu([{
            id: activityID,
            name: "Start Activity"
        }], false, async (activity) => {
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

        /////////// GROUP DATA /////////////
        for (let transform of transforms) {
            const obj = new Object3D();
            obj.name = transform.name;
            obj.userData.id = transform.id;
            obj.matrix.fromArray(transform.matrix);
            obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);
            curTransforms.set(transform.id, obj);
        }

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

        /////////// BUILD SCENE GRAPH /////////////
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

        /////////// BUILD STATIONS /////////////
        for (let fromStationID of curConnections.keys()) {
            const from = curTransforms.get(fromStationID),
                exits = curConnections.get(fromStationID);

            from.visible = false;

            for (let toStationID of exits) {
                const to = curTransforms.get(toStationID);
                const icon = new NavIcon(from, to);
                icon.addEventListener("click", () => showStation(toStationID, onProgress));
                from.add(icon);
            }
        }

        /////////// BUILD SIGNS /////////////
        for (let sign of signs) {
            const transform = curTransforms.get(sign.transformID);
            const img = new Sign(sign);
            await img.setImage(sign.path, progs.shift());
            transform.add(img);
        }

        /////////// BUILD AUDIO TRACKS /////////////
        for (let audioTrack of audioTracks) {
            const clip = new CallaAudioSource(app.audio, audioTrack.fileName);
            await clip.load(
                audioTrack.loop,
                false,
                audioTrack.spatialize,
                progs.shift(),
                audioTrack.path);

            curAudioTracks.push(audioTrack);

            clip.minDistance = audioTrack.minDistance;
            clip.maxDistance = audioTrack.maxDistance;

            if (audioTrack.spatialize) {
                const transform = curTransforms.get(audioTrack.transformID);
                transform.add(clip);
            }

            if (audioTrack.playbackTransformID > 0) {
                const playbackButton = new PlaybackButton(audioTrack.fileName, audioTrack.volume, clip, app.audio);
                playbackButton.addEventListener("play", stopCurrentAudioZone);
                playbackButton.addEventListener("stop", playCurrentAudioZone);

                const transform = curTransforms.get(audioTrack.playbackTransformID);
                transform.add(playbackButton);

                const findStation = () => {
                    let here = transform;
                    while (here !== null) {
                        for (let station of curStations.values()) {
                            if (station.transformID === here.userData.id) {
                                return here;
                            }
                        }
                        here = here.parent;
                    }
                };

                const stTransform = findStation();
                if (stTransform && stTransform !== transform) {
                    stTransform.attach(playbackButton);
                    playbackButton.lookAt(P.set(0, 1.75, 0).add(stTransform.position));
                }
            }
        }

        app.menu.add(homeIcon);

        /////////// START ACTIVITY /////////////
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

    console.info("Current station is", station.fileName);

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

/**
 * @callback menuItemCallback
 * @param {any} selectedValue
 */

const backButton = { name: "Back" };

/**
 * @param {String|any[]} pathOrItems
 * @param {boolean} showBackButton
 * @param {menuItemCallback} onClick
 */
async function showMenu(pathOrItems, showBackButton, onClick) {
    await app.fadeOut();

    await app.skybox.setImage("images/default-background.jpg");
    app.sun.position.set(1, 1, -1);
    app.sun.lookAt(0, 0, 0);
    app.showSkybox = true;

    app.menu.remove(...app.menu.children);
    app.stage.position.set(0, 0, 0);

    const items = isString(pathOrItems)
        ? await getObject(pathOrItems)
        : pathOrItems;

    if (showBackButton) {
        items.push(backButton);
    }

    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const y = ((items.length - 1) / 2 - i) * 0.4 + 1.5;
        addMenuItem(item, y, (item) => {
            if (item === backButton) {
                history.back();
            }
            else {
                onClick(item);
            }
        });
    }

    await app.fadeIn();
}

/**
 * @param {any} item
 * @param {number} y
 * @param {menuItemCallback} onClick
 */
function addMenuItem(item, y, onClick) {
    const button = Object.assign(new TextMesh(item.name), {
        name: item.name,
        disabled: item.enabled === false,
        textBgColor: item.enabled !== false
            ? item === backButton
                ? "#000000"
                : "#ffffff"
            : "#a0a0a0",
        textColor: item.enabled !== false
            ? item === backButton
                ? "#ffffff"
                : "#000000"
            : "#505050",
        textPadding: [15, 30]
    }, menuItemFont);

    button.position.set(0, y, -5);
    button.value = item.name;
    button.addEventListener("click", () => {
        if (!button.disabled) {
            onClick(item);
        }
    });

    app.menu.add(button);
}