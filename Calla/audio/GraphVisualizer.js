import { isNullOrUndefined, isNumber } from "kudzu/typeChecks";
const graph = new Map();
const children = new Map();
function add(a, b) {
    if (isAudioNode(b)) {
        children.set(b, (children.get(b) || 0) + 1);
    }
    if (!graph.has(a)) {
        graph.set(a, new Set());
    }
    const g = graph.get(a);
    if (g.has(b)) {
        return false;
    }
    g.add(b);
    return true;
}
function rem(a, b) {
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
function isAudioNode(a) {
    return !isNullOrUndefined(a)
        && !isNullOrUndefined(a.context);
}
function isAudioParam(a) {
    return !isAudioNode(a);
}
export function connect(a, b, c, d) {
    if (isAudioNode(b)) {
        a.connect(b, c, d);
        return add(a, b);
    }
    else {
        a.connect(b, c);
        return add(a, b);
    }
}
export function disconnect(a, b, c, d) {
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
export function print() {
    for (const node of graph.keys()) {
        if (!children.has(node)) {
            const stack = new Array();
            stack.push({
                pre: "",
                node
            });
            while (stack.length > 0) {
                const { pre, node } = stack.pop();
                console.log(pre, node);
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
window.printGraph = print;
//# sourceMappingURL=GraphVisualizer.js.map