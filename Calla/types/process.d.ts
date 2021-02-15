declare namespace process {

    export const env: {
        NODE_ENV: string;
    };
}

declare module "events" {
    export class EventEmitter { }
}