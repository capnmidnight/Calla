const Tau = 2 * Math.PI;

export function angleClamp(v: number) {
    return ((v % Tau) + Tau) % Tau;
}
