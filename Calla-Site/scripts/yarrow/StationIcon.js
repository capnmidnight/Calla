import { SphereBufferGeometry } from "../lib/three.js/src/geometries/SphereGeometry";
import { AbstractCubeMapView } from "../graphics3d/AbstractCubeMapView";
import { setGeometryUVsForCubemaps } from "../graphics3d/setGeometryUVsForCubemaps";

const geom = new SphereBufferGeometry(0.25, 50, 25);
setGeometryUVsForCubemaps(geom);
export class StationIcon extends AbstractCubeMapView {
    constructor() {
        super(geom);
    }
}
