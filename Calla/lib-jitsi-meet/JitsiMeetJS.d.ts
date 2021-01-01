import JitsiLocalTrack from "./modules/RTC/JitsiLocalTrack";

export { default as JitsiConnection } from "./JitsiConnection";

export as namespace JitsiMeetJS;
export * as events from "./Events";

export enum logLevels {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    LOG = "log",
    WARN = "warn",
    ERROR = "error"
}

export function setLogLevel(level: logLevels): void;
export function init(): void;

export interface JitsiCreateLocalTrackOptions {
    devices?: string[];
    constraints?: MediaTrackConstraints;
    micDeviceId?: string;
    cameraDeviceId?: string;
}

export function createLocalTracks(options: JitsiCreateLocalTrackOptions): Promise<JitsiLocalTrack[]>;

export const mediaDevices: {
    getAudioOutputDevice(): string;
    setAudioOutputDevice(deviceID: string): Promise<void>;
};