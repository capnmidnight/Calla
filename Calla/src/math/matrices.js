/**
 * @param {import("three/src/math/Matrix4").Matrix4} matrix
 * @param {import("three/src/math/Vector3").Vector3} R
 * @param {import("three/src/math/Vector3").Vector3} U
 * @param {import("three/src/math/Vector3").Vector3} F
 * @param {import("three/src/math/Vector3").Vector3} P
 */
export function setRightUpFwdPosFromMatrix(matrix, R, U, F, P) {
    const m = matrix.elements;
    R.set(m[0], m[1], m[2]);
    U.set(m[4], m[5], m[6]);
    F.set(-m[8], -m[9], -m[10]);
    P.set(m[12], m[13], m[14]);
    R.normalize();
    U.normalize();
    F.normalize();
}

/**
 * @param {import("three/src/math/Vector3").Vector3} R
 * @param {import("three/src/math/Vector3").Vector3} U
 * @param {import("three/src/math/Vector3").Vector3} F
 * @param {import("three/src/math/Vector3").Vector3} P
 * @param {import("three/src/math/Matrix4").Matrix4} matrix
 */
export function setMatrixFromRightUpFwdPos(R, U, F, P, matrix) {
    R.normalize();
    U.normalize();
    F.normalize();
    matrix.set(
        R.x, U.x, -F.x, P.x,
        R.y, U.y, -F.y, P.y,
        R.z, U.z, -F.z, P.z,
        0, 0, 0, 1);
}