import { JitsiMetadataClient } from "../meta/jitsi/JitsiMetadataClient";
import { BaseJitsiClientLoader } from "./BaseJitsiClientLoader";
export class JitsiOnlyClientLoader extends BaseJitsiClientLoader {
    constructor(host, bridgeHost, bridgeMUC) {
        super(host, bridgeHost, bridgeMUC);
    }
    createMetadataClient(_fetcher, _audio, tele) {
        if (!this.loaded) {
            throw new Error("lib-jitsi-meet has not been loaded. Call clientFactory.load().");
        }
        tele.useDefaultMetadataClient = true;
        return new JitsiMetadataClient(tele);
    }
}
//# sourceMappingURL=JitsiOnlyClientLoader.js.map