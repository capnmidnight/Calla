/**
 * @param {import("three").Vector3} m
 * @param {import("three").Vector3} a
 * @param {import("three").Vector3} b
 * @param {number} p
 */

export function slerpVectors(m, a, b, p) {
    const dot = a.dot(b);
    const angle = Math.acos(dot);
    if (angle !== 0) {
        const c = Math.sin(angle);
        const pA = Math.sin((1 - p) * angle) / c;
        const pB = Math.sin(p * angle) / c;
        m.x = pA * a.x + pB * b.x;
        m.y = pA * a.y + pB * b.y;
        m.x = pA * a.z + pB * b.z;
    }
}
