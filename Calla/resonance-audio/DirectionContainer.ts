import { Direction } from "./Direction";

export interface DirectionContainer<T> {
    [Direction.Left]: T;
    [Direction.Right]: T;
    [Direction.Front]: T;
    [Direction.Back]: T;
    [Direction.Down]: T;
    [Direction.Up]: T;
}