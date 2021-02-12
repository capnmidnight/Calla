import { Emoji } from "./Emoji";
import { EmojiGroup } from "./EmojiGroup";

export const dice1 = new Emoji("\u2680", "Dice: Side 1");
export const dice2 = new Emoji("\u2681", "Dice: Side 2");
export const dice3 = new Emoji("\u2682", "Dice: Side 3");
export const dice4 = new Emoji("\u2683", "Dice: Side 4");
export const dice5 = new Emoji("\u2684", "Dice: Side 5");
export const dice6 = new Emoji("\u2685", "Dice: Side 6");
export const dice = new EmojiGroup("Dice", "Dice",
    dice1,
    dice2,
    dice3,
    dice4,
    dice5,
    dice6);