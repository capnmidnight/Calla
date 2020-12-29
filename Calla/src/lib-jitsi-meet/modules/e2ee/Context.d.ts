/**
 * Per-participant context holding the cryptographic keys and
 * encode/decode functions
 */
export class Context {
    /**
     * @param {string} id - local muc resourcepart
     */
    constructor(id: string);
    /**
     * Derives the different subkeys and starts using them for encryption or
     * decryption.
     * @param {Uint8Array|false} key bytes. Pass false to disable.
     * @param {Number} keyIndex
     */
    setKey(keyBytes: any, keyIndex: number): Promise<void>;
    /**
     * Sets the public or private key used to sign or verify frames.
     * @param {CryptoKey} public or private CryptoKey object.
     * @param {Object} signature options. Will be passed to sign/verify and need to specify byteLength of the signature.
     *  Defaults to ECDSA with SHA-256 and a byteLength of 132.
     */
    setSignatureKey(key: any, options?: {
        name: string;
        hash: {
            name: string;
        };
        byteLength: number;
    }): void;
    /**
     * Function that will be injected in a stream and will encrypt the given encoded frames.
     *
     * @param {RTCEncodedVideoFrame|RTCEncodedAudioFrame} encodedFrame - Encoded video frame.
     * @param {TransformStreamDefaultController} controller - TransportStreamController.
     *
     * The packet format is a variant of
     *   https://tools.ietf.org/html/draft-omara-sframe-00
     * using a trailer instead of a header. One of the design goals was to not require
     * changes to the SFU which for video requires not encrypting the keyframe bit of VP8
     * as SFUs need to detect a keyframe (framemarking or the generic frame descriptor will
     * solve this eventually). This also "hides" that a client is using E2EE a bit.
     *
     * Note that this operates on the full frame, i.e. for VP8 the data described in
     *   https://tools.ietf.org/html/rfc6386#section-9.1
     *
     * The VP8 payload descriptor described in
     *   https://tools.ietf.org/html/rfc7741#section-4.2
     * is part of the RTP packet and not part of the encoded frame and is therefore not
     * controllable by us. This is fine as the SFU keeps having access to it for routing.
     */
    encodeFunction(encodedFrame: any | any, controller: any): any;
    /**
     * Function that will be injected in a stream and will decrypt the given encoded frames.
     *
     * @param {RTCEncodedVideoFrame|RTCEncodedAudioFrame} encodedFrame - Encoded video frame.
     * @param {TransformStreamDefaultController} controller - TransportStreamController.
     */
    decodeFunction(encodedFrame: any | any, controller: any): Promise<any>;
}
