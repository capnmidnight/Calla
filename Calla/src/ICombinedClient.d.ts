import type { TypedEventBase } from "kudzu";
import type { CallaClientEvents } from "./CallaEvents";
import type { IMetadataClient } from "./IMetadataClient";
import type { ITeleconferenceClient } from "./ITeleconferenceClient";
export declare type ICombinedClient = TypedEventBase<CallaClientEvents> & ITeleconferenceClient & IMetadataClient;
