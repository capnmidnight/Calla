import { isNumber } from "util";
import { isNullOrUndefined } from "../typeChecks";
/**
 * The globe hemispheres in which the UTM point could sit.
 **/
export var GlobeHemisphere;
(function (GlobeHemisphere) {
    GlobeHemisphere[GlobeHemisphere["Northern"] = 0] = "Northern";
    GlobeHemisphere[GlobeHemisphere["Southern"] = 1] = "Southern";
})(GlobeHemisphere || (GlobeHemisphere = {}));
/**
 * The Universal Transverse Mercator (UTM) conformal projection uses a 2-dimensional Cartesian
 * coordinate system to give locations on the surface of the Earth. Like the traditional method
 * of latitude and longitude, it is a horizontal position representation, i.e. it is used to
 * identify locations on the Earth independently of vertical position. However, it differs from
 * that method in several respects.
 *
 * The UTM system is not a single map projection. The system instead divides the Earth into sixty
 * zones, each being a six-degree band of longitude, and uses a secant transverse Mercator
 * projection in each zone.
 **/
export class UTMPoint {
    /// <summary>
    /// Initialize a new UTMPoint with the given components.
    /// </summary>
    /// <param name="x">The number of x</param>
    /// <param name="y">The number of y</param>
    /// <param name="z">The number of z</param>
    /// <param name="zone">The number of zone</param>
    /// <param name="hemisphere">The hemisphere in which the UTM point sits</param>
    constructor(x, y, z, zone, hemisphere) {
        if (!isNullOrUndefined(x)
            && !isNumber(x)) {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
            this._zone = x.zone;
            this._hemisphere = x.hemisphere;
        }
        else {
            this._x = x || 0;
            this._y = y || 0;
            this._z = z || 0;
            this._zone = zone || 0;
            this._hemisphere = hemisphere || GlobeHemisphere.Northern;
        }
    }
    /**
     * The east/west component of the coordinate.
     **/
    get x() {
        return this._x;
    }
    /**
     * The north/south component of the coordinate.
     **/
    get y() {
        return this._y;
    }
    /**
     * An altitude component.
     **/
    get z() {
        return this._z;
    }
    /**
     * The UTM Zone for which this coordinate represents.
     **/
    get zone() {
        return this._zone;
    }
    /**
     * The hemisphere in which the UTM point sits.
     **/
    get hemisphere() {
        return this._hemisphere;
    }
    toJSON() {
        return JSON.stringify({
            x: this.x,
            y: this.y,
            z: this.z,
            zone: this.zone,
            hemisphere: this.hemisphere
        });
    }
    toString() {
        return `(${this.x}, ${this.y}, ${this.z}) zone ${this.zone}`;
    }
}
//# sourceMappingURL=UTMPoint.js.map