/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 * @constant
 * @type {boolean}
 **/
export const canChangeAudioOutput = HTMLAudioElement.prototype["setSinkId"] instanceof Function;