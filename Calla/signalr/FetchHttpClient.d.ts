import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";
import { ILogger } from "./ILogger";
export declare class FetchHttpClient extends HttpClient {
    private readonly abortControllerType;
    private readonly fetchType;
    private readonly jar?;
    private readonly logger;
    constructor(logger: ILogger);
    /** @inheritDoc */
    send(request: HttpRequest): Promise<HttpResponse>;
}
