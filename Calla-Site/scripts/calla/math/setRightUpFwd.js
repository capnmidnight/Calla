/**
 * @param {import("three/src/math/Matrix4").Matrix4} matrix
 * @param {import("three/src/math/Vector3").Vector3} R
 * @param {import("three/src/math/Vector3").Vector3} U
 * @param {import("three/src/math/Vector3").Vector3} F
 * @param {import("three/src/math/Vector3").Vector3} P
 */
export function setRightUpFwdPos(matrix, R, U, F, P) {
    const m = matrix.elements;
    R.set(m[0], m[1], m[2]);
    U.set(m[4], m[5], m[6]);
    F.crossVectors(U, R);
    P.set(m[12], m[13], m[14]);
}