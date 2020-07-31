/**
 * @typedef {number} TestState */
/**
 * An enumeration of values for the states of test runs.
 * @enum {TestState}
 **/
export const TestStates = {
    found: 0,
    started: 1,
    succeeded: 2,
    failed: 4,
    completed: 8
};