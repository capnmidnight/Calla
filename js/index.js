import { JitsiClient } from "./src/jitsihax-client-external-api.js";
import { init } from "./src/app.js";
import {
    A,
    Span,
    ariaLabel,
    className,
    href,
    target,
    title,
    rel,
    role
} from "../../src/html.js";

const { gui } = init(JitsiClient, document.querySelector("#appView"));

// GitHub link
gui.toolbar.appendChild(
    A(href("https://github.com/capnmidnight/Calla"),
        target("_blank"),
        rel("noopener"),
        ariaLabel("Follow Calla on Git Hub"),
        title("Follow Calla on GitHub"),
        Span(className("icon icon-github"),
            role("presentation"))));

// My own Twitter link
gui.toolbar.appendChild(
    A(href("https://twitter.com/Sean_McBeth"),
        target("_blank"),
        rel("noopener"),
        ariaLabel("Follow Sean on Twitter"),
        title("Follow @Sean_McBeth on Twitter"),
        Span(className("icon icon-twitter"),
            role("presentation"))));