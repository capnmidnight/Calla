import { IDisposable } from "kudzu/using";
import { IPoseable } from "../IPoseable";

export interface IPlayableSource
    extends IDisposable, IPoseable {
    isPlaying: boolean;
    play(): Promise<void>;
    stop(): void;
    update(t: number): void;
    volume: number;
    spatialized: boolean;
}
