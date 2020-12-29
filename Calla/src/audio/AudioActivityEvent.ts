/**
 * An Event class for tracking changes to audio activity.
 **/
export class AudioActivityEvent extends Event {
    id: string = null;
    isActive: boolean = false;

    /** Creates a new "audioActivity" event */
    constructor() {
        super("audioActivity");
        Object.seal(this);
    }

    /**
     * Sets the current state of the event
     * @param id - the user for which the activity changed
     * @param isActive - the new state of the activity
     */
    set(id: string, isActive: boolean): void {
        this.id = id;
        this.isActive = isActive;
    }
}
