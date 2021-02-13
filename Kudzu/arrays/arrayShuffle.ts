export function arrayShuffleInplace<T>(arr: T[]): void {
    for (let i = 0; i < arr.length - 1; ++i) {
        const subLength = arr.length - i;
        const subIndex = Math.floor(Math.random() * subLength);
        const temp = arr[i];
        const j = subIndex + i;
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

export function arrayShuffle<T>(arr: readonly T[]): T[] {
    const output = arr.slice();
    arrayShuffleInplace(output);
    return output;
}