import { SignalRMetadataClient } from "../meta/signalr/SignalRMetadataClient";
import { BaseJitsiClientLoader } from "./BaseJitsiClientLoader";
export class JitsiSignalRClientLoader extends BaseJitsiClientLoader {
    constructor(signalRPath, host, bridgeHost, bridgeMUC) {
        super(host, bridgeHost, bridgeMUC);
        this.signalRPath = signalRPath;
    }
    createMetadataClient(_fetcher, _audio, _tele) {
        return new SignalRMetadataClient(this.signalRPath);
    }
}
//# sourceMappingURL=JitsiSignalRClientLoader.js.map