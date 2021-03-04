import { EmojiGroup } from "./EmojiGroup";
import { asterisk, numberSign, keycapAsterisk, keycapNumberSign, keycap10, digitZero, digitOne, digitTwo, digitThree, digitFour, digitFive, digitSix, digitSeven, digitEight, digitNine, keycapDigitZero, keycapDigitOne, keycapDigitTwo, keycapDigitThree, keycapDigitFour, keycapDigitFive, keycapDigitSix, keycapDigitSeven, keycapDigitEight, keycapDigitNine } from "./emojis";

export const keycapDigits = new EmojiGroup(
    "Keycap Digits", "Keycap Digits",
    keycapDigitZero,
    keycapDigitOne,
    keycapDigitTwo,
    keycapDigitThree,
    keycapDigitFour,
    keycapDigitFive,
    keycapDigitSix,
    keycapDigitSeven,
    keycapDigitEight,
    keycapDigitNine,
    keycap10);


export const numbers = new EmojiGroup(
    "Numbers", "Numbers",
    digitZero,
    digitOne,
    digitTwo,
    digitThree,
    digitFour,
    digitFive,
    digitSix,
    digitSeven,
    digitEight,
    digitNine,
    asterisk,
    numberSign,
    keycapDigitZero,
    keycapDigitOne,
    keycapDigitTwo,
    keycapDigitThree,
    keycapDigitFour,
    keycapDigitFive,
    keycapDigitSix,
    keycapDigitSeven,
    keycapDigitEight,
    keycapDigitNine,
    keycapAsterisk,
    keycapNumberSign,
    keycap10);
