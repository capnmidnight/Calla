import { deg2rad } from "../math/deg2rad";
import { isNullOrUndefined, isNumber } from "../typeChecks";
import { DatumWGS_84 } from "./Datum";
import { GlobeHemisphere, UTMPoint } from "./UTMPoint";

export interface ILatLngPoint {
    latitude: number;
    longitude: number;
    altitude: number;
}

/**
 * A point in geographic space on a radial coordinate system.
 **/
export class LatLngPoint implements ILatLngPoint {

    /**
     * An altitude value thrown in just for kicks. It makes some calculations and conversions
     * easier if we keep the Altitude value.
     **/
    get altitude() {
        return this._altitude;
    }
    private _altitude: number;



    /**
     * Lines of latitude run east/west around the globe, parallel to the equator, never
     * intersecting. They measure angular distance north/south.
     **/
    get latitude() {
        return this._latitude;
    }
    private _latitude: number;

    /**
     * Lines of longitude run north/south around the globe, intersecting at the poles. They
     * measure angular distance east/west.
     **/
    get longitude() {
        return this._longitude;
    }
    private _longitude: number;

    /**
     * Initializes a zero LatLngPoint.
     **/
    constructor();
    /**
     * Initializes a new LatLngPoint as a copy of another.
     * @param lat
     */
    constructor(lat: ILatLngPoint);
    /**
     * Initializes a LatLngPoint from the given components.
     * @param lat
     * @param lng
     * @param alt
     */
    constructor(lat: number, lng: number, alt?: number);
    constructor(lat?: number | ILatLngPoint, lng?: number, alt?: number) {
        if (!isNullOrUndefined(lat)
            && !isNumber(lat)) {
            this._latitude = lat.latitude;
            this._longitude = lat.longitude;
            this._altitude = lat.altitude;
        }
        else {
            this._latitude = lat || 0;
            this._longitude = lng || 0;
            this._altitude = alt || 0;
        }
    }

    toJSON(): string {
        return JSON.stringify({
            latitude: this.latitude,
            longitude: this.longitude,
            altitude: this.altitude
        });
    }

    private static parseDMS(value: string): number {
        const parts = value.split(' ');
        if (parts.length == 3) {
            const hemisphere = parts[0];
            const degrees = parseInt(parts[1], 10);
            const minutes = parseFloat(parts[2]);
            if ((hemisphere == "N" || hemisphere == "S" || hemisphere == "E" || hemisphere == "W")
                && Number.isInteger(degrees)
                && Number.isFinite(minutes)) {
                let dec = degrees + (minutes / 60);
                if (hemisphere == "S" || hemisphere == "W") {
                    dec *= -1;
                }

                return dec;
            }
        }

        return Number.NaN;
    }

    private static parseDMSPair(value: string): LatLngPoint | null {
        const parts = value.split(',');
        if (parts.length == 2) {
            const lat = LatLngPoint.parseDMS(parts[0]);
            const lng = LatLngPoint.parseDMS(parts[1]);
            if (!Number.isNaN(lat)
                && !Number.isNaN(lng)) {
                return new LatLngPoint(lat, lng);
            }
        }

        return null;
    }

    private static parseDecimal(value: string): LatLngPoint | null {
        const parts = value.split(',');
        if (parts.length == 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (Number.isFinite(lat)
                && Number.isFinite(lng)) {
                return new LatLngPoint(lat, lng);
            }
        }

        return null;
    }

    /**
     * Try to parse a string as a Latitude/Longitude.
     **/
    static parse(value: string): LatLngPoint | null {
        const asDecimal = LatLngPoint.parseDecimal(value);
        const asDMS = LatLngPoint.parseDMSPair(value);
        return asDecimal || asDMS;
    }

    /**
     * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
     * @param sigfigs
     */
    toDMS(sigfigs: number): string {
        const latStr = LatLngPoint.toDMS(this.latitude, "S", "N", sigfigs);
        const lngStr = LatLngPoint.toDMS(this.longitude, "W", "E", sigfigs);
        const altStr = this.altitude.toFixed(sigfigs) + "m";
        return `<${latStr}, ${lngStr}> alt ${altStr}`;
    }

    /**
     * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
     * @param value The decimal degree value to format
     * @param negative The string prefix to use when the value is negative
     * @param positive The string prefix to use when the value is positive
     * @param sigfigs The number of significant figures to which to print the value
     */
    private static toDMS(value: number, negative: string, positive: string, sigfigs: number): string {
        const hemisphere = value < 0
            ? negative
            : positive;

        value = Math.abs(value);
        const degrees = Math.floor(value);
        const minutes = (value - degrees) * 60;
        const intMinutes = Math.floor(minutes);
        const seconds = (minutes - intMinutes) * 60;
        let secondsStr = seconds.toFixed(sigfigs);
        while (secondsStr.indexOf(".") <= 1) {
            secondsStr = "0" + secondsStr;
        }

        return `${hemisphere} ${degrees.toFixed(sigfigs)}° ${intMinutes.toFixed(sigfigs)}' ${secondsStr}"`;
    }

    /**
     * Pretty-print the LatLngPoint for easier debugging.
     * @param sigfigs
     */
    toString(sigfigs?: number): string {
        sigfigs = sigfigs || 6;
        return `(${this.latitude.toFixed(sigfigs)}°, ${this.longitude.toFixed(sigfigs)}°)`;
    }

    /**
     * Check two LatLngPoints to see if they overlap.
     * @param other
     */
    equals(other?: ILatLngPoint | null): boolean {
        return !isNullOrUndefined(other)
            && this.latitude == other.latitude
            && this.longitude == other.longitude
            && this.altitude == other.altitude;
    }

    compareTo(other?: ILatLngPoint | null): number {
        if (isNullOrUndefined(other)) {
            return -1;
        }
        else {
            const byLat = this.latitude - other.latitude;
            const byLng = this.longitude - other.longitude;
            const byAlt = this.altitude - other.altitude;

            if (byLat == 0
                && byLng == 0) {
                return byAlt;
            }
            else if (byLat == 0) {
                return byLng;
            }
            else {
                return byLat;
            }
        }
    }

    /**
     * Calculate a rough distance, in meters, between two LatLngPoints.
     * @param other
     */
    distance(other: LatLngPoint): number {
        var a = this.toUTM();
        var b = other.toUTM();
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    /**
     * Converts this LatLngPoint to a Universal Transverse Mercator point using the WGS-84
     * datum. The coordinate pair's units will be in meters, and should be usable to make
     * distance calculations over short distances.
     *
     * @see http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    toUTM(): UTMPoint {
        var hemisphere = this.latitude < 0
            ? GlobeHemisphere.Southern
            : GlobeHemisphere.Northern;

        const k0 = 0.9996;

        const phi = deg2rad(this.latitude);
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

        const utmz = 1 + Math.floor((this.longitude + 180) / 6.0);
        const zcm = 3 + (6.0 * (utmz - 1)) - 180;
        const A = deg2rad(this.longitude - zcm) * cosPhi;

        const M = DatumWGS_84.equatorialRadius * (
            (phi * DatumWGS_84.alpha1)
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
        var northing = k0 * (M + (N * tanPhi * (Asqr * ((1 / 2.0) + (Asqr * (((5 - T + (9 * C) + (4 * C * C)) / 24.0) + (Asqr * (61 - (58 * T) + Tsqr + (600 * C) - (330 * DatumWGS_84.e0sq)) / 720.0)))))));
        if (hemisphere == GlobeHemisphere.Southern) {
            northing += DatumWGS_84.FalseNorthing;
        }

        return new UTMPoint(
            easting,
            northing,
            this.altitude,
            utmz,
            hemisphere);
    }

    copy(other: ILatLngPoint) {
        this._latitude = other.latitude;
        this._longitude = other.longitude;
        this._altitude = other.altitude;
    }
}