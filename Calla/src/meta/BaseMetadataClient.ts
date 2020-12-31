import { HubConnectionState } from "@microsoft/signalr";
import type { Emoji } from "kudzu";
import { sleep, TypedEventBase } from "kudzu";
import type { CallaEventType, CallaMetadataEvents } from "../CallaEvents";
import { CallaMetadataEventType, CallaUserEvent } from "../CallaEvents";
import type { IMetadataClientExt } from "./IMetadataClient";


export abstract class BaseMetadataClient
    extends TypedEventBase<CallaMetadataEvents>
    implements IMetadataClientExt {

    private tasks = new Map<string, Promise<any>>();

    constructor(private sleepTime: number) {
        super();
    }

    async getNext<T extends keyof CallaMetadataEvents>(evtName: T, userID: string): Promise<CallaMetadataEvents[T]> {
        return new Promise((resolve) => {
            const getter = (evt: CallaMetadataEvents[T]) => {
                if (evt instanceof CallaUserEvent
                    && evt.id === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };

            this.addEventListener(evtName, getter);
        });
    }

    abstract get metadataState(): HubConnectionState;

    get isConnected(): boolean {
        return this.metadataState === HubConnectionState.Connected;
    }

    protected abstract callInternal(command: CallaEventType, ...args: any[]): Promise<void>;

    private async callThrottled(key: string, command: CallaEventType, ...args: any[]): Promise<void> {
        if (!this.tasks.has(key)) {
            const start = performance.now();
            const task = this.callInternal(command, ...args);
            this.tasks.set(key, task);
            await task;
            const delta = performance.now() - start;
            const sleepTime = this.sleepTime - delta;
            if (sleepTime > 0) {
                await sleep(this.sleepTime);
            }
            this.tasks.delete(key);
        }
    }

    private async callImmediate(command: CallaEventType, ...args: any[]): Promise<void> {
        await this.callInternal(command, ...args);
    }

    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callThrottled(CallaMetadataEventType.UserPosed, CallaMetadataEventType.UserPosed, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPoseImmediate(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callImmediate(CallaMetadataEventType.UserPosed, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callThrottled(CallaMetadataEventType.UserPointer + name, CallaMetadataEventType.UserPointer, name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setAvatarEmoji(emoji: Emoji): void {
        this.callImmediate(CallaMetadataEventType.SetAvatarEmoji, emoji);
    }

    setAvatarURL(url: string): void {
        this.callImmediate(CallaMetadataEventType.AvatarChanged, url);
    }

    emote(emoji: Emoji): void {
        this.callImmediate(CallaMetadataEventType.Emote, emoji);
    }

    chat(text: string): void {
        this.callImmediate(CallaMetadataEventType.Chat, text);
    }

    abstract connect(): Promise<void>;
    abstract join(roomName: string): Promise<void>;
    abstract identify(userNameOrID: string): Promise<void>;
    abstract leave(): Promise<void>;
    abstract disconnect(): Promise<void>;
}
