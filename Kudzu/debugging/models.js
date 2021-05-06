import { isDefined } from "../typeChecks";
export var MessageType;
(function (MessageType) {
    MessageType["Log"] = "log";
    MessageType["Delete"] = "delete";
    MessageType["Clear"] = "clear";
})(MessageType || (MessageType = {}));
export const KEY = "XXX_QUAKE_LOGGER_XXX";
export function isWorkerLoggerMessageData(data) {
    return isDefined(data)
        && "key" in data
        && data.key === KEY;
}
//# sourceMappingURL=models.js.map