import { IUTMPoint, UTMPoint } from "./UTMPoint";
export interface ILatLngPoint {
    latitude: number;
    longitude: number;
    altitude: number | undefined;
}
/**
 * A point in geographic space on a radial coordinate system.
 **/
export declare class LatLngPoint implements ILatLngPoint {
    /**
     * An altitude value thrown in just for kicks. It makes some calculations and conversions
     * easier if we keep the Altitude value.
     **/
    get altitude(): number | undefined;
    private _altitude;
    /**
     * Lines of latitude run east/west around the globe, parallel to the equator, never
     * intersecting. They measure angular distance north/south.
     **/
    get latitude(): number;
    private _latitude;
    /**
     * Lines of longitude run north/south around the globe, intersecting at the poles. They
     * measure angular distance east/west.
     **/
    get longitude(): number;
    private _longitude;
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
    toJSON(): string;
    private static parseDMS;
    private static parseDMSPair;
    private static parseDecimal;
    /**
     * Try to parse a string as a Latitude/Longitude.
     **/
    static parse(value: string): LatLngPoint | null;
    /**
     * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
     * @param sigfigs
     */
    toDMS(sigfigs: number): string;
    /**
     * Pretty-print the Degrees/Minutes/Second version of the Latitude/Longitude angles.
     * @param value The decimal degree value to format
     * @param negative The string prefix to use when the value is negative
     * @param positive The string prefix to use when the value is positive
     * @param sigfigs The number of significant figures to which to print the value
     */
    private static toDMS;
    /**
     * Pretty-print the LatLngPoint for easier debugging.
     * @param sigfigs
     */
    toString(sigfigs?: number): string;
    /**
     * Check two LatLngPoints to see if they overlap.
     * @param other
     */
    equals(other?: ILatLngPoint | null): boolean;
    compareTo(other?: ILatLngPoint | null): number;
    /**
     * Calculate a rough distance, in meters, between two LatLngPoints.
     * @param other
     */
    distance(other: LatLngPoint): number;
    /**
     * Converts this UTMPoint to a Latitude/Longitude point using the WGS-84 datum. The
     * coordinate pair's units will be in meters, and should be usable to make distance
     * calculations over short distances.
     * reference: http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    fromUTM(utm: IUTMPoint): LatLngPoint;
    /**
     * Converts this LatLngPoint to a Universal Transverse Mercator point using the WGS-84
     * datum. The coordinate pair's units will be in meters, and should be usable to make
     * distance calculations over short distances.
     *
     * @see http://www.uwgb.edu/dutchs/usefuldata/utmformulas.htm
     **/
    toUTM(): UTMPoint;
    copy(other: ILatLngPoint): void;
}
