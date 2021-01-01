/**
 * This class implements an End-to-End Encrypted communication channel between every two peers
 * in the conference. This channel uses libolm to achieve E2EE.
 *
 * The created channel is then used to exchange the secret key that each participant will use
 * to encrypt the actual media (see {@link E2EEContext}).
 *
 * A simple JSON message based protocol is implemented, which follows a request - response model:
 * - session-init: Initiates an olm session establishment procedure. This message will be sent
 *                 by the participant who just joined, to everyone else.
 * - session-ack: Completes the olm session etablishment. This messsage may contain ancilliary
 *                encrypted data, more specifically the sender's current key.
 * - key-info: Includes the sender's most up to date key information.
 * - key-info-ack: Acknowledges the reception of a key-info request. In addition, it may contain
 *                 the sender's key information, if available.
 * - error: Indicates a request processing error has occurred.
 *
 * These requessts and responses are transport independent. Currently they are sent using XMPP
 * MUC private messages.
 */
export class OlmAdapter extends Listenable {
    /**
     * Indicates if olm is supported on the current platform.
     *
     * @returns {boolean}
     */
    static isSupported(): boolean;
    /**
     * Creates an adapter instance for the given conference.
     */
    constructor(conference: any);
    /**
     * Updates the current participant key and distributes it to all participants in the conference
     * by sending a key-info message.
     *
     * @param {Uint8Array|boolean} key - The new key.
     * @returns {number}
     */
    updateCurrentKey(key: Uint8Array | boolean): number;
    /**
     * Updates the current participant key and distributes it to all participants in the conference
     * by sending a key-info message.
     *
     * @param {Uint8Array|boolean} key - The new key.
     * @retrns {Promise<Number>}
     */
    updateKey(key: Uint8Array | boolean): Promise<number>;
}
export namespace OlmAdapter {
    export { OlmAdapterEvents as events };
}
import Listenable from "../util/Listenable";
import Deferred from "../util/Deferred";
declare namespace OlmAdapterEvents {
    export const OLM_ID_KEY_READY: string;
    export const PARTICIPANT_E2EE_CHANNEL_READY: string;
    export const PARTICIPANT_KEY_UPDATED: string;
}
export {};
