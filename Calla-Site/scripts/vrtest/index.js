import { once } from "../calla/events/once";
import { getObject } from "../calla/fetching";
import { setRightUpFwdPosFromMatrix } from "../calla/math/matrices";
import { isString } from "../calla/typeChecks";
import { TextMesh } from "../graphics3d/TextMesh";
import { Object3D } from "../lib/three.js/src/core/Object3D";
import { Vector3 } from "../lib/three.js/src/math/Vector3";
import { Application } from "../vr/Application";
import { PlaybackButton } from "../yarrow/PlaybackButton";

const R = new Vector3();
const U = new Vector3();
const F = new Vector3();
const P = new Vector3();
const app = new Application();

/**
 * @param {Number} soFar
 * @param {Number} total
 * @param {String?} msg
 */
function onProgress(soFar, total, msg) {
    app.onProgress(soFar, total, msg);
}


app.addEventListener("started", start);

app.start();

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
        const clip = await app.audio.createClip(
            "music",
            true,
            false,
            true,
            null,
            "/audio/Planet.wav");

        clip.spatializer.minDistance = 1;
        clip.spatializer.maxDistance = 10;

        const clipPose = new Object3D();
        app.foreground.add(clipPose);
        clipPose.position.set(-1, 1.75, -3);
        clipPose.updateMatrixWorld();
        setRightUpFwdPosFromMatrix(clipPose.matrixWorld, R, U, F, P);
        app.audio.setClipPose(
            "music",
            P.x, P.y, P.z,
            F.x, F.y, F.z,
            U.x, U.y, U.z);

        const playbackButton = new PlaybackButton("music", 1, clip, app.audio);
        app.foreground.add(playbackButton);
        playbackButton.position.copy(clipPose.position);
        playbackButton.lookAt(P.set(0, 1.75, 0));
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

    await app.skybox.setImage("images/cube2.jpg");
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