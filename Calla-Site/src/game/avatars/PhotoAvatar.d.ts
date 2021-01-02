import { BaseAvatar } from "./BaseAvatar";
/**
 * An avatar that uses an Image as its representation.
 **/
export declare class PhotoAvatar extends BaseAvatar {
    url: string;
    /**
     * Creates a new avatar that uses an Image as its representation.
     */
    constructor(url: string | URL);
}
