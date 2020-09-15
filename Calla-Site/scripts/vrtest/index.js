import { once } from "../calla/events/once";
import { getObject } from "../calla/fetching";
import { isString } from "../calla/typeChecks";
import { DebugObject } from "../graphics3d/DebugObject";
import { TextMesh } from "../graphics3d/TextMesh";
import { Euler } from "../lib/three.js/src/math/Euler";
import { Quaternion } from "../lib/three.js/src/math/Quaternion";
import { Application } from "../vr/Application";
import { CallaAudioSource } from "../vr/CallaAudioSource";
import { PlaybackButton } from "../yarrow/PlaybackButton";

const app = new Application();

/** @type {CallaAudioSource} */
let clip = null;

/**
 * @param {Number} soFar
 * @param {Number} total
 * @param {String?} msg
 */
function onProgress(soFar, total, msg) {
    app.onProgress(soFar, total, msg);
}


app.addEventListener("started", start);
app.addEventListener("tick", update);

app.start();

const Q = new Quaternion();
const E = new Euler();

function update(evt) {
    if (clip) {
        E.y = evt.t / 10000;
        Q.setFromEuler(E);
        clip.position.set(0, 1.75, -4).applyQuaternion(Q);
        clip.lookAt(0, 1.75, 0);
    }
}

async function start() {
    await app.fadeOut();
    if (!app.audio.ready) {
        showMenu([{
            name: "Start"
        }], false, async (activity) => {
            await once(app.audio, "audioready");
            start();
        });
    }
    else {
        clip = new CallaAudioSource(app.audio, "music");
        await clip.load(
            true,
            false,
            true,
            onProgress,
            "/audio/Planet.wav");

        clip.minDistance = 1;
        clip.maxDistance = 10;
        clip.add(new DebugObject());
        app.foreground.add(clip);

        const playbackButton = new PlaybackButton("music", 1, clip, app.audio);
        playbackButton.position.set(0, 1.75, -3);
        playbackButton.lookAt(0, 1.75, 0);
        app.foreground.add(playbackButton);
    }
    await app.fadeIn();
}


/**
 * @param {String|any[]} pathOrItems
 * @param {boolean} showBackButton
 * @param {menuItemCallback} onClick
 */
async function showMenu(pathOrItems, showBackButton, onClick) {
    await app.fadeOut();

    await app.skybox.setImage("images/default-background.jpg");
    app.sun.position.set(1, 1, -1);
    app.sun.lookAt(0, 0, 0);
    app.showSkybox = true;

    app.menu.remove(...app.menu.children);
    app.stage.position.set(0, 0, 0);

    const items = isString(pathOrItems)
        ? await getObject(pathOrItems)
        : pathOrItems;

    if (showBackButton) {
        items.push(backButton);
    }

    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const y = ((items.length - 1) / 2 - i) * 0.4 + 1.5;
        addMenuItem(item, y, (item) => {
            if (item === backButton) {
                history.back();
            }
            else {
                onClick(item);
            }
        });
    }

    await app.fadeIn();
}

/**
 * @param {any} item
 * @param {number} y
 * @param {menuItemCallback} onClick
 */
function addMenuItem(item, y, onClick) {
    const button = Object.assign(new TextMesh(item.name), {
        name: item.name,
        disabled: item.enabled === false,
        textBgColor: item.enabled !== false
            ? item === backButton
                ? "#000000"
                : "#ffffff"
            : "#a0a0a0",
        textColor: item.enabled !== false
            ? item === backButton
                ? "#ffffff"
                : "#000000"
            : "#505050",
        textPadding: [15, 30]
    }, menuItemFont);

    button.position.set(0, y, -5);
    button.value = item.name;
    button.addEventListener("click", () => {
        if (!button.disabled) {
            onClick(item);
        }
    });

    app.menu.add(button);
}