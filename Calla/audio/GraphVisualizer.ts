import { isDefined, isNullOrUndefined, isNumber } from "kudzu/typeChecks";

const graph = new Map<AudioNode, Set<AudioNode | AudioParam>>();
const children = new WeakMap<AudioNode, number>();
const names = new WeakMap<AudioNode | AudioParam, string>();

function add(a: AudioNode, b: AudioNode | AudioParam): boolean {

    if (isAudioNode(b)) {
        children.set(b, (children.get(b) || 0) + 1);
    }

    if (!graph.has(a)) {
        graph.set(a, new Set<AudioNode | AudioParam>());
    }

    const g = graph.get(a);
    if (g.has(b)) {
        return false;
    }

    g.add(b);
    return true;
}

function rem(a: AudioNode, b?: AudioNode | AudioParam): boolean {
    if (!graph.has(a)) {
        return false;
    }

    const g = graph.get(a);

    let removed = false;
    if (isNullOrUndefined(b)) {
        removed = g.size > 0;
        g.clear();
    }
    else if (g.has(b)) {
        removed = true;
        g.delete(b);
    }

    if (g.size === 0) {
        graph.delete(a);
    }

    if (isAudioNode(b)
        && children.has(b)) {
        const newCount = children.get(b) - 1;
        children.set(b, newCount);
        if (newCount === 0) {
            children.delete(b);
        }
    }

    return removed;
}

function isAudioNode(a: AudioNode | AudioParam | number): a is AudioNode {
    return isDefined(a)
        && isDefined((a as AudioNode).context);
}

function isAudioParam(a: AudioNode | AudioParam): a is AudioParam {
    return !isAudioNode(a);
}

export function nameVertex<T>(name: string, node: T & AudioNode): T;
export function nameVertex<T>(name: string, param: T & AudioParam): T;
export function nameVertex<T>(name: string, v: T & (AudioNode | AudioParam)): T {
    names.set(v, name);
    return v;
}

export function connect(a: AudioNode, destinationNode: AudioNode, output?: number, input?: number): boolean;
export function connect(a: AudioNode, destinationParam: AudioParam, output?: number): boolean;
export function connect(a: AudioNode, b: AudioNode | AudioParam, c?: number, d?: number): boolean {
    if (isAudioNode(b)) {
        a.connect(b, c, d);
        return add(a, b);
    }
    else {
        a.connect(b, c);
        return add(a, b);
    }
}


export function disconnect(a: AudioNode): boolean;
export function disconnect(a: AudioNode, output: number): boolean;
export function disconnect(a: AudioNode, destinationNode: AudioNode, output: number, input: number): boolean;
export function disconnect(a: AudioNode, destinationNode: AudioNode, output: number): boolean;
export function disconnect(a: AudioNode, destinationNode: AudioNode): boolean;
export function disconnect(a: AudioNode, destinationParam: AudioParam, output: number): boolean;
export function disconnect(a: AudioNode, destinationParam: AudioParam): boolean;
export function disconnect(a: AudioNode, b?: number | AudioNode | AudioParam, c?: number, d?: number): boolean {
    if (isNullOrUndefined(b)) {
        a.disconnect();
        return rem(a);
    }
    else if (isNumber(b)) {
        a.disconnect(b);
        return rem(a);
    }
    else if (isAudioNode(b)
        && isNumber(c)
        && isNumber(d)) {
        a.disconnect(b, c, d);
        return rem(a, b);
    }
    else if (isAudioNode(b)
        && isNumber(c)) {
        a.disconnect(b, c);
        return rem(a, b);
    }
    else if (isAudioNode(b)) {
        a.disconnect(b);
        return rem(a, b);
    }
    else if (isAudioParam(b)
        && isNumber(c)) {
        a.disconnect(b);
        return rem(a, b);
    }
    else if (isAudioParam(b)) {
        a.disconnect(b);
        return rem(a, b);
    }

    return false;
}

interface Node {
    pre: string;
    node: AudioNode|AudioParam;
}

export function print() {
    for (const node of graph.keys()) {
        if (!children.has(node)) {
            const stack = new Array<Node>();
            stack.push({
                pre: "",
                node
            });

            while (stack.length > 0) {
                const { pre, node } = stack.pop();
                const name = names.get(node) ?? "???";
                console.log(pre, name, node);
                if (isAudioNode(node)) {
                    const set = graph.get(node);
                    if (set) {
                        for (const child of set) {
                            stack.push({
                                pre: pre + "  ",
                                node: child
                            });
                        }
                    }
                }
            }
        }
    }
}

(window as any).printGraph = print;