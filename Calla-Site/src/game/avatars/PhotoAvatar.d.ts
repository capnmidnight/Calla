import { AvatarMode } from "./AvatarMode";
import { BaseAvatar, BaseAvatarChangedEvent } from "./BaseAvatar";
export declare class PhotoAvatarChangedEvent extends BaseAvatarChangedEvent<AvatarMode.Photo, string> {
    constructor(url: string);
}
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
