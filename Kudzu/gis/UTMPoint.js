import { vec2, vec3 } from "gl-matrix";
import { deg2rad } from "../math/deg2rad";
import { isNullOrUndefined, isNumber } from "../typeChecks";
import { DatumWGS_84 } from "./Datum";
import { LatLngPoint } from "./LatLngPoint";
function has2Components(arr) {
    return !isNumber(arr) && arr.length === 2;
}
function has3Components(arr) {
    return !isNumber(arr) && arr.length === 3;
}
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
    constructor(eastingOrCopy, northing, altitude, zone, hemisphere) {
        if (!isNullOrUndefined(eastingOrCopy)
            && !isNumber(eastingOrCopy)) {
            this._easting = eastingOrCopy.easting;
            this._northing = eastingOrCopy.northing;
            this._altitude = eastingOrCopy.altitude;
            this._zone = eastingOrCopy.zone;
            this._hemisphere = eastingOrCopy.hemisphere;
        }
        else {
            this._easting = eastingOrCopy || 0;
            this._northing = northing || 0;
            this._altitude = altitude || 0;
            this._zone = zone || 0;
            this._hemisphere = hemisphere || GlobeHemisphere.Northern;
        }
    }
    /**
     * The east/west component of the coordinate.
     **/
    get easting() {
        return this._easting;
    }
    /**
     * The north/south component of the coordinate.
     **/
    get northing() {
        return this._northing;
    }
    /**
     * An altitude component.
     **/
    get altitude() {
        return this._altitude;
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
            x: this.easting,
            y: this.northing,
            z: this.altitude,
            zone: this.zone,
            hemisphere: this.hemisphere
        });
    }
    toString() {
        return `(${this.easting}, ${this.northing}, ${this.altitude}) zone ${this.zone}`;
    }
    equals(other) {
        return !isNullOrUndefined(other)
            && this.hemisphere == other.hemisphere
            && this.easting == other.easting
            && this.northing == other.northing
            && this.altitude == other.altitude
            && this.zone == other.zone;
    }
    /**
     * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
     * coordinate pair's units will be in meters, and should be usable to make distance
     * calculations over short distances.
     * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    fromLatLng(latLng) {
        const hemisphere = latLng.latitude < 0
            ? GlobeHemisphere.Southern
            : GlobeHemisphere.Northern;
        const k0 = 0.9996;
        const phi = deg2rad(latLng.latitude);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const sin2Phi = 2 * sinPhi * cosPhi;
        const cos2Phi = (2 * cosPhi * cosPhi) - 1;
        const sin4Phi = 2 * sin2Phi * cos2Phi;
        const cos4Phi = (2 * cos2Phi * cos2Phi) - 1;
        const sin6Phi = (sin4Phi * cos2Phi) + (cos4Phi * sin2Phi);
        const tanPhi = sinPhi / cosPhi;
        const ePhi = DatumWGS_84.e * sinPhi;
        const N = DatumWGS_84.equatorialRadius / Math.sqrt(1 - (ePhi * ePhi));
        const utmz = 1 + Math.floor((latLng.longitude + 180) / 6.0);
        const zcm = 3 + (6.0 * (utmz - 1)) - 180;
        const A = deg2rad(latLng.longitude - zcm) * cosPhi;
        const M = DatumWGS_84.equatorialRadius * ((phi * DatumWGS_84.alpha1)
            - (sin2Phi * DatumWGS_84.alpha2)
            + (sin4Phi * DatumWGS_84.alpha3)
            - (sin6Phi * DatumWGS_84.alpha4));
        // Easting
        const T = tanPhi * tanPhi;
        const C = DatumWGS_84.e0sq * cosPhi * cosPhi;
        const Asqr = A * A;
        const Tsqr = T * T;
        const x0 = 1 - T + C;
        const x1 = 5 - (18 * T) + Tsqr + (72.0 * C) - (58 * DatumWGS_84.e0sq);
        const x2 = Asqr * x1 / 120.0;
        const x3 = (x0 / 6) + x2;
        const x4 = 1 + (Asqr * x3);
        const easting = k0 * N * A * x4 + DatumWGS_84.E0;
        // Northing
        let northing = k0 * (M + (N * tanPhi * (Asqr * ((1 / 2.0) + (Asqr * (((5 - T + (9 * C) + (4 * C * C)) / 24.0) + (Asqr * (61 - (58 * T) + Tsqr + (600 * C) - (330 * DatumWGS_84.e0sq)) / 720.0)))))));
        if (hemisphere == GlobeHemisphere.Southern) {
            northing += DatumWGS_84.FalseNorthing;
        }
        this._easting = easting;
        this._northing = northing;
        this._altitude = latLng.altitude || 0;
        this._zone = utmz;
        this._hemisphere = hemisphere;
        return this;
    }
    /**
     * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
     * coordinate pair's units will be in meters, and should be usable to make distance
     * calculations over short distances.
     * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    toLatLng() {
        return new LatLngPoint().fromUTM(this);
    }
    set(eastingOrArray, northing, altitude) {
        if (has2Components(eastingOrArray)) {
            this._easting = eastingOrArray[0];
            this._northing = eastingOrArray[1];
            this._altitude = 0;
        }
        else if (has3Components(eastingOrArray)) {
            this._easting = eastingOrArray[0];
            this._altitude = eastingOrArray[1];
            this._northing = eastingOrArray[2];
        }
        else {
            this._easting = eastingOrArray;
            if (!isNullOrUndefined(northing)) {
                this._northing = northing;
            }
            if (!isNullOrUndefined(altitude)) {
                this._altitude = altitude;
            }
        }
    }
    copy(other) {
        this._easting = other.easting;
        this._northing = other.northing;
        this._altitude = other.altitude;
        this._zone = other.zone;
        this._hemisphere = other.hemisphere;
    }
    toVec2() {
        const v = vec2.create();
        vec2.set(v, this.easting, this.northing);
        return v;
    }
    toVec3() {
        const v = vec3.create();
        vec3.set(v, this.easting, this.altitude, this.northing);
        return v;
    }
}
//# sourceMappingURL=UTMPoint.js.map