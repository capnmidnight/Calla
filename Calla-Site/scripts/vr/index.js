import { AmbientLight, BackSide, Color, GridHelper, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, SphereBufferGeometry, Texture, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { arrayClear } from "../calla";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";
import { Skybox } from "./Skybox";
import { addEventListeners } from "../calla";


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

const scene = new Scene();
scene.background = new Color(0x606060);

const background = new Object3D();
scene.add(background);

const light = new AmbientLight(0xffffff, 1);
background.add(light);

const gridColor = new Color(0x808080);
const grid = new GridHelper(20, 40, gridColor, gridColor);
background.add(grid);

const skybox = new Skybox(camera);
background.add(skybox);

const foreground = new Object3D();
scene.add(foreground);

const raycaster = new Raycaster();
const screenPointer = new ScreenPointerControls(renderer.domElement);
addEventListeners(screenPointer, {
    move: (evt) => {
        raycaster.setFromCamera({ x: evt.u, y: evt.v }, camera);
    },
    click: (evt) => {
        if (lastObj) {
            const match = lastObj.name.match(/^act-(\d+)/);
            if (match && match.length >= 2) {
                const actID = parseInt(match[1], 10);
                skybox.setImage(document.querySelector(`#${lastObj.name}>img`));
                loadActivity(actID);
            }
        }
    }
});


async function gett(path) {
    const request = fetch(path),
        response = await request;
    if (!response.ok) {
        throw new Error(`[${response.status}] - ${response.statusText}`);
    }

    return await response.json();
}

/**
 * @param {number} actID
 */
async function loadActivity(actID) {
    const activity = `/VR/Activity/${actID}`,
        transforms = await gett(`${activity}/Transforms`),
        stations = await gett(`${activity}/Stations`),
        audio = await gett(`${activity}/Audio`),
        signs = await gett(`${activity}/Signs`);

    console.log(activity, transforms, stations, audio, signs);
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

function update() {
    if (lastObj) {
        lastObj.scale.set(1, 1, 1);
        lastObj = null;
    }
    controls.update();
    skybox.update();
    arrayClear(hits);
    raycaster.intersectObject(foreground, true, hits);
    for (let hit of hits) {
        lastObj = hit.object;
    }
    if (lastObj) {
        lastObj.scale.set(1.1, 1.1, 1.1);
    }
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

const activities = document.querySelectorAll("section");
const count = activities.length;
let i = 0;
for (let activity of activities) {
    // Use a Cube for the Skybox
    const geom = new SphereBufferGeometry(0.25, 50, 25);
    setGeometryUVsForCubemaps(geom);

    const img = activity.querySelector("img");
    const map = new Texture(img);
    img.addEventListener("load", () => {
        map.needsUpdate = true;
    }, { once: true });

    const mat = new MeshBasicMaterial({ map, side: BackSide });
    const mesh = new Mesh(geom, mat);
    mesh.name = activity.id;
    mesh.position.set(
        1 * Math.cos(2 * i * Math.PI / count),
        1,
        1 * Math.sin(2 * i * Math.PI / count));
    foreground.add(mesh);

    if (i == 0) {
        skybox.setImage(img);
    }

    ++i;
}

