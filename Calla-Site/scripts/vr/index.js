import { AmbientLight, BoxBufferGeometry, Color, Matrix4, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addEventListeners, arrayClear } from "../calla";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { getObject } from "./getObject";
import { Skybox } from "./Skybox";
import { StationIcon } from "./StationIcon";
import { Fader } from "./Fader";


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
});
renderer.setPixelRatio(window.devicePixelRatio);

const camera = new PerspectiveCamera(50, 1, 0.01, 1000);
camera.position.set(0, 1.6, 1);

const fader = new Fader(camera);

const scene = new Scene();
scene.background = new Color(0x606060);
window.scene = scene;

const background = new Object3D();
scene.add(background);
background.add(camera);

const light = new AmbientLight(0xffffff, 1);
background.add(light);

const skybox = new Skybox(camera);
skybox.visible = false;
background.add(skybox);

const foreground = new Object3D();
scene.add(foreground);

/** @type {Map<Object3D, function>} */
const objectClicks = new Map();
const raycaster = new Raycaster();
const screenPointer = new ScreenPointerControls(renderer.domElement);
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

const cube = new BoxBufferGeometry(0.1, 0.1, 0.1, 1, 1, 1);
const mube = new MeshBasicMaterial({ color: 0xff0000 });
function D() {
    return new Mesh(cube, mube);
}

const curIcons = [];
/** @type {Map<number, Object3D>} */
const curTransforms = new Map();
/** @type {Map<number, any>} */
const curStations = new Map();

/**
 * @param {number} actID
 */
async function loadActivity(actID) {
    const activity = `/VR/Activity/${actID}`,
        transforms = await getObject(`${activity}/Transforms`),
        stations = await getObject(`${activity}/Stations`),
        audio = await getObject(`${activity}/Audio`),
        signs = await getObject(`${activity}/Signs`);

    console.log(activity);
    console.log(transforms);
    console.log(stations);
    console.log(audio);
    console.log(signs);

    foreground.remove(...foreground.children);
    arrayClear(curIcons);
    objectClicks.clear();
    curTransforms.clear();
    curStations.clear();

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
            foreground.add(child);
        }
        else {
            const parent = curTransforms.get(transform.parentID);
            parent.attach(child);
        }
    }

    for (let station of stations) {
        const parent = curTransforms.get(station.transformID),
            icon = D(),
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

const controls = Object.assign(new OrbitControls(camera, renderer.domElement), {
    enableDamping: true,
    dampingFactor: 0.05,
    screenSpacePanning: false,
    minDistance: 1,
    maxDistance: 5,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: 5 * Math.PI / 8,
    center: new Vector3(0, 1, 0)
});

const hits = [];
/** @type {Object3D} */
let lastObj = null;

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
const timer = new RequestAnimationFrameTimer();
timer.addEventListener("tick", update);
timer.start();


function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);
resize();

(async function () {
    const activities = document.querySelectorAll("section"),
        count = activities.length,
        tasks = [];
    for (let i = 0; i < activities.length; ++i) {
        const activity = activities[i],
            match = activity.id.match(/^act-(\d+)/),
            actID = parseInt(match[1], 10),
            img = activity.querySelector("img"),
            icon = new StationIcon(),
            a = 2 * i * Math.PI / count;

        curIcons.push(icon);
        icon.name = activity.id;
        icon.position.set(Math.cos(a), 1, Math.sin(a));
        objectClicks.set(icon, () => loadActivity(actID));

        tasks.push(icon.setImage(img)
            .then(() => foreground.add(icon)));
    }

    await Promise.all(tasks);
    await fader.fadeIn();
})();