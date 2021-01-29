import { isNumber } from "util";
import { rad2deg } from "../math/rad2deg";
import { isNullOrUndefined } from "../typeChecks";
import { DatumWGS_84 } from "./Datum";
import { LatLngPoint } from "./LatLngPoint";

/**
 * The globe hemispheres in which the UTM point could sit.
 **/
export enum GlobeHemisphere {
    Northern,
    Southern
}

export interface IUTMPoint {
    x: number;
    y: number;
    z: number;
    zone: number;
    hemisphere: GlobeHemisphere;
}

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
export class UTMPoint implements IUTMPoint {

    /**
     * The east/west component of the coordinate.
     **/
    get x() {
        return this._x;
    }
    private _x: number;

    /**
     * The north/south component of the coordinate.
     **/
    get y() {
        return this._y;
    }
    private _y: number;

    /**
     * An altitude component.
     **/
    get z() {
        return this._z;
    }
    private _z: number;

    /**
     * The UTM Zone for which this coordinate represents.
     **/
    get zone() {
        return this._zone;
    }
    private _zone: number;

    /**
     * The hemisphere in which the UTM point sits.
     **/
    get hemisphere() {
        return this._hemisphere;
    }
    private _hemisphere: GlobeHemisphere;


    /**
     * Initialize a zero UTMPoint
     */
    constructor();
    /**
     * Initializes a UTMPoint as a copy of another UTMPoint
     * @param x
     */
    constructor(x: IUTMPoint);
    /**
     * Initialize a UTMPoint from the given components
     * @param x
     * @param y
     * @param z
     * @param zone
     * @param hemisphere
     */
    constructor(x: number, y: number, z: number, zone: number, hemisphere: GlobeHemisphere);
    constructor(x?: number | IUTMPoint, y?: number, z?: number, zone?: number, hemisphere?: GlobeHemisphere) {
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

    toJSON(): string {
        return JSON.stringify({
            x: this.x,
            y: this.y,
            z: this.z,
            zone: this.zone,
            hemisphere: this.hemisphere
        });
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z}) zone ${this.zone}`;
    }

    equals(other: IUTMPoint): boolean {
        return !isNullOrUndefined(other)
            && this.hemisphere == other.hemisphere
            && this.x == other.x
            && this.y == other.y
            && this.z == other.z
            && this.zone == other.zone;
    }

    /**
     * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
     * coordinate pair's units will be in meters, and should be usable to make distance
     * calculations over short distances.
     * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    toLatLng(): LatLngPoint {
        const N0 = this.hemisphere == GlobeHemisphere.Northern ? 0.0 : DatumWGS_84.FalseNorthing;
        const xi = (this.y - N0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
        const eta = (this.x - DatumWGS_84.E0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
        let xiPrime = xi;
        let etaPrime = eta;
        //let sigmaPrime = 1;
        //let tauPrime = 0;

        for (var j = 1; j <= 3; ++j) {
            var beta = DatumWGS_84.beta[j - 1];
            var je2 = 2 * j * xi;
            var jn2 = 2 * j * eta;
            var sinje2 = Math.sin(je2);
            var coshjn2 = Math.cosh(jn2);
            var cosje2 = Math.cos(je2);
            var sinhjn2 = Math.sinh(jn2);

            xiPrime -= beta * sinje2 * coshjn2;
            etaPrime -= beta * cosje2 * sinhjn2;
            //sigmaPrime -= 2 * j * beta * cosje2 * coshjn2;
            //tauPrime -= 2 * j * beta * sinje2 * sinhjn2;
        }

        var chi = Math.asin(Math.sin(xiPrime) / Math.cosh(etaPrime));

        var lat = chi;

        for (var j = 1; j <= 3; ++j) {
            lat += DatumWGS_84.delta[j - 1] * Math.sin(2 * j * chi);
        }

        const long0 = (this.zone * 6) - 183;
        const lng = Math.atan(Math.sinh(etaPrime) / Math.cos(xiPrime));

        return new LatLngPoint(
            rad2deg(lat),
            long0 + rad2deg(lng),
            this.z);
    }
}