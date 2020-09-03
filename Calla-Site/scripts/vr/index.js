import { AmbientLight, Color, Matrix4, Object3D, PerspectiveCamera, Raycaster, Scene, WebGLRenderer, Euler, Quaternion, Vector3 } from "three";
import { addEventListeners, arrayClear } from "../calla";
import { CameraControl } from "../input/CameraControl";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { Stage } from "../input/Stage";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { DebugObject } from "./DebugObject";
import { Fader } from "./Fader";
import { getObject } from "./getObject";
import { Skybox } from "./Skybox";
import { TextMesh } from "./TextMesh";

const renderer = new WebGLRenderer({
    canvas: document.getElementById("frontBuffer"),
    powerPreference: "high-performance",
    precision: "highp",
    antialias: true,
    depth: true,
    stencil: true,
    premultipliedAlpha: true,
    logarithmicDepthBuffer: true,
    alpha: false,
    preserveDrawingBuffer: false
}),
    camera = new PerspectiveCamera(50, 1, 0.01, 1000),
    fader = new Fader(camera),
    scene = new Scene(),
    background = new Object3D(),
    light = new AmbientLight(0xffffff, 1),
    skybox = new Skybox(camera),
    foreground = new Object3D(),
    raycaster = new Raycaster(),
    curTransforms = new Map(),
    curStations = new Map(),
    curConnections = new Map(),
    hits = [],
    timer = new RequestAnimationFrameTimer(),
    stage = new Stage(camera),
    controls = new ScreenPointerControls(renderer.domElement),
    cameraControl = new CameraControl(renderer, camera, stage, controls);

let lastObj = null;

window.scene = scene;
window.stage = stage;

timer.addEventListener("tick", update);
window.addEventListener("resize", resize);

addEventListeners(controls, {
    move: (evt) => {
        let pointer = null;

        if (document.pointerLockElement) {
            pointer = { x: 0, y: 0 };
        }
        else {
            pointer = { x: evt.u, y: evt.v };
        }

        raycaster.setFromCamera(pointer, camera);
    },
    click: () => {
        if (lastObj) {
            lastObj.dispatchEvent({ type: "click" });
        }
    }
});

renderer.setPixelRatio(window.devicePixelRatio);
stage.position.set(0, 0, 3);
skybox.visible = false;
scene.background = new Color(0x606060);
scene.add(background);
scene.add(foreground);
background.name = "Background";
background.add(light);
background.add(skybox);
background.add(stage);
foreground.name = "Foreground";
cameraControl.controlMode = CameraControl.Mode.MouseLocked;
resize();
timer.start();
startup();

function clearScene() {
    foreground.remove(...foreground.children);
    curTransforms.clear();
    curStations.clear();
    curConnections.clear();
}

const scales = new Map();
function update(evt) {
    skybox.update();

    arrayClear(hits);
    raycaster.intersectObject(foreground, true, hits);

    let curObj = null;
    for (let hit of hits) {
        if (hit.object
            && hit.object._listeners
            && hit.object._listeners.click
            && hit.object._listeners.click.length) {
            curObj = hit.object;
        }
    }

    if (curObj !== lastObj) {

        if (lastObj && scales.has(lastObj)) {
            lastObj.scale.fromArray(scales.get(lastObj));
        }

        if (curObj) {
            if (!scales.has(curObj)) {
                scales.set(curObj, curObj.scale.toArray());
            }
            curObj.scale.multiplyScalar(1.1);
        }

        lastObj = curObj;
    }

    fader.update(evt.sdt);
    renderer.render(scene, camera);
}

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

async function showMenu(path, onClick) {
    await fader.fadeOut();
    const items = await await getObject(path);
    clearScene();
    const tasks = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const y = ((items.length - 1) / 2 - i) / 2 + 1.5;
        tasks.push(addMenuItem(item, y, onClick));
    }
    await Promise.all(tasks);
    await fader.fadeIn();
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
    mesh.position.set(0, y, -2);

    await mesh.loadFontAndSetText(item.name);

    foreground.add(mesh);
    if (item.enabled !== false) {
        mesh.addEventListener("click", () => onClick(item));
    }
}

async function startup() {
    await showLanguagesMenu();
}

async function showLanguagesMenu() {
    await showMenu("VR/Languages", (language) => showLanguageLessons(language.id));
}

async function showLanguageLessons(languageID) {
    await showMenu(`VR/Language/${languageID}/Lessons`, (lesson) => showLessonActivities(lesson.id));
}

async function showLessonActivities(lessonID) {
    await showMenu(`VR/Lesson/${lessonID}/Activities`, (activity) => showActivity(activity.id));
}

const deltaPos = new Vector3();
async function showActivity(activityID) {
    await fader.fadeOut();

    const activity = `/VR/Activity/${activityID}`,
        transforms = await getObject(`${activity}/Scene`),
        stations = await getObject(`${activity}/Stations`),
        connections = await getObject(`${activity}/Map`),
        audio = await getObject(`${activity}/Audio`),
        signs = await getObject(`${activity}/Signs`);

    console.log(audio);
    console.log(signs);

    clearScene();

    buildScene(foreground, transforms);

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

    if (startID !== null) {
        await showStation(startID);
    }
}

async function showStation(stationID) {
    await fader.fadeOut();

    const station = curStations.get(stationID),
        here = curTransforms.get(stationID),
        exits = curConnections.get(stationID),
        imgPath = `/VR/File/${station.fileID}`;

    await skybox.setImage(imgPath);
    skybox.visible = true;

    skybox.quaternion.fromArray(station.rotation);
    here.getWorldPosition(stage.position);

    for (let exit of exits) {
        const to = curTransforms.get(exit),
            icon = DebugObject();
        deltaPos.copy(to.position);
        deltaPos.sub(here.position);
        deltaPos.y = 0;
        deltaPos.z *= -1;
        deltaPos.normalize();
        deltaPos.multiplyScalar(1.5);
        deltaPos.y += 1;
        deltaPos.add(here.position);
        icon.position.copy(deltaPos);
        foreground.add(icon);
        icon.addEventListener("click", () => showStation(exit));
    }

    await fader.fadeIn();
}

function buildScene(root, transforms) {
    const matrix = new Matrix4();
    for (let transform of transforms) {
        const obj = new Object3D();
        obj.name = transform.name;
        obj.userData.id = transform.id;
        matrix.fromArray(transform.matrix);
        matrix.decompose(obj.position, obj.quaternion, obj.scale);
        obj.updateMatrix();
        curTransforms.set(transform.id, obj);
    }

    for (let transform of transforms) {
        const child = curTransforms.get(transform.id);
        if (transform.parentID === 0) {
            root.add(child);
        }
        else {
            const parent = curTransforms.get(transform.parentID);
            parent.attach(child);
        }
    }
}