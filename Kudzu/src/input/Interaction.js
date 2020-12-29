/**
 * Sounds to play during certain interaction events
 **/
export var Interaction;
(function (Interaction) {
    /**
     * No interaction.
     **/
    Interaction["None"] = "none";
    /**
     * A pointer entering a control.
     **/
    Interaction["Entered"] = "entered";
    /**
     * A pointer entering a control that has been disabled.
     **/
    Interaction["EnteredDisabled"] = "entereddisabled";
    /**
     * A pointer pressing down on a control.
     **/
    Interaction["Pressed"] = "pressed";
    /**
     * A pointer being clicked on a control that has been disabled.
     **/
    Interaction["PressedDisabled"] = "presseddisabled";
    /**
     * A pointer pressing down and releasing in rapid succession on a control.
     **/
    Interaction["Clicked"] = "clicked";
    /**
     * A pointer pressing down and releasing in rapid succession on a control that has been disabled.
     **/
    Interaction["ClickedDisabled"] = "clickeddisabled";
    /**
     * The first time dragging occured.
     **/
    Interaction["DraggingStarted"] = "draggingstarted";
    /**
     * The first time dragging occured on a contral that has been disabled.
     **/
    Interaction["DraggingStartedDisabled"] = "draggingstarteddisabled";
    /**
     * A pointer pressing down and moving on a control.
     **/
    Interaction["Dragged"] = "dragged";
    /**
     * The last time dragging occured.
     **/
    Interaction["DraggingEnded"] = "draggingended";
    /**
     * A pointer no longer being pressed on a control.
     **/
    Interaction["Released"] = "released";
    /**
     * A pointer leaving a control.
     **/
    Interaction["Exited"] = "exited";
    /**
     * A container element being opened, to have its contents become visible.
     **/
    Interaction["Opened"] = "opened";
    /**
     * A container element being closed, to hide its contents.
     **/
    Interaction["Closed"] = "closed";
    /**
     * A generic error sound.
     **/
    Interaction["Error"] = "error";
    /**
     * A generic completion sound.
     **/
    Interaction["Success"] = "success";
    /**
     * Application start up.
     **/
    Interaction["StartUp"] = "startup";
    /**
     * Application shut down.
     **/
    Interaction["ShutDown"] = "shutdown";
    /**
     * A list being scrolled.
     **/
    Interaction["Scrolled"] = "scrolled";
})(Interaction || (Interaction = {}));
//# sourceMappingURL=Interaction.js.map