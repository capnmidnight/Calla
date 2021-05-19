export * from "./devices/DeviceManager";
export * from "./meta/BaseMetadataClient";
export * from "./tele/BaseTeleconferenceClient";
export { Calla as Client } from "./Calla";
import { version } from "./package.json";
console.info(`Calla v${version}.`);
export { version };
//# sourceMappingURL=index.js.map