import {
    A,
    Aside,
    H2,
    LI,
    Strong,
    UL
} from "../html/tags.js";

import {
    href,
    rel,
    style,
    target
} from "../html/attrs.js";

export function instructions() {
    return [
        Aside(
            style({
                border: "dashed 2px darkred",
                backgroundColor: "wheat",
                borderRadius: "5px",
                padding: "0.5em"
            }),
            Strong("Note: "),
            "Calla is built on top of ",
            A(
                href("https://jitsi.org"),
                target("_blank"),
                rel("noopener"),
                "Jitsi Meet"),
            ". Jitsi does not support iPhones and iPads."),
        UL(
            LI(
                Strong("Be careful in picking your room name"),
                ", if you don't want randos to join. Traffic is low right now, but you never know."),
            LI(
                "Try to ",
                Strong("pick a unique user name"),
                ". A lot of people use \"Test\" and then there are a bunch of people with the same name running around."),
            LI(
                Strong("Open the Options view"),
                " to set your avatar, or to change your microphone settings."),
            LI(
                Strong("Click on the map"),
                " to move your avatar to wherever you want. Movement is instantaneous, with a smooth animation over the transition. Your avatar will stop at walls."),
            LI(
                "Or, ",
                Strong("use the arrow keys"),
                " on your keyboard to move."),
            LI(
                Strong("Click on yourself"),
                " to open a list of Emoji. Select an Emoji to float it out into the map."),
            LI(
                Strong("Hit the E key"),
                " to re-emote with your last selected Emoji."),
            LI(
                "You can ",
                Strong("roll your mouse wheel"),
                " or ",
                Strong("pinch your touchscreen"),
                " to zoom in and out of the map view. This is useful for groups of people standing close to each other to see the detail in their Avatar."))];
}