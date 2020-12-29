/**
 * A TrackRecorder object holds all the information needed for recording a
 * single JitsiTrack (either remote or local)
 * @param track The JitsiTrack the object is going to hold
 */
export class TrackRecorder {
    constructor(track: any);
    track: any;
    recorder: any;
    data: any;
    name: any;
    startTime: any;
}
export default AudioRecorder;
/**
 * main exported object of the file, holding all
 * relevant functions and variables for the outside world
 * @param jitsiConference the jitsiConference which this object
 * is going to record
 */
declare function AudioRecorder(jitsiConference: any): void;
declare class AudioRecorder {
    /**
     * main exported object of the file, holding all
     * relevant functions and variables for the outside world
     * @param jitsiConference the jitsiConference which this object
     * is going to record
     */
    constructor(jitsiConference: any);
    recorders: any[];
    fileType: string;
    isRecording: boolean;
    jitsiConference: any;
    addTrack(track: any): void;
    instantiateTrackRecorder(track: any): TrackRecorder;
    removeTrack(track: any): void;
    updateNames(): void;
    start(): void;
    stop(): void;
    download(): void;
    getRecordingResults(): any[];
    getFileType(): string;
}
declare namespace AudioRecorder {
    export { determineCorrectFileType };
}
/**
 * Determines which kind of audio recording the browser supports
 * chrome supports "audio/webm" and firefox supports "audio/ogg"
 */
declare function determineCorrectFileType(): "audio/webm" | "audio/ogg";
