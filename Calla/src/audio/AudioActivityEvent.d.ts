/**
 * An Event class for tracking changes to audio activity.
 **/
export declare class AudioActivityEvent extends Event {
    id: string;
    isActive: boolean;
    /** Creates a new "audioActivity" event */
    constructor();
    /**
     * Sets the current state of the event
     * @param id - the user for which the activity changed
     * @param isActive - the new state of the activity
     */
    set(id: string, isActive: boolean): void;
}
