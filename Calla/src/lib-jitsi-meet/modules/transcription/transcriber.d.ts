/**
 * This is the main object for handing the Transcription. It interacts with
 * the audioRecorder to record every person in a conference and sends the
 * recorder audio to a transcriptionService. The returned speech-to-text result
 * will be merged to create a transcript
 * @param {AudioRecorder} audioRecorder An audioRecorder recording a conference
 */
export default function Transcriber(): void;
export default class Transcriber {
    audioRecorder: AudioRecorder;
    transcriptionService: SphinxService;
    counter: any;
    startTime: Date;
    transcription: string;
    callback: any;
    results: any[];
    state: string;
    lineLength: number;
    start(): void;
    stop(callback: any): void;
    maybeMerge(): void;
    merge(): void;
    updateTranscription(word: any, name: string | null): void;
    addTrack(track: any): void;
    removeTrack(track: any): void;
    getTranscription(): string;
    getState(): string;
    reset(): void;
}
import AudioRecorder from "./audioRecorder";
import SphinxService from "./transcriptionServices/SphinxTranscriptionService";
