export * from "./arrays";
export * from "./emoji";
export * from "./events";
export * from "./graphics2d";
export * from "./html";
export * from "./input";
export * from "./io";
export * from "./math";
export * from "./strings";
export * from "./timers";
export * from "./typeChecks";
export * from "./using";
export * from "./workers";

import { version } from "../package.json";
export { version };

console.info(`Kudzu v${version}.`);