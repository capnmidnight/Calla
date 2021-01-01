import { isFunction } from "kudzu/typeChecks";

/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 **/
export const canChangeAudioOutput = isFunction((HTMLAudioElement.prototype as any).setSinkId);