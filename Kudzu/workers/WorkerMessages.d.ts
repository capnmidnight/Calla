export declare const GET_PROPERTY_VALUES_METHOD = "XXX_GET_PROPERTY_VALUES_XXX";
export declare enum WorkerClientMessageType {
    MethodCall = "methodCall",
    PropertySet = "propertySet"
}
export interface WorkerClientMessage<T extends WorkerClientMessageType> {
    type: T;
    taskID: number;
}
export interface WorkerClientMethodCallMessage extends WorkerClientMessage<WorkerClientMessageType.MethodCall> {
    methodName: string;
    params?: any[];
}
export interface WorkerClientPropertySetMessage extends WorkerClientMessage<WorkerClientMessageType.PropertySet> {
    propertyName: string;
    value: any;
}
export declare type WorkerClientMessages = WorkerClientMethodCallMessage | WorkerClientPropertySetMessage;
export declare enum WorkerServerMessageType {
    Error = "error",
    Progress = "progress",
    PropertyInit = "propertyInit",
    Property = "property",
    Return = "return",
    Event = "event"
}
export interface WorkerServerMessage<T extends WorkerServerMessageType> {
    methodName: T;
}
export interface WorkerServerEventMessage extends WorkerServerMessage<WorkerServerMessageType.Event> {
    type: string;
    data?: any;
}
export interface WorkerServerTaskMessage<T extends WorkerServerMessageType> extends WorkerServerMessage<T> {
    taskID: number;
}
export interface WorkerServerErrorMessage extends WorkerServerTaskMessage<WorkerServerMessageType.Error> {
    errorMessage: string;
}
export interface WorkerServerProgressMessage extends WorkerServerTaskMessage<WorkerServerMessageType.Progress> {
    soFar: number;
    total: number;
    msg: string;
}
export interface WorkerServerReturnMessage extends WorkerServerTaskMessage<WorkerServerMessageType.Return> {
    returnValue?: any;
}
export interface WorkerServerPropertyMessage<T extends WorkerServerMessageType> extends WorkerServerMessage<T> {
    propertyName: string;
    value: any;
}
export interface WorkerServerPropertyInitializedMessage extends WorkerServerPropertyMessage<WorkerServerMessageType.PropertyInit> {
}
export interface WorkerServerPropertyChangedMessage extends WorkerServerPropertyMessage<WorkerServerMessageType.Property> {
}
export declare type WorkerServerMessages = WorkerServerErrorMessage | WorkerServerProgressMessage | WorkerServerReturnMessage | WorkerServerEventMessage | WorkerServerPropertyInitializedMessage | WorkerServerPropertyChangedMessage;
