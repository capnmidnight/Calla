export * from "./audio";
export * from "./BaseMetadataClient";
export * from "./BaseTeleconferenceClient";
export * from "./Calla";
export * from "./CallaEvents";
export * from "./IClient";
export * from "./ICombinedClient";
export * from "./IMetadataClient";
export * from "./ITeleconferenceClient";
export * from "./JitsiMetadataClient";
export * from "./JitsiTeleconferenceClient";
export * from "./SignalRMetadataClient";

import { version } from "../package.json";
console.info(`Calla v${version}.`);