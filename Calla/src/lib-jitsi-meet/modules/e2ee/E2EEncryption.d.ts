/**
 * This module integrates {@link E2EEContext} with {@link JitsiConference} in order to enable E2E encryption.
 */
export class E2EEncryption {
    /**
     * Indicates if E2EE is supported in the current platform.
     *
     * @param {object} config - Global configuration.
     * @returns {boolean}
     */
    static isSupported(config: object): boolean;
    /**
     * A constructor.
     * @param {JitsiConference} conference - The conference instance for which E2E encryption is to be enabled.
     */
    constructor(conference: any);
    conference: any;
    /**
     * Indicates whether E2EE is currently enabled or not.
     *
     * @returns {boolean}
     */
    isEnabled(): boolean;
    /**
     * Enables / disables End-To-End encryption.
     *
     * @param {boolean} enabled - whether E2EE should be enabled or not.
     * @returns {void}
     */
    setEnabled(enabled: boolean): void;
}
import E2EEContext from "./E2EEContext";
import { OlmAdapter } from "./OlmAdapter";
