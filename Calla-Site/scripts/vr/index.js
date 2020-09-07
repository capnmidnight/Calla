import { Object3D } from "three/src/core/Object3D";
import { Application } from "./Application";
import { DebugObject } from "./DebugObject";
import { getObject } from "./fetching";
import { Image2DMesh } from "./Image2DMesh";
import { splitProgress } from "./progress";
import { TextMesh } from "./TextMesh";


const app = new Application();
const curTransforms = new Map();
const curStations = new Map();
const curConnections = new Map();

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


    const progs = splitProgress(assetProg, signs.length + 1);

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