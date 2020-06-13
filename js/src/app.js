import { Game } from "./game.js";
import { AppGui } from "./appgui.js";
import { a, span } from "./html.js";

export function init(JitsiClientClass, parentNode) {
    const jitsiClient = new JitsiClientClass(parentNode),
        game = new Game(jitsiClient),
        gui = new AppGui(game, jitsiClient);

    Object.assign(window, {
        jitsiClient,
        game,
        gui
    });

    if (gui.toolbar) {
        gui.toolbar.appendChild(a({
            href: "https://github.com/capnmidnight/Calla",
            target: "_blank",
            rel: "noopener",
            ariaLabel: "Follow Calla on Git Hub",
            title: "Follow Calla on GitHub"
        },
            span({
                className: "icon icon-github",
                role: "presentation"
            })));

        gui.toolbar.appendChild(a({
            href: "https://twitter.com/Sean_McBeth",
            target: "_blank",
            rel: "noopener",
            ariaLabel: "Follow Sean on Twitter",
            title: "Follow @Sean_McBeth on Twitter"
        },
            span({
                className: "icon icon-twitter",
                role: "presentation"
            })));
    }

    return game;
}