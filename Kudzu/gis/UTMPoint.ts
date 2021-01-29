import { isNumber } from "util";
import { isNullOrUndefined } from "../typeChecks";

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


    /// <summary>
    /// Initialize a new UTMPoint with the given components.
    /// </summary>
    /// <param name="x">The number of x</param>
    /// <param name="y">The number of y</param>
    /// <param name="z">The number of z</param>
    /// <param name="zone">The number of zone</param>
    /// <param name="hemisphere">The hemisphere in which the UTM point sits</param>
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
    /**

    public bool Equals(UTMPoint other);
{
    return other is object
        && Hemisphere == other.Hemisphere
        && X == other.X
        && Y == other.Y
        && Z == other.Z
        && Zone == other.Zone;
}

        /// <summary>
        /// Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
        /// coordinate pair's units will be in meters, and should be usable to make distance
        /// calculations over short distances. /// reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
        /// </summary>
        /// <param name="utm">The UTM point to convert</param>
        /// <returns>The latitude/longitude</returns>
        public static LatLngPoint ToLatLng(this UTMPoint utm);
{
    if (utm is null)
    {
        throw new ArgumentNullException(nameof(utm));
    }

    var N0 = utm.Hemisphere == UTMPoint.GlobeHemisphere.Northern ? 0.0 : DatumWGS_84.FalseNorthing;
    var xi = (utm.Y - N0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
    var eta = (utm.X - DatumWGS_84.E0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
    var xiPrime = xi;
    var etaPrime = eta;
    double sigmaPrime = 1;
    double tauPrime = 0;

    for (var j = 1; j <= 3; ++j) {
        var beta = DatumWGS_84.beta[j - 1];
        var je2 = 2 * j * xi;
        var jn2 = 2 * j * eta;
        var sinje2 = Sin(je2);
        var coshjn2 = Cosh(jn2);
        var cosje2 = Cos(je2);
        var sinhjn2 = Sinh(jn2);

        xiPrime -= beta * sinje2 * coshjn2;
        etaPrime -= beta * cosje2 * sinhjn2;
        sigmaPrime -= 2 * j * beta * cosje2 * coshjn2;
        tauPrime -= 2 * j * beta * sinje2 * sinhjn2;
    }

    var chi = Asin(Sin(xiPrime) / Cosh(etaPrime));

    var lat = chi;

    for (var j = 1; j <= 3; ++j) {
        lat += DatumWGS_84.delta[j - 1] * Sin(2 * j * chi);
    }

    float long0 = (utm.Zone * 6) - 183;
    var lng = Atan(Sinh(etaPrime) / Cos(xiPrime));

    return new LatLngPoint(
        Radians.Degrees((float)lat),
        long0 + Radians.Degrees((float)lng),
        utm.Z);
}
**/
}