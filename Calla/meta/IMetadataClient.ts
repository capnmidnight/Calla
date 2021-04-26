import type { TypedEventBase } from "kudzu/events/EventBase";
import type { CallaMetadataEvents } from "../CallaEvents";
import type { ConnectionState } from "../ConnectionState";
import type { IClient } from "../IClient";

export interface IMetadataClient
    extends TypedEventBase<CallaMetadataEvents>, IClient {

    metadataState: ConnectionState;

    /**
     * Set the position of the listener.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the forward vector.
     * @param fy - the vertical component of the forward vector.
     * @param fz - the lateral component of the forward vector.
     * @param ux - the horizontal component of the up vector.
     * @param uy - the vertical component of the up vector.
     * @param uz - the lateral component of the up vector.
     */
    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;

    /**
     * Set the position of the listener, but bypasses the network throttling that occurs with setLocalPose.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the forward vector.
     * @param fy - the vertical component of the forward vector.
     * @param fz - the lateral component of the forward vector.
     * @param ux - the horizontal component of the up vector.
     * @param uy - the vertical component of the up vector.
     * @param uz - the lateral component of the up vector.
     */
    setLocalPoseImmediate(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;

    /**
     * Set the position of the user's pointer.
     * @param name - the name of pointer that is being set.
     * @param px - the horizontal component of the position.
     * @param py - the vertical component of the position.
     * @param pz - the lateral component of the position.
     * @param fx - the horizontal component of the forward vector.
     * @param fy - the vertical component of the forward vector.
     * @param fz - the lateral component of the forward vector.
     * @param ux - the horizontal component of the up vector.
     * @param uy - the vertical component of the up vector.
     * @param uz - the lateral component of the up vector.
     */
    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;

    /**
     * Use an Emoji character as the user's avatar.
     * @param emoji
     */
    setAvatarEmoji(emoji: string): void;

    /**
     * Use an image, found somewhere on the public Internet, as the user's avatar.
     * @param url
     */
    setAvatarURL(url: string): void;

    /**
     * Express an emotion to the other users in the teleconferencing session.
     * @param emoji
     */
    emote(emoji: string): void;

    /**
     * Send a text message to the other users in the teleconferencing session.
     * @param text
     */
    chat(text: string): void;
}

export interface IMetadataClientExt extends IMetadataClient {
    getNext<T extends keyof CallaMetadataEvents>(evtName: T, userID: string): Promise<CallaMetadataEvents[T]>;
}
