const Tau = 2 * Math.PI;
export function angleClamp(v) {
    return ((v % Tau) + Tau) % Tau;
}
//# sourceMappingURL=angleClamp.js.map