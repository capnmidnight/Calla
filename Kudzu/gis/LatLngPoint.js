import { rad2deg } from "../math/rad2deg";
import { isNullOrUndefined, isNumber } from "../typeChecks";
import { DatumWGS_84 } from "./Datum";
import { GlobeHemisphere, UTMPoint } from "./UTMPoint";
/**
 * A point in geographic space on a radial coordinate system.
 **/
export class LatLngPoint {
    constructor(lat, lng, alt) {
        if (!isNullOrUndefined(lat)
            && !isNumber(lat)) {
            this._latitude = lat.latitude;
            this._longitude = lat.longitude;
            this._altitude = lat.altitude;
        }
        else {
            this._latitude = lat || 0;
            this._longitude = lng || 0;
            this._altitude = alt;
        }
    }
    /**
     * An altitude value thrown in just for kicks. It makes some calculations and conversions
     * easier if we keep the Altitude value.
     **/
    get altitude() {
        return this._altitude;
    }
    /**
     * Lines of latitude run east/west around the globe, parallel to the equator, never
     * intersecting. They measure angular distance north/south.
     **/
    get latitude() {
        return this._latitude;
    }
    /**
     * Lines of longitude run north/south around the globe, intersecting at the poles. They
     * measure angular distance east/west.
     **/
    get longitude() {
        return this._longitude;
    }
    toJSON() {
        return JSON.stringify({
            latitude: this.latitude,
            longitude: this.longitude,
            altitude: this.altitude
        });
    }
    static parseDMS(value) {
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
    static parseDMSPair(value) {
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
    static parseDecimal(value) {
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
    static parse(value) {
        const asDecimal = LatLngPoint.parseDecimal(value);
        const asDMS = LatLngPoint.parseDMSPair(value);
        return asDecimal || asDMS;
    }
    /**
     * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
     * @param sigfigs
     */
    toDMS(sigfigs) {
        const latStr = LatLngPoint.toDMS(this.latitude, "S", "N", sigfigs);
        const lngStr = LatLngPoint.toDMS(this.longitude, "W", "E", sigfigs);
        if (this.altitude) {
            const altStr = this.altitude.toFixed(sigfigs) + "m";
            return `<${latStr}, ${lngStr}> alt ${altStr}`;
        }
        else {
            return `<${latStr}, ${lngStr}>`;
        }
    }
    /**
     * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
     * @param value The decimal degree value to format
     * @param negative The string prefix to use when the value is negative
     * @param positive The string prefix to use when the value is positive
     * @param sigfigs The number of significant figures to which to print the value
     */
    static toDMS(value, negative, positive, sigfigs) {
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
    toString(sigfigs) {
        sigfigs = sigfigs || 6;
        return `(${this.latitude.toFixed(sigfigs)}°, ${this.longitude.toFixed(sigfigs)}°)`;
    }
    /**
     * Check two LatLngPoints to see if they overlap.
     * @param other
     */
    equals(other) {
        return !isNullOrUndefined(other)
            && this.latitude == other.latitude
            && this.longitude == other.longitude
            && this.altitude == other.altitude;
    }
    compareTo(other) {
        if (isNullOrUndefined(other)) {
            return -1;
        }
        else {
            const byLat = this.latitude - other.latitude;
            const byLng = this.longitude - other.longitude;
            const byAlt = (this.altitude || 0) - (other.altitude || 0);
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
    distance(other) {
        const a = this.toUTM();
        const b = other.toUTM();
        const dx = b.easting - a.easting;
        const dy = b.northing - a.northing;
        return Math.sqrt((dx * dx) + (dy * dy));
    }
    /**
     * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
     * coordinate pair's units will be in meters, and should be usable to make distance
     * calculations over short distances.
     * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    fromUTM(utm) {
        const N0 = utm.hemisphere == GlobeHemisphere.Northern ? 0.0 : DatumWGS_84.FalseNorthing;
        const xi = (utm.northing - N0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
        const eta = (utm.easting - DatumWGS_84.E0) / (DatumWGS_84.pointScaleFactor * DatumWGS_84.A);
        let xiPrime = xi;
        let etaPrime = eta;
        //let sigmaPrime = 1;
        //let tauPrime = 0;
        for (let j = 1; j <= 3; ++j) {
            const beta = DatumWGS_84.beta[j - 1];
            const je2 = 2 * j * xi;
            const jn2 = 2 * j * eta;
            const sinje2 = Math.sin(je2);
            const coshjn2 = Math.cosh(jn2);
            const cosje2 = Math.cos(je2);
            const sinhjn2 = Math.sinh(jn2);
            xiPrime -= beta * sinje2 * coshjn2;
            etaPrime -= beta * cosje2 * sinhjn2;
            //sigmaPrime -= 2 * j * beta * cosje2 * coshjn2;
            //tauPrime -= 2 * j * beta * sinje2 * sinhjn2;
        }
        const chi = Math.asin(Math.sin(xiPrime) / Math.cosh(etaPrime));
        let lat = chi;
        for (let j = 1; j <= 3; ++j) {
            lat += DatumWGS_84.delta[j - 1] * Math.sin(2 * j * chi);
        }
        const long0 = (utm.zone * 6) - 183;
        const lng = Math.atan(Math.sinh(etaPrime) / Math.cos(xiPrime));
        this._latitude = rad2deg(lat);
        this._longitude = long0 + rad2deg(lng);
        this._altitude = utm.altitude;
        return this;
    }
    /**
     * Converts this LatLngPoint to a Universal Transverse Mercator point using the WGS-84
     * datum. The coordinate pair's units will be in meters, and should be usable to make
     * distance calculations over short distances.
     *
     * @see http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    toUTM() {
        return new UTMPoint().fromLatLng(this);
    }
    copy(other) {
        this._latitude = other.latitude;
        this._longitude = other.longitude;
        this._altitude = other.altitude;
        return this;
    }
}
//# sourceMappingURL=LatLngPoint.js.map