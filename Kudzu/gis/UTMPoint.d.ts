/**
 * The globe hemispheres in which the UTM point could sit.
 **/
export declare enum GlobeHemisphere {
    Northern = 0,
    Southern = 1
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
export declare class UTMPoint implements IUTMPoint {
    /**
     * The east/west component of the coordinate.
     **/
    get x(): number;
    private _x;
    /**
     * The north/south component of the coordinate.
     **/
    get y(): number;
    private _y;
    /**
     * An altitude component.
     **/
    get z(): number;
    private _z;
    /**
     * The UTM Zone for which this coordinate represents.
     **/
    get zone(): number;
    private _zone;
    /**
     * The hemisphere in which the UTM point sits.
     **/
    get hemisphere(): GlobeHemisphere;
    private _hemisphere;
    constructor(x?: number | IUTMPoint, y?: number, z?: number, zone?: number, hemisphere?: GlobeHemisphere);
    toJSON(): string;
    toString(): string;
}
