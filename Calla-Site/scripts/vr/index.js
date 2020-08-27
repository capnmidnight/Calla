import { AmbientLight, Color, Matrix4, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addEventListeners, arrayClear } from "../calla";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { DebugObject } from "./DebugObject";
import { Fader } from "./Fader";
import { getObject } from "./getObject";
import { Skybox } from "./Skybox";
import { StationIcon } from "./StationIcon";

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
background.add(camera);
background.add(light);
background.add(skybox);
resize();

async function loadActivity(actID) {
    const activity = `/VR/Activity/${actID}`,
        transforms = await getObject(`${activity}/Transforms`),
        stations = await getObject(`${activity}/Stations`),
        //stationConnections = await getObject(`${activity}/StationConnections`),
        audio = await getObject(`${activity}/Audio`),
        signs = await getObject(`${activity}/Signs`);

    console.log(activity);
    console.log(transforms);
    console.log(stations);
    //console.log(stationConnections);
    console.log(audio);
    console.log(signs);

    foreground.remove(...foreground.children);
    arrayClear(curIcons);
    objectClicks.clear();
    curTransforms.clear();
    curStations.clear();

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

function update(evt) {
    if (lastObj) {
        lastObj.scale.set(1, 1, 1);
        lastObj = null;
    }
    controls.update();
    skybox.update();
    for (let icon of curIcons) {
        icon.update();
    }

    arrayClear(hits);
    raycaster.intersectObject(foreground, true, hits);
    for (let hit of hits) {
        lastObj = hit.object;
    }
    if (lastObj) {
        lastObj.scale.set(1.1, 1.1, 1.1);
    }

    fader.update(evt.sdt);
    renderer.render(scene, camera);
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

async function addActivity(activity, a) {
    const match = activity.id.match(/^act-(\d+)/),
        actID = parseInt(match[1], 10),
        img = activity.querySelector("img"),
        icon = new StationIcon();

    curIcons.push(icon);
    icon.name = activity.id;
    icon.position.set(Math.cos(a), 1, Math.sin(a));
    objectClicks.set(icon, () => loadActivity(actID));
    await icon.setImage(img);
    foreground.add(icon);
}

(async function () {
    const activities = document.querySelectorAll("section"),
        count = activities.length,
        tasks = [];
    for (let i = 0; i < activities.length; ++i) {
        const activity = activities[i],
            a = 2 * i * Math.PI / count;

        tasks.push(addActivity(activity, a));
    }

    await Promise.all(tasks);
    timer.start();
    await fader.fadeIn();
})();
