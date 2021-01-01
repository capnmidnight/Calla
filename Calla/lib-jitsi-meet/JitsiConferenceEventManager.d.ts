/**
 * Setups all event listeners related to conference
 * @param conference {JitsiConference} the conference
 */
export default function JitsiConferenceEventManager(conference: any): void;
export default class JitsiConferenceEventManager {
    /**
     * Setups all event listeners related to conference
     * @param conference {JitsiConference} the conference
     */
    constructor(conference: any);
    conference: any;
    xmppListeners: {};
    setupChatRoomListeners(): void;
    chatRoomForwarder: EventEmitterForwarder;
    setupRTCListeners(): void;
    removeXMPPListeners(): void;
    setupXMPPListeners(): void;
    setupStatisticsListeners(): void;
}
import EventEmitterForwarder from "./modules/util/EventEmitterForwarder";
