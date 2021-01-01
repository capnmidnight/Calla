/**
 * Adapter that creates AudioContext objects depending on the browser.
 *
 * @returns Return a new AudioContext or undefined if the browser does not support it.
 */
export function createAudioContext(options: any): AudioContext;
