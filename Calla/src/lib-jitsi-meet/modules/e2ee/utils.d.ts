/**
 * Polyfill RTCEncoded(Audio|Video)Frame.getMetadata() (not available in M83, available M84+).
 * The polyfill can not be done on the prototype since its not exposed in workers. Instead,
 * it is done as another transformation to keep it separate.
 * TODO: remove when we decode to drop M83 support.
 */
export function polyFillEncodedFrameMetadata(encodedFrame: any, controller: any): void;
/**
 * Compares two byteArrays for equality.
 */
export function isArrayEqual(a1: any, a2: any): boolean;
