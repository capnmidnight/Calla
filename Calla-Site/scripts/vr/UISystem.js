export class UISystem {
    /**
     * @param {import("../input/EventSystem").EventSystem} eventSystem
     */
    constructor(eventSystem) {
        /** @type {WeakMap<import("three").Object3D, import("three").Vector3>} */
        const scales = new WeakMap();

        /**
         * @param {import("../input/EventSystem").EventSystemEvent} evt
         */
        const onEnter = (evt) => {
            if (!evt.hit.object.disabled) {
                if (!scales.has(evt.hit.object)) {
                    scales.set(evt.hit.object, evt.hit.object.scale.clone());
                }
                evt.hit.object.scale.multiplyScalar(1.1);
            }
        };

        /**
         * @param {import("../input/EventSystem").EventSystemEvent} evt
         */
        const onExit = (evt) => {
            if (!evt.hit.object.disabled) {
                evt.hit.object.scale.copy(scales.get(evt.hit.object));
            }
        };

        eventSystem.addEventListener("enter", onEnter);
        eventSystem.addEventListener("exit", onExit);
    }
}