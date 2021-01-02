export declare type scoreCallback = (node: GridNode) => number;
export declare type heuristicCallback = (pos0: GridNode, pos1: GridNode) => number;
export interface SearchOptions {
    /**
     * Specifies whether to return the path to the closest node if the target is unreachable.
     **/
    closest?: boolean;
    /**
     * Heuristic function (see astar.heuristics)
     **/
    heuristic?: heuristicCallback;
}
/**
* Perform an A* Search on a graph given a start and end node.
*/
export declare function search(graph: Graph, start: GridNode, end: GridNode, options?: SearchOptions): GridNode[];
export declare const heuristics: {
    manhattan(pos0: GridNode, pos1: GridNode): number;
    diagonal(pos0: GridNode, pos1: GridNode): number;
};
export declare function cleanNode(node: GridNode): void;
export interface GraphOptions {
    /**
     * Specifies whether diagonal moves are allowed
     **/
    diagonal?: boolean;
}
/**
 * A graph memory structure
 * @param gridIn 2D array of input weights
 */
export declare class Graph {
    nodes: GridNode[];
    dirtyNodes: GridNode[];
    grid: GridNode[][];
    diagonal: boolean;
    constructor(gridIn: number[][], options?: GraphOptions);
    init(): void;
    cleanDirty(): void;
    markDirty(node: GridNode): void;
    neighbors(node: GridNode): GridNode[];
    toString(): string;
}
export declare class GridNode {
    x: number;
    y: number;
    weight: number;
    f: number;
    g: number;
    h: number;
    visited: boolean;
    closed: boolean;
    parent: GridNode;
    constructor(x: number, y: number, weight: number);
    toString(): string;
    getCost(fromNeighbor: GridNode): number;
    isWall(): boolean;
}
