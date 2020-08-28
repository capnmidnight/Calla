import { AmbientLight, Color, Matrix4, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer, PlaneBufferGeometry, MeshBasicMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addEventListeners, arrayClear } from "../calla";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { DebugObject } from "./DebugObject";
import { Fader } from "./Fader";
import { getObject } from "./getObject";
import { Skybox } from "./Skybox";
import { StationIcon } from "./StationIcon";
import { TextImage } from "../game/graphics/TextImage";
import { TexturedMesh } from "./TexturedMesh";

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
    objectClicks = new Map(),
    raycaster = new Raycaster(),
    screenPointer = new ScreenPointerControls(renderer.domElement),
    curIcons = [],
    curTransforms = new Map(),
    curStations = new Map(),
    controls = Object.assign(new OrbitControls(camera, renderer.domElement), {
        enableDamping: true,
        dampingFactor: 0.05,
        screenSpacePanning: false,
        minDistance: 1,
        maxDistance: 5,
        minPolarAngle: Math.PI / 6,
        maxPolarAngle: 5 * Math.PI / 8,
        center: new Vector3(0, 1, 0)
    }),
    hits = [],
    timer = new RequestAnimationFrameTimer();

let lastObj = null;

timer.addEventListener("tick", update);
window.addEventListener("resize", resize);

addEventListeners(screenPointer, {
    move: (evt) => {
        raycaster.setFromCamera({ x: evt.u, y: evt.v }, camera);
    },
    click: (evt) => {
        if (objectClicks.has(lastObj)) {
            objectClicks.get(lastObj)();
        }
    }
});

renderer.setPixelRatio(window.devicePixelRatio);
camera.position.set(0, 1.6, 1);
skybox.visible = false;
scene.background = new Color(0x606060);
window.scene = scene;
scene.add(background);
scene.add(foreground);
background.name = "Background";
background.add(camera);
background.add(light);
background.add(skybox);
foreground.name = "Foreground";
resize();
timer.start();
showLanguagesMenu();

function clearScene() {
    foreground.remove(...foreground.children);
    arrayClear(curIcons);
    objectClicks.clear();
    curTransforms.clear();
    curStations.clear();
}

const scales = new Map();
function update(evt) {
    controls.update();
    skybox.update();
    for (let icon of curIcons) {
        icon.update();
    }

    arrayClear(hits);
    raycaster.intersectObject(foreground, true, hits);

    let curObj = null;
    for (let hit of hits) {
        if (objectClicks.has(hit.object)) {
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

async function showMenu(path, onClick) {
    await fader.fadeOut();
    const items = await await getObject(path);
    clearScene();
    const tasks = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const y = ((items.length - 1) / 2 - i) / 2;
        tasks.push(addMenuItem(item, y, onClick));
    }
    await Promise.all(tasks);
    await fader.fadeIn();
}

const buttonGeom = new PlaneBufferGeometry(1, 1, 1, 1);
async function addMenuItem(item, y, onClick) {
    const lbl = new TextImage("sans-serif");
    lbl.bgColor = item.enabled !== false
        ? "#ffffff"
        : "#a0a0a0";
    lbl.color = item.enabled !== false
        ? "#000000"
        : "#505050";
    lbl.fontSize = 100;
    lbl.padding = [20, 50];
    lbl.value = item.name;

    const mat = new MeshBasicMaterial({ transparent: true });
    const mesh = new TexturedMesh(buttonGeom, mat);
    mesh.name = item.name;
    mesh.position.set(0, y, -3);
    mesh.scale.set(lbl.width / 300, lbl.height / 300, 1);
    await mesh.setImage(lbl.canvas);

    foreground.add(mesh);
    if (item.enabled !== false) {
        objectClicks.set(mesh, () => onClick(item));
    }
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

async function showActivity(activityID) {
    await fader.fadeOut();

    const activity = `/VR/Activity/${activityID}`,
        transforms = await getObject(`${activity}/Scene`),
        stations = await getObject(`${activity}/Stations`),
        connections = await getObject(`${activity}/Map`),
        audio = await getObject(`${activity}/Audio`),
        signs = await getObject(`${activity}/Signs`);

    console.log(activity);
    console.log(transforms);
    console.log(stations);
    console.log(connections);
    console.log(audio);
    console.log(signs);

    clearScene();
    buildScene(foreground, transforms);

    for (let station of stations) {
        const parent = curTransforms.get(station.transformID),
            icon = DebugObject(),
            imgPath = `/VR/File/${station.fileID}`,
            jump = async () => {
                await fader.fadeOut();
                await skybox.setImage(imgPath);
                skybox.visible = true;
                camera.position.copy(parent.position);
                await fader.fadeIn();
            };

        parent.add(icon);
        objectClicks.set(icon, jump);
        curStations.set(station.transformID, station);
        if (station.isStart) {
            jump();
        }
    }
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