import { vec2, vec3 } from "gl-matrix";
import { deg2rad } from "../math/deg2rad";
import { isDefined, isObject } from "../typeChecks";
import { DatumWGS_84 } from "./Datum";
import { LatLngPoint } from "./LatLngPoint";
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
    /**
     * The east/west component of the coordinate.
     **/
    get easting() {
        return this._easting;
    }
    _easting;
    /**
     * The north/south component of the coordinate.
     **/
    get northing() {
        return this._northing;
    }
    _northing;
    /**
     * An altitude component.
     **/
    get altitude() {
        return this._altitude;
    }
    _altitude;
    /**
     * The UTM Zone for which this coordinate represents.
     **/
    get zone() {
        return this._zone;
    }
    _zone;
    /**
     * The hemisphere in which the UTM point sits.
     **/
    get hemisphere() {
        return this._hemisphere;
    }
    _hemisphere;
    constructor(eastingOrCopy, northing, altitude, zone, hemisphere) {
        if (isObject(eastingOrCopy)) {
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
    toJSON() {
        return JSON.stringify({
            easting: this.easting,
            northing: this.northing,
            altitude: this.altitude,
            zone: this.zone,
            hemisphere: this.hemisphere
        });
    }
    toString() {
        return `(${this.easting}, ${this.northing}, ${this.altitude}) zone ${this.zone}`;
    }
    equals(other) {
        return isDefined(other)
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
        const hemisphere = latLng.lat < 0
            ? GlobeHemisphere.Southern
            : GlobeHemisphere.Northern;
        const phi = deg2rad(latLng.lat);
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
        const utmz = 1 + ((latLng.lng + 180) / 6) | 0;
        const zcm = 3 + (6 * (utmz - 1)) - 180;
        const A = deg2rad(latLng.lng - zcm) * cosPhi;
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
        const x1 = 5 - (18 * T) + Tsqr + (72 * C) - (58 * DatumWGS_84.e0sq);
        const x2 = Asqr * x1 / 120;
        const x3 = (x0 / 6) + x2;
        const x4 = 1 + (Asqr * x3);
        const easting = DatumWGS_84.pointScaleFactor * N * A * x4 + DatumWGS_84.E0;
        // Northing
        let northing = DatumWGS_84.pointScaleFactor * (M + (N * tanPhi * (Asqr * (0.5 + (Asqr * (((5 - T + (9 * C) + (4 * C * C)) / 24) + (Asqr * (61 - (58 * T) + Tsqr + (600 * C) - (330 * DatumWGS_84.e0sq)) / 720)))))));
        if (hemisphere == GlobeHemisphere.Southern) {
            northing += DatumWGS_84.FalseNorthing;
        }
        this._easting = easting;
        this._northing = northing;
        this._altitude = latLng.alt || 0;
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
    fromVec2(arr, zone, hemisphere) {
        this._easting = arr[0];
        this._northing = -arr[1];
        this._altitude = 0;
        this._zone = zone;
        this._hemisphere = hemisphere;
        return this;
    }
    fromVec3(arr, zone, hemisphere) {
        this._easting = arr[0];
        this._altitude = arr[1];
        this._northing = -arr[2];
        this._zone = zone;
        this._hemisphere = hemisphere;
        return this;
    }
    copy(other) {
        this._easting = other.easting;
        this._northing = other.northing;
        this._altitude = other.altitude;
        this._zone = other.zone;
        this._hemisphere = other.hemisphere;
        return this;
    }
    toVec2() {
        const v = vec2.create();
        vec2.set(v, this.easting, -this.northing);
        return v;
    }
    toVec3() {
        const v = vec3.create();
        vec3.set(v, this.easting, this.altitude, -this.northing);
        return v;
    }
}
//# sourceMappingURL=UTMPoint.js.map