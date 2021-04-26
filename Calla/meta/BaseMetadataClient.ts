import { TypedEventBase } from "kudzu/events/EventBase";
import { sleep } from "kudzu/events/sleep";
import type { CallaEventType, CallaMetadataEvents } from "../CallaEvents";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
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

    abstract get metadataState(): ConnectionState;

    get isConnected(): boolean {
        return this.metadataState === ConnectionState.Connected;
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
        this.callThrottled("userPosed", "userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPoseImmediate(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callImmediate("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callThrottled("userPointer" + name, "userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setAvatarEmoji(emoji: string): void {
        this.callImmediate("setAvatarEmoji", emoji);
    }

    setAvatarURL(url: string): void {
        this.callImmediate("avatarChanged", url);
    }

    emote(emoji: string): void {
        this.callImmediate("emote", emoji);
    }

    chat(text: string): void {
        this.callImmediate("chat", text);
    }

    abstract connect(): Promise<void>;
    abstract join(roomName: string): Promise<void>;
    abstract identify(userNameOrID: string): Promise<void>;
    abstract leave(): Promise<void>;
    abstract disconnect(): Promise<void>;
}
