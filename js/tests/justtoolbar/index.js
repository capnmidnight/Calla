// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.
import { ToolBar } from "../../src/toolbar.js";
const appView = document.querySelector("#appView"),
    toolbar = new ToolBar();

appView.appendChild(toolbar.element);