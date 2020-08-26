import { AmbientLight, BackSide, Color, GridHelper, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereBufferGeometry, Texture, Vector3, WebGLRenderer, Raycaster } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";
import { Skybox } from "./Skybox";


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

const scene = new Scene();
scene.background = new Color(0x606060);

const light = new AmbientLight(0xffffff, 1);
scene.add(light);

const gridColor = new Color(0x808080);
const grid = new GridHelper(20, 40, gridColor, gridColor);
scene.add(grid);

const camera = new PerspectiveCamera(50, 1, 0.01, 1000);
camera.position.set(0, 1.6, 1);

const skybox = new Skybox(camera);
scene.add(skybox);

const cameraForward = new Vector3();
camera.getWorldDirection(cameraForward);
const raycaster = new Raycaster(camera.position, cameraForward, camera.near, camera.far);

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

renderer.domElement.addEventListener("mousemove", (evt) => {
    
});

function update() {
    controls.update();
    skybox.update();
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
    mesh.position.set(
        1 * Math.cos(2 * i * Math.PI / count),
        1,
        1 * Math.sin(2 * i * Math.PI / count));
    scene.add(mesh);

    if (i == 0) {
        skybox.setImage(img);
    }

    ++i;
}

