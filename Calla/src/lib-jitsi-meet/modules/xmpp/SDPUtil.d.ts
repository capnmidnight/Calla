export default SDPUtil;
declare namespace SDPUtil {
    export function filterSpecialChars(text: any): any;
    export function filterSpecialChars(text: any): any;
    export function iceparams(mediadesc: any, sessiondesc: any): {
        ufrag: any;
        pwd: any;
    };
    export function iceparams(mediadesc: any, sessiondesc: any): {
        ufrag: any;
        pwd: any;
    };
    export function parseICEUfrag(line: any): any;
    export function parseICEUfrag(line: any): any;
    export function buildICEUfrag(frag: any): string;
    export function buildICEUfrag(frag: any): string;
    export function parseICEPwd(line: any): any;
    export function parseICEPwd(line: any): any;
    export function buildICEPwd(pwd: any): string;
    export function buildICEPwd(pwd: any): string;
    export function parseMID(line: any): any;
    export function parseMID(line: any): any;
    export function parseMLine(line: any): {
        media: any;
        port: any;
        proto: any;
        fmt: any;
    };
    export function parseMLine(line: any): {
        media: any;
        port: any;
        proto: any;
        fmt: any;
    };
    export function buildMLine(mline: any): string;
    export function buildMLine(mline: any): string;
    export function parseRTPMap(line: any): {
        id: any;
        name: any;
        clockrate: any;
        channels: any;
    };
    export function parseRTPMap(line: any): {
        id: any;
        name: any;
        clockrate: any;
        channels: any;
    };
    /**
     * Parses SDP line "a=sctpmap:..." and extracts SCTP port from it.
     * @param line eg. "a=sctpmap:5000 webrtc-datachannel"
     * @returns [SCTP port number, protocol, streams]
     */
    export function parseSCTPMap(line: any): any[];
    /**
     * Parses SDP line "a=sctpmap:..." and extracts SCTP port from it.
     * @param line eg. "a=sctpmap:5000 webrtc-datachannel"
     * @returns [SCTP port number, protocol, streams]
     */
    export function parseSCTPMap(line: any): any[];
    export function buildRTPMap(el: any): string;
    export function buildRTPMap(el: any): string;
    export function parseCrypto(line: any): {
        tag: any;
        'crypto-suite': any;
        'key-params': any;
        'session-params': any;
    };
    export function parseCrypto(line: any): {
        tag: any;
        'crypto-suite': any;
        'key-params': any;
        'session-params': any;
    };
    export function parseFingerprint(line: any): {
        hash: any;
        fingerprint: any;
    };
    export function parseFingerprint(line: any): {
        hash: any;
        fingerprint: any;
    };
    export function parseFmtp(line: any): {
        name: any;
        value: any;
    }[];
    export function parseFmtp(line: any): {
        name: any;
        value: any;
    }[];
    export function parseICECandidate(line: any): {
        foundation: any;
        component: any;
        protocol: any;
        priority: any;
        ip: any;
        port: any;
        type: any;
        generation: any;
        'rel-addr': any;
        'rel-port': any;
        tcptype: any;
        network: string;
        id: string;
    };
    export function parseICECandidate(line: any): {
        foundation: any;
        component: any;
        protocol: any;
        priority: any;
        ip: any;
        port: any;
        type: any;
        generation: any;
        'rel-addr': any;
        'rel-port': any;
        tcptype: any;
        network: string;
        id: string;
    };
    export function buildICECandidate(cand: any): string;
    export function buildICECandidate(cand: any): string;
    export function parseSSRC(desc: any): Map<any, any>;
    export function parseSSRC(desc: any): Map<any, any>;
    export function parseRTCPFB(line: any): {
        pt: any;
        type: any;
        params: any;
    };
    export function parseRTCPFB(line: any): {
        pt: any;
        type: any;
        params: any;
    };
    export function parseExtmap(line: any): {
        value: any;
        direction: any;
        uri: any;
        params: any;
    };
    export function parseExtmap(line: any): {
        value: any;
        direction: any;
        uri: any;
        params: any;
    };
    export function findLine(haystack: any, needle: any, sessionpart: any): any;
    export function findLine(haystack: any, needle: any, sessionpart: any): any;
    export function findLines(haystack: any, needle: any, sessionpart: any): any[];
    export function findLines(haystack: any, needle: any, sessionpart: any): any[];
    export function candidateToJingle(line: any): {
        foundation: any;
        component: any;
        protocol: any;
        priority: any;
        ip: any;
        port: any;
        type: any;
        generation: any;
        'rel-addr': any;
        'rel-port': any;
        tcptype: any;
        network: string;
        id: string;
    };
    export function candidateToJingle(line: any): {
        foundation: any;
        component: any;
        protocol: any;
        priority: any;
        ip: any;
        port: any;
        type: any;
        generation: any;
        'rel-addr': any;
        'rel-port': any;
        tcptype: any;
        network: string;
        id: string;
    };
    export function candidateFromJingle(cand: any): string;
    export function candidateFromJingle(cand: any): string;
    /**
     * Parse the 'most' primary video ssrc from the given m line
     * @param {object} mLine object as parsed from transform.parse
     * @return {number} the primary video ssrc from the given m line
     */
    export function parsePrimaryVideoSsrc(videoMLine: any): number;
    /**
     * Parse the 'most' primary video ssrc from the given m line
     * @param {object} mLine object as parsed from transform.parse
     * @return {number} the primary video ssrc from the given m line
     */
    export function parsePrimaryVideoSsrc(videoMLine: any): number;
    /**
     * Generate an ssrc
     * @returns {number} an ssrc
     */
    export function generateSsrc(): number;
    /**
     * Generate an ssrc
     * @returns {number} an ssrc
     */
    export function generateSsrc(): number;
    /**
     * Get an attribute for the given ssrc with the given attributeName
     *  from the given mline
     * @param {object} mLine an mLine object as parsed from transform.parse
     * @param {number} ssrc the ssrc for which an attribute is desired
     * @param {string} attributeName the name of the desired attribute
     * @returns {string} the value corresponding to the given ssrc
     *  and attributeName
     */
    export function getSsrcAttribute(mLine: any, ssrc: number, attributeName: string): string;
    /**
     * Get an attribute for the given ssrc with the given attributeName
     *  from the given mline
     * @param {object} mLine an mLine object as parsed from transform.parse
     * @param {number} ssrc the ssrc for which an attribute is desired
     * @param {string} attributeName the name of the desired attribute
     * @returns {string} the value corresponding to the given ssrc
     *  and attributeName
     */
    export function getSsrcAttribute(mLine: any, ssrc: number, attributeName: string): string;
    /**
     * Parses the ssrcs from the group sdp line and
     *  returns them as a list of numbers
     * @param {object} the ssrcGroup object as parsed from
     *  sdp-transform
     * @returns {list<number>} a list of the ssrcs in the group
     *  parsed as numbers
     */
    export function parseGroupSsrcs(ssrcGroup: any): any;
    /**
     * Parses the ssrcs from the group sdp line and
     *  returns them as a list of numbers
     * @param {object} the ssrcGroup object as parsed from
     *  sdp-transform
     * @returns {list<number>} a list of the ssrcs in the group
     *  parsed as numbers
     */
    export function parseGroupSsrcs(ssrcGroup: any): any;
    /**
     * Get the mline of the given type from the given sdp
     * @param {object} sdp sdp as parsed from transform.parse
     * @param {string} type the type of the desired mline (e.g. "video")
     * @returns {object} a media object
     */
    export function getMedia(sdp: any, type: string): any;
    /**
     * Get the mline of the given type from the given sdp
     * @param {object} sdp sdp as parsed from transform.parse
     * @param {string} type the type of the desired mline (e.g. "video")
     * @returns {object} a media object
     */
    export function getMedia(sdp: any, type: string): any;
    /**
     * Extracts the ICE username fragment from an SDP string.
     * @param {string} sdp the SDP in raw text format
     */
    export function getUfrag(sdp: string): string;
    /**
     * Extracts the ICE username fragment from an SDP string.
     * @param {string} sdp the SDP in raw text format
     */
    export function getUfrag(sdp: string): string;
    /**
     * Sets the given codecName as the preferred codec by moving it to the beginning
     * of the payload types list (modifies the given mline in place). All instances
     * of the codec are moved up.
     * @param {object} mLine the mline object from an sdp as parsed by transform.parse
     * @param {string} codecName the name of the preferred codec
     */
    export function preferCodec(mline: any, codecName: string): void;
    /**
     * Sets the given codecName as the preferred codec by moving it to the beginning
     * of the payload types list (modifies the given mline in place). All instances
     * of the codec are moved up.
     * @param {object} mLine the mline object from an sdp as parsed by transform.parse
     * @param {string} codecName the name of the preferred codec
     */
    export function preferCodec(mline: any, codecName: string): void;
    /**
     * Strips the given codec from the given mline. All related RTX payload
     * types are also stripped. If the resulting mline would have no codecs,
     * it's disabled.
     *
     * @param {object} mLine the mline object from an sdp as parsed by transform.parse.
     * @param {string} codecName the name of the codec which will be stripped.
     * @param {boolean} highProfile determines if only the high profile H264 codec needs to be
     * stripped from the sdp when the passed codecName is H264.
     */
    export function stripCodec(mLine: any, codecName: string, highProfile?: boolean): void;
    /**
     * Strips the given codec from the given mline. All related RTX payload
     * types are also stripped. If the resulting mline would have no codecs,
     * it's disabled.
     *
     * @param {object} mLine the mline object from an sdp as parsed by transform.parse.
     * @param {string} codecName the name of the codec which will be stripped.
     * @param {boolean} highProfile determines if only the high profile H264 codec needs to be
     * stripped from the sdp when the passed codecName is H264.
     */
    export function stripCodec(mLine: any, codecName: string, highProfile?: boolean): void;
}
