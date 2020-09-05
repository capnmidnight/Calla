import { Object3D } from "three";
import { DebugObject } from "./DebugObject";
import { getObject } from "./getObject";
import { Image2DMesh } from "./Image2DMesh";
import { TextMesh } from "./TextMesh";
import { ThreeJSApplication } from "./ThreeJSApplication";


const app = new ThreeJSApplication();
const curTransforms = new Map();
const curStations = new Map();
const curConnections = new Map();

app.addEventListener("sceneclearing", () => {
    curTransforms.clear();
    curStations.clear();
    curConnections.clear();
});

app.addEventListener("started", () => {
    showMainMenu();
});

app.start();

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

    await app.fader.fadeOut();
    app.clearScene();

    const activity = `/VR/Activity/${activityID}`,
        transforms = await getObject(`${activity}/Scene`),
        stations = await getObject(`${activity}/Stations`),
        connections = await getObject(`${activity}/Map`),
        signs = await getObject(`${activity}/Signs`),
        audio = await getObject(`${activity}/Audio`);

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
            icon.addEventListener("click", () => showStation(toStationID));
        }
    }

    for (let sign of signs) {
        const transform = curTransforms.get(sign.transformID);
        const img = new Image2DMesh();
        img.name = "sign-" + sign.imageFileID;
        if (sign.isCallout) {
            img.addEventListener("click", () => console.log(img.name));
        }
        await img.setImage(`VR/File/${sign.imageFileID}`);
        transform.add(img);
    }

    if (startID !== null) {
        await showStation(startID, true);
    }
    await app.fader.fadeIn();
}

async function showStation(stationID, skipHistory = false) {
    setHistory(4, stationID, skipHistory, "Station");

    await app.fader.fadeOut();

    const station = curStations.get(stationID),
        here = curTransforms.get(stationID),
        imgPath = `/VR/File/${station.fileID}`;

    await app.skybox.setImage(imgPath);
    app.skybox.visible = true;
    app.skybox.quaternion.fromArray(station.rotation);

    here.getWorldPosition(app.stage.position);

    for (let otherStationID of curStations.keys()) {
        const there = curTransforms.get(otherStationID);
        there.visible = otherStationID === stationID;
    }

    await app.fader.fadeIn();
}

const functs = [
    showMainMenu,
    showLanguage,
    showLesson,
    showActivity,
    showStation
];

window.addEventListener("popstate", (evt) => {
    const state = evt.state;
    const func = functs[state.step];
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
    await app.fader.fadeOut();

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
    await app.fader.fadeIn();
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

    app.foreground.add(mesh);
    if (item.enabled !== false) {
        mesh.addEventListener("click", () => onClick(item));
    }
}