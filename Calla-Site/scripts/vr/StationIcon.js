import { SphereBufferGeometry } from "three";
import { AbstractCubeMapView } from "./AbstractCubeMapView";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";

const geom = new SphereBufferGeometry(0.25, 50, 25);
setGeometryUVsForCubemaps(geom);
export class StationIcon extends AbstractCubeMapView {
    constructor() {
        super(geom);
    }
}
