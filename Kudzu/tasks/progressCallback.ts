export type progressCallback = (soFar: number, total: number, message?: string, est?: number) => void;

export function dumpProgress(_soFar: number, _total: number, _message?: string, _est?: number): void {
    // do nothing
}