export const GET_PROPERTY_VALUES_METHOD = "XXX_GET_PROPERTY_VALUES_XXX";
export var WorkerClientMessageType;
(function (WorkerClientMessageType) {
    WorkerClientMessageType["MethodCall"] = "methodCall";
    WorkerClientMessageType["PropertySet"] = "propertySet";
})(WorkerClientMessageType || (WorkerClientMessageType = {}));
export var WorkerServerMessageType;
(function (WorkerServerMessageType) {
    WorkerServerMessageType["Error"] = "error";
    WorkerServerMessageType["Progress"] = "progress";
    WorkerServerMessageType["PropertyInit"] = "propertyInit";
    WorkerServerMessageType["Property"] = "property";
    WorkerServerMessageType["Return"] = "return";
    WorkerServerMessageType["Event"] = "event";
})(WorkerServerMessageType || (WorkerServerMessageType = {}));
//# sourceMappingURL=WorkerMessages.js.map