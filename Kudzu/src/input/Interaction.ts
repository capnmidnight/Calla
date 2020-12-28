/**
 * Sounds to play during certain interaction events
 **/
export enum Interaction{
    /**
     * No interaction.
     **/
    None = "none",

    /**
     * A pointer entering a control.
     **/
    Entered = "entered",

    /**
     * A pointer entering a control that has been disabled.
     **/
    EnteredDisabled = "entereddisabled",

    /**
     * A pointer pressing down on a control.
     **/
    Pressed = "pressed",

    /**
     * A pointer being clicked on a control that has been disabled.
     **/
    PressedDisabled = "presseddisabled",

    /**
     * A pointer pressing down and releasing in rapid succession on a control.
     **/
    Clicked = "clicked",

    /**
     * A pointer pressing down and releasing in rapid succession on a control that has been disabled.
     **/
    ClickedDisabled = "clickeddisabled",

    /**
     * The first time dragging occured.
     **/
    DraggingStarted = "draggingstarted",

    /**
     * The first time dragging occured on a contral that has been disabled.
     **/
    DraggingStartedDisabled = "draggingstarteddisabled",

    /**
     * A pointer pressing down and moving on a control.
     **/
    Dragged = "dragged",

    /**
     * The last time dragging occured.
     **/
    DraggingEnded = "draggingended",

    /**
     * A pointer no longer being pressed on a control.
     **/
    Released = "released",

    /**
     * A pointer leaving a control.
     **/
    Exited = "exited",

    /**
     * A container element being opened, to have its contents become visible.
     **/
    Opened = "opened",

    /**
     * A container element being closed, to hide its contents.
     **/
    Closed = "closed",

    /**
     * A generic error sound.
     **/
    Error = "error",

    /**
     * A generic completion sound.
     **/
    Success = "success",

    /**
     * Application start up.
     **/
    StartUp = "startup",

    /**
     * Application shut down.
     **/
    ShutDown = "shutdown",

    /**
     * A list being scrolled.
     **/
    Scrolled = "scrolled"
}