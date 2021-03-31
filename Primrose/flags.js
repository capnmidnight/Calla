export function isLandscape() {
    return Math.abs(window.orientation) === 90;
}
export function isWorker() {
    return typeof importScripts === 'function';
}
//# sourceMappingURL=flags.js.map