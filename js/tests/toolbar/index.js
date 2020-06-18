// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.
import { ToolBar } from "../../src/forms/toolbar.js";
const toolbar = new ToolBar();
document.body.appendChild(toolbar.element);