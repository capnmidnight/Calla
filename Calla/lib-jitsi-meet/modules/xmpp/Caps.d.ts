export const ERROR_FEATURE_VERSION_MISMATCH: "Feature version mismatch";
/**
 * Implements xep-0115 ( http://xmpp.org/extensions/xep-0115.html )
 */
export default class Caps extends Listenable {
    /**
     * Constructs new Caps instance.
     * @param {Strophe.Connection} connection the strophe connection object
     * @param {String} node the value of the node attribute of the "c" xml node
     * that will be sent to the other participants
     */
    constructor(connection?: any, node?: string);
    node: string;
    disco: any;
    versionToCapabilities: any;
    jidToVersion: any;
    version: string;
    rooms: Set<any>;
    /**
     * Adds new feature to the list of supported features for the local
     * participant
     * @param {String} feature the name of the feature.
     * @param {boolean} submit if true - new presence with updated "c" node
     * will be sent.
     */
    addFeature(feature: string, submit?: boolean): void;
    /**
     * Removes a feature from the list of supported features for the local
     * participant
     * @param {String} feature the name of the feature.
     * @param {boolean} submit if true - new presence with updated "c" node
     * will be sent.
     */
    removeFeature(feature: string, submit?: boolean): void;
    /**
     * Sends new presence stanza for every room from the list of rooms.
     */
    submit(): void;
    /**
     * Returns a set with the features for a participant.
     * @param {String} jid the jid of the participant
     * @param {int} timeout the timeout in ms for reply from the participant.
     * @returns {Promise<Set<String>, Error>}
     */
    getFeatures(jid: string, timeout?: any): Promise<Set<string>>;
    /**
     * Returns a set with the features for a host.
     * @param {String} jid the jid of the host
     * @param {int} timeout the timeout in ms for reply from the host.
     * @returns {Promise<Set<String>, Error>}
     */
    getFeaturesAndIdentities(jid: string, node: any, timeout?: any): Promise<Set<string>>;
}
import Listenable from "../util/Listenable";
