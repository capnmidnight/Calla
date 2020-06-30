import "./protos.js";


export class Emoji {
    /**
     * Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     */
    constructor(value, desc) {
        this.value = value;
        this.desc = desc;
    }
}

export class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     * @param {(Emoji|EmojiGroup)[]} rest - Emojis in this group.
     */
    constructor(value, desc, ...rest) {
        super(value, desc);
        /** @type {(Emoji|EmojiGroup)[]} */
        this.alts = rest;
        /** @type {string} */
        this.width = null;
    }
}

/**
 * Check to see if a given Emoji is part of a specific EmojiGroup
 * @param {EmojiGroup} group
 * @param {Emoji} emoji
 */
export function isInSet(group, emoji) {
    return group.value === emoji
        || group.alts && group.alts.findIndex(e => e.value === emoji) >= 0;
}

/**
 * Check to see if a given Emoji walks on water.
 * @param {Emoji} emoji
 */
export function isSurfer(emoji) {
    return isInSet(personSurfing, emoji)
        || isInSet(manSurfing, emoji)
        || isInSet(womanSurfing, emoji)
        || isInSet(personRowing, emoji)
        || isInSet(manRowing, emoji)
        || isInSet(womanRowing, emoji)
        || isInSet(personSwimming, emoji)
        || isInSet(manSwimming, emoji)
        || isInSet(womanSwimming, emoji);
}

export const whiteChessKing = new Emoji("\u{2654}", "White Chess King");
export const whiteChessQueen = new Emoji("\u{2655}", "White Chess Queen");
export const whiteChessRook = new Emoji("\u{2656}", "White Chess Rook");
export const whiteChessBishop = new Emoji("\u{2657}", "White Chess Bishop");
export const whiteChessKnight = new Emoji("\u{2658}", "White Chess Knight");
export const whiteChessPawn = new Emoji("\u{2659}", "White Chess Pawn");
export const whiteChessPieces = Object.assign(new EmojiGroup(
    whiteChessKing.value
    + whiteChessQueen.value
    + whiteChessRook.value
    + whiteChessBishop.value
    + whiteChessKnight.value
    + whiteChessPawn.value,
    "White Chess Pieces",
    whiteChessKing,
    whiteChessQueen,
    whiteChessRook,
    whiteChessBishop,
    whiteChessKnight,
    whiteChessPawn), {
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn
});

export const blackChessKing = new Emoji("\u{265A}", "Black Chess King");
export const blackChessQueen = new Emoji("\u{265B}", "Black Chess Queen");
export const blackChessRook = new Emoji("\u{265C}", "Black Chess Rook");
export const blackChessBishop = new Emoji("\u{265D}", "Black Chess Bishop");
export const blackChessKnight = new Emoji("\u{265E}", "Black Chess Knight");
export const blackChessPawn = new Emoji("\u{265F}", "Black Chess Pawn");
export const blackChessPieces = Object.assign(new EmojiGroup(
    blackChessKing.value
    + blackChessQueen.value
    + blackChessRook.value
    + blackChessBishop.value
    + blackChessKnight.value
    + blackChessPawn.value,
    "Black Chess Pieces",
    blackChessKing,
    blackChessQueen,
    blackChessRook,
    blackChessBishop,
    blackChessKnight,
    blackChessPawn), {
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn
});
export const chessPawns = Object.assign(new EmojiGroup(
    whiteChessPawn.value + blackChessPawn.value,
    "Chess Pawns",
    whiteChessPawn,
    blackChessPawn), {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
export const chessRooks = Object.assign(new EmojiGroup(
    whiteChessRook.value + blackChessRook.value,
    "Chess Rooks",
    whiteChessRook,
    blackChessRook), {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
export const chessBishops = Object.assign(new EmojiGroup(
    whiteChessBishop.value + blackChessBishop.value,
    "Chess Bishops",
    whiteChessBishop,
    blackChessBishop), {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
export const chessKnights = Object.assign(new EmojiGroup(
    whiteChessKnight.value + blackChessKnight.value,
    "Chess Knights",
    whiteChessKnight,
    blackChessKnight), {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
export const chessQueens = Object.assign(new EmojiGroup(
    whiteChessQueen.value + blackChessQueen.value,
    "Chess Queens",
    whiteChessQueen,
    blackChessQueen), {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
export const chessKings = Object.assign(new EmojiGroup(
    whiteChessKing.value + blackChessKing.value,
    "Chess Kings",
    whiteChessKing,
    blackChessKing), {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});
export const chess = Object.assign(new EmojiGroup(
    chessKings.value,
    "Chess Pieces",
    whiteChessPieces,
    blackChessPieces,
    chessPawns,
    chessRooks,
    chessBishops,
    chessKnights,
    chessQueens,
    chessKings), {
    width: "auto",
    white: whiteChessPieces,
    black: blackChessPieces,
    pawns: chessPawns,
    rooks: chessRooks,
    bishops: chessBishops,
    knights: chessKnights,
    queens: chessQueens,
    kings: chessKings
});

export const personSurfingLightSkinTone = new Emoji("\u{1F3C4}\u{1F3FB}", "person surfing: light skin tone");
export const personSurfingMediumLightSkinTone = new Emoji("\u{1F3C4}\u{1F3FC}", "person surfing: medium-light skin tone");
export const personSurfingMediumSkinTone = new Emoji("\u{1F3C4}\u{1F3FD}", "person surfing: medium skin tone");
export const personSurfingMediumDarkSkinTone = new Emoji("\u{1F3C4}\u{1F3FE}", "person surfing: medium-dark skin tone");
export const personSurfingDarkSkinTone = new Emoji("\u{1F3C4}\u{1F3FF}", "person surfing: dark skin tone");
export const personSurfing = new EmojiGroup(
    "\u{1F3C4}", "person surfing",
    personSurfingLightSkinTone,
    personSurfingMediumLightSkinTone,
    personSurfingMediumSkinTone,
    personSurfingMediumDarkSkinTone,
    personSurfingDarkSkinTone);
export const manSurfing = new EmojiGroup(
    "\u{1F3C4}\u{200D}\u{2642}\u{FE0F}", "man surfing",
    new Emoji("\u{1F3C4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man surfing: light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man surfing: medium-light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man surfing: medium skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man surfing: medium-dark skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man surfing: dark skin tone"));
export const womanSurfing = new EmojiGroup(
    "\u{1F3C4}\u{200D}\u{2640}\u{FE0F}", "woman surfing",
    new Emoji("\u{1F3C4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman surfing: light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman surfing: medium-light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman surfing: medium skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman surfing: medium-dark skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman surfing: dark skin tone"));
export const personRowing = new EmojiGroup(
    "\u{1F6A3}", "person rowing boat",
    new Emoji("\u{1F6A3}\u{1F3FB}", "person rowing boat: light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FC}", "person rowing boat: medium-light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FD}", "person rowing boat: medium skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FE}", "person rowing boat: medium-dark skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FF}", "person rowing boat: dark skin tone"));
export const manRowing = new EmojiGroup(
    "\u{1F6A3}\u{200D}\u{2642}\u{FE0F}", "man rowing boat",
    new Emoji("\u{1F6A3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: medium-light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: medium skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: medium-dark skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: dark skin tone"));
export const womanRowing = new EmojiGroup(
    "\u{1F6A3}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat",
    new Emoji("\u{1F6A3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: medium-light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: medium skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: medium-dark skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: dark skin tone"));
export const personSwimming = new EmojiGroup(
    "\u{1F3CA}", "person swimming",
    new Emoji("\u{1F3CA}\u{1F3FB}", "person swimming: light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FC}", "person swimming: medium-light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FD}", "person swimming: medium skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FE}", "person swimming: medium-dark skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FF}", "person swimming: dark skin tone"));
export const manSwimming = new EmojiGroup(
    "\u{1F3CA}\u{200D}\u{2642}\u{FE0F}", "man swimming",
    new Emoji("\u{1F3CA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man swimming: light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man swimming: medium-light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man swimming: medium skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man swimming: medium-dark skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man swimming: dark skin tone"));
export const womanSwimming = new EmojiGroup(
    "\u{1F3CA}\u{200D}\u{2640}\u{FE0F}", "woman swimming",
    new Emoji("\u{1F3CA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman swimming: light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman swimming: medium-light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman swimming: medium skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman swimming: medium-dark skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman swimming: dark skin tone"));
export const personFrowning = new EmojiGroup(
    "\u{1F64D}", "person frowning",
    new Emoji("\u{1F64D}\u{1F3FB}", "person frowning: light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FC}", "person frowning: medium-light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FD}", "person frowning: medium skin tone"),
    new Emoji("\u{1F64D}\u{1F3FE}", "person frowning: medium-dark skin tone"),
    new Emoji("\u{1F64D}\u{1F3FF}", "person frowning: dark skin tone"));
export const manFrowning = new EmojiGroup(
    "\u{1F64D}\u{200D}\u{2642}\u{FE0F}", "man frowning",
    new Emoji("\u{1F64D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man frowning: light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man frowning: medium-light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man frowning: medium skin tone"),
    new Emoji("\u{1F64D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man frowning: medium-dark skin tone"),
    new Emoji("\u{1F64D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man frowning: dark skin tone"));
export const womanFrowning = new EmojiGroup(
    "\u{1F64D}\u{200D}\u{2640}\u{FE0F}", "woman frowning",
    new Emoji("\u{1F64D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman frowning: light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman frowning: medium-light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman frowning: medium skin tone"),
    new Emoji("\u{1F64D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman frowning: medium-dark skin tone"),
    new Emoji("\u{1F64D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman frowning: dark skin tone"));
export const personPouting = new EmojiGroup(
    "\u{1F64E}", "person pouting",
    new Emoji("\u{1F64E}\u{1F3FB}", "person pouting: light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FC}", "person pouting: medium-light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FD}", "person pouting: medium skin tone"),
    new Emoji("\u{1F64E}\u{1F3FE}", "person pouting: medium-dark skin tone"),
    new Emoji("\u{1F64E}\u{1F3FF}", "person pouting: dark skin tone"));
export const manPouting = new EmojiGroup(
    "\u{1F64E}\u{200D}\u{2642}\u{FE0F}", "man pouting",
    new Emoji("\u{1F64E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man pouting: light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man pouting: medium-light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man pouting: medium skin tone"),
    new Emoji("\u{1F64E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man pouting: medium-dark skin tone"),
    new Emoji("\u{1F64E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man pouting: dark skin tone"));
export const womanPouting = new EmojiGroup(
    "\u{1F64E}\u{200D}\u{2640}\u{FE0F}", "woman pouting",
    new Emoji("\u{1F64E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman pouting: light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman pouting: medium-light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman pouting: medium skin tone"),
    new Emoji("\u{1F64E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman pouting: medium-dark skin tone"),
    new Emoji("\u{1F64E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman pouting: dark skin tone"));
export const baby = new EmojiGroup(
    "\u{1F476}", "baby",
    new Emoji("\u{1F476}\u{1F3FB}", "baby: light skin tone"),
    new Emoji("\u{1F476}\u{1F3FC}", "baby: medium-light skin tone"),
    new Emoji("\u{1F476}\u{1F3FD}", "baby: medium skin tone"),
    new Emoji("\u{1F476}\u{1F3FE}", "baby: medium-dark skin tone"),
    new Emoji("\u{1F476}\u{1F3FF}", "baby: dark skin tone"));
export const child = new EmojiGroup(
    "\u{1F9D2}", "child",
    new Emoji("\u{1F9D2}\u{1F3FB}", "child: light skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FC}", "child: medium-light skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FD}", "child: medium skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FE}", "child: medium-dark skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FF}", "child: dark skin tone"));
export const boy = new EmojiGroup(
    "\u{1F466}", "boy",
    new Emoji("\u{1F466}\u{1F3FB}", "boy: light skin tone"),
    new Emoji("\u{1F466}\u{1F3FC}", "boy: medium-light skin tone"),
    new Emoji("\u{1F466}\u{1F3FD}", "boy: medium skin tone"),
    new Emoji("\u{1F466}\u{1F3FE}", "boy: medium-dark skin tone"),
    new Emoji("\u{1F466}\u{1F3FF}", "boy: dark skin tone"));
export const girl = new EmojiGroup(
    "\u{1F467}", "girl",
    new Emoji("\u{1F467}\u{1F3FB}", "girl: light skin tone"),
    new Emoji("\u{1F467}\u{1F3FC}", "girl: medium-light skin tone"),
    new Emoji("\u{1F467}\u{1F3FD}", "girl: medium skin tone"),
    new Emoji("\u{1F467}\u{1F3FE}", "girl: medium-dark skin tone"),
    new Emoji("\u{1F467}\u{1F3FF}", "girl: dark skin tone"));
export const person = new EmojiGroup(
    "\u{1F9D1}", "person",
    new Emoji("\u{1F9D1}\u{1F3FB}", "person: light skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FC}", "person: medium-light skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FD}", "person: medium skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FE}", "person: medium-dark skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FF}", "person: dark skin tone"));
export const blondPerson = new EmojiGroup(
    "\u{1F471}", "person: blond hair",
    new Emoji("\u{1F471}\u{1F3FB}", "person: light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FC}", "person: medium-light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FD}", "person: medium skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FE}", "person: medium-dark skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FF}", "person: dark skin tone, blond hair"));
export const olderPerson = new EmojiGroup(
    "\u{1F9D3}", "older person",
    new Emoji("\u{1F9D3}\u{1F3FB}", "older person: light skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FC}", "older person: medium-light skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FD}", "older person: medium skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FE}", "older person: medium-dark skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FF}", "older person: dark skin tone"));
export const personGesturingNo = new EmojiGroup(
    "\u{1F645}", "person gesturing NO",
    new Emoji("\u{1F645}\u{1F3FB}", "person gesturing NO: light skin tone"),
    new Emoji("\u{1F645}\u{1F3FC}", "person gesturing NO: medium-light skin tone"),
    new Emoji("\u{1F645}\u{1F3FD}", "person gesturing NO: medium skin tone"),
    new Emoji("\u{1F645}\u{1F3FE}", "person gesturing NO: medium-dark skin tone"),
    new Emoji("\u{1F645}\u{1F3FF}", "person gesturing NO: dark skin tone"));
export const manGesturingNo = new EmojiGroup(
    "\u{1F645}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO",
    new Emoji("\u{1F645}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: light skin tone"),
    new Emoji("\u{1F645}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: medium-light skin tone"),
    new Emoji("\u{1F645}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: medium skin tone"),
    new Emoji("\u{1F645}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: medium-dark skin tone"),
    new Emoji("\u{1F645}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: dark skin tone"));
export const womanGesturingNo = new EmojiGroup(
    "\u{1F645}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO",
    new Emoji("\u{1F645}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: light skin tone"),
    new Emoji("\u{1F645}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: medium-light skin tone"),
    new Emoji("\u{1F645}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: medium skin tone"),
    new Emoji("\u{1F645}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: medium-dark skin tone"),
    new Emoji("\u{1F645}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: dark skin tone"));
export const man = new EmojiGroup(
    "\u{1F468}", "man",
    new Emoji("\u{1F468}\u{1F3FB}", "man: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}", "man: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}", "man: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}", "man: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}", "man: dark skin tone"));
export const blondMan = new EmojiGroup(
    "\u{1F471}\u{200D}\u{2642}\u{FE0F}", "man: blond hair",
    new Emoji("\u{1F471}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man: light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man: medium-light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man: medium skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man: medium-dark skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man: dark skin tone, blond hair"));
export const redHairedMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B0}", "man: red hair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B0}", "man: light skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B0}", "man: medium-light skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B0}", "man: medium skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B0}", "man: medium-dark skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B0}", "man: dark skin tone, red hair"));
export const curlyHairedMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B1}", "man: curly hair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B1}", "man: light skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B1}", "man: medium-light skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B1}", "man: medium skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B1}", "man: medium-dark skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B1}", "man: dark skin tone, curly hair"));
export const whiteHairedMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B3}", "man: white hair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B3}", "man: light skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B3}", "man: medium-light skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B3}", "man: medium skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B3}", "man: medium-dark skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B3}", "man: dark skin tone, white hair"));
export const baldMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B2}", "man: bald",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B2}", "man: light skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B2}", "man: medium-light skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B2}", "man: medium skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B2}", "man: medium-dark skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B2}", "man: dark skin tone, bald"));
export const beardedMan = new EmojiGroup(
    "\u{1F9D4}", "man: beard",
    new Emoji("\u{1F9D4}\u{1F3FB}", "man: light skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FC}", "man: medium-light skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FD}", "man: medium skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FE}", "man: medium-dark skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FF}", "man: dark skin tone, beard"));
export const oldMan = new EmojiGroup(
    "\u{1F474}", "old man",
    new Emoji("\u{1F474}\u{1F3FB}", "old man: light skin tone"),
    new Emoji("\u{1F474}\u{1F3FC}", "old man: medium-light skin tone"),
    new Emoji("\u{1F474}\u{1F3FD}", "old man: medium skin tone"),
    new Emoji("\u{1F474}\u{1F3FE}", "old man: medium-dark skin tone"),
    new Emoji("\u{1F474}\u{1F3FF}", "old man: dark skin tone"));
export const woman = new EmojiGroup(
    "\u{1F469}", "woman",
    new Emoji("\u{1F469}\u{1F3FB}", "woman: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}", "woman: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}", "woman: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}", "woman: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}", "woman: dark skin tone"));
export const blondWoman = new EmojiGroup(
    "\u{1F471}\u{200D}\u{2640}\u{FE0F}", "woman: blond hair",
    new Emoji("\u{1F471}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman: light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman: medium-light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman: medium skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman: medium-dark skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman: dark skin tone, blond hair"));
export const redHairedWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B0}", "woman: red hair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B0}", "woman: light skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B0}", "woman: medium-light skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B0}", "woman: medium skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B0}", "woman: medium-dark skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B0}", "woman: dark skin tone, red hair"));
export const curlyHairedWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B1}", "woman: curly hair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B1}", "woman: light skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B1}", "woman: medium-light skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B1}", "woman: medium skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B1}", "woman: medium-dark skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B1}", "woman: dark skin tone, curly hair"));
export const whiteHairedWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B3}", "woman: white hair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B3}", "woman: light skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B3}", "woman: medium-light skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B3}", "woman: medium skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B3}", "woman: medium-dark skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B3}", "woman: dark skin tone, white hair"));
export const baldWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B2}", "woman: bald",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B2}", "woman: light skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B2}", "woman: medium-light skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B2}", "woman: medium skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B2}", "woman: medium-dark skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}", "woman: dark skin tone, bald"));
export const oldWoman = new EmojiGroup(
    "\u{1F475}", "old woman",
    new Emoji("\u{1F475}\u{1F3FB}", "old woman: light skin tone"),
    new Emoji("\u{1F475}\u{1F3FC}", "old woman: medium-light skin tone"),
    new Emoji("\u{1F475}\u{1F3FD}", "old woman: medium skin tone"),
    new Emoji("\u{1F475}\u{1F3FE}", "old woman: medium-dark skin tone"),
    new Emoji("\u{1F475}\u{1F3FF}", "old woman: dark skin tone"));
export const personGesturingOK = new EmojiGroup(
    "\u{1F646}", "person gesturing OK",
    new Emoji("\u{1F646}\u{1F3FB}", "person gesturing OK: light skin tone"),
    new Emoji("\u{1F646}\u{1F3FC}", "person gesturing OK: medium-light skin tone"),
    new Emoji("\u{1F646}\u{1F3FD}", "person gesturing OK: medium skin tone"),
    new Emoji("\u{1F646}\u{1F3FE}", "person gesturing OK: medium-dark skin tone"),
    new Emoji("\u{1F646}\u{1F3FF}", "person gesturing OK: dark skin tone"));
export const manGesturingOK = new EmojiGroup(
    "\u{1F646}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK",
    new Emoji("\u{1F646}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: light skin tone"),
    new Emoji("\u{1F646}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: medium-light skin tone"),
    new Emoji("\u{1F646}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: medium skin tone"),
    new Emoji("\u{1F646}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: medium-dark skin tone"),
    new Emoji("\u{1F646}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: dark skin tone"));
export const womanGesturingOK = new EmojiGroup(
    "\u{1F646}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK",
    new Emoji("\u{1F646}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: light skin tone"),
    new Emoji("\u{1F646}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: medium-light skin tone"),
    new Emoji("\u{1F646}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: medium skin tone"),
    new Emoji("\u{1F646}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: medium-dark skin tone"),
    new Emoji("\u{1F646}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: dark skin tone"));
export const personTippingHand = new EmojiGroup(
    "\u{1F481}", "person tipping hand",
    new Emoji("\u{1F481}\u{1F3FB}", "person tipping hand: light skin tone"),
    new Emoji("\u{1F481}\u{1F3FC}", "person tipping hand: medium-light skin tone"),
    new Emoji("\u{1F481}\u{1F3FD}", "person tipping hand: medium skin tone"),
    new Emoji("\u{1F481}\u{1F3FE}", "person tipping hand: medium-dark skin tone"),
    new Emoji("\u{1F481}\u{1F3FF}", "person tipping hand: dark skin tone"));
export const manTippingHand = new EmojiGroup(
    "\u{1F481}\u{200D}\u{2642}\u{FE0F}", "man tipping hand",
    new Emoji("\u{1F481}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: light skin tone"),
    new Emoji("\u{1F481}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: medium-light skin tone"),
    new Emoji("\u{1F481}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: medium skin tone"),
    new Emoji("\u{1F481}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: medium-dark skin tone"),
    new Emoji("\u{1F481}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: dark skin tone"));
export const womanTippingHand = new EmojiGroup(
    "\u{1F481}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand",
    new Emoji("\u{1F481}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: light skin tone"),
    new Emoji("\u{1F481}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: medium-light skin tone"),
    new Emoji("\u{1F481}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: medium skin tone"),
    new Emoji("\u{1F481}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: medium-dark skin tone"),
    new Emoji("\u{1F481}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: dark skin tone"));
export const personRaisingHand = new EmojiGroup(
    "\u{1F64B}", "person raising hand",
    new Emoji("\u{1F64B}\u{1F3FB}", "person raising hand: light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FC}", "person raising hand: medium-light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FD}", "person raising hand: medium skin tone"),
    new Emoji("\u{1F64B}\u{1F3FE}", "person raising hand: medium-dark skin tone"),
    new Emoji("\u{1F64B}\u{1F3FF}", "person raising hand: dark skin tone"));
export const manRaisingHand = new EmojiGroup(
    "\u{1F64B}\u{200D}\u{2642}\u{FE0F}", "man raising hand",
    new Emoji("\u{1F64B}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man raising hand: light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man raising hand: medium-light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man raising hand: medium skin tone"),
    new Emoji("\u{1F64B}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man raising hand: medium-dark skin tone"),
    new Emoji("\u{1F64B}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man raising hand: dark skin tone"));
export const womanRaisingHand = new EmojiGroup(
    "\u{1F64B}\u{200D}\u{2640}\u{FE0F}", "woman raising hand",
    new Emoji("\u{1F64B}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: medium-light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: medium skin tone"),
    new Emoji("\u{1F64B}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: medium-dark skin tone"),
    new Emoji("\u{1F64B}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: dark skin tone"));
export const deafPerson = new EmojiGroup(
    "\u{1F9CF}", "deaf person",
    new Emoji("\u{1F9CF}\u{1F3FB}", "deaf person: light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FC}", "deaf person: medium-light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FD}", "deaf person: medium skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FE}", "deaf person: medium-dark skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FF}", "deaf person: dark skin tone"));
export const deafMan = new EmojiGroup(
    "\u{1F9CF}\u{200D}\u{2642}\u{FE0F}", "deaf man",
    new Emoji("\u{1F9CF}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "deaf man: light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "deaf man: medium-light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "deaf man: medium skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "deaf man: medium-dark skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "deaf man: dark skin tone"));
export const deafWoman = new EmojiGroup(
    "\u{1F9CF}\u{200D}\u{2640}\u{FE0F}", "deaf woman",
    new Emoji("\u{1F9CF}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "deaf woman: light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "deaf woman: medium-light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "deaf woman: medium skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "deaf woman: medium-dark skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "deaf woman: dark skin tone"));
export const personBowing = new EmojiGroup(
    "\u{1F647}", "person bowing",
    new Emoji("\u{1F647}\u{1F3FB}", "person bowing: light skin tone"),
    new Emoji("\u{1F647}\u{1F3FC}", "person bowing: medium-light skin tone"),
    new Emoji("\u{1F647}\u{1F3FD}", "person bowing: medium skin tone"),
    new Emoji("\u{1F647}\u{1F3FE}", "person bowing: medium-dark skin tone"),
    new Emoji("\u{1F647}\u{1F3FF}", "person bowing: dark skin tone"));
export const manBowing = new EmojiGroup(
    "\u{1F647}\u{200D}\u{2642}\u{FE0F}", "man bowing",
    new Emoji("\u{1F647}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man bowing: light skin tone"),
    new Emoji("\u{1F647}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man bowing: medium-light skin tone"),
    new Emoji("\u{1F647}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man bowing: medium skin tone"),
    new Emoji("\u{1F647}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man bowing: medium-dark skin tone"),
    new Emoji("\u{1F647}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man bowing: dark skin tone"));
export const womanBowing = new EmojiGroup(
    "\u{1F647}\u{200D}\u{2640}\u{FE0F}", "woman bowing",
    new Emoji("\u{1F647}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman bowing: light skin tone"),
    new Emoji("\u{1F647}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman bowing: medium-light skin tone"),
    new Emoji("\u{1F647}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman bowing: medium skin tone"),
    new Emoji("\u{1F647}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman bowing: medium-dark skin tone"),
    new Emoji("\u{1F647}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman bowing: dark skin tone"));
export const personFacePalming = new EmojiGroup(
    "\u{1F926}", "person facepalming",
    new Emoji("\u{1F926}\u{1F3FB}", "person facepalming: light skin tone"),
    new Emoji("\u{1F926}\u{1F3FC}", "person facepalming: medium-light skin tone"),
    new Emoji("\u{1F926}\u{1F3FD}", "person facepalming: medium skin tone"),
    new Emoji("\u{1F926}\u{1F3FE}", "person facepalming: medium-dark skin tone"),
    new Emoji("\u{1F926}\u{1F3FF}", "person facepalming: dark skin tone"));
export const manFacePalming = new EmojiGroup(
    "\u{1F926}\u{200D}\u{2642}\u{FE0F}", "man facepalming",
    new Emoji("\u{1F926}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man facepalming: light skin tone"),
    new Emoji("\u{1F926}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man facepalming: medium-light skin tone"),
    new Emoji("\u{1F926}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man facepalming: medium skin tone"),
    new Emoji("\u{1F926}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man facepalming: medium-dark skin tone"),
    new Emoji("\u{1F926}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man facepalming: dark skin tone"));
export const womanFacePalming = new EmojiGroup(
    "\u{1F926}\u{200D}\u{2640}\u{FE0F}", "woman facepalming",
    new Emoji("\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: light skin tone"),
    new Emoji("\u{1F926}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: medium-light skin tone"),
    new Emoji("\u{1F926}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: medium skin tone"),
    new Emoji("\u{1F926}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: medium-dark skin tone"),
    new Emoji("\u{1F926}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: dark skin tone"));
export const personShrugging = new EmojiGroup(
    "\u{1F937}", "person shrugging",
    new Emoji("\u{1F937}\u{1F3FB}", "person shrugging: light skin tone"),
    new Emoji("\u{1F937}\u{1F3FC}", "person shrugging: medium-light skin tone"),
    new Emoji("\u{1F937}\u{1F3FD}", "person shrugging: medium skin tone"),
    new Emoji("\u{1F937}\u{1F3FE}", "person shrugging: medium-dark skin tone"),
    new Emoji("\u{1F937}\u{1F3FF}", "person shrugging: dark skin tone"));
export const manShrugging = new EmojiGroup(
    "\u{1F937}\u{200D}\u{2642}\u{FE0F}", "man shrugging",
    new Emoji("\u{1F937}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man shrugging: light skin tone"),
    new Emoji("\u{1F937}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man shrugging: medium-light skin tone"),
    new Emoji("\u{1F937}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man shrugging: medium skin tone"),
    new Emoji("\u{1F937}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man shrugging: medium-dark skin tone"),
    new Emoji("\u{1F937}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man shrugging: dark skin tone"));
export const womanShrugging = new EmojiGroup(
    "\u{1F937}\u{200D}\u{2640}\u{FE0F}", "woman shrugging",
    new Emoji("\u{1F937}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: light skin tone"),
    new Emoji("\u{1F937}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: medium-light skin tone"),
    new Emoji("\u{1F937}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: medium skin tone"),
    new Emoji("\u{1F937}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: medium-dark skin tone"),
    new Emoji("\u{1F937}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: dark skin tone"));
export const gestures = new EmojiGroup(
    personGesturingOK.value, "gestures",
    new EmojiGroup(
        "\u{1F64D}", "person frowning",
        personFrowning,
        manFrowning,
        womanFrowning),
    new EmojiGroup(
        "\u{1F64E}", "person pouting",
        personPouting,
        manPouting,
        womanPouting),
    new EmojiGroup(
        "\u{1F645}", "person gesturing NO",
        personGesturingNo,
        manGesturingNo,
        womanGesturingNo),
    new EmojiGroup(
        "\u{1F646}", "person gesturing OK",
        personGesturingOK,
        manGesturingOK,
        womanGesturingOK),
    new EmojiGroup(
        "\u{1F481}", "person tipping hand",
        personTippingHand,
        manTippingHand,
        womanTippingHand),
    new EmojiGroup(
        "\u{1F64B}", "person raising hand",
        personRaisingHand,
        manRaisingHand,
        womanRaisingHand),
    new EmojiGroup(
        "\u{1F9CF}", "deaf person",
        deafPerson,
        deafMan,
        deafWoman),
    new EmojiGroup(
        "\u{1F647}", "person bowing",
        personBowing,
        manBowing,
        womanBowing),
    new EmojiGroup(
        "\u{1F926}", "person facepalming",
        personFacePalming,
        manFacePalming,
        womanFacePalming),
    new EmojiGroup(
        "\u{1F937}", "person shrugging",
        personShrugging,
        manShrugging,
        womanShrugging));
export const manHealthWorker = new EmojiGroup(
    "\u{1F468}\u{200D}\u{2695}\u{FE0F}", "man health worker",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}", "man health worker: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}", "man health worker: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}", "man health worker: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}", "man health worker: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}", "man health worker: dark skin tone"));
export const womanHealthWorker = new EmojiGroup(
    "\u{1F469}\u{200D}\u{2695}\u{FE0F}", "woman health worker",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}", "woman health worker: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}", "woman health worker: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}", "woman health worker: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}", "woman health worker: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}", "woman health worker: dark skin tone"));
export const manStudent = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F393}", "man student",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F393}", "man student: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F393}", "man student: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F393}", "man student: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F393}", "man student: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F393}", "man student: dark skin tone"));
export const womanStudent = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F393}", "woman student",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F393}", "woman student: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F393}", "woman student: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F393}", "woman student: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F393}", "woman student: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F393}", "woman student: dark skin tone"));
export const manTeacher = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3EB}", "man teacher",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3EB}", "man teacher: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3EB}", "man teacher: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3EB}", "man teacher: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3EB}", "man teacher: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3EB}", "man teacher: dark skin tone"));
export const womanTeacher = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3EB}", "woman teacher",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3EB}", "woman teacher: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3EB}", "woman teacher: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3EB}", "woman teacher: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3EB}", "woman teacher: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3EB}", "woman teacher: dark skin tone"));
export const manJudge = new EmojiGroup(
    "\u{1F468}\u{200D}\u{2696}\u{FE0F}", "man judge",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}", "man judge: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}", "man judge: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}", "man judge: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}", "man judge: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}", "man judge: dark skin tone"));
export const womanJudge = new EmojiGroup(
    "\u{1F469}\u{200D}\u{2696}\u{FE0F}", "woman judge",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}", "woman judge: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}", "woman judge: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}", "woman judge: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}", "woman judge: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}", "woman judge: dark skin tone"));
export const manFarmer = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F33E}", "man farmer",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F33E}", "man farmer: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F33E}", "man farmer: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F33E}", "man farmer: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F33E}", "man farmer: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F33E}", "man farmer: dark skin tone"));
export const womanFarmer = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F33E}", "woman farmer",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F33E}", "woman farmer: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F33E}", "woman farmer: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F33E}", "woman farmer: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F33E}", "woman farmer: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F33E}", "woman farmer: dark skin tone"));
export const manCook = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F373}", "man cook",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F373}", "man cook: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F373}", "man cook: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F373}", "man cook: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F373}", "man cook: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F373}", "man cook: dark skin tone"));
export const womanCook = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F373}", "woman cook",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F373}", "woman cook: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F373}", "woman cook: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F373}", "woman cook: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F373}", "woman cook: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F373}", "woman cook: dark skin tone"));
export const manMechanic = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F527}", "man mechanic",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F527}", "man mechanic: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F527}", "man mechanic: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F527}", "man mechanic: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F527}", "man mechanic: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F527}", "man mechanic: dark skin tone"));
export const womanMechanic = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F527}", "woman mechanic",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F527}", "woman mechanic: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F527}", "woman mechanic: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F527}", "woman mechanic: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F527}", "woman mechanic: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F527}", "woman mechanic: dark skin tone"));
export const manFactoryWorker = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3ED}", "man factory worker",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3ED}", "man factory worker: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3ED}", "man factory worker: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3ED}", "man factory worker: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3ED}", "man factory worker: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3ED}", "man factory worker: dark skin tone"));
export const womanFactoryWorker = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3ED}", "woman factory worker",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3ED}", "woman factory worker: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3ED}", "woman factory worker: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3ED}", "woman factory worker: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3ED}", "woman factory worker: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3ED}", "woman factory worker: dark skin tone"));
export const manOfficeWorker = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F4BC}", "man office worker",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F4BC}", "man office worker: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F4BC}", "man office worker: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F4BC}", "man office worker: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F4BC}", "man office worker: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F4BC}", "man office worker: dark skin tone"));
export const womanOfficeWorker = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F4BC}", "woman office worker",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F4BC}", "woman office worker: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F4BC}", "woman office worker: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F4BC}", "woman office worker: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F4BC}", "woman office worker: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F4BC}", "woman office worker: dark skin tone"));
export const prince = new EmojiGroup(
    "\u{1F934}", "prince",
    new Emoji("\u{1F934}\u{1F3FB}", "prince: light skin tone"),
    new Emoji("\u{1F934}\u{1F3FC}", "prince: medium-light skin tone"),
    new Emoji("\u{1F934}\u{1F3FD}", "prince: medium skin tone"),
    new Emoji("\u{1F934}\u{1F3FE}", "prince: medium-dark skin tone"),
    new Emoji("\u{1F934}\u{1F3FF}", "prince: dark skin tone"));
export const princess = new EmojiGroup(
    "\u{1F478}", "princess",
    new Emoji("\u{1F478}\u{1F3FB}", "princess: light skin tone"),
    new Emoji("\u{1F478}\u{1F3FC}", "princess: medium-light skin tone"),
    new Emoji("\u{1F478}\u{1F3FD}", "princess: medium skin tone"),
    new Emoji("\u{1F478}\u{1F3FE}", "princess: medium-dark skin tone"),
    new Emoji("\u{1F478}\u{1F3FF}", "princess: dark skin tone"));
export const constructionWorker = new EmojiGroup(
    "\u{1F477}", "construction worker",
    new Emoji("\u{1F477}\u{1F3FB}", "construction worker: light skin tone"),
    new Emoji("\u{1F477}\u{1F3FC}", "construction worker: medium-light skin tone"),
    new Emoji("\u{1F477}\u{1F3FD}", "construction worker: medium skin tone"),
    new Emoji("\u{1F477}\u{1F3FE}", "construction worker: medium-dark skin tone"),
    new Emoji("\u{1F477}\u{1F3FF}", "construction worker: dark skin tone"));
export const manConstructionWorker = new EmojiGroup(
    "\u{1F477}\u{200D}\u{2642}\u{FE0F}", "man construction worker",
    new Emoji("\u{1F477}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man construction worker: light skin tone"),
    new Emoji("\u{1F477}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man construction worker: medium-light skin tone"),
    new Emoji("\u{1F477}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man construction worker: medium skin tone"),
    new Emoji("\u{1F477}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man construction worker: medium-dark skin tone"),
    new Emoji("\u{1F477}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man construction worker: dark skin tone"));
export const womanConstructionWorker = new EmojiGroup(
    "\u{1F477}\u{200D}\u{2640}\u{FE0F}", "woman construction worker",
    new Emoji("\u{1F477}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: light skin tone"),
    new Emoji("\u{1F477}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: medium-light skin tone"),
    new Emoji("\u{1F477}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: medium skin tone"),
    new Emoji("\u{1F477}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: medium-dark skin tone"),
    new Emoji("\u{1F477}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: dark skin tone"));
export const guard = new EmojiGroup(
    "\u{1F482}", "guard",
    new Emoji("\u{1F482}\u{1F3FB}", "guard: light skin tone"),
    new Emoji("\u{1F482}\u{1F3FC}", "guard: medium-light skin tone"),
    new Emoji("\u{1F482}\u{1F3FD}", "guard: medium skin tone"),
    new Emoji("\u{1F482}\u{1F3FE}", "guard: medium-dark skin tone"),
    new Emoji("\u{1F482}\u{1F3FF}", "guard: dark skin tone"));
export const manGuard = new EmojiGroup(
    "\u{1F482}\u{200D}\u{2642}\u{FE0F}", "man guard",
    new Emoji("\u{1F482}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man guard: light skin tone"),
    new Emoji("\u{1F482}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man guard: medium-light skin tone"),
    new Emoji("\u{1F482}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man guard: medium skin tone"),
    new Emoji("\u{1F482}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man guard: medium-dark skin tone"),
    new Emoji("\u{1F482}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man guard: dark skin tone"));
export const womanGuard = new EmojiGroup(
    "\u{1F482}\u{200D}\u{2640}\u{FE0F}", "woman guard",
    new Emoji("\u{1F482}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman guard: light skin tone"),
    new Emoji("\u{1F482}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman guard: medium-light skin tone"),
    new Emoji("\u{1F482}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman guard: medium skin tone"),
    new Emoji("\u{1F482}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman guard: medium-dark skin tone"),
    new Emoji("\u{1F482}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman guard: dark skin tone"));
export const spy = new EmojiGroup(
    "\u{1F575}\u{FE0F}", "spy",
    new Emoji("\u{1F575}\u{1F3FB}", "spy: light skin tone"),
    new Emoji("\u{1F575}\u{1F3FC}", "spy: medium-light skin tone"),
    new Emoji("\u{1F575}\u{1F3FD}", "spy: medium skin tone"),
    new Emoji("\u{1F575}\u{1F3FE}", "spy: medium-dark skin tone"),
    new Emoji("\u{1F575}\u{1F3FF}", "spy: dark skin tone"));
export const manSpy = new EmojiGroup(
    "\u{1F575}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man spy",
    new Emoji("\u{1F575}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man spy: light skin tone"),
    new Emoji("\u{1F575}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man spy: medium-light skin tone"),
    new Emoji("\u{1F575}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man spy: medium skin tone"),
    new Emoji("\u{1F575}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man spy: medium-dark skin tone"),
    new Emoji("\u{1F575}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man spy: dark skin tone"));
export const womanSpy = new EmojiGroup(
    "\u{1F575}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman spy",
    new Emoji("\u{1F575}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman spy: light skin tone"),
    new Emoji("\u{1F575}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman spy: medium-light skin tone"),
    new Emoji("\u{1F575}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman spy: medium skin tone"),
    new Emoji("\u{1F575}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman spy: medium-dark skin tone"),
    new Emoji("\u{1F575}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman spy: dark skin tone"));
export const policeOfficer = new EmojiGroup(
    "\u{1F46E}", "police officer",
    new Emoji("\u{1F46E}\u{1F3FB}", "police officer: light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FC}", "police officer: medium-light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FD}", "police officer: medium skin tone"),
    new Emoji("\u{1F46E}\u{1F3FE}", "police officer: medium-dark skin tone"),
    new Emoji("\u{1F46E}\u{1F3FF}", "police officer: dark skin tone"));
export const manPoliceOfficer = new EmojiGroup(
    "\u{1F46E}\u{200D}\u{2642}\u{FE0F}", "man police officer",
    new Emoji("\u{1F46E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man police officer: light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man police officer: medium-light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man police officer: medium skin tone"),
    new Emoji("\u{1F46E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man police officer: medium-dark skin tone"),
    new Emoji("\u{1F46E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man police officer: dark skin tone"));
export const womanPoliceOfficer = new EmojiGroup(
    "\u{1F46E}\u{200D}\u{2640}\u{FE0F}", "woman police officer",
    new Emoji("\u{1F46E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman police officer: light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman police officer: medium-light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman police officer: medium skin tone"),
    new Emoji("\u{1F46E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman police officer: medium-dark skin tone"),
    new Emoji("\u{1F46E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman police officer: dark skin tone"));
export const manFirefighter = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F692}", "man firefighter",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F692}", "man firefighter: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F692}", "man firefighter: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F692}", "man firefighter: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F692}", "man firefighter: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F692}", "man firefighter: dark skin tone"));
export const womanFirefighter = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F692}", "woman firefighter",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F692}", "woman firefighter: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F692}", "woman firefighter: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F692}", "woman firefighter: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F692}", "woman firefighter: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F692}", "woman firefighter: dark skin tone"));
export const manAstronaut = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F680}", "man astronaut",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F680}", "man astronaut: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F680}", "man astronaut: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F680}", "man astronaut: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F680}", "man astronaut: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F680}", "man astronaut: dark skin tone"));
export const womanAstronaut = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F680}", "woman astronaut",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F680}", "woman astronaut: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F680}", "woman astronaut: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F680}", "woman astronaut: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F680}", "woman astronaut: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F680}", "woman astronaut: dark skin tone"));
export const manPilot = new EmojiGroup(
    "\u{1F468}\u{200D}\u{2708}\u{FE0F}", "man pilot",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}", "man pilot: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}", "man pilot: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}", "man pilot: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}", "man pilot: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}", "man pilot: dark skin tone"));
export const womanPilot = new EmojiGroup(
    "\u{1F469}\u{200D}\u{2708}\u{FE0F}", "woman pilot",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}", "woman pilot: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}", "woman pilot: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}", "woman pilot: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}", "woman pilot: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}", "woman pilot: dark skin tone"));
export const manArtist = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3A8}", "man artist",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3A8}", "man artist: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3A8}", "man artist: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3A8}", "man artist: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3A8}", "man artist: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3A8}", "man artist: dark skin tone"));
export const womanArtist = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3A8}", "woman artist",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3A8}", "woman artist: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3A8}", "woman artist: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3A8}", "woman artist: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3A8}", "woman artist: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3A8}", "woman artist: dark skin tone"));
export const manSinger = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3A4}", "man singer",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3A4}", "man singer: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3A4}", "man singer: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3A4}", "man singer: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3A4}", "man singer: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3A4}", "man singer: dark skin tone"));
export const womanSinger = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3A4}", "woman singer",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3A4}", "woman singer: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3A4}", "woman singer: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3A4}", "woman singer: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3A4}", "woman singer: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3A4}", "woman singer: dark skin tone"));
export const manTechnologist = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F4BB}", "man technologist",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F4BB}", "man technologist: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F4BB}", "man technologist: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F4BB}", "man technologist: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F4BB}", "man technologist: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F4BB}", "man technologist: dark skin tone"));
export const womanTechnologist = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F4BB}", "woman technologist",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F4BB}", "woman technologist: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F4BB}", "woman technologist: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F4BB}", "woman technologist: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F4BB}", "woman technologist: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F4BB}", "woman technologist: dark skin tone"));
export const manScientist = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F52C}", "man scientist",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F52C}", "man scientist: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F52C}", "man scientist: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F52C}", "man scientist: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F52C}", "man scientist: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F52C}", "man scientist: dark skin tone"));
export const womanScientist = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F52C}", "woman scientist",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F52C}", "woman scientist: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F52C}", "woman scientist: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F52C}", "woman scientist: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F52C}", "woman scientist: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F52C}", "woman scientist: dark skin tone"));
export const roles = [
    new EmojiGroup(
        "\u{2695}\u{FE0F}", "health worker",
        manHealthWorker,
        womanHealthWorker),
    new EmojiGroup(
        "\u{1F393}", "student",
        manStudent,
        womanStudent),
    new EmojiGroup(
        "\u{1F3EB}", "teacher",
        manTeacher,
        womanTeacher),
    new EmojiGroup(
        "\u{2696}\u{FE0F}", "judge",
        manJudge,
        womanJudge),
    new EmojiGroup(
        "\u{1F33E}", "farmer",
        manFarmer,
        womanFarmer),
    new EmojiGroup(
        "\u{1F373}", "cook",
        manCook,
        womanCook),
    new EmojiGroup(
        "\u{1F527}", "mechanic",
        manMechanic,
        womanMechanic),
    new EmojiGroup(
        "\u{1F3ED}", "factory worker",
        manFactoryWorker,
        womanFactoryWorker),
    new EmojiGroup(
        "\u{1F4BC}", "office worker",
        manOfficeWorker,
        womanOfficeWorker),
    new EmojiGroup(
        "\u{1F52C}", "scientist",
        manScientist,
        womanScientist),
    new EmojiGroup(
        "\u{1F4BB}", "technologist",
        manTechnologist,
        womanTechnologist),
    new EmojiGroup(
        "\u{1F3A4}", "singer",
        manSinger,
        womanSinger),
    new EmojiGroup(
        "\u{1F3A8}", "artist",
        manArtist,
        womanArtist),
    new EmojiGroup(
        "\u{2708}\u{FE0F}", "pilot",
        manPilot,
        womanPilot),
    new EmojiGroup(
        "\u{1F680}", "astronaut",
        manAstronaut,
        womanAstronaut),
    new EmojiGroup(
        "\u{1F692}", "firefighter",
        manFirefighter,
        womanFirefighter),
    new EmojiGroup(
        "\u{1F575}\u{FE0F}", "spy",
        spy,
        manSpy,
        womanSpy),
    new EmojiGroup(
        "\u{1F482}", "guard",
        guard,
        manGuard,
        womanGuard),
    new EmojiGroup(
        "\u{1F477}", "construction worker",
        constructionWorker,
        manConstructionWorker,
        womanConstructionWorker),
    new EmojiGroup(
        "\u{1F934}", "royalty",
        prince,
        princess)
];
export const personWearingTurban = new EmojiGroup(
    "\u{1F473}", "person wearing turban",
    new Emoji("\u{1F473}\u{1F3FB}", "person wearing turban: light skin tone"),
    new Emoji("\u{1F473}\u{1F3FC}", "person wearing turban: medium-light skin tone"),
    new Emoji("\u{1F473}\u{1F3FD}", "person wearing turban: medium skin tone"),
    new Emoji("\u{1F473}\u{1F3FE}", "person wearing turban: medium-dark skin tone"),
    new Emoji("\u{1F473}\u{1F3FF}", "person wearing turban: dark skin tone"));
export const manWearingTurban = new EmojiGroup(
    "\u{1F473}\u{200D}\u{2642}\u{FE0F}", "man wearing turban",
    new Emoji("\u{1F473}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: light skin tone"),
    new Emoji("\u{1F473}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: medium-light skin tone"),
    new Emoji("\u{1F473}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: medium skin tone"),
    new Emoji("\u{1F473}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: medium-dark skin tone"),
    new Emoji("\u{1F473}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: dark skin tone"));
export const womanWearingTurban = new EmojiGroup(
    "\u{1F473}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban",
    new Emoji("\u{1F473}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: light skin tone"),
    new Emoji("\u{1F473}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: medium-light skin tone"),
    new Emoji("\u{1F473}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: medium skin tone"),
    new Emoji("\u{1F473}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: medium-dark skin tone"),
    new Emoji("\u{1F473}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: dark skin tone"));
export const wearingTurban = new EmojiGroup(
    personWearingTurban.value, "wearing turban",
    personWearingTurban,
    manWearingTurban,
    womanWearingTurban);
export const manWithChineseCap = new EmojiGroup(
    "\u{1F472}", "man with Chinese cap",
    new Emoji("\u{1F472}\u{1F3FB}", "man with Chinese cap: light skin tone"),
    new Emoji("\u{1F472}\u{1F3FC}", "man with Chinese cap: medium-light skin tone"),
    new Emoji("\u{1F472}\u{1F3FD}", "man with Chinese cap: medium skin tone"),
    new Emoji("\u{1F472}\u{1F3FE}", "man with Chinese cap: medium-dark skin tone"),
    new Emoji("\u{1F472}\u{1F3FF}", "man with Chinese cap: dark skin tone"));
export const womanWithHeadscarf = new EmojiGroup(
    "\u{1F9D5}", "woman with headscarf",
    new Emoji("\u{1F9D5}\u{1F3FB}", "woman with headscarf: light skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FC}", "woman with headscarf: medium-light skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FD}", "woman with headscarf: medium skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FE}", "woman with headscarf: medium-dark skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FF}", "woman with headscarf: dark skin tone"));
export const manInTuxedo = new EmojiGroup(
    "\u{1F935}", "man in tuxedo",
    new Emoji("\u{1F935}\u{1F3FB}", "man in tuxedo: light skin tone"),
    new Emoji("\u{1F935}\u{1F3FC}", "man in tuxedo: medium-light skin tone"),
    new Emoji("\u{1F935}\u{1F3FD}", "man in tuxedo: medium skin tone"),
    new Emoji("\u{1F935}\u{1F3FE}", "man in tuxedo: medium-dark skin tone"),
    new Emoji("\u{1F935}\u{1F3FF}", "man in tuxedo: dark skin tone"));
export const brideWithVeil = new EmojiGroup(
    "\u{1F470}", "bride with veil",
    new Emoji("\u{1F470}\u{1F3FB}", "bride with veil: light skin tone"),
    new Emoji("\u{1F470}\u{1F3FC}", "bride with veil: medium-light skin tone"),
    new Emoji("\u{1F470}\u{1F3FD}", "bride with veil: medium skin tone"),
    new Emoji("\u{1F470}\u{1F3FE}", "bride with veil: medium-dark skin tone"),
    new Emoji("\u{1F470}\u{1F3FF}", "bride with veil: dark skin tone"));
export const pregnantWoman = new EmojiGroup(
    "\u{1F930}", "pregnant woman",
    new Emoji("\u{1F930}\u{1F3FB}", "pregnant woman: light skin tone"),
    new Emoji("\u{1F930}\u{1F3FC}", "pregnant woman: medium-light skin tone"),
    new Emoji("\u{1F930}\u{1F3FD}", "pregnant woman: medium skin tone"),
    new Emoji("\u{1F930}\u{1F3FE}", "pregnant woman: medium-dark skin tone"),
    new Emoji("\u{1F930}\u{1F3FF}", "pregnant woman: dark skin tone"));
export const breastFeeding = new EmojiGroup(
    "\u{1F931}", "breast-feeding",
    new Emoji("\u{1F931}\u{1F3FB}", "breast-feeding: light skin tone"),
    new Emoji("\u{1F931}\u{1F3FC}", "breast-feeding: medium-light skin tone"),
    new Emoji("\u{1F931}\u{1F3FD}", "breast-feeding: medium skin tone"),
    new Emoji("\u{1F931}\u{1F3FE}", "breast-feeding: medium-dark skin tone"),
    new Emoji("\u{1F931}\u{1F3FF}", "breast-feeding: dark skin tone"));
export const otherPeople = [
    wearingTurban,
    manWithChineseCap,
    womanWithHeadscarf,
    manInTuxedo,
    brideWithVeil,
    pregnantWoman,
    breastFeeding
];
export const babyAngel = new EmojiGroup(
    "\u{1F47C}", "baby angel",
    new Emoji("\u{1F47C}\u{1F3FB}", "baby angel: light skin tone"),
    new Emoji("\u{1F47C}\u{1F3FC}", "baby angel: medium-light skin tone"),
    new Emoji("\u{1F47C}\u{1F3FD}", "baby angel: medium skin tone"),
    new Emoji("\u{1F47C}\u{1F3FE}", "baby angel: medium-dark skin tone"),
    new Emoji("\u{1F47C}\u{1F3FF}", "baby angel: dark skin tone"));
export const santaClaus = new EmojiGroup(
    "\u{1F385}", "Santa Claus",
    new Emoji("\u{1F385}\u{1F3FB}", "Santa Claus: light skin tone"),
    new Emoji("\u{1F385}\u{1F3FC}", "Santa Claus: medium-light skin tone"),
    new Emoji("\u{1F385}\u{1F3FD}", "Santa Claus: medium skin tone"),
    new Emoji("\u{1F385}\u{1F3FE}", "Santa Claus: medium-dark skin tone"),
    new Emoji("\u{1F385}\u{1F3FF}", "Santa Claus: dark skin tone"));
export const mrsClaus = new EmojiGroup(
    "\u{1F936}", "Mrs. Claus",
    new Emoji("\u{1F936}\u{1F3FB}", "Mrs. Claus: light skin tone"),
    new Emoji("\u{1F936}\u{1F3FC}", "Mrs. Claus: medium-light skin tone"),
    new Emoji("\u{1F936}\u{1F3FD}", "Mrs. Claus: medium skin tone"),
    new Emoji("\u{1F936}\u{1F3FE}", "Mrs. Claus: medium-dark skin tone"),
    new Emoji("\u{1F936}\u{1F3FF}", "Mrs. Claus: dark skin tone"));
export const superhero = new EmojiGroup(
    "\u{1F9B8}", "superhero",
    new Emoji("\u{1F9B8}\u{1F3FB}", "superhero: light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FC}", "superhero: medium-light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FD}", "superhero: medium skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FE}", "superhero: medium-dark skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FF}", "superhero: dark skin tone"));
export const manSuperhero = new EmojiGroup(
    "\u{1F9B8}\u{200D}\u{2642}\u{FE0F}", "man superhero",
    new Emoji("\u{1F9B8}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man superhero: light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man superhero: medium-light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man superhero: medium skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man superhero: medium-dark skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man superhero: dark skin tone"));
export const womanSuperhero = new EmojiGroup(
    "\u{1F9B8}\u{200D}\u{2640}\u{FE0F}", "woman superhero",
    new Emoji("\u{1F9B8}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman superhero: light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman superhero: medium-light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman superhero: medium skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman superhero: medium-dark skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman superhero: dark skin tone"));
export const supervillain = new EmojiGroup(
    "\u{1F9B9}", "supervillain",
    new Emoji("\u{1F9B9}\u{1F3FB}", "supervillain: light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FC}", "supervillain: medium-light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FD}", "supervillain: medium skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FE}", "supervillain: medium-dark skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FF}", "supervillain: dark skin tone"));
export const manSupervillain = new EmojiGroup(
    "\u{1F9B9}\u{200D}\u{2642}\u{FE0F}", "man supervillain",
    new Emoji("\u{1F9B9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man supervillain: light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man supervillain: medium-light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man supervillain: medium skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man supervillain: medium-dark skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man supervillain: dark skin tone"));
export const womanSupervillain = new EmojiGroup(
    "\u{1F9B9}\u{200D}\u{2640}\u{FE0F}", "woman supervillain",
    new Emoji("\u{1F9B9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: medium-light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: medium skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: medium-dark skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: dark skin tone"));
export const mage = new EmojiGroup(
    "\u{1F9D9}", "mage",
    new Emoji("\u{1F9D9}\u{1F3FB}", "mage: light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FC}", "mage: medium-light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FD}", "mage: medium skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FE}", "mage: medium-dark skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FF}", "mage: dark skin tone"));
export const manMage = new EmojiGroup(
    "\u{1F9D9}\u{200D}\u{2642}\u{FE0F}", "man mage",
    new Emoji("\u{1F9D9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man mage: light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man mage: medium-light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man mage: medium skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man mage: medium-dark skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man mage: dark skin tone"));
export const womanMage = new EmojiGroup(
    "\u{1F9D9}\u{200D}\u{2640}\u{FE0F}", "woman mage",
    new Emoji("\u{1F9D9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman mage: light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman mage: medium-light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman mage: medium skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman mage: medium-dark skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman mage: dark skin tone"));
export const fairy = new EmojiGroup(
    "\u{1F9DA}", "fairy",
    new Emoji("\u{1F9DA}\u{1F3FB}", "fairy: light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FC}", "fairy: medium-light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FD}", "fairy: medium skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FE}", "fairy: medium-dark skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FF}", "fairy: dark skin tone"));
export const manFairy = new EmojiGroup(
    "\u{1F9DA}\u{200D}\u{2642}\u{FE0F}", "man fairy",
    new Emoji("\u{1F9DA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man fairy: light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man fairy: medium-light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man fairy: medium skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man fairy: medium-dark skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man fairy: dark skin tone"));
export const womanFairy = new EmojiGroup(
    "\u{1F9DA}\u{200D}\u{2640}\u{FE0F}", "woman fairy",
    new Emoji("\u{1F9DA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman fairy: light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman fairy: medium-light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman fairy: medium skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman fairy: medium-dark skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman fairy: dark skin tone"));
export const vampire = new EmojiGroup(
    "\u{1F9DB}", "vampire",
    new Emoji("\u{1F9DB}\u{1F3FB}", "vampire: light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FC}", "vampire: medium-light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FD}", "vampire: medium skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FE}", "vampire: medium-dark skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FF}", "vampire: dark skin tone"));
export const manVampire = new EmojiGroup(
    "\u{1F9DB}\u{200D}\u{2642}\u{FE0F}", "man vampire",
    new Emoji("\u{1F9DB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man vampire: light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man vampire: medium-light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man vampire: medium skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man vampire: medium-dark skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man vampire: dark skin tone"));
export const womanVampire = new EmojiGroup(
    "\u{1F9DB}\u{200D}\u{2640}\u{FE0F}", "woman vampire",
    new Emoji("\u{1F9DB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman vampire: light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman vampire: medium-light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman vampire: medium skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman vampire: medium-dark skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman vampire: dark skin tone"));
export const merperson = new EmojiGroup(
    "\u{1F9DC}", "merperson",
    new Emoji("\u{1F9DC}\u{1F3FB}", "merperson: light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FC}", "merperson: medium-light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FD}", "merperson: medium skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FE}", "merperson: medium-dark skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FF}", "merperson: dark skin tone"));
export const merman = new EmojiGroup(
    "\u{1F9DC}\u{200D}\u{2642}\u{FE0F}", "merman",
    new Emoji("\u{1F9DC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "merman: light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "merman: medium-light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "merman: medium skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "merman: medium-dark skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "merman: dark skin tone"));
export const mermaid = new EmojiGroup(
    "\u{1F9DC}\u{200D}\u{2640}\u{FE0F}", "mermaid",
    new Emoji("\u{1F9DC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "mermaid: light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "mermaid: medium-light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "mermaid: medium skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "mermaid: medium-dark skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "mermaid: dark skin tone"));
export const elf = new EmojiGroup(
    "\u{1F9DD}", "elf",
    new Emoji("\u{1F9DD}\u{1F3FB}", "elf: light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FC}", "elf: medium-light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FD}", "elf: medium skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FE}", "elf: medium-dark skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FF}", "elf: dark skin tone"));
export const manElf = new EmojiGroup(
    "\u{1F9DD}\u{200D}\u{2642}\u{FE0F}", "man elf",
    new Emoji("\u{1F9DD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man elf: light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man elf: medium-light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man elf: medium skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man elf: medium-dark skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man elf: dark skin tone"));
export const womanElf = new EmojiGroup(
    "\u{1F9DD}\u{200D}\u{2640}\u{FE0F}", "woman elf",
    new Emoji("\u{1F9DD}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman elf: light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman elf: medium-light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman elf: medium skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman elf: medium-dark skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman elf: dark skin tone"));
export const genie = new Emoji("\u{1F9DE}", "genie");
export const manGenie = new Emoji("\u{1F9DE}\u{200D}\u{2642}\u{FE0F}", "man genie");
export const womanGenie = new Emoji("\u{1F9DE}\u{200D}\u{2640}\u{FE0F}", "woman genie");
export const zombie = new Emoji("\u{1F9DF}", "zombie");
export const manZombie = new Emoji("\u{1F9DF}\u{200D}\u{2642}\u{FE0F}", "man zombie");
export const womanZombie = new Emoji("\u{1F9DF}\u{200D}\u{2640}\u{FE0F}", "woman zombie");
export const fantasy = [
    babyAngel,
    santaClaus,
    mrsClaus,
    new EmojiGroup(
        "\u{1F9B8}", "superhero",
        superhero,
        manSuperhero,
        womanSuperhero),
    new EmojiGroup(
        "\u{1F9B9}", "supervillain",
        supervillain,
        manSupervillain,
        womanSupervillain),
    new EmojiGroup(
        "\u{1F9D9}", "mage",
        mage,
        manMage,
        womanMage),
    new EmojiGroup(
        "\u{1F9DA}", "fairy",
        fairy,
        manFairy,
        womanFairy),
    new EmojiGroup(
        "\u{1F9DB}", "vampire",
        vampire,
        manVampire,
        womanVampire),
    new EmojiGroup(
        "\u{1F9DC}", "merperson",
        merperson,
        merman,
        mermaid),
    new EmojiGroup(
        "\u{1F9DD}", "elf",
        elf,
        manElf,
        womanElf),
    new EmojiGroup(
        "\u{1F9DE}", "genie",
        genie,
        manGenie,
        womanGenie),
    new EmojiGroup(
        "\u{1F9DF}", "zombie",
        zombie,
        manZombie,
        womanZombie)
];

export const personGettingMassage = new EmojiGroup(
    "\u{1F486}", "person getting massage",
    new Emoji("\u{1F486}\u{1F3FB}", "person getting massage: light skin tone"),
    new Emoji("\u{1F486}\u{1F3FC}", "person getting massage: medium-light skin tone"),
    new Emoji("\u{1F486}\u{1F3FD}", "person getting massage: medium skin tone"),
    new Emoji("\u{1F486}\u{1F3FE}", "person getting massage: medium-dark skin tone"),
    new Emoji("\u{1F486}\u{1F3FF}", "person getting massage: dark skin tone"));
export const manGettingMassage = new EmojiGroup(
    "\u{1F486}\u{200D}\u{2642}\u{FE0F}", "man getting massage",
    new Emoji("\u{1F486}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man getting massage: light skin tone"),
    new Emoji("\u{1F486}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man getting massage: medium-light skin tone"),
    new Emoji("\u{1F486}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man getting massage: medium skin tone"),
    new Emoji("\u{1F486}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man getting massage: medium-dark skin tone"),
    new Emoji("\u{1F486}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man getting massage: dark skin tone"));
export const womanGettingMassage = new EmojiGroup(
    "\u{1F486}\u{200D}\u{2640}\u{FE0F}", "woman getting massage",
    new Emoji("\u{1F486}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: light skin tone"),
    new Emoji("\u{1F486}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: medium-light skin tone"),
    new Emoji("\u{1F486}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: medium skin tone"),
    new Emoji("\u{1F486}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: medium-dark skin tone"),
    new Emoji("\u{1F486}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: dark skin tone"));
export const personGettingHaircut = new EmojiGroup(
    "\u{1F487}", "person getting haircut",
    new Emoji("\u{1F487}\u{1F3FB}", "person getting haircut: light skin tone"),
    new Emoji("\u{1F487}\u{1F3FC}", "person getting haircut: medium-light skin tone"),
    new Emoji("\u{1F487}\u{1F3FD}", "person getting haircut: medium skin tone"),
    new Emoji("\u{1F487}\u{1F3FE}", "person getting haircut: medium-dark skin tone"),
    new Emoji("\u{1F487}\u{1F3FF}", "person getting haircut: dark skin tone"));
export const manGettingHaircut = new EmojiGroup(
    "\u{1F487}\u{200D}\u{2642}\u{FE0F}", "man getting haircut",
    new Emoji("\u{1F487}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: light skin tone"),
    new Emoji("\u{1F487}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: medium-light skin tone"),
    new Emoji("\u{1F487}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: medium skin tone"),
    new Emoji("\u{1F487}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: medium-dark skin tone"),
    new Emoji("\u{1F487}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: dark skin tone"));
export const womanGettingHaircut = new EmojiGroup(
    "\u{1F487}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut",
    new Emoji("\u{1F487}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: light skin tone"),
    new Emoji("\u{1F487}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: medium-light skin tone"),
    new Emoji("\u{1F487}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: medium skin tone"),
    new Emoji("\u{1F487}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: medium-dark skin tone"),
    new Emoji("\u{1F487}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: dark skin tone"));
export const personWalking = new EmojiGroup(
    "\u{1F6B6}", "person walking",
    new Emoji("\u{1F6B6}\u{1F3FB}", "person walking: light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FC}", "person walking: medium-light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FD}", "person walking: medium skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FE}", "person walking: medium-dark skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FF}", "person walking: dark skin tone"));
export const manWalking = {
    value: "\u{1F6B6}\u{200D}\u{2642}\u{FE0F}", desc: "man walking", alts: [
        new Emoji("\u{1F6B6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man walking: light skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man walking: medium-light skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man walking: medium skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man walking: medium-dark skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man walking: dark skin tone"),
        new Emoji("\u{1F6B6}\u{200D}\u{2640}\u{FE0F}", "woman walking"),
    ]
};
export const womanWalking = new EmojiGroup(
    "\u{1F6B6}\u{200D}\u{2640}", "woman walking",
    new Emoji("\u{1F6B6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman walking: light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman walking: medium-light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman walking: medium skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman walking: medium-dark skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman walking: dark skin tone"));
export const personStanding = new EmojiGroup(
    "\u{1F9CD}", "person standing",
    new Emoji("\u{1F9CD}\u{1F3FB}", "person standing: light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FC}", "person standing: medium-light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FD}", "person standing: medium skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FE}", "person standing: medium-dark skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FF}", "person standing: dark skin tone"));
export const manStanding = new EmojiGroup(
    "\u{1F9CD}\u{200D}\u{2642}\u{FE0F}", "man standing",
    new Emoji("\u{1F9CD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man standing: light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man standing: medium-light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man standing: medium skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man standing: medium-dark skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man standing: dark skin tone"));
export const womanStanding = new EmojiGroup(
    "\u{1F9CD}\u{200D}\u{2640}\u{FE0F}", "woman standing",
    new Emoji("\u{1F9CD}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman standing: light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman standing: medium-light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman standing: medium skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman standing: medium-dark skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman standing: dark skin tone"));
export const personKneeling = new EmojiGroup(
    "\u{1F9CE}", "person kneeling",
    new Emoji("\u{1F9CE}\u{1F3FB}", "person kneeling: light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FC}", "person kneeling: medium-light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FD}", "person kneeling: medium skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FE}", "person kneeling: medium-dark skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FF}", "person kneeling: dark skin tone"));
export const manKneeling = new EmojiGroup(
    "\u{1F9CE}\u{200D}\u{2642}\u{FE0F}", "man kneeling",
    new Emoji("\u{1F9CE}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man kneeling: light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man kneeling: medium-light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man kneeling: medium skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man kneeling: medium-dark skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man kneeling: dark skin tone"));
export const womanKneeling = new EmojiGroup(
    "\u{1F9CE}\u{200D}\u{2640}\u{FE0F}", "woman kneeling",
    new Emoji("\u{1F9CE}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: medium-light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: medium skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: medium-dark skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: dark skin tone"));
export const manWithProbingCane = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9AF}", "man with probing cane",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9AF}", "man with probing cane: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9AF}", "man with probing cane: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9AF}", "man with probing cane: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9AF}", "man with probing cane: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9AF}", "man with probing cane: dark skin tone"));
export const womanWithProbingCane = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9AF}", "woman with probing cane",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9AF}", "woman with probing cane: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9AF}", "woman with probing cane: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9AF}", "woman with probing cane: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9AF}", "woman with probing cane: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9AF}", "woman with probing cane: dark skin tone"));
export const manInMotorizedWheelchair = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9BC}", "man in motorized wheelchair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9BC}", "man in motorized wheelchair: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9BC}", "man in motorized wheelchair: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9BC}", "man in motorized wheelchair: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9BC}", "man in motorized wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9BC}", "man in motorized wheelchair: dark skin tone"));
export const womanInMotorizedWheelchair = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9BC}", "woman in motorized wheelchair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: dark skin tone"));
export const manInManualWheelchair = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9BD}", "man in manual wheelchair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9BD}", "man in manual wheelchair: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9BD}", "man in manual wheelchair: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9BD}", "man in manual wheelchair: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9BD}", "man in manual wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9BD}", "man in manual wheelchair: dark skin tone"));
export const womanInManualWheelchair = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9BD}", "woman in manual wheelchair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9BD}", "woman in manual wheelchair: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9BD}", "woman in manual wheelchair: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9BD}", "woman in manual wheelchair: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9BD}", "woman in manual wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9BD}", "woman in manual wheelchair: dark skin tone"));
export const personRunning = new EmojiGroup(
    "\u{1F3C3}", "person running",
    new Emoji("\u{1F3C3}\u{1F3FB}", "person running: light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FC}", "person running: medium-light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FD}", "person running: medium skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FE}", "person running: medium-dark skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FF}", "person running: dark skin tone"));
export const manRunning = new EmojiGroup(
    "\u{1F3C3}\u{200D}\u{2642}\u{FE0F}", "man running",
    new Emoji("\u{1F3C3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man running: light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man running: medium-light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man running: medium skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man running: medium-dark skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man running: dark skin tone"));
export const womanRunning = new EmojiGroup(
    "\u{1F3C3}\u{200D}\u{2640}\u{FE0F}", "woman running",
    new Emoji("\u{1F3C3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman running: light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman running: medium-light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman running: medium skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman running: medium-dark skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman running: dark skin tone"));
export const manDancing = new EmojiGroup(
    "\u{1F57A}", "man dancing",
    new Emoji("\u{1F57A}\u{1F3FB}", "man dancing: light skin tone"),
    new Emoji("\u{1F57A}\u{1F3FC}", "man dancing: medium-light skin tone"),
    new Emoji("\u{1F57A}\u{1F3FD}", "man dancing: medium skin tone"),
    new Emoji("\u{1F57A}\u{1F3FE}", "man dancing: medium-dark skin tone"),
    new Emoji("\u{1F57A}\u{1F3FF}", "man dancing: dark skin tone"));
export const womanDancing = new EmojiGroup(
    "\u{1F483}", "woman dancing",
    new Emoji("\u{1F483}\u{1F3FB}", "woman dancing: light skin tone"),
    new Emoji("\u{1F483}\u{1F3FC}", "woman dancing: medium-light skin tone"),
    new Emoji("\u{1F483}\u{1F3FD}", "woman dancing: medium skin tone"),
    new Emoji("\u{1F483}\u{1F3FE}", "woman dancing: medium-dark skin tone"),
    new Emoji("\u{1F483}\u{1F3FF}", "woman dancing: dark skin tone"));
export const manInSuitLevitating = new EmojiGroup(
    "\u{1F574}\u{FE0F}", "man in suit levitating",
    new Emoji("\u{1F574}\u{1F3FB}", "man in suit levitating: light skin tone"),
    new Emoji("\u{1F574}\u{1F3FC}", "man in suit levitating: medium-light skin tone"),
    new Emoji("\u{1F574}\u{1F3FD}", "man in suit levitating: medium skin tone"),
    new Emoji("\u{1F574}\u{1F3FE}", "man in suit levitating: medium-dark skin tone"),
    new Emoji("\u{1F574}\u{1F3FF}", "man in suit levitating: dark skin tone"));
export const personInSteamyRoom = new EmojiGroup(
    "\u{1F9D6}", "person in steamy room",
    new Emoji("\u{1F9D6}\u{1F3FB}", "person in steamy room: light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FC}", "person in steamy room: medium-light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FD}", "person in steamy room: medium skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FE}", "person in steamy room: medium-dark skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FF}", "person in steamy room: dark skin tone"));
export const manInSteamyRoom = new EmojiGroup(
    "\u{1F9D6}\u{200D}\u{2642}\u{FE0F}", "man in steamy room",
    new Emoji("\u{1F9D6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: medium-light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: medium skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: medium-dark skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: dark skin tone"));
export const womanInSteamyRoom = new EmojiGroup(
    "\u{1F9D6}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room",
    new Emoji("\u{1F9D6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: medium-light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: medium skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: medium-dark skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: dark skin tone"));
export const activity = [
    new EmojiGroup(
        "\u{1F486}", "person getting massage",
        personGettingMassage,
        manGettingMassage,
        womanGettingMassage),
    new EmojiGroup(
        "\u{1F487}", "person getting haircut",
        personGettingHaircut,
        manGettingHaircut,
        womanGettingHaircut),
    new EmojiGroup(
        "\u{1F6B6}", "person walking",
        personWalking,
        manWalking,
        womanWalking),
    new EmojiGroup(
        "\u{1F9CD}", "person standing",
        personStanding,
        manStanding,
        womanStanding),
    new EmojiGroup(
        "\u{1F9CE}", "person kneeling",
        personKneeling,
        manKneeling,
        womanKneeling),
    new EmojiGroup(
        "\u{1F9AF}", "probing cane",
        manWithProbingCane,
        womanWithProbingCane),
    new EmojiGroup(
        "\u{1F9BC}", "motorized wheelchair",
        manInMotorizedWheelchair,
        womanInMotorizedWheelchair),
    new EmojiGroup(
        "\u{1F9BD}", "manual wheelchair",
        manInManualWheelchair,
        womanInManualWheelchair),
    new EmojiGroup(
        "\u{1F3C3}", "person running",
        personRunning,
        manRunning,
        womanRunning),
    new EmojiGroup(
        "\u{1F57A}", "dancing",
        manDancing,
        womanDancing),
    manInSuitLevitating,
    new EmojiGroup(
        "\u{1F9D6}", "person in steamy room",
        personInSteamyRoom,
        manInSteamyRoom,
        womanInSteamyRoom),
];

export const personClimbing = new EmojiGroup(
    "\u{1F9D7}", "person climbing",
    new Emoji("\u{1F9D7}\u{1F3FB}", "person climbing: light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FC}", "person climbing: medium-light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FD}", "person climbing: medium skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FE}", "person climbing: medium-dark skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FF}", "person climbing: dark skin tone"));
export const manClimbing = new EmojiGroup(
    "\u{1F9D7}\u{200D}\u{2642}\u{FE0F}", "man climbing",
    new Emoji("\u{1F9D7}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man climbing: light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man climbing: medium-light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man climbing: medium skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man climbing: medium-dark skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man climbing: dark skin tone"));
export const womanClimbing = new EmojiGroup(
    "\u{1F9D7}\u{200D}\u{2640}\u{FE0F}", "woman climbing",
    new Emoji("\u{1F9D7}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman climbing: light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman climbing: medium-light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman climbing: medium skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman climbing: medium-dark skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman climbing: dark skin tone"));
export const personFencing = new Emoji("\u{1F93A}", "person fencing");
export const personRacingHorse = new EmojiGroup(
    "\u{1F3C7}", "horse racing",
    new Emoji("\u{1F3C7}\u{1F3FB}", "horse racing: light skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FC}", "horse racing: medium-light skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FD}", "horse racing: medium skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FE}", "horse racing: medium-dark skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FF}", "horse racing: dark skin tone"));
export const personSkiing = new Emoji("\u{26F7}\u{FE0F}", "skier");
export const personSnowboarding = new EmojiGroup(
    "\u{1F3C2}", "snowboarder",
    new Emoji("\u{1F3C2}\u{1F3FB}", "snowboarder: light skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FC}", "snowboarder: medium-light skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FD}", "snowboarder: medium skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FE}", "snowboarder: medium-dark skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FF}", "snowboarder: dark skin tone"));
export const personGolfing = new EmojiGroup(
    "\u{1F3CC}\u{FE0F}", "person golfing",
    new Emoji("\u{1F3CC}\u{1F3FB}", "person golfing: light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FC}", "person golfing: medium-light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FD}", "person golfing: medium skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FE}", "person golfing: medium-dark skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FF}", "person golfing: dark skin tone"));
export const manGolfing = new EmojiGroup(
    "\u{1F3CC}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man golfing",
    new Emoji("\u{1F3CC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man golfing: light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man golfing: medium-light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man golfing: medium skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man golfing: medium-dark skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man golfing: dark skin tone"));
export const womanGolfing = new EmojiGroup(
    "\u{1F3CC}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman golfing",
    new Emoji("\u{1F3CC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman golfing: light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman golfing: medium-light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman golfing: medium skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman golfing: medium-dark skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman golfing: dark skin tone"));
export const personBouncingBall = new EmojiGroup(
    "\u{26F9}\u{FE0F}", "person bouncing ball",
    new Emoji("\u{26F9}\u{1F3FB}", "person bouncing ball: light skin tone"),
    new Emoji("\u{26F9}\u{1F3FC}", "person bouncing ball: medium-light skin tone"),
    new Emoji("\u{26F9}\u{1F3FD}", "person bouncing ball: medium skin tone"),
    new Emoji("\u{26F9}\u{1F3FE}", "person bouncing ball: medium-dark skin tone"),
    new Emoji("\u{26F9}\u{1F3FF}", "person bouncing ball: dark skin tone"));
export const manBouncingBall = new EmojiGroup(
    "\u{26F9}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball",
    new Emoji("\u{26F9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: light skin tone"),
    new Emoji("\u{26F9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: medium-light skin tone"),
    new Emoji("\u{26F9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: medium skin tone"),
    new Emoji("\u{26F9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: medium-dark skin tone"),
    new Emoji("\u{26F9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: dark skin tone"));
export const womanBouncingBall = new EmojiGroup(
    "\u{26F9}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball",
    new Emoji("\u{26F9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: light skin tone"),
    new Emoji("\u{26F9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: medium-light skin tone"),
    new Emoji("\u{26F9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: medium skin tone"),
    new Emoji("\u{26F9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: medium-dark skin tone"),
    new Emoji("\u{26F9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: dark skin tone"));
export const personLiftingWeights = new EmojiGroup(
    "\u{1F3CB}\u{FE0F}", "person lifting weights",
    new Emoji("\u{1F3CB}\u{1F3FB}", "person lifting weights: light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FC}", "person lifting weights: medium-light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FD}", "person lifting weights: medium skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FE}", "person lifting weights: medium-dark skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FF}", "person lifting weights: dark skin tone"));
export const manLifitingWeights = new EmojiGroup(
    "\u{1F3CB}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man lifting weights",
    new Emoji("\u{1F3CB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: medium-light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: medium skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: medium-dark skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: dark skin tone"));
export const womanLiftingWeights = new EmojiGroup(
    "\u{1F3CB}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights",
    new Emoji("\u{1F3CB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: medium-light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: medium skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: medium-dark skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: dark skin tone"));
export const personBiking = new EmojiGroup(
    "\u{1F6B4}", "person biking",
    new Emoji("\u{1F6B4}\u{1F3FB}", "person biking: light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FC}", "person biking: medium-light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FD}", "person biking: medium skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FE}", "person biking: medium-dark skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FF}", "person biking: dark skin tone"));
export const manBiking = new EmojiGroup(
    "\u{1F6B4}\u{200D}\u{2642}\u{FE0F}", "man biking",
    new Emoji("\u{1F6B4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man biking: light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man biking: medium-light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man biking: medium skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man biking: medium-dark skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man biking: dark skin tone"));
export const womanBiking = new EmojiGroup(
    "\u{1F6B4}\u{200D}\u{2640}\u{FE0F}", "woman biking",
    new Emoji("\u{1F6B4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman biking: light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman biking: medium-light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman biking: medium skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman biking: medium-dark skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman biking: dark skin tone"));
export const personMountainBiking = new EmojiGroup(
    "\u{1F6B5}", "person mountain biking",
    new Emoji("\u{1F6B5}\u{1F3FB}", "person mountain biking: light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FC}", "person mountain biking: medium-light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FD}", "person mountain biking: medium skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FE}", "person mountain biking: medium-dark skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FF}", "person mountain biking: dark skin tone"));
export const manMountainBiking = new EmojiGroup(
    "\u{1F6B5}\u{200D}\u{2642}\u{FE0F}", "man mountain biking",
    new Emoji("\u{1F6B5}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: medium-light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: medium skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: medium-dark skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: dark skin tone"));
export const womanMountainBiking = new EmojiGroup(
    "\u{1F6B5}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking",
    new Emoji("\u{1F6B5}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: medium-light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: medium skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: medium-dark skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: dark skin tone"));
export const personCartwheeling = new EmojiGroup(
    "\u{1F938}", "person cartwheeling",
    new Emoji("\u{1F938}\u{1F3FB}", "person cartwheeling: light skin tone"),
    new Emoji("\u{1F938}\u{1F3FC}", "person cartwheeling: medium-light skin tone"),
    new Emoji("\u{1F938}\u{1F3FD}", "person cartwheeling: medium skin tone"),
    new Emoji("\u{1F938}\u{1F3FE}", "person cartwheeling: medium-dark skin tone"),
    new Emoji("\u{1F938}\u{1F3FF}", "person cartwheeling: dark skin tone"));
export const manCartwheeling = new EmojiGroup(
    "\u{1F938}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling",
    new Emoji("\u{1F938}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: light skin tone"),
    new Emoji("\u{1F938}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: medium-light skin tone"),
    new Emoji("\u{1F938}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: medium skin tone"),
    new Emoji("\u{1F938}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: medium-dark skin tone"),
    new Emoji("\u{1F938}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: dark skin tone"));
export const womanCartweeling = new EmojiGroup(
    "\u{1F938}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling",
    new Emoji("\u{1F938}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: light skin tone"),
    new Emoji("\u{1F938}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: medium-light skin tone"),
    new Emoji("\u{1F938}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: medium skin tone"),
    new Emoji("\u{1F938}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: medium-dark skin tone"),
    new Emoji("\u{1F938}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: dark skin tone"));
export const peopleWrestling = new Emoji("\u{1F93C}", "people wrestling");
export const menWrestling = new Emoji("\u{1F93C}\u{200D}\u{2642}\u{FE0F}", "men wrestling");
export const womenWrestling = new Emoji("\u{1F93C}\u{200D}\u{2640}\u{FE0F}", "women wrestling");
export const personPlayingWaterPolo = new EmojiGroup(
    "\u{1F93D}", "person playing water polo",
    new Emoji("\u{1F93D}\u{1F3FB}", "person playing water polo: light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FC}", "person playing water polo: medium-light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FD}", "person playing water polo: medium skin tone"),
    new Emoji("\u{1F93D}\u{1F3FE}", "person playing water polo: medium-dark skin tone"),
    new Emoji("\u{1F93D}\u{1F3FF}", "person playing water polo: dark skin tone"));
export const manPlayingWaterPolo = new EmojiGroup(
    "\u{1F93D}\u{200D}\u{2642}\u{FE0F}", "man playing water polo",
    new Emoji("\u{1F93D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: medium-light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: medium skin tone"),
    new Emoji("\u{1F93D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: medium-dark skin tone"),
    new Emoji("\u{1F93D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: dark skin tone"));
export const womanPlayingWaterPolo = new EmojiGroup(
    "\u{1F93D}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo",
    new Emoji("\u{1F93D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: medium-light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: medium skin tone"),
    new Emoji("\u{1F93D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: medium-dark skin tone"),
    new Emoji("\u{1F93D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: dark skin tone"));
export const personPlayingHandball = new EmojiGroup(
    "\u{1F93E}", "person playing handball",
    new Emoji("\u{1F93E}\u{1F3FB}", "person playing handball: light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FC}", "person playing handball: medium-light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FD}", "person playing handball: medium skin tone"),
    new Emoji("\u{1F93E}\u{1F3FE}", "person playing handball: medium-dark skin tone"),
    new Emoji("\u{1F93E}\u{1F3FF}", "person playing handball: dark skin tone"));
export const manPlayingHandball = new EmojiGroup(
    "\u{1F93E}\u{200D}\u{2642}\u{FE0F}", "man playing handball",
    new Emoji("\u{1F93E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man playing handball: light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man playing handball: medium-light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man playing handball: medium skin tone"),
    new Emoji("\u{1F93E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man playing handball: medium-dark skin tone"),
    new Emoji("\u{1F93E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man playing handball: dark skin tone"));
export const womanPlayingHandball = new EmojiGroup(
    "\u{1F93E}\u{200D}\u{2640}\u{FE0F}", "woman playing handball",
    new Emoji("\u{1F93E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: medium-light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: medium skin tone"),
    new Emoji("\u{1F93E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: medium-dark skin tone"),
    new Emoji("\u{1F93E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: dark skin tone"));
export const personJuggling = new EmojiGroup(
    "\u{1F939}", "person juggling",
    new Emoji("\u{1F939}\u{1F3FB}", "person juggling: light skin tone"),
    new Emoji("\u{1F939}\u{1F3FC}", "person juggling: medium-light skin tone"),
    new Emoji("\u{1F939}\u{1F3FD}", "person juggling: medium skin tone"),
    new Emoji("\u{1F939}\u{1F3FE}", "person juggling: medium-dark skin tone"),
    new Emoji("\u{1F939}\u{1F3FF}", "person juggling: dark skin tone"));
export const manJuggling = new EmojiGroup(
    "\u{1F939}\u{200D}\u{2642}\u{FE0F}", "man juggling",
    new Emoji("\u{1F939}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man juggling: light skin tone"),
    new Emoji("\u{1F939}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man juggling: medium-light skin tone"),
    new Emoji("\u{1F939}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man juggling: medium skin tone"),
    new Emoji("\u{1F939}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man juggling: medium-dark skin tone"),
    new Emoji("\u{1F939}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man juggling: dark skin tone"));
export const womanJuggling = new EmojiGroup(
    "\u{1F939}\u{200D}\u{2640}\u{FE0F}", "woman juggling",
    new Emoji("\u{1F939}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman juggling: light skin tone"),
    new Emoji("\u{1F939}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman juggling: medium-light skin tone"),
    new Emoji("\u{1F939}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman juggling: medium skin tone"),
    new Emoji("\u{1F939}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman juggling: medium-dark skin tone"),
    new Emoji("\u{1F939}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman juggling: dark skin tone"));
export const sports = [
    new EmojiGroup(
        "\u{1F9D7}", "person climbing",
        personClimbing,
        manClimbing,
        womanClimbing),
    personFencing,
    personRacingHorse,
    personSkiing,
    personSnowboarding,
    new EmojiGroup(
        "\u{1F3CC}\u{FE0F}", "person golfing",
        personGolfing,
        manGolfing,
        womanGolfing),
    new EmojiGroup(
        "\u{1F3C4}", "person surfing",
        personSurfing,
        manSurfing,
        womanSurfing),
    new EmojiGroup(
        "\u{1F6A3}", "person rowing boat",
        personRowing,
        manRowing,
        womanRowing),
    new EmojiGroup(
        "\u{1F3CA}", "person swimming",
        personSwimming,
        manSwimming,
        womanSwimming),
    new EmojiGroup(
        "\u{26F9}\u{FE0F}", "person bouncing ball",
        personBouncingBall,
        manBouncingBall,
        womanBouncingBall),
    new EmojiGroup(
        "\u{1F3CB}\u{FE0F}", "person lifting weights",
        personLiftingWeights,
        manLifitingWeights,
        womanLiftingWeights),
    new EmojiGroup(
        "\u{1F6B4}", "person biking",
        personBiking,
        manBiking,
        womanBiking),
    new EmojiGroup(
        "\u{1F6B5}", "person mountain biking",
        personMountainBiking,
        manMountainBiking,
        womanMountainBiking),
    new EmojiGroup(
        "\u{1F938}", "person cartwheeling",
        personCartwheeling,
        manCartwheeling,
        womanCartweeling),
    new EmojiGroup(
        "\u{1F93C}", "people wrestling",
        peopleWrestling,
        menWrestling,
        womenWrestling),
    new EmojiGroup(
        "\u{1F93D}", "person playing water polo",
        personPlayingWaterPolo,
        manPlayingWaterPolo,
        womanPlayingWaterPolo),
    new EmojiGroup(
        "\u{1F93E}", "person playing handball",
        personPlayingHandball,
        manPlayingHandball,
        womanPlayingHandball),
    new EmojiGroup(
        "\u{1F939}", "person juggling",
        personJuggling,
        manJuggling,
        womanJuggling)
];
export const personInLotusPosition = new EmojiGroup(
    "\u{1F9D8}", "person in lotus position",
    new Emoji("\u{1F9D8}\u{1F3FB}", "person in lotus position: light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FC}", "person in lotus position: medium-light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FD}", "person in lotus position: medium skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FE}", "person in lotus position: medium-dark skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FF}", "person in lotus position: dark skin tone"));
export const manInLotusPosition = new EmojiGroup(
    "\u{1F9D8}\u{200D}\u{2642}\u{FE0F}", "man in lotus position",
    new Emoji("\u{1F9D8}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: medium-light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: medium skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: medium-dark skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: dark skin tone"));
export const womanInLotusPosition = new EmojiGroup(
    "\u{1F9D8}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position",
    new Emoji("\u{1F9D8}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: medium-light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: medium skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: medium-dark skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: dark skin tone"));
export const personTakingBath = new EmojiGroup(
    "\u{1F6C0}", "person taking bath",
    new Emoji("\u{1F6C0}\u{1F3FB}", "person taking bath: light skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FC}", "person taking bath: medium-light skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FD}", "person taking bath: medium skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FE}", "person taking bath: medium-dark skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FF}", "person taking bath: dark skin tone"));
export const personInBed = new EmojiGroup(
    "\u{1F6CC}", "person in bed",
    new Emoji("\u{1F6CC}\u{1F3FB}", "person in bed: light skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FC}", "person in bed: medium-light skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FD}", "person in bed: medium skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FE}", "person in bed: medium-dark skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FF}", "person in bed: dark skin tone"));
export const personResting = [
    new EmojiGroup(
        personInLotusPosition.value, "in lotus position",
        personInLotusPosition,
        manInLotusPosition,
        womanInLotusPosition),
    personTakingBath,
    personInBed,
];
export const people = [
    {
        value: baby.value, desc: "baby", alts: [
            baby,
            babyAngel,
        ]
    },
    new EmojiGroup(
        "\u{1F9D2}", "child",
        child,
        boy,
        girl),
    {
        value: "\u{1F9D1}", desc: "person", alts: [
            new EmojiGroup(
                "\u{1F9D1}", "person",
                person,
                blondPerson,
                olderPerson,
                personFrowning,
                personPouting,
                personGesturingNo,
                personGesturingOK,
                personTippingHand,
                personRaisingHand,
                deafPerson,
                personBowing,
                personFacePalming,
                personShrugging,
                spy,
                guard,
                constructionWorker,
                personWearingTurban,
                superhero,
                supervillain,
                mage,
                fairy,
                vampire,
                merperson,
                elf,
                genie,
                zombie,
                personGettingMassage,
                personGettingHaircut,
                personWalking,
                personStanding,
                personKneeling,
                personRunning,
                personInSteamyRoom,
                personClimbing,
                personFencing,
                personRacingHorse,
                personSkiing,
                personSnowboarding,
                personGolfing,
                personSurfing,
                personRowing,
                personSwimming,
                personBouncingBall,
                personLiftingWeights,
                personBiking,
                personMountainBiking,
                personCartwheeling,
                peopleWrestling,
                personPlayingWaterPolo,
                personPlayingHandball,
                personJuggling,
                personInLotusPosition,
                personTakingBath,
                personInBed),
            new EmojiGroup(
                "\u{1F468}", "man",
                man,
                blondMan,
                redHairedMan,
                curlyHairedMan,
                whiteHairedMan,
                baldMan,
                beardedMan,
                oldMan,
                manFrowning,
                manPouting,
                manGesturingNo,
                manGesturingOK,
                manTippingHand,
                manRaisingHand,
                deafMan,
                manBowing,
                manFacePalming,
                manShrugging,
                manHealthWorker,
                manStudent,
                manTeacher,
                manJudge,
                manFarmer,
                manCook,
                manMechanic,
                manFactoryWorker,
                manOfficeWorker,
                manScientist,
                manTechnologist,
                manSinger,
                manArtist,
                manPilot,
                manAstronaut,
                manFirefighter,
                manPoliceOfficer,
                manSpy,
                manGuard,
                manConstructionWorker,
                prince,
                manWearingTurban,
                manWithChineseCap,
                manInTuxedo,
                santaClaus,
                manSuperhero,
                manSupervillain,
                manMage,
                manFairy,
                manVampire,
                merman,
                manElf,
                manGenie,
                manZombie,
                manGettingMassage,
                manGettingHaircut,
                manWalking,
                manStanding,
                manKneeling,
                manWithProbingCane,
                manInMotorizedWheelchair,
                manInManualWheelchair,
                manRunning,
                manDancing,
                manInSuitLevitating,
                manInSteamyRoom,
                manClimbing,
                manGolfing,
                manSurfing,
                manRowing,
                manSwimming,
                manBouncingBall,
                manLifitingWeights,
                manBiking,
                manMountainBiking,
                manCartwheeling,
                menWrestling,
                manPlayingWaterPolo,
                manPlayingHandball,
                manJuggling,
                manInLotusPosition),
            new EmojiGroup(
                "\u{1F469}", "woman",
                woman,
                blondWoman,
                redHairedWoman,
                curlyHairedWoman,
                whiteHairedWoman,
                baldWoman,
                oldWoman,
                womanFrowning,
                womanPouting,
                womanGesturingNo,
                womanGesturingOK,
                womanTippingHand,
                womanRaisingHand,
                deafWoman,
                womanBowing,
                womanFacePalming,
                womanShrugging,
                womanHealthWorker,
                womanStudent,
                womanTeacher,
                womanJudge,
                womanFarmer,
                womanCook,
                womanMechanic,
                womanFactoryWorker,
                womanOfficeWorker,
                womanScientist,
                womanTechnologist,
                womanSinger,
                womanArtist,
                womanPilot,
                womanAstronaut,
                womanFirefighter,
                womanPoliceOfficer,
                womanSpy,
                womanGuard,
                womanConstructionWorker,
                princess,
                womanWearingTurban,
                womanWithHeadscarf,
                brideWithVeil,
                pregnantWoman,
                breastFeeding,
                mrsClaus,
                womanSuperhero,
                womanSupervillain,
                womanMage,
                womanFairy,
                womanVampire,
                mermaid,
                womanElf,
                womanGenie,
                womanZombie,
                womanGettingMassage,
                womanGettingHaircut,
                womanWalking,
                womanStanding,
                womanKneeling,
                womanWithProbingCane,
                womanInMotorizedWheelchair,
                womanInManualWheelchair,
                womanRunning,
                womanDancing,
                womanInSteamyRoom,
                womanClimbing,
                womanGolfing,
                womanSurfing,
                womanRowing,
                womanSwimming,
                womanBouncingBall,
                womanLiftingWeights,
                womanBiking,
                womanMountainBiking,
                womanCartweeling,
                womenWrestling,
                womanPlayingWaterPolo,
                womanPlayingHandball,
                womanJuggling,
                womanInLotusPosition),
        ]
    },
    new EmojiGroup(
        "\u{1F9D3}", "older person",
        olderPerson,
        oldMan,
        oldWoman),
];

export const allPeople = [
    people,
    gestures,
    activity,
    roles,
    fantasy,
    sports,
    personResting,
    otherPeople,
];

export function randomPerson() {
    let value = allPeople.random().random(),
        lastValue = null;
    while (!!value.alts && lastValue !== value) {
        lastValue = value;
        if (value.value !== value.alts[0].value) {
            value = value.alts.random(value);
        }
        else {
            value = value.alts.random();
        }
    }
    return value;
}

export const ogre = new Emoji("\u{1F479}", "Ogre");
export const goblin = new Emoji("\u{1F47A}", "Goblin");
export const ghost = new Emoji("\u{1F47B}", "Ghost");
export const alien = new Emoji("\u{1F47D}", "Alien");
export const alienMonster = new Emoji("\u{1F47E}", "Alien Monster");
export const angryFaceWithHorns = new Emoji("\u{1F47F}", "Angry Face with Horns");
export const skull = new Emoji("\u{1F480}", "Skull");
export const pileOfPoo = new Emoji("\u{1F4A9}", "Pile of Poo");
export const grinningFace = new Emoji("\u{1F600}", "Grinning Face");
export const beamingFaceWithSmilingEyes = new Emoji("\u{1F601}", "Beaming Face with Smiling Eyes");
export const faceWithTearsOfJoy = new Emoji("\u{1F602}", "Face with Tears of Joy");
export const grinningFaceWithBigEyes = new Emoji("\u{1F603}", "Grinning Face with Big Eyes");
export const grinningFaceWithSmilingEyes = new Emoji("\u{1F604}", "Grinning Face with Smiling Eyes");
export const grinningFaceWithSweat = new Emoji("\u{1F605}", "Grinning Face with Sweat");
export const grinningSquitingFace = new Emoji("\u{1F606}", "Grinning Squinting Face");
export const smillingFaceWithHalo = new Emoji("\u{1F607}", "Smiling Face with Halo");
export const smilingFaceWithHorns = new Emoji("\u{1F608}", "Smiling Face with Horns");
export const winkingFace = new Emoji("\u{1F609}", "Winking Face");
export const smilingFaceWithSmilingEyes = new Emoji("\u{1F60A}", "Smiling Face with Smiling Eyes");
export const faceSavoringFood = new Emoji("\u{1F60B}", "Face Savoring Food");
export const relievedFace = new Emoji("\u{1F60C}", "Relieved Face");
export const smilingFaceWithHeartEyes = new Emoji("\u{1F60D}", "Smiling Face with Heart-Eyes");
export const smilingFaceWithSunglasses = new Emoji("\u{1F60E}", "Smiling Face with Sunglasses");
export const smirkingFace = new Emoji("\u{1F60F}", "Smirking Face");
export const neutralFace = new Emoji("\u{1F610}", "Neutral Face");
export const expressionlessFace = new Emoji("\u{1F611}", "Expressionless Face");
export const unamusedFace = new Emoji("\u{1F612}", "Unamused Face");
export const downcastFaceWithSweat = new Emoji("\u{1F613}", "Downcast Face with Sweat");
export const pensiveFace = new Emoji("\u{1F614}", "Pensive Face");
export const confusedFace = new Emoji("\u{1F615}", "Confused Face");
export const confoundedFace = new Emoji("\u{1F616}", "Confounded Face");
export const kissingFace = new Emoji("\u{1F617}", "Kissing Face");
export const faceBlowingAKiss = new Emoji("\u{1F618}", "Face Blowing a Kiss");
export const kissingFaceWithSmilingEyes = new Emoji("\u{1F619}", "Kissing Face with Smiling Eyes");
export const kissingFaceWithClosedEyes = new Emoji("\u{1F61A}", "Kissing Face with Closed Eyes");
export const faceWithTongue = new Emoji("\u{1F61B}", "Face with Tongue");
export const winkingFaceWithTongue = new Emoji("\u{1F61C}", "Winking Face with Tongue");
export const squintingFaceWithTongue = new Emoji("\u{1F61D}", "Squinting Face with Tongue");
export const disappointedFace = new Emoji("\u{1F61E}", "Disappointed Face");
export const worriedFace = new Emoji("\u{1F61F}", "Worried Face");
export const angryFace = new Emoji("\u{1F620}", "Angry Face");
export const poutingFace = new Emoji("\u{1F621}", "Pouting Face");
export const cryingFace = new Emoji("\u{1F622}", "Crying Face");
export const perseveringFace = new Emoji("\u{1F623}", "Persevering Face");
export const faceWithSteamFromNose = new Emoji("\u{1F624}", "Face with Steam From Nose");
export const sadButRelievedFace = new Emoji("\u{1F625}", "Sad but Relieved Face");
export const frowningFaceWithOpenMouth = new Emoji("\u{1F626}", "Frowning Face with Open Mouth");
export const anguishedFace = new Emoji("\u{1F627}", "Anguished Face");
export const fearfulFace = new Emoji("\u{1F628}", "Fearful Face");
export const wearyFace = new Emoji("\u{1F629}", "Weary Face");
export const sleepyFace = new Emoji("\u{1F62A}", "Sleepy Face");
export const tiredFace = new Emoji("\u{1F62B}", "Tired Face");
export const grimacingFace = new Emoji("\u{1F62C}", "Grimacing Face");
export const loudlyCryingFace = new Emoji("\u{1F62D}", "Loudly Crying Face");
export const faceWithOpenMouth = new Emoji("\u{1F62E}", "Face with Open Mouth");
export const hushedFace = new Emoji("\u{1F62F}", "Hushed Face");
export const anxiousFaceWithSweat = new Emoji("\u{1F630}", "Anxious Face with Sweat");
export const faceScreamingInFear = new Emoji("\u{1F631}", "Face Screaming in Fear");
export const astonishedFace = new Emoji("\u{1F632}", "Astonished Face");
export const flushedFace = new Emoji("\u{1F633}", "Flushed Face");
export const sleepingFace = new Emoji("\u{1F634}", "Sleeping Face");
export const dizzyFace = new Emoji("\u{1F635}", "Dizzy Face");
export const faceWithoutMouth = new Emoji("\u{1F636}", "Face Without Mouth");
export const faceWithMedicalMask = new Emoji("\u{1F637}", "Face with Medical Mask");
export const grinningCatWithSmilingEyes = new Emoji("\u{1F638}", "Grinning Cat with Smiling Eyes");
export const catWithTearsOfJoy = new Emoji("\u{1F639}", "Cat with Tears of Joy");
export const grinningCat = new Emoji("\u{1F63A}", "Grinning Cat");
export const smilingCatWithHeartEyes = new Emoji("\u{1F63B}", "Smiling Cat with Heart-Eyes");
export const catWithWrySmile = new Emoji("\u{1F63C}", "Cat with Wry Smile");
export const kissingCat = new Emoji("\u{1F63D}", "Kissing Cat");
export const poutingCat = new Emoji("\u{1F63E}", "Pouting Cat");
export const cryingCat = new Emoji("\u{1F63F}", "Crying Cat");
export const wearyCat = new Emoji("\u{1F640}", "Weary Cat");
export const slightlyFrowningFace = new Emoji("\u{1F641}", "Slightly Frowning Face");
export const slightlySmilingFace = new Emoji("\u{1F642}", "Slightly Smiling Face");
export const updisdeDownFace = new Emoji("\u{1F643}", "Upside-Down Face");
export const faceWithRollingEyes = new Emoji("\u{1F644}", "Face with Rolling Eyes");
export const seeNoEvilMonkey = new Emoji("\u{1F648}", "See-No-Evil Monkey");
export const hearNoEvilMonkey = new Emoji("\u{1F649}", "Hear-No-Evil Monkey");
export const speakNoEvilMonkey = new Emoji("\u{1F64A}", "Speak-No-Evil Monkey");
export const zipperMouthFace = new Emoji("\u{1F910}", "Zipper-Mouth Face");
export const moneyMouthFace = new Emoji("\u{1F911}", "Money-Mouth Face");
export const faceWithThermometer = new Emoji("\u{1F912}", "Face with Thermometer");
export const nerdFace = new Emoji("\u{1F913}", "Nerd Face");
export const thinkingFace = new Emoji("\u{1F914}", "Thinking Face");
export const faceWithHeadBandage = new Emoji("\u{1F915}", "Face with Head-Bandage");
export const robot = new Emoji("\u{1F916}", "Robot");
export const huggingFace = new Emoji("\u{1F917}", "Hugging Face");
export const cowboyHatFace = new Emoji("\u{1F920}", "Cowboy Hat Face");
export const clownFace = new Emoji("\u{1F921}", "Clown Face");
export const nauseatedFace = new Emoji("\u{1F922}", "Nauseated Face");
export const rollingOnTheFloorLaughing = new Emoji("\u{1F923}", "Rolling on the Floor Laughing");
export const droolingFace = new Emoji("\u{1F924}", "Drooling Face");
export const lyingFace = new Emoji("\u{1F925}", "Lying Face");
export const sneezingFace = new Emoji("\u{1F927}", "Sneezing Face");
export const faceWithRaisedEyebrow = new Emoji("\u{1F928}", "Face with Raised Eyebrow");
export const starStruck = new Emoji("\u{1F929}", "Star-Struck");
export const zanyFace = new Emoji("\u{1F92A}", "Zany Face");
export const shushingFace = new Emoji("\u{1F92B}", "Shushing Face");
export const faceWithSymbolsOnMouth = new Emoji("\u{1F92C}", "Face with Symbols on Mouth");
export const faceWithHandOverMouth = new Emoji("\u{1F92D}", "Face with Hand Over Mouth");
export const faceVomitting = new Emoji("\u{1F92E}", "Face Vomiting");
export const explodingHead = new Emoji("\u{1F92F}", "Exploding Head");
export const smilingFaceWithHearts = new Emoji("\u{1F970}", "Smiling Face with Hearts");
export const yawningFace = new Emoji("\u{1F971}", "Yawning Face");
export const smilingFaceWithTear = new Emoji("\u{1F972}", "Smiling Face with Tear");
export const partyingFace = new Emoji("\u{1F973}", "Partying Face");
export const woozyFace = new Emoji("\u{1F974}", "Woozy Face");
export const hotFace = new Emoji("\u{1F975}", "Hot Face");
export const coldFace = new Emoji("\u{1F976}", "Cold Face");
export const disguisedFace = new Emoji("\u{1F978}", "Disguised Face");
export const pleadingFace = new Emoji("\u{1F97A}", "Pleading Face");
export const faceWithMonocle = new Emoji("\u{1F9D0}", "Face with Monocle");
export const skullAndCrossbones = new Emoji("\u{2620}\u{FE0F}", "Skull and Crossbones");
export const frowningFace = new Emoji("\u{2639}\u{FE0F}", "Frowning Face");
export const fmilingFace = new Emoji("\u{263A}\u{FE0F}", "Smiling Face");
export const speakingHead = new Emoji("\u{1F5E3}\u{FE0F}", "Speaking Head");
export const bust = new Emoji("\u{1F464}", "Bust in Silhouette");
export const faces = [
    ogre,
    goblin,
    ghost,
    alien,
    alienMonster,
    angryFaceWithHorns,
    skull,
    pileOfPoo,
    grinningFace,
    beamingFaceWithSmilingEyes,
    faceWithTearsOfJoy,
    grinningFaceWithBigEyes,
    grinningFaceWithSmilingEyes,
    grinningFaceWithSweat,
    grinningSquitingFace,
    smillingFaceWithHalo,
    smilingFaceWithHorns,
    winkingFace,
    smilingFaceWithSmilingEyes,
    faceSavoringFood,
    relievedFace,
    smilingFaceWithHeartEyes,
    smilingFaceWithSunglasses,
    smirkingFace,
    neutralFace,
    expressionlessFace,
    unamusedFace,
    downcastFaceWithSweat,
    pensiveFace,
    confusedFace,
    confoundedFace,
    kissingFace,
    faceBlowingAKiss,
    kissingFaceWithSmilingEyes,
    kissingFaceWithClosedEyes,
    faceWithTongue,
    winkingFaceWithTongue,
    squintingFaceWithTongue,
    disappointedFace,
    worriedFace,
    angryFace,
    poutingFace,
    cryingFace,
    perseveringFace,
    faceWithSteamFromNose,
    sadButRelievedFace,
    frowningFaceWithOpenMouth,
    anguishedFace,
    fearfulFace,
    wearyFace,
    sleepyFace,
    tiredFace,
    grimacingFace,
    loudlyCryingFace,
    faceWithOpenMouth,
    hushedFace,
    anxiousFaceWithSweat,
    faceScreamingInFear,
    astonishedFace,
    flushedFace,
    sleepingFace,
    dizzyFace,
    faceWithoutMouth,
    faceWithMedicalMask,
    grinningCatWithSmilingEyes,
    catWithTearsOfJoy,
    grinningCat,
    smilingCatWithHeartEyes,
    catWithWrySmile,
    kissingCat,
    poutingCat,
    cryingCat,
    wearyCat,
    slightlyFrowningFace,
    slightlySmilingFace,
    updisdeDownFace,
    faceWithRollingEyes,
    seeNoEvilMonkey,
    hearNoEvilMonkey,
    speakNoEvilMonkey,
    zipperMouthFace,
    moneyMouthFace,
    faceWithThermometer,
    nerdFace,
    thinkingFace,
    faceWithHeadBandage,
    robot,
    huggingFace,
    cowboyHatFace,
    clownFace,
    nauseatedFace,
    rollingOnTheFloorLaughing,
    droolingFace,
    lyingFace,
    sneezingFace,
    faceWithRaisedEyebrow,
    starStruck,
    zanyFace,
    shushingFace,
    faceWithSymbolsOnMouth,
    faceWithHandOverMouth,
    faceVomitting,
    explodingHead,
    smilingFaceWithHearts,
    yawningFace,
    smilingFaceWithTear,
    partyingFace,
    woozyFace,
    hotFace,
    coldFace,
    disguisedFace,
    pleadingFace,
    faceWithMonocle,
    skullAndCrossbones,
    frowningFace,
    fmilingFace,
    speakingHead,
    bust,
];

export const kissMark = new Emoji("\u{1F48B}", "Kiss Mark");
export const loveLetter = new Emoji("\u{1F48C}", "Love Letter");
export const beatingHeart = new Emoji("\u{1F493}", "Beating Heart");
export const brokenHeart = new Emoji("\u{1F494}", "Broken Heart");
export const twoHearts = new Emoji("\u{1F495}", "Two Hearts");
export const sparklingHeart = new Emoji("\u{1F496}", "Sparkling Heart");
export const growingHeart = new Emoji("\u{1F497}", "Growing Heart");
export const heartWithArrow = new Emoji("\u{1F498}", "Heart with Arrow");
export const blueHeart = new Emoji("\u{1F499}", "Blue Heart");
export const greenHeart = new Emoji("\u{1F49A}", "Green Heart");
export const yellowHeart = new Emoji("\u{1F49B}", "Yellow Heart");
export const purpleHeart = new Emoji("\u{1F49C}", "Purple Heart");
export const heartWithRibbon = new Emoji("\u{1F49D}", "Heart with Ribbon");
export const revolvingHearts = new Emoji("\u{1F49E}", "Revolving Hearts");
export const heartDecoration = new Emoji("\u{1F49F}", "Heart Decoration");
export const blackHeart = new Emoji("\u{1F5A4}", "Black Heart");
export const whiteHeart = new Emoji("\u{1F90D}", "White Heart");
export const brownHeart = new Emoji("\u{1F90E}", "Brown Heart");
export const orangeHeart = new Emoji("\u{1F9E1}", "Orange Heart");
export const heartExclamation = new Emoji("\u{2763}\u{FE0F}", "Heart Exclamation");
export const redHeart = new Emoji("\u{2764}\u{FE0F}", "Red Heart");
export const love = [
    kissMark,
    loveLetter,
    beatingHeart,
    brokenHeart,
    twoHearts,
    sparklingHeart,
    growingHeart,
    heartWithArrow,
    blueHeart,
    greenHeart,
    yellowHeart,
    purpleHeart,
    heartWithRibbon,
    revolvingHearts,
    heartDecoration,
    blackHeart,
    whiteHeart,
    brownHeart,
    orangeHeart,
    heartExclamation,
    redHeart,
];

export const cartoon = [
    new Emoji("\u{1F4A2}", "Anger Symbol"),
    new Emoji("\u{1F4A3}", "Bomb"),
    new Emoji("\u{1F4A4}", "Zzz"),
    new Emoji("\u{1F4A5}", "Collision"),
    new Emoji("\u{1F4A6}", "Sweat Droplets"),
    new Emoji("\u{1F4A8}", "Dashing Away"),
    new Emoji("\u{1F4AB}", "Dizzy"),
    new Emoji("\u{1F4AC}", "Speech Balloon"),
    new Emoji("\u{1F4AD}", "Thought Balloon"),
    new Emoji("\u{1F4AF}", "Hundred Points"),
    new Emoji("\u{1F573}\u{FE0F}", "Hole"),
    new Emoji("\u{1F5E8}\u{FE0F}", "Left Speech Bubble"),
    new Emoji("\u{1F5EF}\u{FE0F}", "Right Anger Bubble"),
];

export const hands = [
    new Emoji("\u{1F446}", "Backhand Index Pointing Up"),
    new Emoji("\u{1F447}", "Backhand Index Pointing Down"),
    new Emoji("\u{1F448}", "Backhand Index Pointing Left"),
    new Emoji("\u{1F449}", "Backhand Index Pointing Right"),
    new Emoji("\u{1F44A}", "Oncoming Fist"),
    new Emoji("\u{1F44B}", "Waving Hand"),
    new Emoji("\u{1F44C}", "OK Hand"),
    new Emoji("\u{1F44D}", "Thumbs Up"),
    new Emoji("\u{1F44E}", "Thumbs Down"),
    new Emoji("\u{1F44F}", "Clapping Hands"),
    new Emoji("\u{1F450}", "Open Hands"),
    new Emoji("\u{1F485}", "Nail Polish"),
    new Emoji("\u{1F590}\u{FE0F}", "Hand with Fingers Splayed"),
    new Emoji("\u{1F595}", "Middle Finger"),
    new Emoji("\u{1F596}", "Vulcan Salute"),
    new Emoji("\u{1F64C}", "Raising Hands"),
    new Emoji("\u{1F64F}", "Folded Hands"),
    new Emoji("\u{1F90C}", "Pinched Fingers"),
    new Emoji("\u{1F90F}", "Pinching Hand"),
    new Emoji("\u{1F918}", "Sign of the Horns"),
    new Emoji("\u{1F919}", "Call Me Hand"),
    new Emoji("\u{1F91A}", "Raised Back of Hand"),
    new Emoji("\u{1F91B}", "Left-Facing Fist"),
    new Emoji("\u{1F91C}", "Right-Facing Fist"),
    new Emoji("\u{1F91D}", "Handshake"),
    new Emoji("\u{1F91E}", "Crossed Fingers"),
    new Emoji("\u{1F91F}", "Love-You Gesture"),
    new Emoji("\u{1F932}", "Palms Up Together"),
    new Emoji("\u{261D}\u{FE0F}", "Index Pointing Up"),
    new Emoji("\u{270A}", "Raised Fist"),
    new Emoji("\u{270B}", "Raised Hand"),
    new Emoji("\u{270C}\u{FE0F}", "Victory Hand"),
    new Emoji("\u{270D}\u{FE0F}", "Writing Hand"),
];
export const bodyParts = [
    new Emoji("\u{1F440}", "Eyes"),
    new Emoji("\u{1F441}\u{FE0F}", "Eye"),
    new Emoji("\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", "Eye in Speech Bubble"),
    new Emoji("\u{1F442}", "Ear"),
    new Emoji("\u{1F443}", "Nose"),
    new Emoji("\u{1F444}", "Mouth"),
    new Emoji("\u{1F445}", "Tongue"),
    new Emoji("\u{1F4AA}", "Flexed Biceps"),
    new Emoji("\u{1F933}", "Selfie"),
    new Emoji("\u{1F9B4}", "Bone"),
    new Emoji("\u{1F9B5}", "Leg"),
    new Emoji("\u{1F9B6}", "Foot"),
    new Emoji("\u{1F9B7}", "Tooth"),
    new Emoji("\u{1F9BB}", "Ear with Hearing Aid"),
    new Emoji("\u{1F9BE}", "Mechanical Arm"),
    new Emoji("\u{1F9BF}", "Mechanical Leg"),
    new Emoji("\u{1F9E0}", "Brain"),
    new Emoji("\u{1FAC0}", "Anatomical Heart"),
    new Emoji("\u{1FAC1}", "Lungs"),
];
export const sex = [
    new Emoji("\u{200D}\u{2640}\u{FE0F}", "Female"),
    new Emoji("\u{200D}\u{2642}\u{FE0F}", "Male"),
];
export const skinTones = [
    new Emoji("\u{1F3FB}", "Light Skin Tone"),
    new Emoji("\u{1F3FC}", "Medium-Light Skin Tone"),
    new Emoji("\u{1F3FD}", "Medium Skin Tone"),
    new Emoji("\u{1F3FE}", "Medium-Dark Skin Tone"),
    new Emoji("\u{1F3FF}", "Dark Skin Tone"),
];
export const hairColors = [
    new Emoji("\u{1F9B0}", "Red Hair"),
    new Emoji("\u{1F9B1}", "Curly Hair"),
    new Emoji("\u{1F9B3}", "White Hair"),
    new Emoji("\u{1F9B2}", "Bald"),
];
export const animals = [
    new Emoji("\u{1F400}", "Rat"),
    new Emoji("\u{1F401}", "Mouse"),
    new Emoji("\u{1F402}", "Ox"),
    new Emoji("\u{1F403}", "Water Buffalo"),
    new Emoji("\u{1F404}", "Cow"),
    new Emoji("\u{1F405}", "Tiger"),
    new Emoji("\u{1F406}", "Leopard"),
    new Emoji("\u{1F407}", "Rabbit"),
    new Emoji("\u{1F408}", "Cat"),
    new Emoji("\u{1F408}\u{200D}\u{2B1B}", "Black Cat"),
    new Emoji("\u{1F409}", "Dragon"),
    new Emoji("\u{1F40A}", "Crocodile"),
    new Emoji("\u{1F40B}", "Whale"),
    new Emoji("\u{1F40C}", "Snail"),
    new Emoji("\u{1F40D}", "Snake"),
    new Emoji("\u{1F40E}", "Horse"),
    new Emoji("\u{1F40F}", "Ram"),
    new Emoji("\u{1F410}", "Goat"),
    new Emoji("\u{1F411}", "Ewe"),
    new Emoji("\u{1F412}", "Monkey"),
    new Emoji("\u{1F413}", "Rooster"),
    new Emoji("\u{1F414}", "Chicken"),
    new Emoji("\u{1F415}", "Dog"),
    new Emoji("\u{1F415}\u{200D}\u{1F9BA}", "Service Dog"),
    new Emoji("\u{1F416}", "Pig"),
    new Emoji("\u{1F417}", "Boar"),
    new Emoji("\u{1F418}", "Elephant"),
    new Emoji("\u{1F419}", "Octopus"),
    new Emoji("\u{1F41A}", "Spiral Shell"),
    new Emoji("\u{1F41B}", "Bug"),
    new Emoji("\u{1F41C}", "Ant"),
    new Emoji("\u{1F41D}", "Honeybee"),
    new Emoji("\u{1F41E}", "Lady Beetle"),
    new Emoji("\u{1F41F}", "Fish"),
    new Emoji("\u{1F420}", "Tropical Fish"),
    new Emoji("\u{1F421}", "Blowfish"),
    new Emoji("\u{1F422}", "Turtle"),
    new Emoji("\u{1F423}", "Hatching Chick"),
    new Emoji("\u{1F424}", "Baby Chick"),
    new Emoji("\u{1F425}", "Front-Facing Baby Chick"),
    new Emoji("\u{1F426}", "Bird"),
    new Emoji("\u{1F427}", "Penguin"),
    new Emoji("\u{1F428}", "Koala"),
    new Emoji("\u{1F429}", "Poodle"),
    new Emoji("\u{1F42A}", "Camel"),
    new Emoji("\u{1F42B}", "Two-Hump Camel"),
    new Emoji("\u{1F42C}", "Dolphin"),
    new Emoji("\u{1F42D}", "Mouse Face"),
    new Emoji("\u{1F42E}", "Cow Face"),
    new Emoji("\u{1F42F}", "Tiger Face"),
    new Emoji("\u{1F430}", "Rabbit Face"),
    new Emoji("\u{1F431}", "Cat Face"),
    new Emoji("\u{1F432}", "Dragon Face"),
    new Emoji("\u{1F433}", "Spouting Whale"),
    new Emoji("\u{1F434}", "Horse Face"),
    new Emoji("\u{1F435}", "Monkey Face"),
    new Emoji("\u{1F436}", "Dog Face"),
    new Emoji("\u{1F437}", "Pig Face"),
    new Emoji("\u{1F438}", "Frog"),
    new Emoji("\u{1F439}", "Hamster"),
    new Emoji("\u{1F43A}", "Wolf"),
    new Emoji("\u{1F43B}", "Bear"),
    new Emoji("\u{1F43B}\u{200D}\u{2744}\u{FE0F}", "Polar Bear"),
    new Emoji("\u{1F43C}", "Panda"),
    new Emoji("\u{1F43D}", "Pig Nose"),
    new Emoji("\u{1F43E}", "Paw Prints"),
    new Emoji("\u{1F43F}\u{FE0F}", "Chipmunk"),
    new Emoji("\u{1F54A}\u{FE0F}", "Dove"),
    new Emoji("\u{1F577}\u{FE0F}", "Spider"),
    new Emoji("\u{1F578}\u{FE0F}", "Spider Web"),
    new Emoji("\u{1F981}", "Lion"),
    new Emoji("\u{1F982}", "Scorpion"),
    new Emoji("\u{1F983}", "Turkey"),
    new Emoji("\u{1F984}", "Unicorn"),
    new Emoji("\u{1F985}", "Eagle"),
    new Emoji("\u{1F986}", "Duck"),
    new Emoji("\u{1F987}", "Bat"),
    new Emoji("\u{1F988}", "Shark"),
    new Emoji("\u{1F989}", "Owl"),
    new Emoji("\u{1F98A}", "Fox"),
    new Emoji("\u{1F98B}", "Butterfly"),
    new Emoji("\u{1F98C}", "Deer"),
    new Emoji("\u{1F98D}", "Gorilla"),
    new Emoji("\u{1F98E}", "Lizard"),
    new Emoji("\u{1F98F}", "Rhinoceros"),
    new Emoji("\u{1F992}", "Giraffe"),
    new Emoji("\u{1F993}", "Zebra"),
    new Emoji("\u{1F994}", "Hedgehog"),
    new Emoji("\u{1F995}", "Sauropod"),
    new Emoji("\u{1F996}", "T-Rex"),
    new Emoji("\u{1F997}", "Cricket"),
    new Emoji("\u{1F998}", "Kangaroo"),
    new Emoji("\u{1F999}", "Llama"),
    new Emoji("\u{1F99A}", "Peacock"),
    new Emoji("\u{1F99B}", "Hippopotamus"),
    new Emoji("\u{1F99C}", "Parrot"),
    new Emoji("\u{1F99D}", "Raccoon"),
    new Emoji("\u{1F99F}", "Mosquito"),
    new Emoji("\u{1F9A0}", "Microbe"),
    new Emoji("\u{1F9A1}", "Badger"),
    new Emoji("\u{1F9A2}", "Swan"),
    new Emoji("\u{1F9A3}", "Mammoth"),
    new Emoji("\u{1F9A4}", "Dodo"),
    new Emoji("\u{1F9A5}", "Sloth"),
    new Emoji("\u{1F9A6}", "Otter"),
    new Emoji("\u{1F9A7}", "Orangutan"),
    new Emoji("\u{1F9A8}", "Skunk"),
    new Emoji("\u{1F9A9}", "Flamingo"),
    new Emoji("\u{1F9AB}", "Beaver"),
    new Emoji("\u{1F9AC}", "Bison"),
    new Emoji("\u{1F9AD}", "Seal"),
    new Emoji("\u{1F9AE}", "Guide Dog"),
    new Emoji("\u{1FAB0}", "Fly"),
    new Emoji("\u{1FAB1}", "Worm"),
    new Emoji("\u{1FAB2}", "Beetle"),
    new Emoji("\u{1FAB3}", "Cockroach"),
    new Emoji("\u{1FAB6}", "Feather"),
];
export const plants = [
    new Emoji("\u{1F331}", "Seedling"),
    new Emoji("\u{1F332}", "Evergreen Tree"),
    new Emoji("\u{1F333}", "Deciduous Tree"),
    new Emoji("\u{1F334}", "Palm Tree"),
    new Emoji("\u{1F335}", "Cactus"),
    new Emoji("\u{1F337}", "Tulip"),
    new Emoji("\u{1F338}", "Cherry Blossom"),
    new Emoji("\u{1F339}", "Rose"),
    new Emoji("\u{1F33A}", "Hibiscus"),
    new Emoji("\u{1F33B}", "Sunflower"),
    new Emoji("\u{1F33C}", "Blossom"),
    new Emoji("\u{1F33E}", "Sheaf of Rice"),
    new Emoji("\u{1F33F}", "Herb"),
    new Emoji("\u{1F340}", "Four Leaf Clover"),
    new Emoji("\u{1F341}", "Maple Leaf"),
    new Emoji("\u{1F342}", "Fallen Leaf"),
    new Emoji("\u{1F343}", "Leaf Fluttering in Wind"),
    new Emoji("\u{1F3F5}\u{FE0F}", "Rosette"),
    new Emoji("\u{1F490}", "Bouquet"),
    new Emoji("\u{1F4AE}", "White Flower"),
    new Emoji("\u{1F940}", "Wilted Flower"),
    new Emoji("\u{1FAB4}", "Potted Plant"),
    new Emoji("\u{2618}\u{FE0F}", "Shamrock"),
];
export const food = [
    new Emoji("\u{1F32D}", "Hot Dog"),
    new Emoji("\u{1F32E}", "Taco"),
    new Emoji("\u{1F32F}", "Burrito"),
    new Emoji("\u{1F330}", "Chestnut"),
    new Emoji("\u{1F336}\u{FE0F}", "Hot Pepper"),
    new Emoji("\u{1F33D}", "Ear of Corn"),
    new Emoji("\u{1F344}", "Mushroom"),
    new Emoji("\u{1F345}", "Tomato"),
    new Emoji("\u{1F346}", "Eggplant"),
    new Emoji("\u{1F347}", "Grapes"),
    new Emoji("\u{1F348}", "Melon"),
    new Emoji("\u{1F349}", "Watermelon"),
    new Emoji("\u{1F34A}", "Tangerine"),
    new Emoji("\u{1F34B}", "Lemon"),
    new Emoji("\u{1F34C}", "Banana"),
    new Emoji("\u{1F34D}", "Pineapple"),
    new Emoji("\u{1F34E}", "Red Apple"),
    new Emoji("\u{1F34F}", "Green Apple"),
    new Emoji("\u{1F350}", "Pear"),
    new Emoji("\u{1F351}", "Peach"),
    new Emoji("\u{1F352}", "Cherries"),
    new Emoji("\u{1F353}", "Strawberry"),
    new Emoji("\u{1F354}", "Hamburger"),
    new Emoji("\u{1F355}", "Pizza"),
    new Emoji("\u{1F356}", "Meat on Bone"),
    new Emoji("\u{1F357}", "Poultry Leg"),
    new Emoji("\u{1F358}", "Rice Cracker"),
    new Emoji("\u{1F359}", "Rice Ball"),
    new Emoji("\u{1F35A}", "Cooked Rice"),
    new Emoji("\u{1F35B}", "Curry Rice"),
    new Emoji("\u{1F35C}", "Steaming Bowl"),
    new Emoji("\u{1F35D}", "Spaghetti"),
    new Emoji("\u{1F35E}", "Bread"),
    new Emoji("\u{1F35F}", "French Fries"),
    new Emoji("\u{1F360}", "Roasted Sweet Potato"),
    new Emoji("\u{1F361}", "Dango"),
    new Emoji("\u{1F362}", "Oden"),
    new Emoji("\u{1F363}", "Sushi"),
    new Emoji("\u{1F364}", "Fried Shrimp"),
    new Emoji("\u{1F365}", "Fish Cake with Swirl"),
    new Emoji("\u{1F371}", "Bento Box"),
    new Emoji("\u{1F372}", "Pot of Food"),
    new Emoji("\u{1F373}", "Cooking"),
    new Emoji("\u{1F37F}", "Popcorn"),
    new Emoji("\u{1F950}", "Croissant"),
    new Emoji("\u{1F951}", "Avocado"),
    new Emoji("\u{1F952}", "Cucumber"),
    new Emoji("\u{1F953}", "Bacon"),
    new Emoji("\u{1F954}", "Potato"),
    new Emoji("\u{1F955}", "Carrot"),
    new Emoji("\u{1F956}", "Baguette Bread"),
    new Emoji("\u{1F957}", "Green Salad"),
    new Emoji("\u{1F958}", "Shallow Pan of Food"),
    new Emoji("\u{1F959}", "Stuffed Flatbread"),
    new Emoji("\u{1F95A}", "Egg"),
    new Emoji("\u{1F95C}", "Peanuts"),
    new Emoji("\u{1F95D}", "Kiwi Fruit"),
    new Emoji("\u{1F95E}", "Pancakes"),
    new Emoji("\u{1F95F}", "Dumpling"),
    new Emoji("\u{1F960}", "Fortune Cookie"),
    new Emoji("\u{1F961}", "Takeout Box"),
    new Emoji("\u{1F963}", "Bowl with Spoon"),
    new Emoji("\u{1F965}", "Coconut"),
    new Emoji("\u{1F966}", "Broccoli"),
    new Emoji("\u{1F968}", "Pretzel"),
    new Emoji("\u{1F969}", "Cut of Meat"),
    new Emoji("\u{1F96A}", "Sandwich"),
    new Emoji("\u{1F96B}", "Canned Food"),
    new Emoji("\u{1F96C}", "Leafy Green"),
    new Emoji("\u{1F96D}", "Mango"),
    new Emoji("\u{1F96E}", "Moon Cake"),
    new Emoji("\u{1F96F}", "Bagel"),
    new Emoji("\u{1F980}", "Crab"),
    new Emoji("\u{1F990}", "Shrimp"),
    new Emoji("\u{1F991}", "Squid"),
    new Emoji("\u{1F99E}", "Lobster"),
    new Emoji("\u{1F9AA}", "Oyster"),
    new Emoji("\u{1F9C0}", "Cheese Wedge"),
    new Emoji("\u{1F9C2}", "Salt"),
    new Emoji("\u{1F9C4}", "Garlic"),
    new Emoji("\u{1F9C5}", "Onion"),
    new Emoji("\u{1F9C6}", "Falafel"),
    new Emoji("\u{1F9C7}", "Waffle"),
    new Emoji("\u{1F9C8}", "Butter"),
    new Emoji("\u{1FAD0}", "Blueberries"),
    new Emoji("\u{1FAD1}", "Bell Pepper"),
    new Emoji("\u{1FAD2}", "Olive"),
    new Emoji("\u{1FAD3}", "Flatbread"),
    new Emoji("\u{1FAD4}", "Tamale"),
    new Emoji("\u{1FAD5}", "Fondue"),
];
export const sweets = [
    new Emoji("\u{1F366}", "Soft Ice Cream"),
    new Emoji("\u{1F367}", "Shaved Ice"),
    new Emoji("\u{1F368}", "Ice Cream"),
    new Emoji("\u{1F369}", "Doughnut"),
    new Emoji("\u{1F36A}", "Cookie"),
    new Emoji("\u{1F36B}", "Chocolate Bar"),
    new Emoji("\u{1F36C}", "Candy"),
    new Emoji("\u{1F36D}", "Lollipop"),
    new Emoji("\u{1F36E}", "Custard"),
    new Emoji("\u{1F36F}", "Honey Pot"),
    new Emoji("\u{1F370}", "Shortcake"),
    new Emoji("\u{1F382}", "Birthday Cake"),
    new Emoji("\u{1F967}", "Pie"),
    new Emoji("\u{1F9C1}", "Cupcake"),
];
export const drinks = [
    new Emoji("\u{1F375}", "Teacup Without Handle"),
    new Emoji("\u{1F376}", "Sake"),
    new Emoji("\u{1F377}", "Wine Glass"),
    new Emoji("\u{1F378}", "Cocktail Glass"),
    new Emoji("\u{1F379}", "Tropical Drink"),
    new Emoji("\u{1F37A}", "Beer Mug"),
    new Emoji("\u{1F37B}", "Clinking Beer Mugs"),
    new Emoji("\u{1F37C}", "Baby Bottle"),
    new Emoji("\u{1F37E}", "Bottle with Popping Cork"),
    new Emoji("\u{1F942}", "Clinking Glasses"),
    new Emoji("\u{1F943}", "Tumbler Glass"),
    new Emoji("\u{1F95B}", "Glass of Milk"),
    new Emoji("\u{1F964}", "Cup with Straw"),
    new Emoji("\u{1F9C3}", "Beverage Box"),
    new Emoji("\u{1F9C9}", "Mate"),
    new Emoji("\u{1F9CA}", "Ice"),
    new Emoji("\u{1F9CB}", "Bubble Tea"),
    new Emoji("\u{1FAD6}", "Teapot"),
    new Emoji("\u{2615}", "Hot Beverage"),
];
export const utensils = [
    new Emoji("\u{1F374}", "Fork and Knife"),
    new Emoji("\u{1F37D}\u{FE0F}", "Fork and Knife with Plate"),
    new Emoji("\u{1F3FA}", "Amphora"),
    new Emoji("\u{1F52A}", "Kitchen Knife"),
    new Emoji("\u{1F944}", "Spoon"),
    new Emoji("\u{1F962}", "Chopsticks"),
];
export const nations = [
    new Emoji("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island"),
    new Emoji("\u{1F1E6}\u{1F1E9}", "Flag: Andorra"),
    new Emoji("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates"),
    new Emoji("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan"),
    new Emoji("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda"),
    new Emoji("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla"),
    new Emoji("\u{1F1E6}\u{1F1F1}", "Flag: Albania"),
    new Emoji("\u{1F1E6}\u{1F1F2}", "Flag: Armenia"),
    new Emoji("\u{1F1E6}\u{1F1F4}", "Flag: Angola"),
    new Emoji("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica"),
    new Emoji("\u{1F1E6}\u{1F1F7}", "Flag: Argentina"),
    new Emoji("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa"),
    new Emoji("\u{1F1E6}\u{1F1F9}", "Flag: Austria"),
    new Emoji("\u{1F1E6}\u{1F1FA}", "Flag: Australia"),
    new Emoji("\u{1F1E6}\u{1F1FC}", "Flag: Aruba"),
    new Emoji("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands"),
    new Emoji("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan"),
    new Emoji("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina"),
    new Emoji("\u{1F1E7}\u{1F1E7}", "Flag: Barbados"),
    new Emoji("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh"),
    new Emoji("\u{1F1E7}\u{1F1EA}", "Flag: Belgium"),
    new Emoji("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso"),
    new Emoji("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria"),
    new Emoji("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain"),
    new Emoji("\u{1F1E7}\u{1F1EE}", "Flag: Burundi"),
    new Emoji("\u{1F1E7}\u{1F1EF}", "Flag: Benin"),
    new Emoji("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy"),
    new Emoji("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda"),
    new Emoji("\u{1F1E7}\u{1F1F3}", "Flag: Brunei"),
    new Emoji("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia"),
    new Emoji("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands"),
    new Emoji("\u{1F1E7}\u{1F1F7}", "Flag: Brazil"),
    new Emoji("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas"),
    new Emoji("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan"),
    new Emoji("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island"),
    new Emoji("\u{1F1E7}\u{1F1FC}", "Flag: Botswana"),
    new Emoji("\u{1F1E7}\u{1F1FE}", "Flag: Belarus"),
    new Emoji("\u{1F1E7}\u{1F1FF}", "Flag: Belize"),
    new Emoji("\u{1F1E8}\u{1F1E6}", "Flag: Canada"),
    new Emoji("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands"),
    new Emoji("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa"),
    new Emoji("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic"),
    new Emoji("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville"),
    new Emoji("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland"),
    new Emoji("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire"),
    new Emoji("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands"),
    new Emoji("\u{1F1E8}\u{1F1F1}", "Flag: Chile"),
    new Emoji("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon"),
    new Emoji("\u{1F1E8}\u{1F1F3}", "Flag: China"),
    new Emoji("\u{1F1E8}\u{1F1F4}", "Flag: Colombia"),
    new Emoji("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island"),
    new Emoji("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica"),
    new Emoji("\u{1F1E8}\u{1F1FA}", "Flag: Cuba"),
    new Emoji("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde"),
    new Emoji("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao"),
    new Emoji("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island"),
    new Emoji("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus"),
    new Emoji("\u{1F1E8}\u{1F1FF}", "Flag: Czechia"),
    new Emoji("\u{1F1E9}\u{1F1EA}", "Flag: Germany"),
    new Emoji("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia"),
    new Emoji("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti"),
    new Emoji("\u{1F1E9}\u{1F1F0}", "Flag: Denmark"),
    new Emoji("\u{1F1E9}\u{1F1F2}", "Flag: Dominica"),
    new Emoji("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic"),
    new Emoji("\u{1F1E9}\u{1F1FF}", "Flag: Algeria"),
    new Emoji("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla"),
    new Emoji("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador"),
    new Emoji("\u{1F1EA}\u{1F1EA}", "Flag: Estonia"),
    new Emoji("\u{1F1EA}\u{1F1EC}", "Flag: Egypt"),
    new Emoji("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara"),
    new Emoji("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea"),
    new Emoji("\u{1F1EA}\u{1F1F8}", "Flag: Spain"),
    new Emoji("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia"),
    new Emoji("\u{1F1EA}\u{1F1FA}", "Flag: European Union"),
    new Emoji("\u{1F1EB}\u{1F1EE}", "Flag: Finland"),
    new Emoji("\u{1F1EB}\u{1F1EF}", "Flag: Fiji"),
    new Emoji("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands"),
    new Emoji("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia"),
    new Emoji("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands"),
    new Emoji("\u{1F1EB}\u{1F1F7}", "Flag: France"),
    new Emoji("\u{1F1EC}\u{1F1E6}", "Flag: Gabon"),
    new Emoji("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom"),
    new Emoji("\u{1F1EC}\u{1F1E9}", "Flag: Grenada"),
    new Emoji("\u{1F1EC}\u{1F1EA}", "Flag: Georgia"),
    new Emoji("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana"),
    new Emoji("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey"),
    new Emoji("\u{1F1EC}\u{1F1ED}", "Flag: Ghana"),
    new Emoji("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar"),
    new Emoji("\u{1F1EC}\u{1F1F1}", "Flag: Greenland"),
    new Emoji("\u{1F1EC}\u{1F1F2}", "Flag: Gambia"),
    new Emoji("\u{1F1EC}\u{1F1F3}", "Flag: Guinea"),
    new Emoji("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe"),
    new Emoji("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea"),
    new Emoji("\u{1F1EC}\u{1F1F7}", "Flag: Greece"),
    new Emoji("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands"),
    new Emoji("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala"),
    new Emoji("\u{1F1EC}\u{1F1FA}", "Flag: Guam"),
    new Emoji("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau"),
    new Emoji("\u{1F1EC}\u{1F1FE}", "Flag: Guyana"),
    new Emoji("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China"),
    new Emoji("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands"),
    new Emoji("\u{1F1ED}\u{1F1F3}", "Flag: Honduras"),
    new Emoji("\u{1F1ED}\u{1F1F7}", "Flag: Croatia"),
    new Emoji("\u{1F1ED}\u{1F1F9}", "Flag: Haiti"),
    new Emoji("\u{1F1ED}\u{1F1FA}", "Flag: Hungary"),
    new Emoji("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands"),
    new Emoji("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia"),
    new Emoji("\u{1F1EE}\u{1F1EA}", "Flag: Ireland"),
    new Emoji("\u{1F1EE}\u{1F1F1}", "Flag: Israel"),
    new Emoji("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man"),
    new Emoji("\u{1F1EE}\u{1F1F3}", "Flag: India"),
    new Emoji("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory"),
    new Emoji("\u{1F1EE}\u{1F1F6}", "Flag: Iraq"),
    new Emoji("\u{1F1EE}\u{1F1F7}", "Flag: Iran"),
    new Emoji("\u{1F1EE}\u{1F1F8}", "Flag: Iceland"),
    new Emoji("\u{1F1EE}\u{1F1F9}", "Flag: Italy"),
    new Emoji("\u{1F1EF}\u{1F1EA}", "Flag: Jersey"),
    new Emoji("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica"),
    new Emoji("\u{1F1EF}\u{1F1F4}", "Flag: Jordan"),
    new Emoji("\u{1F1EF}\u{1F1F5}", "Flag: Japan"),
    new Emoji("\u{1F1F0}\u{1F1EA}", "Flag: Kenya"),
    new Emoji("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan"),
    new Emoji("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia"),
    new Emoji("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati"),
    new Emoji("\u{1F1F0}\u{1F1F2}", "Flag: Comoros"),
    new Emoji("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis"),
    new Emoji("\u{1F1F0}\u{1F1F5}", "Flag: North Korea"),
    new Emoji("\u{1F1F0}\u{1F1F7}", "Flag: South Korea"),
    new Emoji("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait"),
    new Emoji("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands"),
    new Emoji("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan"),
    new Emoji("\u{1F1F1}\u{1F1E6}", "Flag: Laos"),
    new Emoji("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon"),
    new Emoji("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia"),
    new Emoji("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein"),
    new Emoji("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka"),
    new Emoji("\u{1F1F1}\u{1F1F7}", "Flag: Liberia"),
    new Emoji("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho"),
    new Emoji("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania"),
    new Emoji("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg"),
    new Emoji("\u{1F1F1}\u{1F1FB}", "Flag: Latvia"),
    new Emoji("\u{1F1F1}\u{1F1FE}", "Flag: Libya"),
    new Emoji("\u{1F1F2}\u{1F1E6}", "Flag: Morocco"),
    new Emoji("\u{1F1F2}\u{1F1E8}", "Flag: Monaco"),
    new Emoji("\u{1F1F2}\u{1F1E9}", "Flag: Moldova"),
    new Emoji("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro"),
    new Emoji("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin"),
    new Emoji("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar"),
    new Emoji("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands"),
    new Emoji("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia"),
    new Emoji("\u{1F1F2}\u{1F1F1}", "Flag: Mali"),
    new Emoji("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)"),
    new Emoji("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia"),
    new Emoji("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China"),
    new Emoji("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands"),
    new Emoji("\u{1F1F2}\u{1F1F6}", "Flag: Martinique"),
    new Emoji("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania"),
    new Emoji("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat"),
    new Emoji("\u{1F1F2}\u{1F1F9}", "Flag: Malta"),
    new Emoji("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius"),
    new Emoji("\u{1F1F2}\u{1F1FB}", "Flag: Maldives"),
    new Emoji("\u{1F1F2}\u{1F1FC}", "Flag: Malawi"),
    new Emoji("\u{1F1F2}\u{1F1FD}", "Flag: Mexico"),
    new Emoji("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia"),
    new Emoji("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique"),
    new Emoji("\u{1F1F3}\u{1F1E6}", "Flag: Namibia"),
    new Emoji("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia"),
    new Emoji("\u{1F1F3}\u{1F1EA}", "Flag: Niger"),
    new Emoji("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island"),
    new Emoji("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria"),
    new Emoji("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua"),
    new Emoji("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands"),
    new Emoji("\u{1F1F3}\u{1F1F4}", "Flag: Norway"),
    new Emoji("\u{1F1F3}\u{1F1F5}", "Flag: Nepal"),
    new Emoji("\u{1F1F3}\u{1F1F7}", "Flag: Nauru"),
    new Emoji("\u{1F1F3}\u{1F1FA}", "Flag: Niue"),
    new Emoji("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand"),
    new Emoji("\u{1F1F4}\u{1F1F2}", "Flag: Oman"),
    new Emoji("\u{1F1F5}\u{1F1E6}", "Flag: Panama"),
    new Emoji("\u{1F1F5}\u{1F1EA}", "Flag: Peru"),
    new Emoji("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia"),
    new Emoji("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea"),
    new Emoji("\u{1F1F5}\u{1F1ED}", "Flag: Philippines"),
    new Emoji("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan"),
    new Emoji("\u{1F1F5}\u{1F1F1}", "Flag: Poland"),
    new Emoji("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon"),
    new Emoji("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands"),
    new Emoji("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico"),
    new Emoji("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories"),
    new Emoji("\u{1F1F5}\u{1F1F9}", "Flag: Portugal"),
    new Emoji("\u{1F1F5}\u{1F1FC}", "Flag: Palau"),
    new Emoji("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay"),
    new Emoji("\u{1F1F6}\u{1F1E6}", "Flag: Qatar"),
    new Emoji("\u{1F1F7}\u{1F1EA}", "Flag: Réunion"),
    new Emoji("\u{1F1F7}\u{1F1F4}", "Flag: Romania"),
    new Emoji("\u{1F1F7}\u{1F1F8}", "Flag: Serbia"),
    new Emoji("\u{1F1F7}\u{1F1FA}", "Flag: Russia"),
    new Emoji("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda"),
    new Emoji("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia"),
    new Emoji("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands"),
    new Emoji("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles"),
    new Emoji("\u{1F1F8}\u{1F1E9}", "Flag: Sudan"),
    new Emoji("\u{1F1F8}\u{1F1EA}", "Flag: Sweden"),
    new Emoji("\u{1F1F8}\u{1F1EC}", "Flag: Singapore"),
    new Emoji("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena"),
    new Emoji("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia"),
    new Emoji("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen"),
    new Emoji("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia"),
    new Emoji("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone"),
    new Emoji("\u{1F1F8}\u{1F1F2}", "Flag: San Marino"),
    new Emoji("\u{1F1F8}\u{1F1F3}", "Flag: Senegal"),
    new Emoji("\u{1F1F8}\u{1F1F4}", "Flag: Somalia"),
    new Emoji("\u{1F1F8}\u{1F1F7}", "Flag: Suriname"),
    new Emoji("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan"),
    new Emoji("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe"),
    new Emoji("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador"),
    new Emoji("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten"),
    new Emoji("\u{1F1F8}\u{1F1FE}", "Flag: Syria"),
    new Emoji("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini"),
    new Emoji("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha"),
    new Emoji("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands"),
    new Emoji("\u{1F1F9}\u{1F1E9}", "Flag: Chad"),
    new Emoji("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories"),
    new Emoji("\u{1F1F9}\u{1F1EC}", "Flag: Togo"),
    new Emoji("\u{1F1F9}\u{1F1ED}", "Flag: Thailand"),
    new Emoji("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan"),
    new Emoji("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau"),
    new Emoji("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste"),
    new Emoji("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan"),
    new Emoji("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia"),
    new Emoji("\u{1F1F9}\u{1F1F4}", "Flag: Tonga"),
    new Emoji("\u{1F1F9}\u{1F1F7}", "Flag: Turkey"),
    new Emoji("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago"),
    new Emoji("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu"),
    new Emoji("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan"),
    new Emoji("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania"),
    new Emoji("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine"),
    new Emoji("\u{1F1FA}\u{1F1EC}", "Flag: Uganda"),
    new Emoji("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands"),
    new Emoji("\u{1F1FA}\u{1F1F3}", "Flag: United Nations"),
    new Emoji("\u{1F1FA}\u{1F1F8}", "Flag: United States"),
    new Emoji("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay"),
    new Emoji("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan"),
    new Emoji("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City"),
    new Emoji("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines"),
    new Emoji("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela"),
    new Emoji("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands"),
    new Emoji("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands"),
    new Emoji("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam"),
    new Emoji("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu"),
    new Emoji("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna"),
    new Emoji("\u{1F1FC}\u{1F1F8}", "Flag: Samoa"),
    new Emoji("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo"),
    new Emoji("\u{1F1FE}\u{1F1EA}", "Flag: Yemen"),
    new Emoji("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte"),
    new Emoji("\u{1F1FF}\u{1F1E6}", "Flag: South Africa"),
    new Emoji("\u{1F1FF}\u{1F1F2}", "Flag: Zambia"),
    new Emoji("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"),
];
export const flags = [
    new Emoji("\u{1F38C}", "Crossed Flags"),
    new Emoji("\u{1F3C1}", "Chequered Flag"),
    new Emoji("\u{1F3F3}\u{FE0F}", "White Flag"),
    new Emoji("\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", "Rainbow Flag"),
    new Emoji("\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", "Transgender Flag"),
    new Emoji("\u{1F3F4}", "Black Flag"),
    new Emoji("\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", "Pirate Flag"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"),
    new Emoji("\u{1F6A9}", "Triangular Flag"),
];

export const motorcycle = new Emoji("\u{1F3CD}\u{FE0F}", "Motorcycle");
export const racingCar = new Emoji("\u{1F3CE}\u{FE0F}", "Racing Car");
export const seat = new Emoji("\u{1F4BA}", "Seat");
export const rocket = new Emoji("\u{1F680}", "Rocket");
export const helicopter = new Emoji("\u{1F681}", "Helicopter");
export const locomotive = new Emoji("\u{1F682}", "Locomotive");
export const railwayCar = new Emoji("\u{1F683}", "Railway Car");
export const highspeedTrain = new Emoji("\u{1F684}", "High-Speed Train");
export const bulletTrain = new Emoji("\u{1F685}", "Bullet Train");
export const train = new Emoji("\u{1F686}", "Train");
export const metro = new Emoji("\u{1F687}", "Metro");
export const lightRail = new Emoji("\u{1F688}", "Light Rail");
export const station = new Emoji("\u{1F689}", "Station");
export const tram = new Emoji("\u{1F68A}", "Tram");
export const tramCar = new Emoji("\u{1F68B}", "Tram Car");
export const bus = new Emoji("\u{1F68C}", "Bus");
export const oncomingBus = new Emoji("\u{1F68D}", "Oncoming Bus");
export const trolleyBus = new Emoji("\u{1F68E}", "Trolleybus");
export const busStop = new Emoji("\u{1F68F}", "Bus Stop");
export const miniBus = new Emoji("\u{1F690}", "Minibus");
export const ambulance = new Emoji("\u{1F691}", "Ambulance");
export const fireEngine = new Emoji("\u{1F692}", "Fire Engine");
export const policeCar = new Emoji("\u{1F693}", "Police Car");
export const oncomingPoliceCar = new Emoji("\u{1F694}", "Oncoming Police Car");
export const taxi = new Emoji("\u{1F695}", "Taxi");
export const oncomingTaxi = new Emoji("\u{1F696}", "Oncoming Taxi");
export const automobile = new Emoji("\u{1F697}", "Automobile");
export const oncomingAutomobile = new Emoji("\u{1F698}", "Oncoming Automobile");
export const sportUtilityVehicle = new Emoji("\u{1F699}", "Sport Utility Vehicle");
export const deliveryTruck = new Emoji("\u{1F69A}", "Delivery Truck");
export const articulatedLorry = new Emoji("\u{1F69B}", "Articulated Lorry");
export const tractor = new Emoji("\u{1F69C}", "Tractor");
export const monorail = new Emoji("\u{1F69D}", "Monorail");
export const mountainRailway = new Emoji("\u{1F69E}", "Mountain Railway");
export const suspensionRailway = new Emoji("\u{1F69F}", "Suspension Railway");
export const mountainCableway = new Emoji("\u{1F6A0}", "Mountain Cableway");
export const aerialTramway = new Emoji("\u{1F6A1}", "Aerial Tramway");
export const ship = new Emoji("\u{1F6A2}", "Ship");
export const speedBoat = new Emoji("\u{1F6A4}", "Speedboat");
export const horizontalTrafficLight = new Emoji("\u{1F6A5}", "Horizontal Traffic Light");
export const verticalTrafficLight = new Emoji("\u{1F6A6}", "Vertical Traffic Light");
export const construction = new Emoji("\u{1F6A7}", "Construction");
export const policeCarLight = new Emoji("\u{1F6A8}", "Police Car Light");
export const bicycle = new Emoji("\u{1F6B2}", "Bicycle");
export const stopSign = new Emoji("\u{1F6D1}", "Stop Sign");
export const oilDrum = new Emoji("\u{1F6E2}\u{FE0F}", "Oil Drum");
export const motorway = new Emoji("\u{1F6E3}\u{FE0F}", "Motorway");
export const railwayTrack = new Emoji("\u{1F6E4}\u{FE0F}", "Railway Track");
export const motorBoat = new Emoji("\u{1F6E5}\u{FE0F}", "Motor Boat");
export const smallAirplane = new Emoji("\u{1F6E9}\u{FE0F}", "Small Airplane");
export const airplaneDeparture = new Emoji("\u{1F6EB}", "Airplane Departure");
export const airplaneArrival = new Emoji("\u{1F6EC}", "Airplane Arrival");
export const satellite = new Emoji("\u{1F6F0}\u{FE0F}", "Satellite");
export const passengerShip = new Emoji("\u{1F6F3}\u{FE0F}", "Passenger Ship");
export const kickScooter = new Emoji("\u{1F6F4}", "Kick Scooter");
export const motorScooter = new Emoji("\u{1F6F5}", "Motor Scooter");
export const canoe = new Emoji("\u{1F6F6}", "Canoe");
export const flyingSaucer = new Emoji("\u{1F6F8}", "Flying Saucer");
export const skateboard = new Emoji("\u{1F6F9}", "Skateboard");
export const autoRickshaw = new Emoji("\u{1F6FA}", "Auto Rickshaw");
export const pickupTruck = new Emoji("\u{1F6FB}", "Pickup Truck");
export const rollerSkate = new Emoji("\u{1F6FC}", "Roller Skate");
export const motorizedWheelchair = new Emoji("\u{1F9BC}", "Motorized Wheelchair");
export const manualWheelchair = new Emoji("\u{1F9BD}", "Manual Wheelchair");
export const parachute = new Emoji("\u{1FA82}", "Parachute");
export const anchor = new Emoji("\u{2693}", "Anchor");
export const ferry = new Emoji("\u{26F4}\u{FE0F}", "Ferry");
export const sailboat = new Emoji("\u{26F5}", "Sailboat");
export const fuelPump = new Emoji("\u{26FD}", "Fuel Pump");
export const airplane = new Emoji("\u{2708}\u{FE0F}", "Airplane");
export const vehicles = [
    motorcycle,
    racingCar,
    seat,
    rocket,
    helicopter,
    locomotive,
    railwayCar,
    highspeedTrain,
    bulletTrain,
    train,
    metro,
    lightRail,
    station,
    tram,
    tramCar,
    bus,
    oncomingBus,
    trolleyBus,
    busStop,
    miniBus,
    ambulance,
    fireEngine,
    taxi,
    oncomingTaxi,
    automobile,
    oncomingAutomobile,
    sportUtilityVehicle,
    deliveryTruck,
    articulatedLorry,
    tractor,
    monorail,
    mountainRailway,
    suspensionRailway,
    mountainCableway,
    aerialTramway,
    ship,
    speedBoat,
    horizontalTrafficLight,
    verticalTrafficLight,
    construction,
    bicycle,
    stopSign,
    oilDrum,
    motorway,
    railwayTrack,
    motorBoat,
    smallAirplane,
    airplaneDeparture,
    airplaneArrival,
    satellite,
    passengerShip,
    kickScooter,
    motorScooter,
    canoe,
    flyingSaucer,
    skateboard,
    autoRickshaw,
    pickupTruck,
    rollerSkate,
    motorizedWheelchair,
    manualWheelchair,
    parachute,
    anchor,
    ferry,
    sailboat,
    fuelPump,
    airplane,
];
export const bloodTypes = [
    new Emoji("\u{1F170}", "A Button (Blood Type)"),
    new Emoji("\u{1F171}", "B Button (Blood Type)"),
    new Emoji("\u{1F17E}", "O Button (Blood Type)"),
    new Emoji("\u{1F18E}", "AB Button (Blood Type)"),
];
export const regions = [
    new Emoji("\u{1F1E6}", "Regional Indicator Symbol Letter A"),
    new Emoji("\u{1F1E7}", "Regional Indicator Symbol Letter B"),
    new Emoji("\u{1F1E8}", "Regional Indicator Symbol Letter C"),
    new Emoji("\u{1F1E9}", "Regional Indicator Symbol Letter D"),
    new Emoji("\u{1F1EA}", "Regional Indicator Symbol Letter E"),
    new Emoji("\u{1F1EB}", "Regional Indicator Symbol Letter F"),
    new Emoji("\u{1F1EC}", "Regional Indicator Symbol Letter G"),
    new Emoji("\u{1F1ED}", "Regional Indicator Symbol Letter H"),
    new Emoji("\u{1F1EE}", "Regional Indicator Symbol Letter I"),
    new Emoji("\u{1F1EF}", "Regional Indicator Symbol Letter J"),
    new Emoji("\u{1F1F0}", "Regional Indicator Symbol Letter K"),
    new Emoji("\u{1F1F1}", "Regional Indicator Symbol Letter L"),
    new Emoji("\u{1F1F2}", "Regional Indicator Symbol Letter M"),
    new Emoji("\u{1F1F3}", "Regional Indicator Symbol Letter N"),
    new Emoji("\u{1F1F4}", "Regional Indicator Symbol Letter O"),
    new Emoji("\u{1F1F5}", "Regional Indicator Symbol Letter P"),
    new Emoji("\u{1F1F6}", "Regional Indicator Symbol Letter Q"),
    new Emoji("\u{1F1F7}", "Regional Indicator Symbol Letter R"),
    new Emoji("\u{1F1F8}", "Regional Indicator Symbol Letter S"),
    new Emoji("\u{1F1F9}", "Regional Indicator Symbol Letter T"),
    new Emoji("\u{1F1FA}", "Regional Indicator Symbol Letter U"),
    new Emoji("\u{1F1FB}", "Regional Indicator Symbol Letter V"),
    new Emoji("\u{1F1FC}", "Regional Indicator Symbol Letter W"),
    new Emoji("\u{1F1FD}", "Regional Indicator Symbol Letter X"),
    new Emoji("\u{1F1FE}", "Regional Indicator Symbol Letter Y"),
    new Emoji("\u{1F1FF}", "Regional Indicator Symbol Letter Z"),
];
export const japanese = [
    new Emoji("\u{1F530}", "Japanese Symbol for Beginner"),
    new Emoji("\u{1F201}", "Japanese “Here” Button"),
    new Emoji("\u{1F202}\u{FE0F}", "Japanese “Service Charge” Button"),
    new Emoji("\u{1F21A}", "Japanese “Free of Charge” Button"),
    new Emoji("\u{1F22F}", "Japanese “Reserved” Button"),
    new Emoji("\u{1F232}", "Japanese “Prohibited” Button"),
    new Emoji("\u{1F233}", "Japanese “Vacancy” Button"),
    new Emoji("\u{1F234}", "Japanese “Passing Grade” Button"),
    new Emoji("\u{1F235}", "Japanese “No Vacancy” Button"),
    new Emoji("\u{1F236}", "Japanese “Not Free of Charge” Button"),
    new Emoji("\u{1F237}\u{FE0F}", "Japanese “Monthly Amount” Button"),
    new Emoji("\u{1F238}", "Japanese “Application” Button"),
    new Emoji("\u{1F239}", "Japanese “Discount” Button"),
    new Emoji("\u{1F23A}", "Japanese “Open for Business” Button"),
    new Emoji("\u{1F250}", "Japanese “Bargain” Button"),
    new Emoji("\u{1F251}", "Japanese “Acceptable” Button"),
    new Emoji("\u{3297}\u{FE0F}", "Japanese “Congratulations” Button"),
    new Emoji("\u{3299}\u{FE0F}", "Japanese “Secret” Button"),
];
export const time = [
    new Emoji("\u{1F550}", "One O’Clock"),
    new Emoji("\u{1F551}", "Two O’Clock"),
    new Emoji("\u{1F552}", "Three O’Clock"),
    new Emoji("\u{1F553}", "Four O’Clock"),
    new Emoji("\u{1F554}", "Five O’Clock"),
    new Emoji("\u{1F555}", "Six O’Clock"),
    new Emoji("\u{1F556}", "Seven O’Clock"),
    new Emoji("\u{1F557}", "Eight O’Clock"),
    new Emoji("\u{1F558}", "Nine O’Clock"),
    new Emoji("\u{1F559}", "Ten O’Clock"),
    new Emoji("\u{1F55A}", "Eleven O’Clock"),
    new Emoji("\u{1F55B}", "Twelve O’Clock"),
    new Emoji("\u{1F55C}", "One-Thirty"),
    new Emoji("\u{1F55D}", "Two-Thirty"),
    new Emoji("\u{1F55E}", "Three-Thirty"),
    new Emoji("\u{1F55F}", "Four-Thirty"),
    new Emoji("\u{1F560}", "Five-Thirty"),
    new Emoji("\u{1F561}", "Six-Thirty"),
    new Emoji("\u{1F562}", "Seven-Thirty"),
    new Emoji("\u{1F563}", "Eight-Thirty"),
    new Emoji("\u{1F564}", "Nine-Thirty"),
    new Emoji("\u{1F565}", "Ten-Thirty"),
    new Emoji("\u{1F566}", "Eleven-Thirty"),
    new Emoji("\u{1F567}", "Twelve-Thirty"),
];
export const clocks = [
    new Emoji("\u{1F570}\u{FE0F}", "Mantelpiece Clock"),
    new Emoji("\u{231A}", "Watch"),
    new Emoji("\u{23F0}", "Alarm Clock"),
    new Emoji("\u{23F1}\u{FE0F}", "Stopwatch"),
    new Emoji("\u{23F2}\u{FE0F}", "Timer Clock"),
    new Emoji("\u{231B}", "Hourglass Done"),
    new Emoji("\u{23F3}", "Hourglass Not Done"),
];
export const arrows = [
    new Emoji("\u{1F503}\u{FE0F}", "Clockwise Vertical Arrows"),
    new Emoji("\u{1F504}\u{FE0F}", "Counterclockwise Arrows Button"),
    new Emoji("\u{2194}\u{FE0F}", "Left-Right Arrow"),
    new Emoji("\u{2195}\u{FE0F}", "Up-Down Arrow"),
    new Emoji("\u{2196}\u{FE0F}", "Up-Left Arrow"),
    new Emoji("\u{2197}\u{FE0F}", "Up-Right Arrow"),
    new Emoji("\u{2198}\u{FE0F}", "Down-Right Arrow"),
    new Emoji("\u{2199}\u{FE0F}", "Down-Left Arrow"),
    new Emoji("\u{21A9}\u{FE0F}", "Right Arrow Curving Left"),
    new Emoji("\u{21AA}\u{FE0F}", "Left Arrow Curving Right"),
    new Emoji("\u{27A1}\u{FE0F}", "Right Arrow"),
    new Emoji("\u{2934}\u{FE0F}", "Right Arrow Curving Up"),
    new Emoji("\u{2935}\u{FE0F}", "Right Arrow Curving Down"),
    new Emoji("\u{2B05}\u{FE0F}", "Left Arrow"),
    new Emoji("\u{2B06}\u{FE0F}", "Up Arrow"),
    new Emoji("\u{2B07}\u{FE0F}", "Down Arrow"),
];
export const shapes = [
    new Emoji("\u{1F534}", "Red Circle"),
    new Emoji("\u{1F535}", "Blue Circle"),
    new Emoji("\u{1F536}", "Large Orange Diamond"),
    new Emoji("\u{1F537}", "Large Blue Diamond"),
    new Emoji("\u{1F538}", "Small Orange Diamond"),
    new Emoji("\u{1F539}", "Small Blue Diamond"),
    new Emoji("\u{1F53A}", "Red Triangle Pointed Up"),
    new Emoji("\u{1F53B}", "Red Triangle Pointed Down"),
    new Emoji("\u{1F7E0}", "Orange Circle"),
    new Emoji("\u{1F7E1}", "Yellow Circle"),
    new Emoji("\u{1F7E2}", "Green Circle"),
    new Emoji("\u{1F7E3}", "Purple Circle"),
    new Emoji("\u{1F7E4}", "Brown Circle"),
    new Emoji("\u{2B55}", "Hollow Red Circle"),
    new Emoji("\u{26AA}", "White Circle"),
    new Emoji("\u{26AB}", "Black Circle"),
    new Emoji("\u{1F7E5}", "Red Square"),
    new Emoji("\u{1F7E6}", "Blue Square"),
    new Emoji("\u{1F7E7}", "Orange Square"),
    new Emoji("\u{1F7E8}", "Yellow Square"),
    new Emoji("\u{1F7E9}", "Green Square"),
    new Emoji("\u{1F7EA}", "Purple Square"),
    new Emoji("\u{1F7EB}", "Brown Square"),
    new Emoji("\u{1F532}", "Black Square Button"),
    new Emoji("\u{1F533}", "White Square Button"),
    new Emoji("\u{25AA}\u{FE0F}", "Black Small Square"),
    new Emoji("\u{25AB}\u{FE0F}", "White Small Square"),
    new Emoji("\u{25FD}", "White Medium-Small Square"),
    new Emoji("\u{25FE}", "Black Medium-Small Square"),
    new Emoji("\u{25FB}\u{FE0F}", "White Medium Square"),
    new Emoji("\u{25FC}\u{FE0F}", "Black Medium Square"),
    new Emoji("\u{2B1B}", "Black Large Square"),
    new Emoji("\u{2B1C}", "White Large Square"),
    new Emoji("\u{2B50}", "Star"),
    new Emoji("\u{1F4A0}", "Diamond with a Dot")
];
export const shuffleTracksButton = new Emoji("\u{1F500}", "Shuffle Tracks Button");
export const repeatButton = new Emoji("\u{1F501}", "Repeat Button");
export const repeatSingleButton = new Emoji("\u{1F502}", "Repeat Single Button");
export const upwardsButton = new Emoji("\u{1F53C}", "Upwards Button");
export const downwardsButton = new Emoji("\u{1F53D}", "Downwards Button");
export const playButton = new Emoji("\u{25B6}\u{FE0F}", "Play Button");
export const reverseButton = new Emoji("\u{25C0}\u{FE0F}", "Reverse Button");
export const ejectButton = new Emoji("\u{23CF}\u{FE0F}", "Eject Button");
export const fastForwardButton = new Emoji("\u{23E9}", "Fast-Forward Button");
export const fastReverseButton = new Emoji("\u{23EA}", "Fast Reverse Button");
export const fastUpButton = new Emoji("\u{23EB}", "Fast Up Button");
export const fastDownButton = new Emoji("\u{23EC}", "Fast Down Button");
export const nextTrackButton = new Emoji("\u{23ED}\u{FE0F}", "Next Track Button");
export const lastTrackButton = new Emoji("\u{23EE}\u{FE0F}", "Last Track Button");
export const playOrPauseButton = new Emoji("\u{23EF}\u{FE0F}", "Play or Pause Button");
export const pauseButton = new Emoji("\u{23F8}\u{FE0F}", "Pause Button");
export const stopButton = new Emoji("\u{23F9}\u{FE0F}", "Stop Button");
export const recordButton = new Emoji("\u{23FA}\u{FE0F}", "Record Button");
export const mediaPlayer = [
    shuffleTracksButton,
    repeatButton,
    repeatSingleButton,
    upwardsButton,
    downwardsButton,
    pauseButton,
    reverseButton,
    ejectButton,
    fastForwardButton,
    fastReverseButton,
    fastUpButton,
    fastDownButton,
    nextTrackButton,
    lastTrackButton,
    playOrPauseButton,
    pauseButton,
    stopButton,
    recordButton,
];
export const zodiac = [
    new Emoji("\u{2648}", "Aries"),
    new Emoji("\u{2649}", "Taurus"),
    new Emoji("\u{264A}", "Gemini"),
    new Emoji("\u{264B}", "Cancer"),
    new Emoji("\u{264C}", "Leo"),
    new Emoji("\u{264D}", "Virgo"),
    new Emoji("\u{264E}", "Libra"),
    new Emoji("\u{264F}", "Scorpio"),
    new Emoji("\u{2650}", "Sagittarius"),
    new Emoji("\u{2651}", "Capricorn"),
    new Emoji("\u{2652}", "Aquarius"),
    new Emoji("\u{2653}", "Pisces"),
    new Emoji("\u{26CE}", "Ophiuchus"),
];
export const numbers = [
    new Emoji("\u{30}\u{FE0F}", "Digit Zero"),
    new Emoji("\u{31}\u{FE0F}", "Digit One"),
    new Emoji("\u{32}\u{FE0F}", "Digit Two"),
    new Emoji("\u{33}\u{FE0F}", "Digit Three"),
    new Emoji("\u{34}\u{FE0F}", "Digit Four"),
    new Emoji("\u{35}\u{FE0F}", "Digit Five"),
    new Emoji("\u{36}\u{FE0F}", "Digit Six"),
    new Emoji("\u{37}\u{FE0F}", "Digit Seven"),
    new Emoji("\u{38}\u{FE0F}", "Digit Eight"),
    new Emoji("\u{39}\u{FE0F}", "Digit Nine"),
    new Emoji("\u{2A}\u{FE0F}", "Asterisk"),
    new Emoji("\u{23}\u{FE0F}", "Number Sign"),
    new Emoji("\u{30}\u{FE0F}\u{20E3}", "Keycap Digit Zero"),
    new Emoji("\u{31}\u{FE0F}\u{20E3}", "Keycap Digit One"),
    new Emoji("\u{32}\u{FE0F}\u{20E3}", "Keycap Digit Two"),
    new Emoji("\u{33}\u{FE0F}\u{20E3}", "Keycap Digit Three"),
    new Emoji("\u{34}\u{FE0F}\u{20E3}", "Keycap Digit Four"),
    new Emoji("\u{35}\u{FE0F}\u{20E3}", "Keycap Digit Five"),
    new Emoji("\u{36}\u{FE0F}\u{20E3}", "Keycap Digit Six"),
    new Emoji("\u{37}\u{FE0F}\u{20E3}", "Keycap Digit Seven"),
    new Emoji("\u{38}\u{FE0F}\u{20E3}", "Keycap Digit Eight"),
    new Emoji("\u{39}\u{FE0F}\u{20E3}", "Keycap Digit Nine"),
    new Emoji("\u{2A}\u{FE0F}\u{20E3}", "Keycap Asterisk"),
    new Emoji("\u{23}\u{FE0F}\u{20E3}", "Keycap Number Sign"),
    new Emoji("\u{1F51F}", "Keycap: 10"),
];
export const tags = [
    new Emoji("\u{E0020}", "Tag Space"),
    new Emoji("\u{E0021}", "Tag Exclamation Mark"),
    new Emoji("\u{E0022}", "Tag Quotation Mark"),
    new Emoji("\u{E0023}", "Tag Number Sign"),
    new Emoji("\u{E0024}", "Tag Dollar Sign"),
    new Emoji("\u{E0025}", "Tag Percent Sign"),
    new Emoji("\u{E0026}", "Tag Ampersand"),
    new Emoji("\u{E0027}", "Tag Apostrophe"),
    new Emoji("\u{E0028}", "Tag Left Parenthesis"),
    new Emoji("\u{E0029}", "Tag Right Parenthesis"),
    new Emoji("\u{E002A}", "Tag Asterisk"),
    new Emoji("\u{E002B}", "Tag Plus Sign"),
    new Emoji("\u{E002C}", "Tag Comma"),
    new Emoji("\u{E002D}", "Tag Hyphen-Minus"),
    new Emoji("\u{E002E}", "Tag Full Stop"),
    new Emoji("\u{E002F}", "Tag Solidus"),
    new Emoji("\u{E0030}", "Tag Digit Zero"),
    new Emoji("\u{E0031}", "Tag Digit One"),
    new Emoji("\u{E0032}", "Tag Digit Two"),
    new Emoji("\u{E0033}", "Tag Digit Three"),
    new Emoji("\u{E0034}", "Tag Digit Four"),
    new Emoji("\u{E0035}", "Tag Digit Five"),
    new Emoji("\u{E0036}", "Tag Digit Six"),
    new Emoji("\u{E0037}", "Tag Digit Seven"),
    new Emoji("\u{E0038}", "Tag Digit Eight"),
    new Emoji("\u{E0039}", "Tag Digit Nine"),
    new Emoji("\u{E003A}", "Tag Colon"),
    new Emoji("\u{E003B}", "Tag Semicolon"),
    new Emoji("\u{E003C}", "Tag Less-Than Sign"),
    new Emoji("\u{E003D}", "Tag Equals Sign"),
    new Emoji("\u{E003E}", "Tag Greater-Than Sign"),
    new Emoji("\u{E003F}", "Tag Question Mark"),
    new Emoji("\u{E0040}", "Tag Commercial at"),
    new Emoji("\u{E0041}", "Tag Latin Capital Letter a"),
    new Emoji("\u{E0042}", "Tag Latin Capital Letter B"),
    new Emoji("\u{E0043}", "Tag Latin Capital Letter C"),
    new Emoji("\u{E0044}", "Tag Latin Capital Letter D"),
    new Emoji("\u{E0045}", "Tag Latin Capital Letter E"),
    new Emoji("\u{E0046}", "Tag Latin Capital Letter F"),
    new Emoji("\u{E0047}", "Tag Latin Capital Letter G"),
    new Emoji("\u{E0048}", "Tag Latin Capital Letter H"),
    new Emoji("\u{E0049}", "Tag Latin Capital Letter I"),
    new Emoji("\u{E004A}", "Tag Latin Capital Letter J"),
    new Emoji("\u{E004B}", "Tag Latin Capital Letter K"),
    new Emoji("\u{E004C}", "Tag Latin Capital Letter L"),
    new Emoji("\u{E004D}", "Tag Latin Capital Letter M"),
    new Emoji("\u{E004E}", "Tag Latin Capital Letter N"),
    new Emoji("\u{E004F}", "Tag Latin Capital Letter O"),
    new Emoji("\u{E0050}", "Tag Latin Capital Letter P"),
    new Emoji("\u{E0051}", "Tag Latin Capital Letter Q"),
    new Emoji("\u{E0052}", "Tag Latin Capital Letter R"),
    new Emoji("\u{E0053}", "Tag Latin Capital Letter S"),
    new Emoji("\u{E0054}", "Tag Latin Capital Letter T"),
    new Emoji("\u{E0055}", "Tag Latin Capital Letter U"),
    new Emoji("\u{E0056}", "Tag Latin Capital Letter V"),
    new Emoji("\u{E0057}", "Tag Latin Capital Letter W"),
    new Emoji("\u{E0058}", "Tag Latin Capital Letter X"),
    new Emoji("\u{E0059}", "Tag Latin Capital Letter Y"),
    new Emoji("\u{E005A}", "Tag Latin Capital Letter Z"),
    new Emoji("\u{E005B}", "Tag Left Square Bracket"),
    new Emoji("\u{E005C}", "Tag Reverse Solidus"),
    new Emoji("\u{E005D}", "Tag Right Square Bracket"),
    new Emoji("\u{E005E}", "Tag Circumflex Accent"),
    new Emoji("\u{E005F}", "Tag Low Line"),
    new Emoji("\u{E0060}", "Tag Grave Accent"),
    new Emoji("\u{E0061}", "Tag Latin Small Letter a"),
    new Emoji("\u{E0062}", "Tag Latin Small Letter B"),
    new Emoji("\u{E0063}", "Tag Latin Small Letter C"),
    new Emoji("\u{E0064}", "Tag Latin Small Letter D"),
    new Emoji("\u{E0065}", "Tag Latin Small Letter E"),
    new Emoji("\u{E0066}", "Tag Latin Small Letter F"),
    new Emoji("\u{E0067}", "Tag Latin Small Letter G"),
    new Emoji("\u{E0068}", "Tag Latin Small Letter H"),
    new Emoji("\u{E0069}", "Tag Latin Small Letter I"),
    new Emoji("\u{E006A}", "Tag Latin Small Letter J"),
    new Emoji("\u{E006B}", "Tag Latin Small Letter K"),
    new Emoji("\u{E006C}", "Tag Latin Small Letter L"),
    new Emoji("\u{E006D}", "Tag Latin Small Letter M"),
    new Emoji("\u{E006E}", "Tag Latin Small Letter N"),
    new Emoji("\u{E006F}", "Tag Latin Small Letter O"),
    new Emoji("\u{E0070}", "Tag Latin Small Letter P"),
    new Emoji("\u{E0071}", "Tag Latin Small Letter Q"),
    new Emoji("\u{E0072}", "Tag Latin Small Letter R"),
    new Emoji("\u{E0073}", "Tag Latin Small Letter S"),
    new Emoji("\u{E0074}", "Tag Latin Small Letter T"),
    new Emoji("\u{E0075}", "Tag Latin Small Letter U"),
    new Emoji("\u{E0076}", "Tag Latin Small Letter V"),
    new Emoji("\u{E0077}", "Tag Latin Small Letter W"),
    new Emoji("\u{E0078}", "Tag Latin Small Letter X"),
    new Emoji("\u{E0079}", "Tag Latin Small Letter Y"),
    new Emoji("\u{E007A}", "Tag Latin Small Letter Z"),
    new Emoji("\u{E007B}", "Tag Left Curly Bracket"),
    new Emoji("\u{E007C}", "Tag Vertical Line"),
    new Emoji("\u{E007D}", "Tag Right Curly Bracket"),
    new Emoji("\u{E007E}", "Tag Tilde"),
    new Emoji("\u{E007F}", "Cancel Tag"),
];
export const math = [
    new Emoji("\u{2716}\u{FE0F}", "Multiply"),
    new Emoji("\u{2795}", "Plus"),
    new Emoji("\u{2796}", "Minus"),
    new Emoji("\u{2797}", "Divide"),
];
export const games = [
    new Emoji("\u{2660}\u{FE0F}", "Spade Suit"),
    new Emoji("\u{2663}\u{FE0F}", "Club Suit"),
    { value: "\u{2665}\u{FE0F}", desc: "Heart Suit", color: "red" },
    { value: "\u{2666}\u{FE0F}", desc: "Diamond Suit", color: "red" },
    new Emoji("\u{1F004}", "Mahjong Red Dragon"),
    new Emoji("\u{1F0CF}", "Joker"),
    new Emoji("\u{1F3AF}", "Direct Hit"),
    new Emoji("\u{1F3B0}", "Slot Machine"),
    new Emoji("\u{1F3B1}", "Pool 8 Ball"),
    new Emoji("\u{1F3B2}", "Game Die"),
    new Emoji("\u{1F3B3}", "Bowling"),
    new Emoji("\u{1F3B4}", "Flower Playing Cards"),
    new Emoji("\u{1F9E9}", "Puzzle Piece"),
    new Emoji("\u{265F}\u{FE0F}", "Chess Pawn"),
    new Emoji("\u{1FA80}", "Yo-Yo"),
    new Emoji("\u{1FA81}", "Kite"),
    new Emoji("\u{1FA83}", "Boomerang"),
    new Emoji("\u{1FA86}", "Nesting Dolls"),
];
export const sportsEquipment = [
    new Emoji("\u{1F3BD}", "Running Shirt"),
    new Emoji("\u{1F3BE}", "Tennis"),
    new Emoji("\u{1F3BF}", "Skis"),
    new Emoji("\u{1F3C0}", "Basketball"),
    new Emoji("\u{1F3C5}", "Sports Medal"),
    new Emoji("\u{1F3C6}", "Trophy"),
    new Emoji("\u{1F3C8}", "American Football"),
    new Emoji("\u{1F3C9}", "Rugby Football"),
    new Emoji("\u{1F3CF}", "Cricket Game"),
    new Emoji("\u{1F3D0}", "Volleyball"),
    new Emoji("\u{1F3D1}", "Field Hockey"),
    new Emoji("\u{1F3D2}", "Ice Hockey"),
    new Emoji("\u{1F3D3}", "Ping Pong"),
    new Emoji("\u{1F3F8}", "Badminton"),
    new Emoji("\u{1F6F7}", "Sled"),
    new Emoji("\u{1F945}", "Goal Net"),
    new Emoji("\u{1F947}", "1st Place Medal"),
    new Emoji("\u{1F948}", "2nd Place Medal"),
    new Emoji("\u{1F949}", "3rd Place Medal"),
    new Emoji("\u{1F94A}", "Boxing Glove"),
    new Emoji("\u{1F94C}", "Curling Stone"),
    new Emoji("\u{1F94D}", "Lacrosse"),
    new Emoji("\u{1F94E}", "Softball"),
    new Emoji("\u{1F94F}", "Flying Disc"),
    new Emoji("\u{26BD}", "Soccer Ball"),
    new Emoji("\u{26BE}", "Baseball"),
    new Emoji("\u{26F8}\u{FE0F}", "Ice Skate"),
];
export const clothing = [
    new Emoji("\u{1F3A9}", "Top Hat"),
    new Emoji("\u{1F93F}", "Diving Mask"),
    new Emoji("\u{1F452}", "Woman’s Hat"),
    new Emoji("\u{1F453}", "Glasses"),
    new Emoji("\u{1F576}\u{FE0F}", "Sunglasses"),
    new Emoji("\u{1F454}", "Necktie"),
    new Emoji("\u{1F455}", "T-Shirt"),
    new Emoji("\u{1F456}", "Jeans"),
    new Emoji("\u{1F457}", "Dress"),
    new Emoji("\u{1F458}", "Kimono"),
    new Emoji("\u{1F459}", "Bikini"),
    new Emoji("\u{1F45A}", "Woman’s Clothes"),
    new Emoji("\u{1F45B}", "Purse"),
    new Emoji("\u{1F45C}", "Handbag"),
    new Emoji("\u{1F45D}", "Clutch Bag"),
    new Emoji("\u{1F45E}", "Man’s Shoe"),
    new Emoji("\u{1F45F}", "Running Shoe"),
    new Emoji("\u{1F460}", "High-Heeled Shoe"),
    new Emoji("\u{1F461}", "Woman’s Sandal"),
    new Emoji("\u{1F462}", "Woman’s Boot"),
    new Emoji("\u{1F94B}", "Martial Arts Uniform"),
    new Emoji("\u{1F97B}", "Sari"),
    new Emoji("\u{1F97C}", "Lab Coat"),
    new Emoji("\u{1F97D}", "Goggles"),
    new Emoji("\u{1F97E}", "Hiking Boot"),
    new Emoji("\u{1F97F}", "Flat Shoe"),
    new Emoji("\u{1F9AF}", "White Cane"),
    new Emoji("\u{1F9BA}", "Safety Vest"),
    new Emoji("\u{1F9E2}", "Billed Cap"),
    new Emoji("\u{1F9E3}", "Scarf"),
    new Emoji("\u{1F9E4}", "Gloves"),
    new Emoji("\u{1F9E5}", "Coat"),
    new Emoji("\u{1F9E6}", "Socks"),
    new Emoji("\u{1F9FF}", "Nazar Amulet"),
    new Emoji("\u{1FA70}", "Ballet Shoes"),
    new Emoji("\u{1FA71}", "One-Piece Swimsuit"),
    new Emoji("\u{1FA72}", "Briefs"),
    new Emoji("\u{1FA73}", "Shorts"),
    new Emoji("\u{1FA74}", "Thong Sandal"),
];
export const town = [
    new Emoji("\u{1F3D7}\u{FE0F}", "Building Construction"),
    new Emoji("\u{1F3D8}\u{FE0F}", "Houses"),
    new Emoji("\u{1F3D9}\u{FE0F}", "Cityscape"),
    new Emoji("\u{1F3DA}\u{FE0F}", "Derelict House"),
    new Emoji("\u{1F3DB}\u{FE0F}", "Classical Building"),
    new Emoji("\u{1F3DC}\u{FE0F}", "Desert"),
    new Emoji("\u{1F3DD}\u{FE0F}", "Desert Island"),
    new Emoji("\u{1F3DE}\u{FE0F}", "National Park"),
    new Emoji("\u{1F3DF}\u{FE0F}", "Stadium"),
    new Emoji("\u{1F3E0}", "House"),
    new Emoji("\u{1F3E1}", "House with Garden"),
    new Emoji("\u{1F3E2}", "Office Building"),
    new Emoji("\u{1F3E3}", "Japanese Post Office"),
    new Emoji("\u{1F3E4}", "Post Office"),
    new Emoji("\u{1F3E5}", "Hospital"),
    new Emoji("\u{1F3E6}", "Bank"),
    new Emoji("\u{1F3E7}", "ATM Sign"),
    new Emoji("\u{1F3E8}", "Hotel"),
    new Emoji("\u{1F3E9}", "Love Hotel"),
    new Emoji("\u{1F3EA}", "Convenience Store"),
    new Emoji("\u{1F3EB}", "School"),
    new Emoji("\u{1F3EC}", "Department Store"),
    new Emoji("\u{1F3ED}", "Factory"),
    new Emoji("\u{1F309}", "Bridge at Night"),
    new Emoji("\u{26F2}", "Fountain"),
    new Emoji("\u{1F6CD}\u{FE0F}", "Shopping Bags"),
    new Emoji("\u{1F9FE}", "Receipt"),
    new Emoji("\u{1F6D2}", "Shopping Cart"),
    new Emoji("\u{1F488}", "Barber Pole"),
    new Emoji("\u{1F492}", "Wedding"),
    new Emoji("\u{1F6D6}", "Hut"),
    new Emoji("\u{1F6D7}", "Elevator"),
    new Emoji("\u{1F5F3}\u{FE0F}", "Ballot Box with Ballot")
];
export const buttons = [
    new Emoji("\u{1F191}", "CL Button"),
    new Emoji("\u{1F192}", "Cool Button"),
    new Emoji("\u{1F193}", "Free Button"),
    new Emoji("\u{1F194}", "ID Button"),
    new Emoji("\u{1F195}", "New Button"),
    new Emoji("\u{1F196}", "NG Button"),
    new Emoji("\u{1F197}", "OK Button"),
    new Emoji("\u{1F198}", "SOS Button"),
    new Emoji("\u{1F199}", "Up! Button"),
    new Emoji("\u{1F19A}", "Vs Button"),
    new Emoji("\u{1F518}", "Radio Button"),
    new Emoji("\u{1F519}", "Back Arrow"),
    new Emoji("\u{1F51A}", "End Arrow"),
    new Emoji("\u{1F51B}", "On! Arrow"),
    new Emoji("\u{1F51C}", "Soon Arrow"),
    new Emoji("\u{1F51D}", "Top Arrow"),
    new Emoji("\u{2611}\u{FE0F}", "Check Box with Check"),
    new Emoji("\u{1F520}", "Input Latin Uppercase"),
    new Emoji("\u{1F521}", "Input Latin Lowercase"),
    new Emoji("\u{1F522}", "Input Numbers"),
    new Emoji("\u{1F523}", "Input Symbols"),
    new Emoji("\u{1F524}", "Input Latin Letters"),
];
export const music = [
    new Emoji("\u{1F3BC}", "Musical Score"),
    new Emoji("\u{1F3B6}", "Musical Notes"),
    new Emoji("\u{1F3B5}", "Musical Note"),
    new Emoji("\u{1F3B7}", "Saxophone"),
    new Emoji("\u{1F3B8}", "Guitar"),
    new Emoji("\u{1F3B9}", "Musical Keyboard"),
    new Emoji("\u{1F3BA}", "Trumpet"),
    new Emoji("\u{1F3BB}", "Violin"),
    new Emoji("\u{1F941}", "Drum"),
    new Emoji("\u{1FA95}", "Banjo"),
    new Emoji("\u{1FA97}", "Accordion"),
    new Emoji("\u{1FA98}", "Long Drum"),
];
export const weather = [
    new Emoji("\u{1F304}", "Sunrise Over Mountains"),
    new Emoji("\u{1F305}", "Sunrise"),
    new Emoji("\u{1F306}", "Cityscape at Dusk"),
    new Emoji("\u{1F307}", "Sunset"),
    new Emoji("\u{1F303}", "Night with Stars"),
    new Emoji("\u{1F302}", "Closed Umbrella"),
    new Emoji("\u{2602}\u{FE0F}", "Umbrella"),
    new Emoji("\u{2614}\u{FE0F}", "Umbrella with Rain Drops"),
    new Emoji("\u{2603}\u{FE0F}", "Snowman"),
    new Emoji("\u{26C4}", "Snowman Without Snow"),
    new Emoji("\u{2600}\u{FE0F}", "Sun"),
    new Emoji("\u{2601}\u{FE0F}", "Cloud"),
    new Emoji("\u{1F324}\u{FE0F}", "Sun Behind Small Cloud"),
    new Emoji("\u{26C5}", "Sun Behind Cloud"),
    new Emoji("\u{1F325}\u{FE0F}", "Sun Behind Large Cloud"),
    new Emoji("\u{1F326}\u{FE0F}", "Sun Behind Rain Cloud"),
    new Emoji("\u{1F327}\u{FE0F}", "Cloud with Rain"),
    new Emoji("\u{1F328}\u{FE0F}", "Cloud with Snow"),
    new Emoji("\u{1F329}\u{FE0F}", "Cloud with Lightning"),
    new Emoji("\u{26C8}\u{FE0F}", "Cloud with Lightning and Rain"),
    new Emoji("\u{2744}\u{FE0F}", "Snowflake"),
    new Emoji("\u{1F300}", "Cyclone"),
    new Emoji("\u{1F32A}\u{FE0F}", "Tornado"),
    new Emoji("\u{1F32C}\u{FE0F}", "Wind Face"),
    new Emoji("\u{1F30A}", "Water Wave"),
    new Emoji("\u{1F32B}\u{FE0F}", "Fog"),
    new Emoji("\u{1F301}", "Foggy"),
    new Emoji("\u{1F308}", "Rainbow"),
    new Emoji("\u{1F321}\u{FE0F}", "Thermometer"),
];
export const astro = [
    new Emoji("\u{1F30C}", "Milky Way"),
    new Emoji("\u{1F30D}", "Globe Showing Europe-Africa"),
    new Emoji("\u{1F30E}", "Globe Showing Americas"),
    new Emoji("\u{1F30F}", "Globe Showing Asia-Australia"),
    new Emoji("\u{1F310}", "Globe with Meridians"),
    new Emoji("\u{1F311}", "New Moon"),
    new Emoji("\u{1F312}", "Waxing Crescent Moon"),
    new Emoji("\u{1F313}", "First Quarter Moon"),
    new Emoji("\u{1F314}", "Waxing Gibbous Moon"),
    new Emoji("\u{1F315}", "Full Moon"),
    new Emoji("\u{1F316}", "Waning Gibbous Moon"),
    new Emoji("\u{1F317}", "Last Quarter Moon"),
    new Emoji("\u{1F318}", "Waning Crescent Moon"),
    new Emoji("\u{1F319}", "Crescent Moon"),
    new Emoji("\u{1F31A}", "New Moon Face"),
    new Emoji("\u{1F31B}", "First Quarter Moon Face"),
    new Emoji("\u{1F31C}", "Last Quarter Moon Face"),
    new Emoji("\u{1F31D}", "Full Moon Face"),
    new Emoji("\u{1F31E}", "Sun with Face"),
    new Emoji("\u{1F31F}", "Glowing Star"),
    new Emoji("\u{1F320}", "Shooting Star"),
    new Emoji("\u{2604}\u{FE0F}", "Comet"),
    new Emoji("\u{1FA90}", "Ringed Planet"),
];
export const finance = [
    new Emoji("\u{1F4B0}", "Money Bag"),
    new Emoji("\u{1F4B1}", "Currency Exchange"),
    new Emoji("\u{1F4B2}", "Heavy Dollar Sign"),
    new Emoji("\u{1F4B3}", "Credit Card"),
    new Emoji("\u{1F4B4}", "Yen Banknote"),
    new Emoji("\u{1F4B5}", "Dollar Banknote"),
    new Emoji("\u{1F4B6}", "Euro Banknote"),
    new Emoji("\u{1F4B7}", "Pound Banknote"),
    new Emoji("\u{1F4B8}", "Money with Wings"),
    new Emoji("\u{1F4B9}", "Chart Increasing with Yen"),
    new Emoji("\u{1FA99}", "Coin"),
];
export const writing = [
    new Emoji("\u{1F58A}\u{FE0F}", "Pen"),
    new Emoji("\u{1F58B}\u{FE0F}", "Fountain Pen"),
    new Emoji("\u{1F58C}\u{FE0F}", "Paintbrush"),
    new Emoji("\u{1F58D}\u{FE0F}", "Crayon"),
    new Emoji("\u{270F}\u{FE0F}", "Pencil"),
    new Emoji("\u{2712}\u{FE0F}", "Black Nib"),
];
export const droplet = new Emoji("\u{1F4A7}", "Droplet");
export const dropOfBlood = new Emoji("\u{1FA78}", "Drop of Blood");
export const adhesiveBandage = new Emoji("\u{1FA79}", "Adhesive Bandage");
export const stehoscope = new Emoji("\u{1FA7A}", "Stethoscope");
export const syringe = new Emoji("\u{1F489}", "Syringe");
export const pill = new Emoji("\u{1F48A}", "Pill");
export const micrscope = new Emoji("\u{1F52C}", "Microscope");
export const testTube = new Emoji("\u{1F9EA}", "Test Tube");
export const petriDish = new Emoji("\u{1F9EB}", "Petri Dish");
export const dna = new Emoji("\u{1F9EC}", "DNA");
export const abacus = new Emoji("\u{1F9EE}", "Abacus");
export const magnet = new Emoji("\u{1F9F2}", "Magnet");
export const telescope = new Emoji("\u{1F52D}", "Telescope");
export const medicalSymbol = new Emoji("\u{2695}\u{FE0F}", "Medical Symbol");
export const balanceScale = new Emoji("\u{2696}\u{FE0F}", "Balance Scale");
export const alembic = new Emoji("\u{2697}\u{FE0F}", "Alembic");
export const gear = new Emoji("\u{2699}\u{FE0F}", "Gear");
export const atomSymbol = new Emoji("\u{269B}\u{FE0F}", "Atom Symbol");
export const magnifyingGlassTiltedLeft = new Emoji("\u{1F50D}", "Magnifying Glass Tilted Left");
export const magnifyingGlassTiltedRight = new Emoji("\u{1F50E}", "Magnifying Glass Tilted Right");
export const science = [
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stehoscope,
    syringe,
    pill,
    micrscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medicalSymbol,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
];
export const joystick = new Emoji("\u{1F579}\u{FE0F}", "Joystick");
export const videoGame = new Emoji("\u{1F3AE}", "Video Game");
export const lightBulb = new Emoji("\u{1F4A1}", "Light Bulb");
export const laptop = new Emoji("\u{1F4BB}", "Laptop");
export const briefcase = new Emoji("\u{1F4BC}", "Briefcase");
export const computerDisk = new Emoji("\u{1F4BD}", "Computer Disk");
export const floppyDisk = new Emoji("\u{1F4BE}", "Floppy Disk");
export const opticalDisk = new Emoji("\u{1F4BF}", "Optical Disk");
export const dvd = new Emoji("\u{1F4C0}", "DVD");
export const desktopComputer = new Emoji("\u{1F5A5}\u{FE0F}", "Desktop Computer");
export const keyboard = new Emoji("\u{2328}\u{FE0F}", "Keyboard");
export const printer = new Emoji("\u{1F5A8}\u{FE0F}", "Printer");
export const computerMouse = new Emoji("\u{1F5B1}\u{FE0F}", "Computer Mouse");
export const trackball = new Emoji("\u{1F5B2}\u{FE0F}", "Trackball");
export const telephone = new Emoji("\u{260E}\u{FE0F}", "Telephone");
export const telephoneReceiver = new Emoji("\u{1F4DE}", "Telephone Receiver");
export const pager = new Emoji("\u{1F4DF}", "Pager");
export const faxMachine = new Emoji("\u{1F4E0}", "Fax Machine");
export const satelliteAntenna = new Emoji("\u{1F4E1}", "Satellite Antenna");
export const loudspeaker = new Emoji("\u{1F4E2}", "Loudspeaker");
export const megaphone = new Emoji("\u{1F4E3}", "Megaphone");
export const television = new Emoji("\u{1F4FA}", "Television");
export const radio = new Emoji("\u{1F4FB}", "Radio");
export const videocassette = new Emoji("\u{1F4FC}", "Videocassette");
export const filProjector = new Emoji("\u{1F4FD}\u{FE0F}", "Film Projector");
export const studioMicrophone = new Emoji("\u{1F399}\u{FE0F}", "Studio Microphone");
export const levelSlider = new Emoji("\u{1F39A}\u{FE0F}", "Level Slider");
export const controlKnobs = new Emoji("\u{1F39B}\u{FE0F}", "Control Knobs");
export const microphone = new Emoji("\u{1F3A4}", "Microphone");
export const movieCamera = new Emoji("\u{1F3A5}", "Movie Camera");
export const headphone = new Emoji("\u{1F3A7}", "Headphone");
export const camera = new Emoji("\u{1F4F7}", "Camera");
export const cameraWithFlash = new Emoji("\u{1F4F8}", "Camera with Flash");
export const videoCamera = new Emoji("\u{1F4F9}", "Video Camera");
export const mobilePhone = new Emoji("\u{1F4F1}", "Mobile Phone");
export const mobilePhoneOff = new Emoji("\u{1F4F4}", "Mobile Phone Off");
export const mobilePhoneWithArrow = new Emoji("\u{1F4F2}", "Mobile Phone with Arrow");
export const lockedWithPen = new Emoji("\u{1F50F}", "Locked with Pen");
export const lockedWithKey = new Emoji("\u{1F510}", "Locked with Key");
export const locked = new Emoji("\u{1F512}", "Locked");
export const unlocked = new Emoji("\u{1F513}", "Unlocked");
export const bell = new Emoji("\u{1F514}", "Bell");
export const bellWithSlash = new Emoji("\u{1F515}", "Bell with Slash");
export const bookmark = new Emoji("\u{1F516}", "Bookmark");
export const link = new Emoji("\u{1F517}", "Link");
export const vibrationMode = new Emoji("\u{1F4F3}", "Vibration Mode");
export const antennaBars = new Emoji("\u{1F4F6}", "Antenna Bars");
export const dimButton = new Emoji("\u{1F505}", "Dim Button");
export const brightButton = new Emoji("\u{1F506}", "Bright Button");
export const mutedSpeaker = new Emoji("\u{1F507}", "Muted Speaker");
export const speakerLowVolume = new Emoji("\u{1F508}", "Speaker Low Volume");
export const speakerMediumVolume = new Emoji("\u{1F509}", "Speaker Medium Volume");
export const speakerHighVolume = new Emoji("\u{1F50A}", "Speaker High Volume");
export const battery = new Emoji("\u{1F50B}", "Battery");
export const electricPlug = new Emoji("\u{1F50C}", "Electric Plug");
export const tech = [
    joystick,
    videoGame,
    lightBulb,
    laptop,
    briefcase,
    computerDisk,
    floppyDisk,
    opticalDisk,
    dvd,
    desktopComputer,
    keyboard,
    printer,
    computerMouse,
    trackball,
    telephone,
    telephoneReceiver,
    pager,
    faxMachine,
    satelliteAntenna,
    loudspeaker,
    megaphone,
    television,
    radio,
    videocassette,
    filProjector,
    studioMicrophone,
    levelSlider,
    controlKnobs,
    microphone,
    movieCamera,
    headphone,
    camera,
    cameraWithFlash,
    videoCamera,
    mobilePhone,
    mobilePhoneOff,
    mobilePhoneWithArrow,
    lockedWithPen,
    lockedWithKey,
    locked,
    unlocked,
    bell,
    bellWithSlash,
    bookmark,
    link,
    vibrationMode,
    antennaBars,
    dimButton,
    brightButton,
    mutedSpeaker,
    speakerLowVolume,
    speakerMediumVolume,
    speakerHighVolume,
    battery,
    electricPlug,
];
export const mail = [
    new Emoji("\u{1F4E4}", "Outbox Tray"),
    new Emoji("\u{1F4E5}", "Inbox Tray"),
    new Emoji("\u{1F4E6}", "Package"),
    new Emoji("\u{1F4E7}", "E-Mail"),
    new Emoji("\u{1F4E8}", "Incoming Envelope"),
    new Emoji("\u{1F4E9}", "Envelope with Arrow"),
    new Emoji("\u{1F4EA}", "Closed Mailbox with Lowered Flag"),
    new Emoji("\u{1F4EB}", "Closed Mailbox with Raised Flag"),
    new Emoji("\u{1F4EC}", "Open Mailbox with Raised Flag"),
    new Emoji("\u{1F4ED}", "Open Mailbox with Lowered Flag"),
    new Emoji("\u{1F4EE}", "Postbox"),
    new Emoji("\u{1F4EF}", "Postal Horn"),
];
export const celebration = [
    new Emoji("\u{1FA85}", "Piñata"),
    new Emoji("\u{1F380}", "Ribbon"),
    new Emoji("\u{1F381}", "Wrapped Gift"),
    new Emoji("\u{1F383}", "Jack-O-Lantern"),
    new Emoji("\u{1F384}", "Christmas Tree"),
    new Emoji("\u{1F9E8}", "Firecracker"),
    new Emoji("\u{1F386}", "Fireworks"),
    new Emoji("\u{1F387}", "Sparkler"),
    new Emoji("\u{2728}", "Sparkles"),
    new Emoji("\u{2747}\u{FE0F}", "Sparkle"),
    new Emoji("\u{1F388}", "Balloon"),
    new Emoji("\u{1F389}", "Party Popper"),
    new Emoji("\u{1F38A}", "Confetti Ball"),
    new Emoji("\u{1F38B}", "Tanabata Tree"),
    new Emoji("\u{1F38D}", "Pine Decoration"),
    new Emoji("\u{1F38E}", "Japanese Dolls"),
    new Emoji("\u{1F38F}", "Carp Streamer"),
    new Emoji("\u{1F390}", "Wind Chime"),
    new Emoji("\u{1F391}", "Moon Viewing Ceremony"),
    new Emoji("\u{1F392}", "Backpack"),
    new Emoji("\u{1F393}", "Graduation Cap"),
    new Emoji("\u{1F9E7}", "Red Envelope"),
    new Emoji("\u{1F3EE}", "Red Paper Lantern"),
    new Emoji("\u{1F396}\u{FE0F}", "Military Medal"),
];
export const tools = [
    new Emoji("\u{1F3A3}", "Fishing Pole"),
    new Emoji("\u{1F526}", "Flashlight"),
    new Emoji("\u{1F527}", "Wrench"),
    new Emoji("\u{1F528}", "Hammer"),
    new Emoji("\u{1F529}", "Nut and Bolt"),
    new Emoji("\u{1F6E0}\u{FE0F}", "Hammer and Wrench"),
    new Emoji("\u{1F9ED}", "Compass"),
    new Emoji("\u{1F9EF}", "Fire Extinguisher"),
    new Emoji("\u{1F9F0}", "Toolbox"),
    new Emoji("\u{1F9F1}", "Brick"),
    new Emoji("\u{1FA93}", "Axe"),
    new Emoji("\u{2692}\u{FE0F}", "Hammer and Pick"),
    new Emoji("\u{26CF}\u{FE0F}", "Pick"),
    new Emoji("\u{26D1}\u{FE0F}", "Rescue Worker’s Helmet"),
    new Emoji("\u{26D3}\u{FE0F}", "Chains"),
    new Emoji("\u{1F5DC}\u{FE0F}", "Clamp"),
    new Emoji("\u{1FA9A}", "Carpentry Saw"),
    new Emoji("\u{1FA9B}", "Screwdriver"),
    new Emoji("\u{1FA9C}", "Ladder"),
    new Emoji("\u{1FA9D}", "Hook"),
];
export const office = [
    new Emoji("\u{1F4C1}", "File Folder"),
    new Emoji("\u{1F4C2}", "Open File Folder"),
    new Emoji("\u{1F4C3}", "Page with Curl"),
    new Emoji("\u{1F4C4}", "Page Facing Up"),
    new Emoji("\u{1F4C5}", "Calendar"),
    new Emoji("\u{1F4C6}", "Tear-Off Calendar"),
    new Emoji("\u{1F4C7}", "Card Index"),
    new Emoji("\u{1F5C2}\u{FE0F}", "Card Index Dividers"),
    new Emoji("\u{1F5C3}\u{FE0F}", "Card File Box"),
    new Emoji("\u{1F5C4}\u{FE0F}", "File Cabinet"),
    new Emoji("\u{1F5D1}\u{FE0F}", "Wastebasket"),
    new Emoji("\u{1F5D2}\u{FE0F}", "Spiral Notepad"),
    new Emoji("\u{1F5D3}\u{FE0F}", "Spiral Calendar"),
    new Emoji("\u{1F4C8}", "Chart Increasing"),
    new Emoji("\u{1F4C9}", "Chart Decreasing"),
    new Emoji("\u{1F4CA}", "Bar Chart"),
    new Emoji("\u{1F4CB}", "Clipboard"),
    new Emoji("\u{1F4CC}", "Pushpin"),
    new Emoji("\u{1F4CD}", "Round Pushpin"),
    new Emoji("\u{1F4CE}", "Paperclip"),
    new Emoji("\u{1F587}\u{FE0F}", "Linked Paperclips"),
    new Emoji("\u{1F4CF}", "Straight Ruler"),
    new Emoji("\u{1F4D0}", "Triangular Ruler"),
    new Emoji("\u{1F4D1}", "Bookmark Tabs"),
    new Emoji("\u{1F4D2}", "Ledger"),
    new Emoji("\u{1F4D3}", "Notebook"),
    new Emoji("\u{1F4D4}", "Notebook with Decorative Cover"),
    new Emoji("\u{1F4D5}", "Closed Book"),
    new Emoji("\u{1F4D6}", "Open Book"),
    new Emoji("\u{1F4D7}", "Green Book"),
    new Emoji("\u{1F4D8}", "Blue Book"),
    new Emoji("\u{1F4D9}", "Orange Book"),
    new Emoji("\u{1F4DA}", "Books"),
    new Emoji("\u{1F4DB}", "Name Badge"),
    new Emoji("\u{1F4DC}", "Scroll"),
    new Emoji("\u{1F4DD}", "Memo"),
    new Emoji("\u{2702}\u{FE0F}", "Scissors"),
    new Emoji("\u{2709}\u{FE0F}", "Envelope"),
];
export const signs = [
    new Emoji("\u{1F3A6}", "Cinema"),
    new Emoji("\u{1F4F5}", "No Mobile Phones"),
    new Emoji("\u{1F51E}", "No One Under Eighteen"),
    new Emoji("\u{1F6AB}", "Prohibited"),
    new Emoji("\u{1F6AC}", "Cigarette"),
    new Emoji("\u{1F6AD}", "No Smoking"),
    new Emoji("\u{1F6AE}", "Litter in Bin Sign"),
    new Emoji("\u{1F6AF}", "No Littering"),
    new Emoji("\u{1F6B0}", "Potable Water"),
    new Emoji("\u{1F6B1}", "Non-Potable Water"),
    new Emoji("\u{1F6B3}", "No Bicycles"),
    new Emoji("\u{1F6B7}", "No Pedestrians"),
    new Emoji("\u{1F6B8}", "Children Crossing"),
    new Emoji("\u{1F6B9}", "Men’s Room"),
    new Emoji("\u{1F6BA}", "Women’s Room"),
    new Emoji("\u{1F6BB}", "Restroom"),
    new Emoji("\u{1F6BC}", "Baby Symbol"),
    new Emoji("\u{1F6BE}", "Water Closet"),
    new Emoji("\u{1F6C2}", "Passport Control"),
    new Emoji("\u{1F6C3}", "Customs"),
    new Emoji("\u{1F6C4}", "Baggage Claim"),
    new Emoji("\u{1F6C5}", "Left Luggage"),
    new Emoji("\u{1F17F}\u{FE0F}", "Parking Button"),
    new Emoji("\u{267F}", "Wheelchair Symbol"),
    new Emoji("\u{2622}\u{FE0F}", "Radioactive"),
    new Emoji("\u{2623}\u{FE0F}", "Biohazard"),
    new Emoji("\u{26A0}\u{FE0F}", "Warning"),
    new Emoji("\u{26A1}", "High Voltage"),
    new Emoji("\u{26D4}", "No Entry"),
    new Emoji("\u{267B}\u{FE0F}", "Recycling Symbol"),
    new Emoji("\u{2640}\u{FE0F}", "Female Sign"),
    new Emoji("\u{2642}\u{FE0F}", "Male Sign"),
    new Emoji("\u{26A7}\u{FE0F}", "Transgender Symbol"),
];
export const religion = [
    new Emoji("\u{1F52F}", "Dotted Six-Pointed Star"),
    new Emoji("\u{2721}\u{FE0F}", "Star of David"),
    new Emoji("\u{1F549}\u{FE0F}", "Om"),
    new Emoji("\u{1F54B}", "Kaaba"),
    new Emoji("\u{1F54C}", "Mosque"),
    new Emoji("\u{1F54D}", "Synagogue"),
    new Emoji("\u{1F54E}", "Menorah"),
    new Emoji("\u{1F6D0}", "Place of Worship"),
    new Emoji("\u{1F6D5}", "Hindu Temple"),
    new Emoji("\u{2626}\u{FE0F}", "Orthodox Cross"),
    new Emoji("\u{271D}\u{FE0F}", "Latin Cross"),
    new Emoji("\u{262A}\u{FE0F}", "Star and Crescent"),
    new Emoji("\u{262E}\u{FE0F}", "Peace Symbol"),
    new Emoji("\u{262F}\u{FE0F}", "Yin Yang"),
    new Emoji("\u{2638}\u{FE0F}", "Wheel of Dharma"),
    new Emoji("\u{267E}\u{FE0F}", "Infinity"),
    new Emoji("\u{1FA94}", "Diya Lamp"),
    new Emoji("\u{26E9}\u{FE0F}", "Shinto Shrine"),
    new Emoji("\u{26EA}", "Church"),
    new Emoji("\u{2734}\u{FE0F}", "Eight-Pointed Star"),
    new Emoji("\u{1F4FF}", "Prayer Beads"),
];
export const household = [
    new Emoji("\u{1F484}", "Lipstick"),
    new Emoji("\u{1F48D}", "Ring"),
    new Emoji("\u{1F48E}", "Gem Stone"),
    new Emoji("\u{1F4F0}", "Newspaper"),
    new Emoji("\u{1F511}", "Key"),
    new Emoji("\u{1F525}", "Fire"),
    new Emoji("\u{1FAA8}", "Rock"),
    new Emoji("\u{1FAB5}", "Wood"),
    new Emoji("\u{1F52B}", "Pistol"),
    new Emoji("\u{1F56F}\u{FE0F}", "Candle"),
    new Emoji("\u{1F5BC}\u{FE0F}", "Framed Picture"),
    new Emoji("\u{1F5DD}\u{FE0F}", "Old Key"),
    new Emoji("\u{1F5DE}\u{FE0F}", "Rolled-Up Newspaper"),
    new Emoji("\u{1F5FA}\u{FE0F}", "World Map"),
    new Emoji("\u{1F6AA}", "Door"),
    new Emoji("\u{1F6BD}", "Toilet"),
    new Emoji("\u{1F6BF}", "Shower"),
    new Emoji("\u{1F6C1}", "Bathtub"),
    new Emoji("\u{1F6CB}\u{FE0F}", "Couch and Lamp"),
    new Emoji("\u{1F6CF}\u{FE0F}", "Bed"),
    new Emoji("\u{1F9F4}", "Lotion Bottle"),
    new Emoji("\u{1F9F5}", "Thread"),
    new Emoji("\u{1F9F6}", "Yarn"),
    new Emoji("\u{1F9F7}", "Safety Pin"),
    new Emoji("\u{1F9F8}", "Teddy Bear"),
    new Emoji("\u{1F9F9}", "Broom"),
    new Emoji("\u{1F9FA}", "Basket"),
    new Emoji("\u{1F9FB}", "Roll of Paper"),
    new Emoji("\u{1F9FC}", "Soap"),
    new Emoji("\u{1F9FD}", "Sponge"),
    new Emoji("\u{1FA91}", "Chair"),
    new Emoji("\u{1FA92}", "Razor"),
    new Emoji("\u{1FA9E}", "Mirror"),
    new Emoji("\u{1FA9F}", "Window"),
    new Emoji("\u{1FAA0}", "Plunger"),
    new Emoji("\u{1FAA1}", "Sewing Needle"),
    new Emoji("\u{1FAA2}", "Knot"),
    new Emoji("\u{1FAA3}", "Bucket"),
    new Emoji("\u{1FAA4}", "Mouse Trap"),
    new Emoji("\u{1FAA5}", "Toothbrush"),
    new Emoji("\u{1FAA6}", "Headstone"),
    new Emoji("\u{1FAA7}", "Placard"),
    new Emoji("\u{1F397}\u{FE0F}", "Reminder Ribbon"),
];
export const activities = [
    new Emoji("\u{1F39E}\u{FE0F}", "Film Frames"),
    new Emoji("\u{1F39F}\u{FE0F}", "Admission Tickets"),
    new Emoji("\u{1F3A0}", "Carousel Horse"),
    new Emoji("\u{1F3A1}", "Ferris Wheel"),
    new Emoji("\u{1F3A2}", "Roller Coaster"),
    new Emoji("\u{1F3A8}", "Artist Palette"),
    new Emoji("\u{1F3AA}", "Circus Tent"),
    new Emoji("\u{1F3AB}", "Ticket"),
    new Emoji("\u{1F3AC}", "Clapper Board"),
    new Emoji("\u{1F3AD}", "Performing Arts"),
];
export const travel = [
    new Emoji("\u{1F3F7}\u{FE0F}", "Label"),
    new Emoji("\u{1F30B}", "Volcano"),
    new Emoji("\u{1F3D4}\u{FE0F}", "Snow-Capped Mountain"),
    new Emoji("\u{26F0}\u{FE0F}", "Mountain"),
    new Emoji("\u{1F3D5}\u{FE0F}", "Camping"),
    new Emoji("\u{1F3D6}\u{FE0F}", "Beach with Umbrella"),
    new Emoji("\u{26F1}\u{FE0F}", "Umbrella on Ground"),
    new Emoji("\u{1F3EF}", "Japanese Castle"),
    new Emoji("\u{1F463}", "Footprints"),
    new Emoji("\u{1F5FB}", "Mount Fuji"),
    new Emoji("\u{1F5FC}", "Tokyo Tower"),
    new Emoji("\u{1F5FD}", "Statue of Liberty"),
    new Emoji("\u{1F5FE}", "Map of Japan"),
    new Emoji("\u{1F5FF}", "Moai"),
    new Emoji("\u{1F6CE}\u{FE0F}", "Bellhop Bell"),
    new Emoji("\u{1F9F3}", "Luggage"),
    new Emoji("\u{26F3}", "Flag in Hole"),
    new Emoji("\u{26FA}", "Tent"),
    new Emoji("\u{2668}\u{FE0F}", "Hot Springs"),
];
export const medieval = [
    new Emoji("\u{1F3F0}", "Castle"),
    new Emoji("\u{1F3F9}", "Bow and Arrow"),
    new Emoji("\u{1F451}", "Crown"),
    new Emoji("\u{1F531}", "Trident Emblem"),
    new Emoji("\u{1F5E1}\u{FE0F}", "Dagger"),
    new Emoji("\u{1F6E1}\u{FE0F}", "Shield"),
    new Emoji("\u{1F52E}", "Crystal Ball"),
    new Emoji("\u{1FA84}", "Magic Wand"),
    new Emoji("\u{2694}\u{FE0F}", "Crossed Swords"),
    new Emoji("\u{269C}\u{FE0F}", "Fleur-de-lis"),
    new Emoji("\u{1FA96}", "Military Helmet")
];

export const doubleExclamationMark = new Emoji("\u{203C}\u{FE0F}", "Double Exclamation Mark");
export const interrobang = new Emoji("\u{2049}\u{FE0F}", "Exclamation Question Mark");
export const information = new Emoji("\u{2139}\u{FE0F}", "Information");
export const circledM = new Emoji("\u{24C2}\u{FE0F}", "Circled M");
export const checkMarkButton = new Emoji("\u{2705}", "Check Mark Button");
export const checkMark = new Emoji("\u{2714}\u{FE0F}", "Check Mark");
export const eightSpokedAsterisk = new Emoji("\u{2733}\u{FE0F}", "Eight-Spoked Asterisk");
export const crossMark = new Emoji("\u{274C}", "Cross Mark");
export const crossMarkButton = new Emoji("\u{274E}", "Cross Mark Button");
export const questionMark = new Emoji("\u{2753}", "Question Mark");
export const whiteQuestionMark = new Emoji("\u{2754}", "White Question Mark");
export const whiteExclamationMark = new Emoji("\u{2755}", "White Exclamation Mark");
export const exclamationMark = new Emoji("\u{2757}", "Exclamation Mark");
export const curlyLoop = new Emoji("\u{27B0}", "Curly Loop");
export const doubleCurlyLoop = new Emoji("\u{27BF}", "Double Curly Loop");
export const wavyDash = new Emoji("\u{3030}\u{FE0F}", "Wavy Dash");
export const partAlternationMark = new Emoji("\u{303D}\u{FE0F}", "Part Alternation Mark");
export const tradeMark = new Emoji("\u{2122}\u{FE0F}", "Trade Mark");
export const copyright = new Emoji("\u{A9}\u{FE0F}", "Copyright");
export const registered = new Emoji("\u{AE}\u{FE0F}", "Registered");
export const marks = [
    doubleExclamationMark,
    interrobang,
    information,
    circledM,
    checkMarkButton,
    checkMark,
    eightSpokedAsterisk,
    crossMark,
    crossMarkButton,
    questionMark,
    whiteQuestionMark,
    whiteExclamationMark,
    exclamationMark,
    curlyLoop,
    doubleCurlyLoop,
    wavyDash,
    partAlternationMark,
    tradeMark,
    copyright,
    registered,
];

export const textStyle = new Emoji("\u{FE0E}", "Variation Selector-15: text style");
export const emojiStyle = new Emoji("\u{FE0F}", "Variation Selector-16: emoji style");
export const zeroWidthJoiner = new Emoji("\u{200D}", "Zero Width Joiner");
export const combiningClosingKeycap = new Emoji("\u{20E3}", "Combining Enclosing Keycap");
export const combiners = [
    textStyle,
    emojiStyle,
    zeroWidthJoiner,
    combiningClosingKeycap,
];
export const allIcons = {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    sex,
    people,
    gestures,
    activity,
    roles,
    fantasy,
    sports,
    personResting,
    otherPeople,
    skinTones,
    hairColors,
    animals,
    plants,
    food,
    sweets,
    drinks,
    utensils,
    nations,
    flags,
    vehicles,
    bloodTypes,
    regions,
    japanese,
    time,
    clocks,
    arrows,
    shapes,
    mediaPlayer,
    zodiac,
    chess,
    numbers,
    tags,
    math,
    games,
    sportsEquipment,
    clothing,
    town,
    buttons,
    music,
    weather,
    astro,
    finance,
    writing,
    science,
    tech,
    mail,
    celebration,
    tools,
    office,
    signs,
    religion,
    household,
    activities,
    travel,
    medieval,
    marks,
    combiners
};