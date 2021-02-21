import { rad2deg } from "../math/rad2deg";
import { isNullOrUndefined, isObject } from "../typeChecks";
import { DatumWGS_84 } from "./Datum";
import { GlobeHemisphere, UTMPoint } from "./UTMPoint";
/**
 * A point in geographic space on a radial coordinate system.
 **/
export class LatLngPoint {
    constructor(lat, lng, alt) {
        if (isObject(lat)) {
            this._lat = lat.lat;
            this._lng = lat.lng;
            this._alt = lat.alt;
        }
        else {
            this._lat = lat || 0;
            this._lng = lng || 0;
            this._alt = alt;
        }
    }
    /**
     * An altitude value thrown in just for kicks. It makes some calculations and conversions
     * easier if we keep the Altitude value.
     **/
    get alt() {
        return this._alt;
    }
    /**
     * Lines of latitude run east/west around the globe, parallel to the equator, never
     * intersecting. They measure angular distance north/south.
     **/
    get lat() {
        return this._lat;
    }
    /**
     * Lines of longitude run north/south around the globe, intersecting at the poles. They
     * measure angular distance east/west.
     **/
    get lng() {
        return this._lng;
    }
    toJSON() {
        return JSON.stringify({
            lat: this.lat,
            lng: this.lng,
            alt: this.alt
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
        const latStr = LatLngPoint.toDMS(this.lat, "S", "N", sigfigs);
        const lngStr = LatLngPoint.toDMS(this.lng, "W", "E", sigfigs);
        if (this.alt) {
            const altStr = this.alt.toFixed(sigfigs) + "m";
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
        return `(${this.lat.toFixed(sigfigs)}°, ${this.lng.toFixed(sigfigs)}°)`;
    }
    /**
     * Check two LatLngPoints to see if they overlap.
     * @param other
     */
    equals(other) {
        return isObject(other)
            && this.lat == other.lat
            && this.lng == other.lng
            && this.alt == other.alt;
    }
    compareTo(other) {
        if (isNullOrUndefined(other)) {
            return -1;
        }
        else {
            const byLat = this.lat - other.lat;
            const byLng = this.lng - other.lng;
            const byAlt = (this.alt || 0) - (other.alt || 0);
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
        this._lat = rad2deg(lat);
        this._lng = long0 + rad2deg(lng);
        this._alt = utm.altitude;
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
        this._lat = other.lat;
        this._lng = other.lng;
        this._alt = other.alt;
        return this;
    }
}
//# sourceMappingURL=LatLngPoint.js.map