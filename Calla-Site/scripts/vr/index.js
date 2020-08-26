import { AmbientLight, BackSide, BoxBufferGeometry, Color, GridHelper, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Texture, WebGLRenderer, SphereBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RequestAnimationFrameTimer } from "../game/timers/RequestAnimationFrameTimer";


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
camera.position.set(0, 1.6, 0);

const controls = new OrbitControls(camera, renderer.domElement);

function update() {
    controls.update();
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
    const geom = new SphereBufferGeometry(0.5, 100, 50);
    const positions = geom.attributes.position;
    const normals = geom.attributes.normal;
    const uvs = geom.attributes.uv;

    for (let n = 0; n < normals.count; ++n) {
        const _x = n * normals.itemSize,
            _y = n * normals.itemSize + 1,
            _z = n * normals.itemSize + 2,
            nx = normals.array[_x],
            ny = normals.array[_y],
            nz = normals.array[_z],
            _nx_ = Math.abs(nx),
            _ny_ = Math.abs(ny),
            _nz_ = Math.abs(nz),
            px = positions.array[_x],
            py = positions.array[_y],
            pz = positions.array[_z],
            _px_ = Math.abs(px),
            _py_ = Math.abs(py),
            _pz_ = Math.abs(pz),
            _u = n * uvs.itemSize,
            _v = n * uvs.itemSize + 1;

        let u = uvs.array[_u],
            v = uvs.array[_v],
            largest = 0,
            mx = _nx_,
            max = _px_;

        if (_ny_ > mx) {
            largest = 1;
            mx = _ny_;
            max = _py_;
        }
        if (_nz_ > mx) {
            largest = 2;
            mx = _nz_;
            max = _pz_;
        }

        if (largest === 0) {
            if (px < 0) {
                //left
                u = -pz;
                v = py;
            }
            else {
                // right
                u = pz;
                v = py;
            }
        }
        else if (largest === 1) {
            if (py < 0) {
                // bottom
                u = px;
                v = -pz;
            }
            else {
                // top
                u = px;
                v = pz;
            }
        }
        else {
            if (pz < 0) {
                // front
                u = px;
                v = py;
            }
            else {
                // back
                u = -px;
                v = py;
            }
        }

        u = 0.5 * (u / max + 1) * 0.25;
        v = 0.5 * (v / max + 1) * 0.333333;

        if (largest === 0) {
            if (px < 0) {
                //left
                u += 0;
                v += 1 / 3;
            }
            else {
                // right
                u += 0.5;
                v += 1 / 3;
            }
        }
        else if (largest === 1) {
            if (py < 0) {
                // bottom
                u += 0.25;
                v += 0;
            }
            else {
                // top
                u += 0.25;
                v += 2 / 3;
            }
        }
        else {
            if (pz < 0) {
                // front
                u += 0.25;
                v += 1 / 3;
            }
            else {
                // back
                u += 0.75;
                v += 1 / 3;
            }
        }

        uvs.array[_u] = u;
        uvs.array[_v] = v;
    }

    const img = activity.querySelector("img");
    const map = new Texture(img);
    const mat = new MeshBasicMaterial({ map, side: BackSide });
    const mesh = new Mesh(geom, mat);
    mesh.position.set(2 * Math.cos(2 * i * Math.PI / count), 1, 2 * Math.sin(2 * i * Math.PI / count) - 5);
    ++i;
    scene.add(mesh);

    img.addEventListener("load", () => {
        map.needsUpdate = true;
    }, { once: true });
}