import type { TypedEventBase } from "kudzu";
import type { CallaClientEvents } from "./CallaEvents";
import type { IMetadataClient } from "./meta/IMetadataClient";
import type { ITeleconferenceClient } from "./tele/ITeleconferenceClient";

export type ICombinedClient = TypedEventBase<CallaClientEvents> &
    ITeleconferenceClient &
    IMetadataClient;