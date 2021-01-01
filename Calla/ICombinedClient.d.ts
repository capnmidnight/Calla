import type { TypedEventBase } from "kudzu/events/EventBase";
import type { CallaClientEvents } from "./CallaEvents";
import type { IMetadataClient } from "./meta/IMetadataClient";
import type { ITeleconferenceClient } from "./tele/ITeleconferenceClient";
export declare type ICombinedClient = TypedEventBase<CallaClientEvents> & ITeleconferenceClient & IMetadataClient;
