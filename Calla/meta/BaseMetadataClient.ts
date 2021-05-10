import { TypedEventBase } from "kudzu/events/EventBase";
import type { CallaEventType, CallaMetadataEvents } from "../CallaEvents";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
import type { IMetadataClientExt } from "./IMetadataClient";


export abstract class BaseMetadataClient
    extends TypedEventBase<CallaMetadataEvents>
    implements IMetadataClientExt {

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

    protected abstract callInternalSingle(userid: string, command: CallaEventType, ...args: any[]): Promise<void>;

    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callInternal("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    tellLocalPose(userid: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callInternalSingle(userid, "userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.callInternal("userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setAvatarEmoji(emoji: string): void {
        this.callInternal("setAvatarEmoji", emoji);
    }

    tellAvatarEmoji(userid: string, emoji: string): void {
        this.callInternalSingle(userid, "setAvatarEmoji", emoji);
    }

    setAvatarURL(url: string): void {
        this.callInternal("setAvatarURL", url);
    }

    tellAvatarURL(userid: string, url: string): void {
        this.callInternalSingle(userid, "setAvatarURL", url);
    }

    emote(emoji: string): void {
        this.callInternal("emote", emoji);
    }

    chat(text: string): void {
        this.callInternal("chat", text);
    }

    abstract connect(): Promise<void>;
    abstract join(roomName: string): Promise<void>;
    abstract identify(userNameOrID: string): Promise<void>;
    abstract leave(): Promise<void>;
    abstract disconnect(): Promise<void>;
}
