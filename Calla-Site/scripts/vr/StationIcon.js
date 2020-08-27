import { SphereBufferGeometry } from "three";
import { AbstractCubeMapView } from "./AbstractCubeMapView";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";

export class StationIcon extends AbstractCubeMapView {
    /**
     * @param {PerspectiveCamera} camera
     */
    constructor() {
        const geom = new SphereBufferGeometry(0.25, 50, 25);
        setGeometryUVsForCubemaps(geom);
        super(geom);
    }
}
