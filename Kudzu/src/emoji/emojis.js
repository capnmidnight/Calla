import { e } from "./Emoji";
import { EmojiGroup, g } from "./EmojiGroup";
import { gg } from "./gg";
export const textStyle = e("\u{FE0E}", "Variation Selector-15: text style");
export const emojiStyle = e("\u{FE0F}", "Variation Selector-16: emoji style");
export const zeroWidthJoiner = e("\u{200D}", "Zero Width Joiner");
export const combiningEnclosingCircleBackslash = e("\u{20E3}", "Combining Enclosing Circle Backslash");
export const combiningEnclosingKeycap = e("\u{20E3}", "Combining Enclosing Keycap");
export const combiners = [
    textStyle,
    emojiStyle,
    zeroWidthJoiner,
    combiningEnclosingCircleBackslash,
    combiningEnclosingKeycap,
];
export const female = e("\u{2640}\u{FE0F}", "Female");
export const male = e("\u{2642}\u{FE0F}", "Male");
export const sexes = [
    female,
    male,
];
export const skinL = e("\u{1F3FB}", "Light Skin Tone");
export const skinML = e("\u{1F3FC}", "Medium-Light Skin Tone");
export const skinM = e("\u{1F3FD}", "Medium Skin Tone");
export const skinMD = e("\u{1F3FE}", "Medium-Dark Skin Tone");
export const skinD = e("\u{1F3FF}", "Dark Skin Tone");
export const skinTones = [
    skinL,
    skinML,
    skinM,
    skinMD,
    skinD,
];
export const hairRed = e("\u{1F9B0}", "Red Hair");
export const hairCurly = e("\u{1F9B1}", "Curly Hair");
export const hairWhite = e("\u{1F9B3}", "White Hair");
export const hairBald = e("\u{1F9B2}", "Bald");
export const hairColors = [
    hairRed,
    hairCurly,
    hairWhite,
    hairBald,
];
function combo(a, b) {
    if (a instanceof Array) {
        return a.map(c => combo(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = combo(e(a.value, a.desc), b);
        return g(value, desc, ...combo(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => combo(a, c));
    }
    else {
        return e(a.value + b.value, a.desc + ": " + b.desc);
    }
}
function join(a, b) {
    if (a instanceof Array) {
        return a.map(c => join(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = join(e(a.value, a.desc), b);
        return g(value, desc, ...join(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => join(a, c));
    }
    else {
        return e(a.value + zeroWidthJoiner.value + b.value, a.desc + ": " + b.desc);
    }
}
export function isSurfer(e) {
    return surfers.contains(e)
        || rowers.contains(e)
        || swimmers.contains(e)
        || merpeople.contains(e);
}
function skin(v, d, ...rest) {
    const person = e(v, d), light = combo(person, skinL), mediumLight = combo(person, skinML), medium = combo(person, skinM), mediumDark = combo(person, skinMD), dark = combo(person, skinD);
    return gg(person.value, person.desc, {
        default: person,
        light,
        mediumLight,
        medium,
        mediumDark,
        dark
    }, ...rest);
}
function sex(person) {
    const man = join(person, male), woman = join(person, female);
    return gg(person.value, person.desc, {
        default: person,
        man,
        woman
    });
}
function skinAndSex(v, d) {
    return sex(skin(v, d));
}
function skinAndHair(v, d, ...rest) {
    const people = skin(v, d), red = join(people, hairRed), curly = join(people, hairCurly), white = join(people, hairWhite), bald = join(people, hairBald);
    return gg(people.value, people.desc, {
        default: people,
        red,
        curly,
        white,
        bald
    }, ...rest);
}
function sym(symbol, name) {
    const j = e(symbol.value, name), men = join(man.default, j), women = join(woman.default, j);
    return gg(symbol.value, symbol.desc, {
        symbol,
        men,
        women
    });
}
export const frowners = skinAndSex("\u{1F64D}", "Frowning");
export const pouters = skinAndSex("\u{1F64E}", "Pouting");
export const gesturingNo = skinAndSex("\u{1F645}", "Gesturing NO");
export const gesturingOK = skinAndSex("\u{1F646}", "Gesturing OK");
export const tippingHand = skinAndSex("\u{1F481}", "Tipping Hand");
export const raisingHand = skinAndSex("\u{1F64B}", "Raising Hand");
export const bowing = skinAndSex("\u{1F647}", "Bowing");
export const facePalming = skinAndSex("\u{1F926}", "Facepalming");
export const shrugging = skinAndSex("\u{1F937}", "Shrugging");
export const cantHear = skinAndSex("\u{1F9CF}", "Can't Hear");
export const gettingMassage = skinAndSex("\u{1F486}", "Getting Massage");
export const gettingHaircut = skinAndSex("\u{1F487}", "Getting Haircut");
export const constructionWorkers = skinAndSex("\u{1F477}", "Construction Worker");
export const guards = skinAndSex("\u{1F482}", "Guard");
export const spies = skinAndSex("\u{1F575}", "Spy");
export const police = skinAndSex("\u{1F46E}", "Police");
export const wearingTurban = skinAndSex("\u{1F473}", "Wearing Turban");
export const superheroes = skinAndSex("\u{1F9B8}", "Superhero");
export const supervillains = skinAndSex("\u{1F9B9}", "Supervillain");
export const mages = skinAndSex("\u{1F9D9}", "Mage");
export const fairies = skinAndSex("\u{1F9DA}", "Fairy");
export const vampires = skinAndSex("\u{1F9DB}", "Vampire");
export const merpeople = skinAndSex("\u{1F9DC}", "Merperson");
export const elves = skinAndSex("\u{1F9DD}", "Elf");
export const walking = skinAndSex("\u{1F6B6}", "Walking");
export const standing = skinAndSex("\u{1F9CD}", "Standing");
export const kneeling = skinAndSex("\u{1F9CE}", "Kneeling");
export const runners = skinAndSex("\u{1F3C3}", "Running");
export const gestures = g("Gestures", "Gestures", frowners, pouters, gesturingNo, gesturingOK, tippingHand, raisingHand, bowing, facePalming, shrugging, cantHear, gettingMassage, gettingHaircut);
export const baby = skin("\u{1F476}", "Baby");
export const child = skin("\u{1F9D2}", "Child");
export const boy = skin("\u{1F466}", "Boy");
export const girl = skin("\u{1F467}", "Girl");
export const children = gg(child.value, child.desc, {
    default: child,
    male: boy,
    female: girl
});
export const blondes = skinAndSex("\u{1F471}", "Blond Person");
export const person = skin("\u{1F9D1}", "Person", blondes.default, wearingTurban.default);
export const beardedMan = skin("\u{1F9D4}", "Bearded Man");
export const manInSuitLevitating = e("\u{1F574}\u{FE0F}", "Man in Suit, Levitating");
export const manWithChineseCap = skin("\u{1F472}", "Man With Chinese Cap");
export const manInTuxedo = skin("\u{1F935}", "Man in Tuxedo");
export const man = skinAndHair("\u{1F468}", "Man", blondes.man, beardedMan, manInSuitLevitating, manWithChineseCap, wearingTurban.man, manInTuxedo);
export const pregnantWoman = skin("\u{1F930}", "Pregnant Woman");
export const breastFeeding = skin("\u{1F931}", "Breast-Feeding");
export const womanWithHeadscarf = skin("\u{1F9D5}", "Woman With Headscarf");
export const brideWithVeil = skin("\u{1F470}", "Bride With Veil");
export const woman = skinAndHair("\u{1F469}", "Woman", blondes.woman, pregnantWoman, breastFeeding, womanWithHeadscarf, wearingTurban.woman, brideWithVeil);
export const adults = gg(person.value, "Adult", {
    default: person,
    male: man,
    female: woman
});
export const olderPerson = skin("\u{1F9D3}", "Older Person");
export const oldMan = skin("\u{1F474}", "Old Man");
export const oldWoman = skin("\u{1F475}", "Old Woman");
export const elderly = gg(olderPerson.value, olderPerson.desc, {
    default: olderPerson,
    male: oldMan,
    female: oldWoman
});
export const medical = e("\u{2695}\u{FE0F}", "Medical");
export const healthCareWorkers = sym(medical, "Health Care");
export const graduationCap = e("\u{1F393}", "Graduation Cap");
export const students = sym(graduationCap, "Student");
export const school = e("\u{1F3EB}", "School");
export const teachers = sym(school, "Teacher");
export const balanceScale = e("\u{2696}\u{FE0F}", "Balance Scale");
export const judges = sym(balanceScale, "Judge");
export const sheafOfRice = e("\u{1F33E}", "Sheaf of Rice");
export const farmers = sym(sheafOfRice, "Farmer");
export const cooking = e("\u{1F373}", "Cooking");
export const cooks = sym(cooking, "Cook");
export const wrench = e("\u{1F527}", "Wrench");
export const mechanics = sym(wrench, "Mechanic");
export const factory = e("\u{1F3ED}", "Factory");
export const factoryWorkers = sym(factory, "Factory Worker");
export const briefcase = e("\u{1F4BC}", "Briefcase");
export const officeWorkers = sym(briefcase, "Office Worker");
export const fireEngine = e("\u{1F692}", "Fire Engine");
export const fireFighters = sym(fireEngine, "Fire Fighter");
export const rocket = e("\u{1F680}", "Rocket");
export const astronauts = sym(rocket, "Astronaut");
export const airplane = e("\u{2708}\u{FE0F}", "Airplane");
export const pilots = sym(airplane, "Pilot");
export const artistPalette = e("\u{1F3A8}", "Artist Palette");
export const artists = sym(artistPalette, "Artist");
export const microphone = e("\u{1F3A4}", "Microphone");
export const singers = sym(microphone, "Singer");
export const laptop = e("\u{1F4BB}", "Laptop");
export const technologists = sym(laptop, "Technologist");
export const microscope = e("\u{1F52C}", "Microscope");
export const scientists = sym(microscope, "Scientist");
export const crown = e("\u{1F451}", "Crown");
export const prince = skin("\u{1F934}", "Prince");
export const princess = skin("\u{1F478}", "Princess");
export const royalty = gg(crown.value, crown.desc, {
    symbol: crown,
    male: prince,
    female: princess
});
export const roles = gg("Roles", "Depictions of people working", {
    healthCareWorkers,
    students,
    teachers,
    judges,
    farmers,
    cooks,
    mechanics,
    factoryWorkers,
    officeWorkers,
    scientists,
    technologists,
    singers,
    artists,
    pilots,
    astronauts,
    fireFighters,
    spies,
    guards,
    constructionWorkers,
    royalty
});
export const cherub = skin("\u{1F47C}", "Cherub");
export const santaClaus = skin("\u{1F385}", "Santa Claus");
export const mrsClaus = skin("\u{1F936}", "Mrs. Claus");
export const genies = sex(e("\u{1F9DE}", "Genie"));
export const zombies = sex(e("\u{1F9DF}", "Zombie"));
export const fantasy = gg("Fantasy", "Depictions of fantasy characters", {
    cherub,
    santaClaus,
    mrsClaus,
    superheroes,
    supervillains,
    mages,
    fairies,
    vampires,
    merpeople,
    elves,
    genies,
    zombies
});
export const whiteCane = e("\u{1F9AF}", "Probing Cane");
export const withProbingCane = sym(whiteCane, "Probing");
export const motorizedWheelchair = e("\u{1F9BC}", "Motorized Wheelchair");
export const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");
export const manualWheelchair = e("\u{1F9BD}", "Manual Wheelchair");
export const inManualWheelchair = sym(manualWheelchair, "In Manual Wheelchair");
export const manDancing = skin("\u{1F57A}", "Man Dancing");
export const womanDancing = skin("\u{1F483}", "Woman Dancing");
export const dancers = gg(manDancing.value, "Dancing", {
    male: manDancing,
    female: womanDancing
});
export const jugglers = skinAndSex("\u{1F939}", "Juggler");
export const climbers = skinAndSex("\u{1F9D7}", "Climber");
export const fencer = e("\u{1F93A}", "Fencer");
export const jockeys = skin("\u{1F3C7}", "Jockey");
export const skier = e("\u{26F7}\u{FE0F}", "Skier");
export const snowboarders = skin("\u{1F3C2}", "Snowboarder");
export const golfers = skinAndSex("\u{1F3CC}\u{FE0F}", "Golfer");
export const surfers = skinAndSex("\u{1F3C4}", "Surfing");
export const rowers = skinAndSex("\u{1F6A3}", "Rowing Boat");
export const swimmers = skinAndSex("\u{1F3CA}", "Swimming");
export const basketballers = skinAndSex("\u{26F9}\u{FE0F}", "Basket Baller");
export const weightLifters = skinAndSex("\u{1F3CB}\u{FE0F}", "Weight Lifter");
export const bikers = skinAndSex("\u{1F6B4}", "Biker");
export const mountainBikers = skinAndSex("\u{1F6B5}", "Mountain Biker");
export const cartwheelers = skinAndSex("\u{1F938}", "Cartwheeler");
export const wrestlers = sex(e("\u{1F93C}", "Wrestler"));
export const waterPoloers = skinAndSex("\u{1F93D}", "Water Polo Player");
export const handBallers = skinAndSex("\u{1F93E}", "Hand Baller");
export const inMotion = gg("In Motion", "Depictions of people in motion", {
    walking,
    standing,
    kneeling,
    withProbingCane,
    inMotorizedWheelchair,
    inManualWheelchair,
    dancers,
    jugglers,
    climbers,
    fencer,
    jockeys,
    skier,
    snowboarders,
    golfers,
    surfers,
    rowers,
    swimmers,
    runners,
    basketballers,
    weightLifters,
    bikers,
    mountainBikers,
    cartwheelers,
    wrestlers,
    waterPoloers,
    handBallers
});
export const inLotusPosition = skinAndSex("\u{1F9D8}", "In Lotus Position");
export const inBath = skin("\u{1F6C0}", "In Bath");
export const inBed = skin("\u{1F6CC}", "In Bed");
export const inSauna = skinAndSex("\u{1F9D6}", "In Sauna");
export const resting = gg("Resting", "Depictions of people at rest", {
    inLotusPosition,
    inBath,
    inBed,
    inSauna
});
export const babies = g(baby.value, baby.desc, baby, cherub);
export const people = gg("People", "People", {
    babies,
    children,
    adults,
    elderly
});
export const allPeople = gg("All People", "All People", {
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy
});
export const ogre = e("\u{1F479}", "Ogre");
export const goblin = e("\u{1F47A}", "Goblin");
export const ghost = e("\u{1F47B}", "Ghost");
export const alien = e("\u{1F47D}", "Alien");
export const alienMonster = e("\u{1F47E}", "Alien Monster");
export const angryFaceWithHorns = e("\u{1F47F}", "Angry Face with Horns");
export const skull = e("\u{1F480}", "Skull");
export const pileOfPoo = e("\u{1F4A9}", "Pile of Poo");
export const grinningFace = e("\u{1F600}", "Grinning Face");
export const beamingFaceWithSmilingEyes = e("\u{1F601}", "Beaming Face with Smiling Eyes");
export const faceWithTearsOfJoy = e("\u{1F602}", "Face with Tears of Joy");
export const grinningFaceWithBigEyes = e("\u{1F603}", "Grinning Face with Big Eyes");
export const grinningFaceWithSmilingEyes = e("\u{1F604}", "Grinning Face with Smiling Eyes");
export const grinningFaceWithSweat = e("\u{1F605}", "Grinning Face with Sweat");
export const grinningSquitingFace = e("\u{1F606}", "Grinning Squinting Face");
export const smillingFaceWithHalo = e("\u{1F607}", "Smiling Face with Halo");
export const smilingFaceWithHorns = e("\u{1F608}", "Smiling Face with Horns");
export const winkingFace = e("\u{1F609}", "Winking Face");
export const smilingFaceWithSmilingEyes = e("\u{1F60A}", "Smiling Face with Smiling Eyes");
export const faceSavoringFood = e("\u{1F60B}", "Face Savoring Food");
export const relievedFace = e("\u{1F60C}", "Relieved Face");
export const smilingFaceWithHeartEyes = e("\u{1F60D}", "Smiling Face with Heart-Eyes");
export const smilingFaceWithSunglasses = e("\u{1F60E}", "Smiling Face with Sunglasses");
export const smirkingFace = e("\u{1F60F}", "Smirking Face");
export const neutralFace = e("\u{1F610}", "Neutral Face");
export const expressionlessFace = e("\u{1F611}", "Expressionless Face");
export const unamusedFace = e("\u{1F612}", "Unamused Face");
export const downcastFaceWithSweat = e("\u{1F613}", "Downcast Face with Sweat");
export const pensiveFace = e("\u{1F614}", "Pensive Face");
export const confusedFace = e("\u{1F615}", "Confused Face");
export const confoundedFace = e("\u{1F616}", "Confounded Face");
export const kissingFace = e("\u{1F617}", "Kissing Face");
export const faceBlowingAKiss = e("\u{1F618}", "Face Blowing a Kiss");
export const kissingFaceWithSmilingEyes = e("\u{1F619}", "Kissing Face with Smiling Eyes");
export const kissingFaceWithClosedEyes = e("\u{1F61A}", "Kissing Face with Closed Eyes");
export const faceWithTongue = e("\u{1F61B}", "Face with Tongue");
export const winkingFaceWithTongue = e("\u{1F61C}", "Winking Face with Tongue");
export const squintingFaceWithTongue = e("\u{1F61D}", "Squinting Face with Tongue");
export const disappointedFace = e("\u{1F61E}", "Disappointed Face");
export const worriedFace = e("\u{1F61F}", "Worried Face");
export const angryFace = e("\u{1F620}", "Angry Face");
export const poutingFace = e("\u{1F621}", "Pouting Face");
export const cryingFace = e("\u{1F622}", "Crying Face");
export const perseveringFace = e("\u{1F623}", "Persevering Face");
export const faceWithSteamFromNose = e("\u{1F624}", "Face with Steam From Nose");
export const sadButRelievedFace = e("\u{1F625}", "Sad but Relieved Face");
export const frowningFaceWithOpenMouth = e("\u{1F626}", "Frowning Face with Open Mouth");
export const anguishedFace = e("\u{1F627}", "Anguished Face");
export const fearfulFace = e("\u{1F628}", "Fearful Face");
export const wearyFace = e("\u{1F629}", "Weary Face");
export const sleepyFace = e("\u{1F62A}", "Sleepy Face");
export const tiredFace = e("\u{1F62B}", "Tired Face");
export const grimacingFace = e("\u{1F62C}", "Grimacing Face");
export const loudlyCryingFace = e("\u{1F62D}", "Loudly Crying Face");
export const faceWithOpenMouth = e("\u{1F62E}", "Face with Open Mouth");
export const hushedFace = e("\u{1F62F}", "Hushed Face");
export const anxiousFaceWithSweat = e("\u{1F630}", "Anxious Face with Sweat");
export const faceScreamingInFear = e("\u{1F631}", "Face Screaming in Fear");
export const astonishedFace = e("\u{1F632}", "Astonished Face");
export const flushedFace = e("\u{1F633}", "Flushed Face");
export const sleepingFace = e("\u{1F634}", "Sleeping Face");
export const dizzyFace = e("\u{1F635}", "Dizzy Face");
export const faceWithoutMouth = e("\u{1F636}", "Face Without Mouth");
export const faceWithMedicalMask = e("\u{1F637}", "Face with Medical Mask");
export const grinningCatWithSmilingEyes = e("\u{1F638}", "Grinning Cat with Smiling Eyes");
export const catWithTearsOfJoy = e("\u{1F639}", "Cat with Tears of Joy");
export const grinningCat = e("\u{1F63A}", "Grinning Cat");
export const smilingCatWithHeartEyes = e("\u{1F63B}", "Smiling Cat with Heart-Eyes");
export const catWithWrySmile = e("\u{1F63C}", "Cat with Wry Smile");
export const kissingCat = e("\u{1F63D}", "Kissing Cat");
export const poutingCat = e("\u{1F63E}", "Pouting Cat");
export const cryingCat = e("\u{1F63F}", "Crying Cat");
export const wearyCat = e("\u{1F640}", "Weary Cat");
export const slightlyFrowningFace = e("\u{1F641}", "Slightly Frowning Face");
export const slightlySmilingFace = e("\u{1F642}", "Slightly Smiling Face");
export const updisdeDownFace = e("\u{1F643}", "Upside-Down Face");
export const faceWithRollingEyes = e("\u{1F644}", "Face with Rolling Eyes");
export const seeNoEvilMonkey = e("\u{1F648}", "See-No-Evil Monkey");
export const hearNoEvilMonkey = e("\u{1F649}", "Hear-No-Evil Monkey");
export const speakNoEvilMonkey = e("\u{1F64A}", "Speak-No-Evil Monkey");
export const zipperMouthFace = e("\u{1F910}", "Zipper-Mouth Face");
export const moneyMouthFace = e("\u{1F911}", "Money-Mouth Face");
export const faceWithThermometer = e("\u{1F912}", "Face with Thermometer");
export const nerdFace = e("\u{1F913}", "Nerd Face");
export const thinkingFace = e("\u{1F914}", "Thinking Face");
export const faceWithHeadBandage = e("\u{1F915}", "Face with Head-Bandage");
export const robot = e("\u{1F916}", "Robot");
export const huggingFace = e("\u{1F917}", "Hugging Face");
export const cowboyHatFace = e("\u{1F920}", "Cowboy Hat Face");
export const clownFace = e("\u{1F921}", "Clown Face");
export const nauseatedFace = e("\u{1F922}", "Nauseated Face");
export const rollingOnTheFloorLaughing = e("\u{1F923}", "Rolling on the Floor Laughing");
export const droolingFace = e("\u{1F924}", "Drooling Face");
export const lyingFace = e("\u{1F925}", "Lying Face");
export const sneezingFace = e("\u{1F927}", "Sneezing Face");
export const faceWithRaisedEyebrow = e("\u{1F928}", "Face with Raised Eyebrow");
export const starStruck = e("\u{1F929}", "Star-Struck");
export const zanyFace = e("\u{1F92A}", "Zany Face");
export const shushingFace = e("\u{1F92B}", "Shushing Face");
export const faceWithSymbolsOnMouth = e("\u{1F92C}", "Face with Symbols on Mouth");
export const faceWithHandOverMouth = e("\u{1F92D}", "Face with Hand Over Mouth");
export const faceVomitting = e("\u{1F92E}", "Face Vomiting");
export const explodingHead = e("\u{1F92F}", "Exploding Head");
export const smilingFaceWithHearts = e("\u{1F970}", "Smiling Face with Hearts");
export const yawningFace = e("\u{1F971}", "Yawning Face");
//export const smilingFaceWithTear = e("\u{1F972}", "Smiling Face with Tear");
export const partyingFace = e("\u{1F973}", "Partying Face");
export const woozyFace = e("\u{1F974}", "Woozy Face");
export const hotFace = e("\u{1F975}", "Hot Face");
export const coldFace = e("\u{1F976}", "Cold Face");
//export const disguisedFace = e("\u{1F978}", "Disguised Face");
export const pleadingFace = e("\u{1F97A}", "Pleading Face");
export const faceWithMonocle = e("\u{1F9D0}", "Face with Monocle");
export const skullAndCrossbones = e("\u{2620}\u{FE0F}", "Skull and Crossbones");
export const frowningFace = e("\u{2639}\u{FE0F}", "Frowning Face");
export const smilingFace = e("\u{263A}\u{FE0F}", "Smiling Face");
export const speakingHead = e("\u{1F5E3}\u{FE0F}", "Speaking Head");
export const bust = e("\u{1F464}", "Bust in Silhouette");
export const faces = gg("Faces", "Round emoji faces", {
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
    //smilingFaceWithTear,
    partyingFace,
    woozyFace,
    hotFace,
    coldFace,
    //disguisedFace,
    pleadingFace,
    faceWithMonocle,
    skullAndCrossbones,
    frowningFace,
    smilingFace,
    speakingHead,
    bust,
});
export const kissMark = e("\u{1F48B}", "Kiss Mark");
export const loveLetter = e("\u{1F48C}", "Love Letter");
export const beatingHeart = e("\u{1F493}", "Beating Heart");
export const brokenHeart = e("\u{1F494}", "Broken Heart");
export const twoHearts = e("\u{1F495}", "Two Hearts");
export const sparklingHeart = e("\u{1F496}", "Sparkling Heart");
export const growingHeart = e("\u{1F497}", "Growing Heart");
export const heartWithArrow = e("\u{1F498}", "Heart with Arrow");
export const blueHeart = e("\u{1F499}", "Blue Heart");
export const greenHeart = e("\u{1F49A}", "Green Heart");
export const yellowHeart = e("\u{1F49B}", "Yellow Heart");
export const purpleHeart = e("\u{1F49C}", "Purple Heart");
export const heartWithRibbon = e("\u{1F49D}", "Heart with Ribbon");
export const revolvingHearts = e("\u{1F49E}", "Revolving Hearts");
export const heartDecoration = e("\u{1F49F}", "Heart Decoration");
export const blackHeart = e("\u{1F5A4}", "Black Heart");
export const whiteHeart = e("\u{1F90D}", "White Heart");
export const brownHeart = e("\u{1F90E}", "Brown Heart");
export const orangeHeart = e("\u{1F9E1}", "Orange Heart");
export const heartExclamation = e("\u{2763}\u{FE0F}", "Heart Exclamation");
export const redHeart = e("\u{2764}\u{FE0F}", "Red Heart");
export const love = gg("Love", "Hearts and kisses", {
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
});
export const angerSymbol = e("\u{1F4A2}", "Anger Symbol");
export const bomb = e("\u{1F4A3}", "Bomb");
export const zzz = e("\u{1F4A4}", "Zzz");
export const collision = e("\u{1F4A5}", "Collision");
export const sweatDroplets = e("\u{1F4A6}", "Sweat Droplets");
export const dashingAway = e("\u{1F4A8}", "Dashing Away");
export const dizzy = e("\u{1F4AB}", "Dizzy");
export const speechBalloon = e("\u{1F4AC}", "Speech Balloon");
export const thoughtBalloon = e("\u{1F4AD}", "Thought Balloon");
export const hundredPoints = e("\u{1F4AF}", "Hundred Points");
export const hole = e("\u{1F573}\u{FE0F}", "Hole");
export const leftSpeechBubble = e("\u{1F5E8}\u{FE0F}", "Left Speech Bubble");
export const rightSpeechBubble = e("\u{1F5E9}\u{FE0F}", "Right Speech Bubble");
export const conversationBubbles2 = e("\u{1F5EA}\u{FE0F}", "Conversation Bubbles 2");
export const conversationBubbles3 = e("\u{1F5EB}\u{FE0F}", "Conversation Bubbles 3");
export const leftThoughtBubble = e("\u{1F5EC}\u{FE0F}", "Left Thought Bubble");
export const rightThoughtBubble = e("\u{1F5ED}\u{FE0F}", "Right Thought Bubble");
export const leftAngerBubble = e("\u{1F5EE}\u{FE0F}", "Left Anger Bubble");
export const rightAngerBubble = e("\u{1F5EF}\u{FE0F}", "Right Anger Bubble");
export const angerBubble = e("\u{1F5F0}\u{FE0F}", "Anger Bubble");
export const angerBubbleLightningBolt = e("\u{1F5F1}\u{FE0F}", "Anger Bubble Lightning");
export const lightningBolt = e("\u{1F5F2}\u{FE0F}", "Lightning Bolt");
export const cartoon = g("Cartoon", "Cartoon symbols", angerSymbol, bomb, zzz, collision, sweatDroplets, dashingAway, dizzy, speechBalloon, thoughtBalloon, hundredPoints, hole, leftSpeechBubble, rightSpeechBubble, conversationBubbles2, conversationBubbles3, leftThoughtBubble, rightThoughtBubble, leftAngerBubble, rightAngerBubble, angerBubble, angerBubbleLightningBolt, lightningBolt);
export const backhandIndexPointingUp = e("\u{1F446}", "Backhand Index Pointing Up");
export const backhandIndexPointingDown = e("\u{1F447}", "Backhand Index Pointing Down");
export const backhandIndexPointingLeft = e("\u{1F448}", "Backhand Index Pointing Left");
export const backhandIndexPointingRight = e("\u{1F449}", "Backhand Index Pointing Right");
export const oncomingFist = e("\u{1F44A}", "Oncoming Fist");
export const wavingHand = e("\u{1F44B}", "Waving Hand");
export const okHand = e("\u{1F58F}", "OK Hand");
export const thumbsUp = e("\u{1F44D}", "Thumbs Up");
export const thumbsDown = e("\u{1F44E}", "Thumbs Down");
export const clappingHands = e("\u{1F44F}", "Clapping Hands");
export const openHands = e("\u{1F450}", "Open Hands");
export const nailPolish = e("\u{1F485}", "Nail Polish");
export const handsWithFingersSplayed = e("\u{1F590}\u{FE0F}", "Hand with Fingers Splayed");
export const handsWithFingersSplayed2 = e("\u{1F591}\u{FE0F}", "Hand with Fingers Splayed 2");
export const thumbsUp2 = e("\u{1F592}", "Thumbs Up 2");
export const thumbsDown2 = e("\u{1F593}", "Thumbs Down 2");
export const peaceFingers = e("\u{1F594}", "Peace Fingers");
export const middleFinger = e("\u{1F595}", "Middle Finger");
export const vulcanSalute = e("\u{1F596}", "Vulcan Salute");
export const handPointingDown = e("\u{1F597}", "Hand Pointing Down");
export const handPointingLeft = e("\u{1F598}", "Hand Pointing Left");
export const handPointingRight = e("\u{1F599}", "Hand Pointing Right");
export const handPointingLeft2 = e("\u{1F59A}", "Hand Pointing Left 2");
export const handPointingRight2 = e("\u{1F59B}", "Hand Pointing Right 2");
export const indexPointingLeft = e("\u{1F59C}", "Index Pointing Left");
export const indexPointingRight = e("\u{1F59D}", "Index Pointing Right");
export const indexPointingUp = e("\u{1F59E}", "Index Pointing Up");
export const indexPointingDown = e("\u{1F59F}", "Index Pointing Down");
export const indexPointingUp2 = e("\u{1F5A0}", "Index Pointing Up 2");
export const indexPointingDown2 = e("\u{1F5A1}", "Index Pointing Down 2");
export const indexPointingUp3 = e("\u{1F5A2}", "Index Pointing Up 3");
export const indexPointingDown3 = e("\u{1F5A3}", "Index Pointing Down 3");
export const raisingHands = e("\u{1F64C}", "Raising Hands");
export const foldedHands = e("\u{1F64F}", "Folded Hands");
//export const pinchedFingers = e("\u{1F90C}", "Pinched Fingers");
export const pinchingHand = e("\u{1F90F}", "Pinching Hand");
export const signOfTheHorns = e("\u{1F918}", "Sign of the Horns");
export const callMeHand = e("\u{1F919}", "Call Me Hand");
export const rasiedBackOfHand = e("\u{1F91A}", "Raised Back of Hand");
export const leftFacingFist = e("\u{1F91B}", "Left-Facing Fist");
export const rightFacingFist = e("\u{1F91C}", "Right-Facing Fist");
export const handshake = e("\u{1F91D}", "Handshake");
export const crossedFingers = e("\u{1F91E}", "Crossed Fingers");
export const loveYouGesture = e("\u{1F91F}", "Love-You Gesture");
export const palmsUpTogether = e("\u{1F932}", "Palms Up Together");
export const indexPointingUp4 = e("\u{261D}\u{FE0F}", "Index Pointing Up 4");
export const raisedFist = e("\u{270A}", "Raised Fist");
export const raisedHand = e("\u{270B}", "Raised Hand");
export const victoryHand = e("\u{270C}\u{FE0F}", "Victory Hand");
export const writingHand = e("\u{270D}\u{FE0F}", "Writing Hand");
export const hands = g("Hands", "Hands pointing at things", backhandIndexPointingUp, backhandIndexPointingDown, backhandIndexPointingLeft, backhandIndexPointingRight, oncomingFist, wavingHand, okHand, thumbsUp, thumbsDown, clappingHands, openHands, nailPolish, handsWithFingersSplayed, handsWithFingersSplayed2, handsWithFingersSplayed2, thumbsUp2, thumbsDown2, peaceFingers, middleFinger, vulcanSalute, handPointingDown, handPointingLeft, handPointingRight, handPointingLeft2, handPointingRight2, indexPointingLeft, indexPointingRight, indexPointingUp, indexPointingDown, indexPointingUp2, indexPointingDown2, indexPointingUp3, indexPointingDown3, raisingHands, foldedHands, 
//pinchedFingers,
pinchingHand, signOfTheHorns, callMeHand, rasiedBackOfHand, leftFacingFist, rightFacingFist, handshake, crossedFingers, loveYouGesture, palmsUpTogether, indexPointingUp4, raisedFist, raisedHand, victoryHand, writingHand);
export const bodyParts = g("Body Parts", "General body parts", e("\u{1F440}", "Eyes"), e("\u{1F441}\u{FE0F}", "Eye"), e("\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", "Eye in Speech Bubble"), e("\u{1F442}", "Ear"), e("\u{1F443}", "Nose"), e("\u{1F444}", "Mouth"), e("\u{1F445}", "Tongue"), e("\u{1F4AA}", "Flexed Biceps"), e("\u{1F933}", "Selfie"), e("\u{1F9B4}", "Bone"), e("\u{1F9B5}", "Leg"), e("\u{1F9B6}", "Foot"), e("\u{1F9B7}", "Tooth"), e("\u{1F9BB}", "Ear with Hearing Aid"), e("\u{1F9BE}", "Mechanical Arm"), e("\u{1F9BF}", "Mechanical Leg"), 
//e("\u{1FAC0}", "Anatomical Heart"),
//e("\u{1FAC1}", "Lungs"),
e("\u{1F9E0}", "Brain"));
export const animals = g("Animals", "Animals and insects", e("\u{1F400}", "Rat"), e("\u{1F401}", "Mouse"), e("\u{1F402}", "Ox"), e("\u{1F403}", "Water Buffalo"), e("\u{1F404}", "Cow"), e("\u{1F405}", "Tiger"), e("\u{1F406}", "Leopard"), e("\u{1F407}", "Rabbit"), e("\u{1F408}", "Cat"), 
//e("\u{1F408}\u{200D}\u{2B1B}", "Black Cat"),
e("\u{1F409}", "Dragon"), e("\u{1F40A}", "Crocodile"), e("\u{1F40B}", "Whale"), e("\u{1F40C}", "Snail"), e("\u{1F40D}", "Snake"), e("\u{1F40E}", "Horse"), e("\u{1F40F}", "Ram"), e("\u{1F410}", "Goat"), e("\u{1F411}", "Ewe"), e("\u{1F412}", "Monkey"), e("\u{1F413}", "Rooster"), e("\u{1F414}", "Chicken"), e("\u{1F415}", "Dog"), e("\u{1F415}\u{200D}\u{1F9BA}", "Service Dog"), e("\u{1F416}", "Pig"), e("\u{1F417}", "Boar"), e("\u{1F418}", "Elephant"), e("\u{1F419}", "Octopus"), e("\u{1F41A}", "Spiral Shell"), e("\u{1F41B}", "Bug"), e("\u{1F41C}", "Ant"), e("\u{1F41D}", "Honeybee"), e("\u{1F41E}", "Lady Beetle"), e("\u{1F41F}", "Fish"), e("\u{1F420}", "Tropical Fish"), e("\u{1F421}", "Blowfish"), e("\u{1F422}", "Turtle"), e("\u{1F423}", "Hatching Chick"), e("\u{1F424}", "Baby Chick"), e("\u{1F425}", "Front-Facing Baby Chick"), e("\u{1F426}", "Bird"), e("\u{1F427}", "Penguin"), e("\u{1F428}", "Koala"), e("\u{1F429}", "Poodle"), e("\u{1F42A}", "Camel"), e("\u{1F42B}", "Two-Hump Camel"), e("\u{1F42C}", "Dolphin"), e("\u{1F42D}", "Mouse Face"), e("\u{1F42E}", "Cow Face"), e("\u{1F42F}", "Tiger Face"), e("\u{1F430}", "Rabbit Face"), e("\u{1F431}", "Cat Face"), e("\u{1F432}", "Dragon Face"), e("\u{1F433}", "Spouting Whale"), e("\u{1F434}", "Horse Face"), e("\u{1F435}", "Monkey Face"), e("\u{1F436}", "Dog Face"), e("\u{1F437}", "Pig Face"), e("\u{1F438}", "Frog"), e("\u{1F439}", "Hamster"), e("\u{1F43A}", "Wolf"), e("\u{1F43B}", "Bear"), e("\u{1F43B}\u{200D}\u{2744}\u{FE0F}", "Polar Bear"), e("\u{1F43C}", "Panda"), e("\u{1F43D}", "Pig Nose"), e("\u{1F43E}", "Paw Prints"), e("\u{1F43F}\u{FE0F}", "Chipmunk"), e("\u{1F54A}\u{FE0F}", "Dove"), e("\u{1F577}\u{FE0F}", "Spider"), e("\u{1F578}\u{FE0F}", "Spider Web"), e("\u{1F981}", "Lion"), e("\u{1F982}", "Scorpion"), e("\u{1F983}", "Turkey"), e("\u{1F984}", "Unicorn"), e("\u{1F985}", "Eagle"), e("\u{1F986}", "Duck"), e("\u{1F987}", "Bat"), e("\u{1F988}", "Shark"), e("\u{1F989}", "Owl"), e("\u{1F98A}", "Fox"), e("\u{1F98B}", "Butterfly"), e("\u{1F98C}", "Deer"), e("\u{1F98D}", "Gorilla"), e("\u{1F98E}", "Lizard"), e("\u{1F98F}", "Rhinoceros"), e("\u{1F992}", "Giraffe"), e("\u{1F993}", "Zebra"), e("\u{1F994}", "Hedgehog"), e("\u{1F995}", "Sauropod"), e("\u{1F996}", "T-Rex"), e("\u{1F997}", "Cricket"), e("\u{1F998}", "Kangaroo"), e("\u{1F999}", "Llama"), e("\u{1F99A}", "Peacock"), e("\u{1F99B}", "Hippopotamus"), e("\u{1F99C}", "Parrot"), e("\u{1F99D}", "Raccoon"), e("\u{1F99F}", "Mosquito"), e("\u{1F9A0}", "Microbe"), e("\u{1F9A1}", "Badger"), e("\u{1F9A2}", "Swan"), 
//e("\u{1F9A3}", "Mammoth"),
//e("\u{1F9A4}", "Dodo"),
e("\u{1F9A5}", "Sloth"), e("\u{1F9A6}", "Otter"), e("\u{1F9A7}", "Orangutan"), e("\u{1F9A8}", "Skunk"), e("\u{1F9A9}", "Flamingo"), 
//e("\u{1F9AB}", "Beaver"),
//e("\u{1F9AC}", "Bison"),
//e("\u{1F9AD}", "Seal"),
//e("\u{1FAB0}", "Fly"),
//e("\u{1FAB1}", "Worm"),
//e("\u{1FAB2}", "Beetle"),
//e("\u{1FAB3}", "Cockroach"),
//e("\u{1FAB6}", "Feather"),
e("\u{1F9AE}", "Guide Dog"));
export const whiteFlower = e("\u{1F4AE}", "White Flower");
export const plants = g("Plants", "Flowers, trees, and things", e("\u{1F331}", "Seedling"), e("\u{1F332}", "Evergreen Tree"), e("\u{1F333}", "Deciduous Tree"), e("\u{1F334}", "Palm Tree"), e("\u{1F335}", "Cactus"), e("\u{1F337}", "Tulip"), e("\u{1F338}", "Cherry Blossom"), e("\u{1F339}", "Rose"), e("\u{1F33A}", "Hibiscus"), e("\u{1F33B}", "Sunflower"), e("\u{1F33C}", "Blossom"), sheafOfRice, e("\u{1F33F}", "Herb"), e("\u{1F340}", "Four Leaf Clover"), e("\u{1F341}", "Maple Leaf"), e("\u{1F342}", "Fallen Leaf"), e("\u{1F343}", "Leaf Fluttering in Wind"), e("\u{1F3F5}\u{FE0F}", "Rosette"), e("\u{1F490}", "Bouquet"), whiteFlower, e("\u{1F940}", "Wilted Flower"), 
//e("\u{1FAB4}", "Potted Plant"),
e("\u{2618}\u{FE0F}", "Shamrock"));
export const banana = e("\u{1F34C}", "Banana");
export const food = g("Food", "Food, drink, and utensils", e("\u{1F32D}", "Hot Dog"), e("\u{1F32E}", "Taco"), e("\u{1F32F}", "Burrito"), e("\u{1F330}", "Chestnut"), e("\u{1F336}\u{FE0F}", "Hot Pepper"), e("\u{1F33D}", "Ear of Corn"), e("\u{1F344}", "Mushroom"), e("\u{1F345}", "Tomato"), e("\u{1F346}", "Eggplant"), e("\u{1F347}", "Grapes"), e("\u{1F348}", "Melon"), e("\u{1F349}", "Watermelon"), e("\u{1F34A}", "Tangerine"), e("\u{1F34B}", "Lemon"), banana, e("\u{1F34D}", "Pineapple"), e("\u{1F34E}", "Red Apple"), e("\u{1F34F}", "Green Apple"), e("\u{1F350}", "Pear"), e("\u{1F351}", "Peach"), e("\u{1F352}", "Cherries"), e("\u{1F353}", "Strawberry"), e("\u{1F354}", "Hamburger"), e("\u{1F355}", "Pizza"), e("\u{1F356}", "Meat on Bone"), e("\u{1F357}", "Poultry Leg"), e("\u{1F358}", "Rice Cracker"), e("\u{1F359}", "Rice Ball"), e("\u{1F35A}", "Cooked Rice"), e("\u{1F35B}", "Curry Rice"), e("\u{1F35C}", "Steaming Bowl"), e("\u{1F35D}", "Spaghetti"), e("\u{1F35E}", "Bread"), e("\u{1F35F}", "French Fries"), e("\u{1F360}", "Roasted Sweet Potato"), e("\u{1F361}", "Dango"), e("\u{1F362}", "Oden"), e("\u{1F363}", "Sushi"), e("\u{1F364}", "Fried Shrimp"), e("\u{1F365}", "Fish Cake with Swirl"), e("\u{1F371}", "Bento Box"), e("\u{1F372}", "Pot of Food"), cooking, e("\u{1F37F}", "Popcorn"), e("\u{1F950}", "Croissant"), e("\u{1F951}", "Avocado"), e("\u{1F952}", "Cucumber"), e("\u{1F953}", "Bacon"), e("\u{1F954}", "Potato"), e("\u{1F955}", "Carrot"), e("\u{1F956}", "Baguette Bread"), e("\u{1F957}", "Green Salad"), e("\u{1F958}", "Shallow Pan of Food"), e("\u{1F959}", "Stuffed Flatbread"), e("\u{1F95A}", "Egg"), e("\u{1F95C}", "Peanuts"), e("\u{1F95D}", "Kiwi Fruit"), e("\u{1F95E}", "Pancakes"), e("\u{1F95F}", "Dumpling"), e("\u{1F960}", "Fortune Cookie"), e("\u{1F961}", "Takeout Box"), e("\u{1F963}", "Bowl with Spoon"), e("\u{1F965}", "Coconut"), e("\u{1F966}", "Broccoli"), e("\u{1F968}", "Pretzel"), e("\u{1F969}", "Cut of Meat"), e("\u{1F96A}", "Sandwich"), e("\u{1F96B}", "Canned Food"), e("\u{1F96C}", "Leafy Green"), e("\u{1F96D}", "Mango"), e("\u{1F96E}", "Moon Cake"), e("\u{1F96F}", "Bagel"), e("\u{1F980}", "Crab"), e("\u{1F990}", "Shrimp"), e("\u{1F991}", "Squid"), e("\u{1F99E}", "Lobster"), e("\u{1F9AA}", "Oyster"), e("\u{1F9C0}", "Cheese Wedge"), e("\u{1F9C2}", "Salt"), e("\u{1F9C4}", "Garlic"), e("\u{1F9C5}", "Onion"), e("\u{1F9C6}", "Falafel"), e("\u{1F9C7}", "Waffle"), e("\u{1F9C8}", "Butter"), 
//e("\u{1FAD0}", "Blueberries"),
//e("\u{1FAD1}", "Bell Pepper"),
//e("\u{1FAD2}", "Olive"),
//e("\u{1FAD3}", "Flatbread"),
//e("\u{1FAD4}", "Tamale"),
//e("\u{1FAD5}", "Fondue"),
e("\u{1F366}", "Soft Ice Cream"), e("\u{1F367}", "Shaved Ice"), e("\u{1F368}", "Ice Cream"), e("\u{1F369}", "Doughnut"), e("\u{1F36A}", "Cookie"), e("\u{1F36B}", "Chocolate Bar"), e("\u{1F36C}", "Candy"), e("\u{1F36D}", "Lollipop"), e("\u{1F36E}", "Custard"), e("\u{1F36F}", "Honey Pot"), e("\u{1F370}", "Shortcake"), e("\u{1F382}", "Birthday Cake"), e("\u{1F967}", "Pie"), e("\u{1F9C1}", "Cupcake"), e("\u{1F375}", "Teacup Without Handle"), e("\u{1F376}", "Sake"), e("\u{1F377}", "Wine Glass"), e("\u{1F378}", "Cocktail Glass"), e("\u{1F379}", "Tropical Drink"), e("\u{1F37A}", "Beer Mug"), e("\u{1F37B}", "Clinking Beer Mugs"), e("\u{1F37C}", "Baby Bottle"), e("\u{1F37E}", "Bottle with Popping Cork"), e("\u{1F942}", "Clinking Glasses"), e("\u{1F943}", "Tumbler Glass"), e("\u{1F95B}", "Glass of Milk"), e("\u{1F964}", "Cup with Straw"), e("\u{1F9C3}", "Beverage Box"), e("\u{1F9C9}", "Mate"), e("\u{1F9CA}", "Ice"), 
//e("\u{1F9CB}", "Bubble Tea"),
//e("\u{1FAD6}", "Teapot"),
e("\u{2615}", "Hot Beverage"), e("\u{1F374}", "Fork and Knife"), e("\u{1F37D}\u{FE0F}", "Fork and Knife with Plate"), e("\u{1F3FA}", "Amphora"), e("\u{1F52A}", "Kitchen Knife"), e("\u{1F944}", "Spoon"), e("\u{1F962}", "Chopsticks"));
export const nations = g("National Flags", "Flags of countries from around the world", e("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island"), e("\u{1F1E6}\u{1F1E9}", "Flag: Andorra"), e("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates"), e("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan"), e("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda"), e("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla"), e("\u{1F1E6}\u{1F1F1}", "Flag: Albania"), e("\u{1F1E6}\u{1F1F2}", "Flag: Armenia"), e("\u{1F1E6}\u{1F1F4}", "Flag: Angola"), e("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica"), e("\u{1F1E6}\u{1F1F7}", "Flag: Argentina"), e("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa"), e("\u{1F1E6}\u{1F1F9}", "Flag: Austria"), e("\u{1F1E6}\u{1F1FA}", "Flag: Australia"), e("\u{1F1E6}\u{1F1FC}", "Flag: Aruba"), e("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands"), e("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan"), e("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina"), e("\u{1F1E7}\u{1F1E7}", "Flag: Barbados"), e("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh"), e("\u{1F1E7}\u{1F1EA}", "Flag: Belgium"), e("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso"), e("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria"), e("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain"), e("\u{1F1E7}\u{1F1EE}", "Flag: Burundi"), e("\u{1F1E7}\u{1F1EF}", "Flag: Benin"), e("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy"), e("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda"), e("\u{1F1E7}\u{1F1F3}", "Flag: Brunei"), e("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia"), e("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands"), e("\u{1F1E7}\u{1F1F7}", "Flag: Brazil"), e("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas"), e("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan"), e("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island"), e("\u{1F1E7}\u{1F1FC}", "Flag: Botswana"), e("\u{1F1E7}\u{1F1FE}", "Flag: Belarus"), e("\u{1F1E7}\u{1F1FF}", "Flag: Belize"), e("\u{1F1E8}\u{1F1E6}", "Flag: Canada"), e("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands"), e("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa"), e("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic"), e("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville"), e("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland"), e("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire"), e("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands"), e("\u{1F1E8}\u{1F1F1}", "Flag: Chile"), e("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon"), e("\u{1F1E8}\u{1F1F3}", "Flag: China"), e("\u{1F1E8}\u{1F1F4}", "Flag: Colombia"), e("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island"), e("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica"), e("\u{1F1E8}\u{1F1FA}", "Flag: Cuba"), e("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde"), e("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao"), e("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island"), e("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus"), e("\u{1F1E8}\u{1F1FF}", "Flag: Czechia"), e("\u{1F1E9}\u{1F1EA}", "Flag: Germany"), e("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia"), e("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti"), e("\u{1F1E9}\u{1F1F0}", "Flag: Denmark"), e("\u{1F1E9}\u{1F1F2}", "Flag: Dominica"), e("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic"), e("\u{1F1E9}\u{1F1FF}", "Flag: Algeria"), e("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla"), e("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador"), e("\u{1F1EA}\u{1F1EA}", "Flag: Estonia"), e("\u{1F1EA}\u{1F1EC}", "Flag: Egypt"), e("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara"), e("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea"), e("\u{1F1EA}\u{1F1F8}", "Flag: Spain"), e("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia"), e("\u{1F1EA}\u{1F1FA}", "Flag: European Union"), e("\u{1F1EB}\u{1F1EE}", "Flag: Finland"), e("\u{1F1EB}\u{1F1EF}", "Flag: Fiji"), e("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands"), e("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia"), e("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands"), e("\u{1F1EB}\u{1F1F7}", "Flag: France"), e("\u{1F1EC}\u{1F1E6}", "Flag: Gabon"), e("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom"), e("\u{1F1EC}\u{1F1E9}", "Flag: Grenada"), e("\u{1F1EC}\u{1F1EA}", "Flag: Georgia"), e("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana"), e("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey"), e("\u{1F1EC}\u{1F1ED}", "Flag: Ghana"), e("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar"), e("\u{1F1EC}\u{1F1F1}", "Flag: Greenland"), e("\u{1F1EC}\u{1F1F2}", "Flag: Gambia"), e("\u{1F1EC}\u{1F1F3}", "Flag: Guinea"), e("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe"), e("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea"), e("\u{1F1EC}\u{1F1F7}", "Flag: Greece"), e("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands"), e("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala"), e("\u{1F1EC}\u{1F1FA}", "Flag: Guam"), e("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau"), e("\u{1F1EC}\u{1F1FE}", "Flag: Guyana"), e("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China"), e("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands"), e("\u{1F1ED}\u{1F1F3}", "Flag: Honduras"), e("\u{1F1ED}\u{1F1F7}", "Flag: Croatia"), e("\u{1F1ED}\u{1F1F9}", "Flag: Haiti"), e("\u{1F1ED}\u{1F1FA}", "Flag: Hungary"), e("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands"), e("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia"), e("\u{1F1EE}\u{1F1EA}", "Flag: Ireland"), e("\u{1F1EE}\u{1F1F1}", "Flag: Israel"), e("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man"), e("\u{1F1EE}\u{1F1F3}", "Flag: India"), e("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory"), e("\u{1F1EE}\u{1F1F6}", "Flag: Iraq"), e("\u{1F1EE}\u{1F1F7}", "Flag: Iran"), e("\u{1F1EE}\u{1F1F8}", "Flag: Iceland"), e("\u{1F1EE}\u{1F1F9}", "Flag: Italy"), e("\u{1F1EF}\u{1F1EA}", "Flag: Jersey"), e("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica"), e("\u{1F1EF}\u{1F1F4}", "Flag: Jordan"), e("\u{1F1EF}\u{1F1F5}", "Flag: Japan"), e("\u{1F1F0}\u{1F1EA}", "Flag: Kenya"), e("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan"), e("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia"), e("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati"), e("\u{1F1F0}\u{1F1F2}", "Flag: Comoros"), e("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis"), e("\u{1F1F0}\u{1F1F5}", "Flag: North Korea"), e("\u{1F1F0}\u{1F1F7}", "Flag: South Korea"), e("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait"), e("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands"), e("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan"), e("\u{1F1F1}\u{1F1E6}", "Flag: Laos"), e("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon"), e("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia"), e("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein"), e("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka"), e("\u{1F1F1}\u{1F1F7}", "Flag: Liberia"), e("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho"), e("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania"), e("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg"), e("\u{1F1F1}\u{1F1FB}", "Flag: Latvia"), e("\u{1F1F1}\u{1F1FE}", "Flag: Libya"), e("\u{1F1F2}\u{1F1E6}", "Flag: Morocco"), e("\u{1F1F2}\u{1F1E8}", "Flag: Monaco"), e("\u{1F1F2}\u{1F1E9}", "Flag: Moldova"), e("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro"), e("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin"), e("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar"), e("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands"), e("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia"), e("\u{1F1F2}\u{1F1F1}", "Flag: Mali"), e("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)"), e("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia"), e("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China"), e("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands"), e("\u{1F1F2}\u{1F1F6}", "Flag: Martinique"), e("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania"), e("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat"), e("\u{1F1F2}\u{1F1F9}", "Flag: Malta"), e("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius"), e("\u{1F1F2}\u{1F1FB}", "Flag: Maldives"), e("\u{1F1F2}\u{1F1FC}", "Flag: Malawi"), e("\u{1F1F2}\u{1F1FD}", "Flag: Mexico"), e("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia"), e("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique"), e("\u{1F1F3}\u{1F1E6}", "Flag: Namibia"), e("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia"), e("\u{1F1F3}\u{1F1EA}", "Flag: Niger"), e("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island"), e("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria"), e("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua"), e("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands"), e("\u{1F1F3}\u{1F1F4}", "Flag: Norway"), e("\u{1F1F3}\u{1F1F5}", "Flag: Nepal"), e("\u{1F1F3}\u{1F1F7}", "Flag: Nauru"), e("\u{1F1F3}\u{1F1FA}", "Flag: Niue"), e("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand"), e("\u{1F1F4}\u{1F1F2}", "Flag: Oman"), e("\u{1F1F5}\u{1F1E6}", "Flag: Panama"), e("\u{1F1F5}\u{1F1EA}", "Flag: Peru"), e("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia"), e("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea"), e("\u{1F1F5}\u{1F1ED}", "Flag: Philippines"), e("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan"), e("\u{1F1F5}\u{1F1F1}", "Flag: Poland"), e("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon"), e("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands"), e("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico"), e("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories"), e("\u{1F1F5}\u{1F1F9}", "Flag: Portugal"), e("\u{1F1F5}\u{1F1FC}", "Flag: Palau"), e("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay"), e("\u{1F1F6}\u{1F1E6}", "Flag: Qatar"), e("\u{1F1F7}\u{1F1EA}", "Flag: Réunion"), e("\u{1F1F7}\u{1F1F4}", "Flag: Romania"), e("\u{1F1F7}\u{1F1F8}", "Flag: Serbia"), e("\u{1F1F7}\u{1F1FA}", "Flag: Russia"), e("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda"), e("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia"), e("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands"), e("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles"), e("\u{1F1F8}\u{1F1E9}", "Flag: Sudan"), e("\u{1F1F8}\u{1F1EA}", "Flag: Sweden"), e("\u{1F1F8}\u{1F1EC}", "Flag: Singapore"), e("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena"), e("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia"), e("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen"), e("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia"), e("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone"), e("\u{1F1F8}\u{1F1F2}", "Flag: San Marino"), e("\u{1F1F8}\u{1F1F3}", "Flag: Senegal"), e("\u{1F1F8}\u{1F1F4}", "Flag: Somalia"), e("\u{1F1F8}\u{1F1F7}", "Flag: Suriname"), e("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan"), e("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe"), e("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador"), e("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten"), e("\u{1F1F8}\u{1F1FE}", "Flag: Syria"), e("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini"), e("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha"), e("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands"), e("\u{1F1F9}\u{1F1E9}", "Flag: Chad"), e("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories"), e("\u{1F1F9}\u{1F1EC}", "Flag: Togo"), e("\u{1F1F9}\u{1F1ED}", "Flag: Thailand"), e("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan"), e("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau"), e("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste"), e("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan"), e("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia"), e("\u{1F1F9}\u{1F1F4}", "Flag: Tonga"), e("\u{1F1F9}\u{1F1F7}", "Flag: Turkey"), e("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago"), e("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu"), e("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan"), e("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania"), e("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine"), e("\u{1F1FA}\u{1F1EC}", "Flag: Uganda"), e("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands"), e("\u{1F1FA}\u{1F1F3}", "Flag: United Nations"), e("\u{1F1FA}\u{1F1F8}", "Flag: United States"), e("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay"), e("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan"), e("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City"), e("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines"), e("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela"), e("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands"), e("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands"), e("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam"), e("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu"), e("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna"), e("\u{1F1FC}\u{1F1F8}", "Flag: Samoa"), e("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo"), e("\u{1F1FE}\u{1F1EA}", "Flag: Yemen"), e("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte"), e("\u{1F1FF}\u{1F1E6}", "Flag: South Africa"), e("\u{1F1FF}\u{1F1F2}", "Flag: Zambia"), e("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"));
export const flags = g("Flags", "Basic flags", e("\u{1F38C}", "Crossed Flags"), e("\u{1F3C1}", "Chequered Flag"), e("\u{1F3F3}\u{FE0F}", "White Flag"), e("\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", "Rainbow Flag"), 
//e("\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", "Transgender Flag"),
e("\u{1F3F4}", "Black Flag"), 
//e("\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", "Pirate Flag"),
e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"), e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"), e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"), e("\u{1F6A9}", "Triangular Flag"));
export const motorcycle = e("\u{1F3CD}\u{FE0F}", "Motorcycle");
export const racingCar = e("\u{1F3CE}\u{FE0F}", "Racing Car");
export const seat = e("\u{1F4BA}", "Seat");
export const helicopter = e("\u{1F681}", "Helicopter");
export const locomotive = e("\u{1F682}", "Locomotive");
export const railwayCar = e("\u{1F683}", "Railway Car");
export const highspeedTrain = e("\u{1F684}", "High-Speed Train");
export const bulletTrain = e("\u{1F685}", "Bullet Train");
export const train = e("\u{1F686}", "Train");
export const metro = e("\u{1F687}", "Metro");
export const lightRail = e("\u{1F688}", "Light Rail");
export const station = e("\u{1F689}", "Station");
export const tram = e("\u{1F68A}", "Tram");
export const tramCar = e("\u{1F68B}", "Tram Car");
export const bus = e("\u{1F68C}", "Bus");
export const oncomingBus = e("\u{1F68D}", "Oncoming Bus");
export const trolleyBus = e("\u{1F68E}", "Trolleybus");
export const busStop = e("\u{1F68F}", "Bus Stop");
export const miniBus = e("\u{1F690}", "Minibus");
export const ambulance = e("\u{1F691}", "Ambulance");
export const policeCar = e("\u{1F693}", "Police Car");
export const oncomingPoliceCar = e("\u{1F694}", "Oncoming Police Car");
export const taxi = e("\u{1F695}", "Taxi");
export const oncomingTaxi = e("\u{1F696}", "Oncoming Taxi");
export const automobile = e("\u{1F697}", "Automobile");
export const oncomingAutomobile = e("\u{1F698}", "Oncoming Automobile");
export const sportUtilityVehicle = e("\u{1F699}", "Sport Utility Vehicle");
export const deliveryTruck = e("\u{1F69A}", "Delivery Truck");
export const articulatedLorry = e("\u{1F69B}", "Articulated Lorry");
export const tractor = e("\u{1F69C}", "Tractor");
export const monorail = e("\u{1F69D}", "Monorail");
export const mountainRailway = e("\u{1F69E}", "Mountain Railway");
export const suspensionRailway = e("\u{1F69F}", "Suspension Railway");
export const mountainCableway = e("\u{1F6A0}", "Mountain Cableway");
export const aerialTramway = e("\u{1F6A1}", "Aerial Tramway");
export const ship = e("\u{1F6A2}", "Ship");
export const speedBoat = e("\u{1F6A4}", "Speedboat");
export const horizontalTrafficLight = e("\u{1F6A5}", "Horizontal Traffic Light");
export const verticalTrafficLight = e("\u{1F6A6}", "Vertical Traffic Light");
export const construction = e("\u{1F6A7}", "Construction");
export const policeCarLight = e("\u{1F6A8}", "Police Car Light");
export const bicycle = e("\u{1F6B2}", "Bicycle");
export const stopSign = e("\u{1F6D1}", "Stop Sign");
export const oilDrum = e("\u{1F6E2}\u{FE0F}", "Oil Drum");
export const motorway = e("\u{1F6E3}\u{FE0F}", "Motorway");
export const railwayTrack = e("\u{1F6E4}\u{FE0F}", "Railway Track");
export const motorBoat = e("\u{1F6E5}\u{FE0F}", "Motor Boat");
export const smallAirplane = e("\u{1F6E9}\u{FE0F}", "Small Airplane");
export const airplaneDeparture = e("\u{1F6EB}", "Airplane Departure");
export const airplaneArrival = e("\u{1F6EC}", "Airplane Arrival");
export const satellite = e("\u{1F6F0}\u{FE0F}", "Satellite");
export const passengerShip = e("\u{1F6F3}\u{FE0F}", "Passenger Ship");
export const kickScooter = e("\u{1F6F4}", "Kick Scooter");
export const motorScooter = e("\u{1F6F5}", "Motor Scooter");
export const canoe = e("\u{1F6F6}", "Canoe");
export const flyingSaucer = e("\u{1F6F8}", "Flying Saucer");
export const skateboard = e("\u{1F6F9}", "Skateboard");
export const autoRickshaw = e("\u{1F6FA}", "Auto Rickshaw");
//export const pickupTruck = e("\u{1F6FB}", "Pickup Truck");
//export const rollerSkate = e("\u{1F6FC}", "Roller Skate");
export const parachute = e("\u{1FA82}", "Parachute");
export const anchor = e("\u{2693}", "Anchor");
export const ferry = e("\u{26F4}\u{FE0F}", "Ferry");
export const sailboat = e("\u{26F5}", "Sailboat");
export const fuelPump = e("\u{26FD}", "Fuel Pump");
export const vehicles = g("Vehicles", "Things that go", motorcycle, racingCar, seat, rocket, helicopter, locomotive, railwayCar, highspeedTrain, bulletTrain, train, metro, lightRail, station, tram, tramCar, bus, oncomingBus, trolleyBus, busStop, miniBus, ambulance, fireEngine, taxi, oncomingTaxi, automobile, oncomingAutomobile, sportUtilityVehicle, deliveryTruck, articulatedLorry, tractor, monorail, mountainRailway, suspensionRailway, mountainCableway, aerialTramway, ship, speedBoat, horizontalTrafficLight, verticalTrafficLight, construction, bicycle, stopSign, oilDrum, motorway, railwayTrack, motorBoat, smallAirplane, airplaneDeparture, airplaneArrival, satellite, passengerShip, kickScooter, motorScooter, canoe, flyingSaucer, skateboard, autoRickshaw, 
//pickupTruck,
//rollerSkate,
motorizedWheelchair, manualWheelchair, parachute, anchor, ferry, sailboat, fuelPump, airplane);
export const bloodTypes = g("Blood Types", "Blood types", e("\u{1F170}", "A Button (Blood Type)"), e("\u{1F171}", "B Button (Blood Type)"), e("\u{1F17E}", "O Button (Blood Type)"), e("\u{1F18E}", "AB Button (Blood Type)"));
export const regionIndicators = g("Regions", "Region indicators", e("\u{1F1E6}", "Regional Indicator Symbol Letter A"), e("\u{1F1E7}", "Regional Indicator Symbol Letter B"), e("\u{1F1E8}", "Regional Indicator Symbol Letter C"), e("\u{1F1E9}", "Regional Indicator Symbol Letter D"), e("\u{1F1EA}", "Regional Indicator Symbol Letter E"), e("\u{1F1EB}", "Regional Indicator Symbol Letter F"), e("\u{1F1EC}", "Regional Indicator Symbol Letter G"), e("\u{1F1ED}", "Regional Indicator Symbol Letter H"), e("\u{1F1EE}", "Regional Indicator Symbol Letter I"), e("\u{1F1EF}", "Regional Indicator Symbol Letter J"), e("\u{1F1F0}", "Regional Indicator Symbol Letter K"), e("\u{1F1F1}", "Regional Indicator Symbol Letter L"), e("\u{1F1F2}", "Regional Indicator Symbol Letter M"), e("\u{1F1F3}", "Regional Indicator Symbol Letter N"), e("\u{1F1F4}", "Regional Indicator Symbol Letter O"), e("\u{1F1F5}", "Regional Indicator Symbol Letter P"), e("\u{1F1F6}", "Regional Indicator Symbol Letter Q"), e("\u{1F1F7}", "Regional Indicator Symbol Letter R"), e("\u{1F1F8}", "Regional Indicator Symbol Letter S"), e("\u{1F1F9}", "Regional Indicator Symbol Letter T"), e("\u{1F1FA}", "Regional Indicator Symbol Letter U"), e("\u{1F1FB}", "Regional Indicator Symbol Letter V"), e("\u{1F1FC}", "Regional Indicator Symbol Letter W"), e("\u{1F1FD}", "Regional Indicator Symbol Letter X"), e("\u{1F1FE}", "Regional Indicator Symbol Letter Y"), e("\u{1F1FF}", "Regional Indicator Symbol Letter Z"));
export const japanese = g("Japanese", "Japanse symbology", e("\u{1F530}", "Japanese Symbol for Beginner"), e("\u{1F201}", "Japanese “Here” Button"), e("\u{1F202}\u{FE0F}", "Japanese “Service Charge” Button"), e("\u{1F21A}", "Japanese “Free of Charge” Button"), e("\u{1F22F}", "Japanese “Reserved” Button"), e("\u{1F232}", "Japanese “Prohibited” Button"), e("\u{1F233}", "Japanese “Vacancy” Button"), e("\u{1F234}", "Japanese “Passing Grade” Button"), e("\u{1F235}", "Japanese “No Vacancy” Button"), e("\u{1F236}", "Japanese “Not Free of Charge” Button"), e("\u{1F237}\u{FE0F}", "Japanese “Monthly Amount” Button"), e("\u{1F238}", "Japanese “Application” Button"), e("\u{1F239}", "Japanese “Discount” Button"), e("\u{1F23A}", "Japanese “Open for Business” Button"), e("\u{1F250}", "Japanese “Bargain” Button"), e("\u{1F251}", "Japanese “Acceptable” Button"), e("\u{3297}\u{FE0F}", "Japanese “Congratulations” Button"), e("\u{3299}\u{FE0F}", "Japanese “Secret” Button"));
export const clocks = g("Clocks", "Time-keeping pieces", e("\u{1F550}", "One O’Clock"), e("\u{1F551}", "Two O’Clock"), e("\u{1F552}", "Three O’Clock"), e("\u{1F553}", "Four O’Clock"), e("\u{1F554}", "Five O’Clock"), e("\u{1F555}", "Six O’Clock"), e("\u{1F556}", "Seven O’Clock"), e("\u{1F557}", "Eight O’Clock"), e("\u{1F558}", "Nine O’Clock"), e("\u{1F559}", "Ten O’Clock"), e("\u{1F55A}", "Eleven O’Clock"), e("\u{1F55B}", "Twelve O’Clock"), e("\u{1F55C}", "One-Thirty"), e("\u{1F55D}", "Two-Thirty"), e("\u{1F55E}", "Three-Thirty"), e("\u{1F55F}", "Four-Thirty"), e("\u{1F560}", "Five-Thirty"), e("\u{1F561}", "Six-Thirty"), e("\u{1F562}", "Seven-Thirty"), e("\u{1F563}", "Eight-Thirty"), e("\u{1F564}", "Nine-Thirty"), e("\u{1F565}", "Ten-Thirty"), e("\u{1F566}", "Eleven-Thirty"), e("\u{1F567}", "Twelve-Thirty"), e("\u{1F570}\u{FE0F}", "Mantelpiece Clock"), e("\u{231A}", "Watch"), e("\u{23F0}", "Alarm Clock"), e("\u{23F1}\u{FE0F}", "Stopwatch"), e("\u{23F2}\u{FE0F}", "Timer Clock"), e("\u{231B}", "Hourglass Done"), e("\u{23F3}", "Hourglass Not Done"));
export const clockwiseVerticalArrows = e("\u{1F503}\u{FE0F}", "Clockwise Vertical Arrows");
export const counterclockwiseArrowsButton = e("\u{1F504}\u{FE0F}", "Counterclockwise Arrows Button");
export const leftRightArrow = e("\u{2194}\u{FE0F}", "Left-Right Arrow");
export const upDownArrow = e("\u{2195}\u{FE0F}", "Up-Down Arrow");
export const upLeftArrow = e("\u{2196}\u{FE0F}", "Up-Left Arrow");
export const upRightArrow = e("\u{2197}\u{FE0F}", "Up-Right Arrow");
export const downRightArrow = e("\u{2198}", "Down-Right Arrow");
export const downRightArrowText = e("\u{2198}\u{FE0E}", "Down-Right Arrow");
export const downRightArrowEmoji = e("\u{2198}\u{FE0F}", "Down-Right Arrow");
export const downLeftArrow = e("\u{2199}\u{FE0F}", "Down-Left Arrow");
export const rightArrowCurvingLeft = e("\u{21A9}\u{FE0F}", "Right Arrow Curving Left");
export const leftArrowCurvingRight = e("\u{21AA}\u{FE0F}", "Left Arrow Curving Right");
export const rightArrow = e("\u{27A1}\u{FE0F}", "Right Arrow");
export const rightArrowCurvingUp = e("\u{2934}\u{FE0F}", "Right Arrow Curving Up");
export const rightArrowCurvingDown = e("\u{2935}\u{FE0F}", "Right Arrow Curving Down");
export const leftArrow = e("\u{2B05}\u{FE0F}", "Left Arrow");
export const upArrow = e("\u{2B06}\u{FE0F}", "Up Arrow");
export const downArrow = e("\u{2B07}\u{FE0F}", "Down Arrow");
export const arrows = g("Arrows", "Arrows pointing in different directions", clockwiseVerticalArrows, counterclockwiseArrowsButton, leftRightArrow, upDownArrow, upLeftArrow, upRightArrow, downRightArrowEmoji, downLeftArrow, rightArrowCurvingLeft, leftArrowCurvingRight, rightArrow, rightArrowCurvingUp, rightArrowCurvingDown, leftArrow, upArrow, downArrow);
export const redCircle = e("\u{1F534}", "Red Circle");
export const blueCircle = e("\u{1F535}", "Blue Circle");
export const largeOrangeDiamond = e("\u{1F536}", "Large Orange Diamond");
export const largeBlueDiamond = e("\u{1F537}", "Large Blue Diamond");
export const smallOrangeDiamond = e("\u{1F538}", "Small Orange Diamond");
export const smallBlueDiamond = e("\u{1F539}", "Small Blue Diamond");
export const redTrianglePointedUp = e("\u{1F53A}", "Red Triangle Pointed Up");
export const redTrianglePointedDown = e("\u{1F53B}", "Red Triangle Pointed Down");
export const orangeCircle = e("\u{1F7E0}", "Orange Circle");
export const yellowCircle = e("\u{1F7E1}", "Yellow Circle");
export const greenCircle = e("\u{1F7E2}", "Green Circle");
export const purpleCircle = e("\u{1F7E3}", "Purple Circle");
export const brownCircle = e("\u{1F7E4}", "Brown Circle");
export const hollowRedCircle = e("\u{2B55}", "Hollow Red Circle");
export const whiteCircle = e("\u{26AA}", "White Circle");
export const blackCircle = e("\u{26AB}", "Black Circle");
export const redSquare = e("\u{1F7E5}", "Red Square");
export const blueSquare = e("\u{1F7E6}", "Blue Square");
export const orangeSquare = e("\u{1F7E7}", "Orange Square");
export const yellowSquare = e("\u{1F7E8}", "Yellow Square");
export const greenSquare = e("\u{1F7E9}", "Green Square");
export const purpleSquare = e("\u{1F7EA}", "Purple Square");
export const brownSquare = e("\u{1F7EB}", "Brown Square");
export const blackSquareButton = e("\u{1F532}", "Black Square Button");
export const whiteSquareButton = e("\u{1F533}", "White Square Button");
export const blackSmallSquare = e("\u{25AA}\u{FE0F}", "Black Small Square");
export const whiteSmallSquare = e("\u{25AB}\u{FE0F}", "White Small Square");
export const whiteMediumSmallSquare = e("\u{25FD}", "White Medium-Small Square");
export const blackMediumSmallSquare = e("\u{25FE}", "Black Medium-Small Square");
export const whiteMediumSquare = e("\u{25FB}\u{FE0F}", "White Medium Square");
export const blackMediumSquare = e("\u{25FC}\u{FE0F}", "Black Medium Square");
export const blackLargeSquare = e("\u{2B1B}", "Black Large Square");
export const whiteLargeSquare = e("\u{2B1C}", "White Large Square");
export const star = e("\u{2B50}", "Star");
export const diamondWithADot = e("\u{1F4A0}", "Diamond with a Dot");
export const shapes = g("Shapes", "Colored shapes", redCircle, blueCircle, largeOrangeDiamond, largeBlueDiamond, smallOrangeDiamond, smallBlueDiamond, redTrianglePointedUp, redTrianglePointedDown, orangeCircle, yellowCircle, greenCircle, purpleCircle, brownCircle, hollowRedCircle, whiteCircle, blackCircle, redSquare, blueSquare, orangeSquare, yellowSquare, greenSquare, purpleSquare, brownSquare, blackSquareButton, whiteSquareButton, blackSmallSquare, whiteSmallSquare, whiteMediumSmallSquare, blackMediumSmallSquare, whiteMediumSquare, blackMediumSquare, blackLargeSquare, whiteLargeSquare, star, diamondWithADot);
export const clearButton = e("\u{1F191}", "CL Button");
export const coolButton = e("\u{1F192}", "Cool Button");
export const freeButton = e("\u{1F193}", "Free Button");
export const idButton = e("\u{1F194}", "ID Button");
export const newButton = e("\u{1F195}", "New Button");
export const ngButton = e("\u{1F196}", "NG Button");
export const okButton = e("\u{1F197}", "OK Button");
export const sosButton = e("\u{1F198}", "SOS Button");
export const upButton = e("\u{1F199}", "Up! Button");
export const vsButton = e("\u{1F19A}", "Vs Button");
export const radioButton = e("\u{1F518}", "Radio Button");
export const backArrow = e("\u{1F519}", "Back Arrow");
export const endArrow = e("\u{1F51A}", "End Arrow");
export const onArrow = e("\u{1F51B}", "On! Arrow");
export const soonArrow = e("\u{1F51C}", "Soon Arrow");
export const topArrow = e("\u{1F51D}", "Top Arrow");
export const checkBoxWithCheck = e("\u{2611}\u{FE0F}", "Check Box with Check");
export const inputLatinUppercase = e("\u{1F520}", "Input Latin Uppercase");
export const inputLatinLowercase = e("\u{1F521}", "Input Latin Lowercase");
export const inputNumbers = e("\u{1F522}", "Input Numbers");
export const inputSymbols = e("\u{1F523}", "Input Symbols");
export const inputLatinLetters = e("\u{1F524}", "Input Latin Letters");
export const shuffleTracksButton = e("\u{1F500}", "Shuffle Tracks Button");
export const repeatButton = e("\u{1F501}", "Repeat Button");
export const repeatSingleButton = e("\u{1F502}", "Repeat Single Button");
export const upwardsButton = e("\u{1F53C}", "Upwards Button");
export const downwardsButton = e("\u{1F53D}", "Downwards Button");
export const playButton = e("\u{25B6}\u{FE0F}", "Play Button");
export const reverseButton = e("\u{25C0}\u{FE0F}", "Reverse Button");
export const ejectButton = e("\u{23CF}\u{FE0F}", "Eject Button");
export const fastForwardButton = e("\u{23E9}", "Fast-Forward Button");
export const fastReverseButton = e("\u{23EA}", "Fast Reverse Button");
export const fastUpButton = e("\u{23EB}", "Fast Up Button");
export const fastDownButton = e("\u{23EC}", "Fast Down Button");
export const nextTrackButton = e("\u{23ED}\u{FE0F}", "Next Track Button");
export const lastTrackButton = e("\u{23EE}\u{FE0F}", "Last Track Button");
export const playOrPauseButton = e("\u{23EF}\u{FE0F}", "Play or Pause Button");
export const pauseButton = e("\u{23F8}\u{FE0F}", "Pause Button");
export const stopButton = e("\u{23F9}\u{FE0F}", "Stop Button");
export const recordButton = e("\u{23FA}\u{FE0F}", "Record Button");
export const buttons = g("Buttons", "Buttons", clearButton, coolButton, freeButton, idButton, newButton, ngButton, okButton, sosButton, upButton, vsButton, radioButton, backArrow, endArrow, onArrow, soonArrow, topArrow, checkBoxWithCheck, inputLatinUppercase, inputLatinLowercase, inputNumbers, inputSymbols, inputLatinLetters, shuffleTracksButton, repeatButton, repeatSingleButton, upwardsButton, downwardsButton, playButton, pauseButton, reverseButton, ejectButton, fastForwardButton, fastReverseButton, fastUpButton, fastDownButton, nextTrackButton, lastTrackButton, playOrPauseButton, pauseButton, stopButton, recordButton);
export const zodiac = g("Zodiac", "The symbology of astrology", e("\u{2648}", "Aries"), e("\u{2649}", "Taurus"), e("\u{264A}", "Gemini"), e("\u{264B}", "Cancer"), e("\u{264C}", "Leo"), e("\u{264D}", "Virgo"), e("\u{264E}", "Libra"), e("\u{264F}", "Scorpio"), e("\u{2650}", "Sagittarius"), e("\u{2651}", "Capricorn"), e("\u{2652}", "Aquarius"), e("\u{2653}", "Pisces"), e("\u{26CE}", "Ophiuchus"));
export const numbers = g("Numbers", "Numbers", e("\u{30}\u{FE0F}", "Digit Zero"), e("\u{31}\u{FE0F}", "Digit One"), e("\u{32}\u{FE0F}", "Digit Two"), e("\u{33}\u{FE0F}", "Digit Three"), e("\u{34}\u{FE0F}", "Digit Four"), e("\u{35}\u{FE0F}", "Digit Five"), e("\u{36}\u{FE0F}", "Digit Six"), e("\u{37}\u{FE0F}", "Digit Seven"), e("\u{38}\u{FE0F}", "Digit Eight"), e("\u{39}\u{FE0F}", "Digit Nine"), e("\u{2A}\u{FE0F}", "Asterisk"), e("\u{23}\u{FE0F}", "Number Sign"), e("\u{30}\u{FE0F}\u{20E3}", "Keycap Digit Zero"), e("\u{31}\u{FE0F}\u{20E3}", "Keycap Digit One"), e("\u{32}\u{FE0F}\u{20E3}", "Keycap Digit Two"), e("\u{33}\u{FE0F}\u{20E3}", "Keycap Digit Three"), e("\u{34}\u{FE0F}\u{20E3}", "Keycap Digit Four"), e("\u{35}\u{FE0F}\u{20E3}", "Keycap Digit Five"), e("\u{36}\u{FE0F}\u{20E3}", "Keycap Digit Six"), e("\u{37}\u{FE0F}\u{20E3}", "Keycap Digit Seven"), e("\u{38}\u{FE0F}\u{20E3}", "Keycap Digit Eight"), e("\u{39}\u{FE0F}\u{20E3}", "Keycap Digit Nine"), e("\u{2A}\u{FE0F}\u{20E3}", "Keycap Asterisk"), e("\u{23}\u{FE0F}\u{20E3}", "Keycap Number Sign"), e("\u{1F51F}", "Keycap: 10"));
export const tagPlusSign = e("\u{E002B}", "Tag Plus Sign");
export const tagMinusHyphen = e("\u{E002D}", "Tag Hyphen-Minus");
export const tags = g("Tags", "Tags", e("\u{E0020}", "Tag Space"), e("\u{E0021}", "Tag Exclamation Mark"), e("\u{E0022}", "Tag Quotation Mark"), e("\u{E0023}", "Tag Number Sign"), e("\u{E0024}", "Tag Dollar Sign"), e("\u{E0025}", "Tag Percent Sign"), e("\u{E0026}", "Tag Ampersand"), e("\u{E0027}", "Tag Apostrophe"), e("\u{E0028}", "Tag Left Parenthesis"), e("\u{E0029}", "Tag Right Parenthesis"), e("\u{E002A}", "Tag Asterisk"), tagPlusSign, e("\u{E002C}", "Tag Comma"), tagMinusHyphen, e("\u{E002E}", "Tag Full Stop"), e("\u{E002F}", "Tag Solidus"), e("\u{E0030}", "Tag Digit Zero"), e("\u{E0031}", "Tag Digit One"), e("\u{E0032}", "Tag Digit Two"), e("\u{E0033}", "Tag Digit Three"), e("\u{E0034}", "Tag Digit Four"), e("\u{E0035}", "Tag Digit Five"), e("\u{E0036}", "Tag Digit Six"), e("\u{E0037}", "Tag Digit Seven"), e("\u{E0038}", "Tag Digit Eight"), e("\u{E0039}", "Tag Digit Nine"), e("\u{E003A}", "Tag Colon"), e("\u{E003B}", "Tag Semicolon"), e("\u{E003C}", "Tag Less-Than Sign"), e("\u{E003D}", "Tag Equals Sign"), e("\u{E003E}", "Tag Greater-Than Sign"), e("\u{E003F}", "Tag Question Mark"), e("\u{E0040}", "Tag Commercial at"), e("\u{E0041}", "Tag Latin Capital Letter a"), e("\u{E0042}", "Tag Latin Capital Letter B"), e("\u{E0043}", "Tag Latin Capital Letter C"), e("\u{E0044}", "Tag Latin Capital Letter D"), e("\u{E0045}", "Tag Latin Capital Letter E"), e("\u{E0046}", "Tag Latin Capital Letter F"), e("\u{E0047}", "Tag Latin Capital Letter G"), e("\u{E0048}", "Tag Latin Capital Letter H"), e("\u{E0049}", "Tag Latin Capital Letter I"), e("\u{E004A}", "Tag Latin Capital Letter J"), e("\u{E004B}", "Tag Latin Capital Letter K"), e("\u{E004C}", "Tag Latin Capital Letter L"), e("\u{E004D}", "Tag Latin Capital Letter M"), e("\u{E004E}", "Tag Latin Capital Letter N"), e("\u{E004F}", "Tag Latin Capital Letter O"), e("\u{E0050}", "Tag Latin Capital Letter P"), e("\u{E0051}", "Tag Latin Capital Letter Q"), e("\u{E0052}", "Tag Latin Capital Letter R"), e("\u{E0053}", "Tag Latin Capital Letter S"), e("\u{E0054}", "Tag Latin Capital Letter T"), e("\u{E0055}", "Tag Latin Capital Letter U"), e("\u{E0056}", "Tag Latin Capital Letter V"), e("\u{E0057}", "Tag Latin Capital Letter W"), e("\u{E0058}", "Tag Latin Capital Letter X"), e("\u{E0059}", "Tag Latin Capital Letter Y"), e("\u{E005A}", "Tag Latin Capital Letter Z"), e("\u{E005B}", "Tag Left Square Bracket"), e("\u{E005C}", "Tag Reverse Solidus"), e("\u{E005D}", "Tag Right Square Bracket"), e("\u{E005E}", "Tag Circumflex Accent"), e("\u{E005F}", "Tag Low Line"), e("\u{E0060}", "Tag Grave Accent"), e("\u{E0061}", "Tag Latin Small Letter a"), e("\u{E0062}", "Tag Latin Small Letter B"), e("\u{E0063}", "Tag Latin Small Letter C"), e("\u{E0064}", "Tag Latin Small Letter D"), e("\u{E0065}", "Tag Latin Small Letter E"), e("\u{E0066}", "Tag Latin Small Letter F"), e("\u{E0067}", "Tag Latin Small Letter G"), e("\u{E0068}", "Tag Latin Small Letter H"), e("\u{E0069}", "Tag Latin Small Letter I"), e("\u{E006A}", "Tag Latin Small Letter J"), e("\u{E006B}", "Tag Latin Small Letter K"), e("\u{E006C}", "Tag Latin Small Letter L"), e("\u{E006D}", "Tag Latin Small Letter M"), e("\u{E006E}", "Tag Latin Small Letter N"), e("\u{E006F}", "Tag Latin Small Letter O"), e("\u{E0070}", "Tag Latin Small Letter P"), e("\u{E0071}", "Tag Latin Small Letter Q"), e("\u{E0072}", "Tag Latin Small Letter R"), e("\u{E0073}", "Tag Latin Small Letter S"), e("\u{E0074}", "Tag Latin Small Letter T"), e("\u{E0075}", "Tag Latin Small Letter U"), e("\u{E0076}", "Tag Latin Small Letter V"), e("\u{E0077}", "Tag Latin Small Letter W"), e("\u{E0078}", "Tag Latin Small Letter X"), e("\u{E0079}", "Tag Latin Small Letter Y"), e("\u{E007A}", "Tag Latin Small Letter Z"), e("\u{E007B}", "Tag Left Curly Bracket"), e("\u{E007C}", "Tag Vertical Line"), e("\u{E007D}", "Tag Right Curly Bracket"), e("\u{E007E}", "Tag Tilde"), e("\u{E007F}", "Cancel Tag"));
export const math = g("Math", "Math", e("\u{2716}\u{FE0F}", "Multiply"), e("\u{2795}", "Plus"), e("\u{2796}", "Minus"), e("\u{2797}", "Divide"));
export const games = g("Games", "Games", e("\u{2660}\u{FE0F}", "Spade Suit"), e("\u{2663}\u{FE0F}", "Club Suit"), e("\u{2665}\u{FE0F}", "Heart Suit", { color: "red" }), e("\u{2666}\u{FE0F}", "Diamond Suit", { color: "red" }), e("\u{1F004}", "Mahjong Red Dragon"), e("\u{1F0CF}", "Joker"), e("\u{1F3AF}", "Direct Hit"), e("\u{1F3B0}", "Slot Machine"), e("\u{1F3B1}", "Pool 8 Ball"), e("\u{1F3B2}", "Game Die"), e("\u{1F3B3}", "Bowling"), e("\u{1F3B4}", "Flower Playing Cards"), e("\u{1F9E9}", "Puzzle Piece"), e("\u{265F}\u{FE0F}", "Chess Pawn"), e("\u{1FA80}", "Yo-Yo"), 
//e("\u{1FA83}", "Boomerang"),
//e("\u{1FA86}", "Nesting Dolls"),
e("\u{1FA81}", "Kite"));
export const sportsEquipment = g("Sports Equipment", "Sports equipment", e("\u{1F3BD}", "Running Shirt"), e("\u{1F3BE}", "Tennis"), e("\u{1F3BF}", "Skis"), e("\u{1F3C0}", "Basketball"), e("\u{1F3C5}", "Sports Medal"), e("\u{1F3C6}", "Trophy"), e("\u{1F3C8}", "American Football"), e("\u{1F3C9}", "Rugby Football"), e("\u{1F3CF}", "Cricket Game"), e("\u{1F3D0}", "Volleyball"), e("\u{1F3D1}", "Field Hockey"), e("\u{1F3D2}", "Ice Hockey"), e("\u{1F3D3}", "Ping Pong"), e("\u{1F3F8}", "Badminton"), e("\u{1F6F7}", "Sled"), e("\u{1F945}", "Goal Net"), e("\u{1F947}", "1st Place Medal"), e("\u{1F948}", "2nd Place Medal"), e("\u{1F949}", "3rd Place Medal"), e("\u{1F94A}", "Boxing Glove"), e("\u{1F94C}", "Curling Stone"), e("\u{1F94D}", "Lacrosse"), e("\u{1F94E}", "Softball"), e("\u{1F94F}", "Flying Disc"), e("\u{26BD}", "Soccer Ball"), e("\u{26BE}", "Baseball"), e("\u{26F8}\u{FE0F}", "Ice Skate"));
export const clothing = g("Clothing", "Clothing", e("\u{1F3A9}", "Top Hat"), e("\u{1F93F}", "Diving Mask"), e("\u{1F452}", "Woman’s Hat"), e("\u{1F453}", "Glasses"), e("\u{1F576}\u{FE0F}", "Sunglasses"), e("\u{1F454}", "Necktie"), e("\u{1F455}", "T-Shirt"), e("\u{1F456}", "Jeans"), e("\u{1F457}", "Dress"), e("\u{1F458}", "Kimono"), e("\u{1F459}", "Bikini"), e("\u{1F45A}", "Woman’s Clothes"), e("\u{1F45B}", "Purse"), e("\u{1F45C}", "Handbag"), e("\u{1F45D}", "Clutch Bag"), e("\u{1F45E}", "Man’s Shoe"), e("\u{1F45F}", "Running Shoe"), e("\u{1F460}", "High-Heeled Shoe"), e("\u{1F461}", "Woman’s Sandal"), e("\u{1F462}", "Woman’s Boot"), e("\u{1F94B}", "Martial Arts Uniform"), e("\u{1F97B}", "Sari"), e("\u{1F97C}", "Lab Coat"), e("\u{1F97D}", "Goggles"), e("\u{1F97E}", "Hiking Boot"), e("\u{1F97F}", "Flat Shoe"), whiteCane, e("\u{1F9BA}", "Safety Vest"), e("\u{1F9E2}", "Billed Cap"), e("\u{1F9E3}", "Scarf"), e("\u{1F9E4}", "Gloves"), e("\u{1F9E5}", "Coat"), e("\u{1F9E6}", "Socks"), e("\u{1F9FF}", "Nazar Amulet"), e("\u{1FA70}", "Ballet Shoes"), e("\u{1FA71}", "One-Piece Swimsuit"), e("\u{1FA72}", "Briefs"), e("\u{1FA73}", "Shorts"));
export const town = g("Town", "Town", e("\u{1F3D7}\u{FE0F}", "Building Construction"), e("\u{1F3D8}\u{FE0F}", "Houses"), e("\u{1F3D9}\u{FE0F}", "Cityscape"), e("\u{1F3DA}\u{FE0F}", "Derelict House"), e("\u{1F3DB}\u{FE0F}", "Classical Building"), e("\u{1F3DC}\u{FE0F}", "Desert"), e("\u{1F3DD}\u{FE0F}", "Desert Island"), e("\u{1F3DE}\u{FE0F}", "National Park"), e("\u{1F3DF}\u{FE0F}", "Stadium"), e("\u{1F3E0}", "House"), e("\u{1F3E1}", "House with Garden"), e("\u{1F3E2}", "Office Building"), e("\u{1F3E3}", "Japanese Post Office"), e("\u{1F3E4}", "Post Office"), e("\u{1F3E5}", "Hospital"), e("\u{1F3E6}", "Bank"), e("\u{1F3E7}", "ATM Sign"), e("\u{1F3E8}", "Hotel"), e("\u{1F3E9}", "Love Hotel"), e("\u{1F3EA}", "Convenience Store"), school, e("\u{1F3EC}", "Department Store"), factory, e("\u{1F309}", "Bridge at Night"), e("\u{26F2}", "Fountain"), e("\u{1F6CD}\u{FE0F}", "Shopping Bags"), e("\u{1F9FE}", "Receipt"), e("\u{1F6D2}", "Shopping Cart"), e("\u{1F488}", "Barber Pole"), e("\u{1F492}", "Wedding"), e("\u{1F5F3}\u{FE0F}", "Ballot Box with Ballot"));
export const music = g("Music", "Music", e("\u{1F3BC}", "Musical Score"), e("\u{1F3B6}", "Musical Notes"), e("\u{1F3B5}", "Musical Note"), e("\u{1F3B7}", "Saxophone"), e("\u{1F3B8}", "Guitar"), e("\u{1F3B9}", "Musical Keyboard"), e("\u{1F3BA}", "Trumpet"), e("\u{1F3BB}", "Violin"), e("\u{1F941}", "Drum"), 
//e("\u{1FA97}", "Accordion"),
//e("\u{1FA98}", "Long Drum"),
e("\u{1FA95}", "Banjo"));
export const weather = g("Weather", "Weather", e("\u{1F304}", "Sunrise Over Mountains"), e("\u{1F305}", "Sunrise"), e("\u{1F306}", "Cityscape at Dusk"), e("\u{1F307}", "Sunset"), e("\u{1F303}", "Night with Stars"), e("\u{1F302}", "Closed Umbrella"), e("\u{2602}\u{FE0F}", "Umbrella"), e("\u{2614}\u{FE0F}", "Umbrella with Rain Drops"), e("\u{2603}\u{FE0F}", "Snowman"), e("\u{26C4}", "Snowman Without Snow"), e("\u{2600}\u{FE0F}", "Sun"), e("\u{2601}\u{FE0F}", "Cloud"), e("\u{1F324}\u{FE0F}", "Sun Behind Small Cloud"), e("\u{26C5}", "Sun Behind Cloud"), e("\u{1F325}\u{FE0F}", "Sun Behind Large Cloud"), e("\u{1F326}\u{FE0F}", "Sun Behind Rain Cloud"), e("\u{1F327}\u{FE0F}", "Cloud with Rain"), e("\u{1F328}\u{FE0F}", "Cloud with Snow"), e("\u{1F329}\u{FE0F}", "Cloud with Lightning"), e("\u{26C8}\u{FE0F}", "Cloud with Lightning and Rain"), e("\u{2744}\u{FE0F}", "Snowflake"), e("\u{1F300}", "Cyclone"), e("\u{1F32A}\u{FE0F}", "Tornado"), e("\u{1F32C}\u{FE0F}", "Wind Face"), e("\u{1F30A}", "Water Wave"), e("\u{1F32B}\u{FE0F}", "Fog"), e("\u{1F301}", "Foggy"), e("\u{1F308}", "Rainbow"), e("\u{1F321}\u{FE0F}", "Thermometer"));
export const astro = g("Astronomy", "Astronomy", e("\u{1F30C}", "Milky Way"), e("\u{1F30D}", "Globe Showing Europe-Africa"), e("\u{1F30E}", "Globe Showing Americas"), e("\u{1F30F}", "Globe Showing Asia-Australia"), e("\u{1F310}", "Globe with Meridians"), e("\u{1F311}", "New Moon"), e("\u{1F312}", "Waxing Crescent Moon"), e("\u{1F313}", "First Quarter Moon"), e("\u{1F314}", "Waxing Gibbous Moon"), e("\u{1F315}", "Full Moon"), e("\u{1F316}", "Waning Gibbous Moon"), e("\u{1F317}", "Last Quarter Moon"), e("\u{1F318}", "Waning Crescent Moon"), e("\u{1F319}", "Crescent Moon"), e("\u{1F31A}", "New Moon Face"), e("\u{1F31B}", "First Quarter Moon Face"), e("\u{1F31C}", "Last Quarter Moon Face"), e("\u{1F31D}", "Full Moon Face"), e("\u{1F31E}", "Sun with Face"), e("\u{1F31F}", "Glowing Star"), e("\u{1F320}", "Shooting Star"), e("\u{2604}\u{FE0F}", "Comet"), e("\u{1FA90}", "Ringed Planet"));
export const finance = g("Finance", "Finance", e("\u{1F4B0}", "Money Bag"), e("\u{1F4B1}", "Currency Exchange"), e("\u{1F4B2}", "Heavy Dollar Sign"), e("\u{1F4B3}", "Credit Card"), e("\u{1F4B4}", "Yen Banknote"), e("\u{1F4B5}", "Dollar Banknote"), e("\u{1F4B6}", "Euro Banknote"), e("\u{1F4B7}", "Pound Banknote"), e("\u{1F4B8}", "Money with Wings"), 
//e("\u{1FA99}", "Coin"),
e("\u{1F4B9}", "Chart Increasing with Yen"));
export const writing = g("Writing", "Writing", e("\u{1F58A}\u{FE0F}", "Pen"), e("\u{1F58B}\u{FE0F}", "Fountain Pen"), e("\u{1F58C}\u{FE0F}", "Paintbrush"), e("\u{1F58D}\u{FE0F}", "Crayon"), e("\u{270F}\u{FE0F}", "Pencil"), e("\u{2712}\u{FE0F}", "Black Nib"));
export const alembic = e("\u{2697}\u{FE0F}", "Alembic");
export const gear = e("\u{2699}\u{FE0F}", "Gear");
export const atomSymbol = e("\u{269B}\u{FE0F}", "Atom Symbol");
export const keyboard = e("\u{2328}\u{FE0F}", "Keyboard");
export const telephone = e("\u{260E}\u{FE0F}", "Telephone");
export const studioMicrophone = e("\u{1F399}\u{FE0F}", "Studio Microphone");
export const levelSlider = e("\u{1F39A}\u{FE0F}", "Level Slider");
export const controlKnobs = e("\u{1F39B}\u{FE0F}", "Control Knobs");
export const movieCamera = e("\u{1F3A5}", "Movie Camera");
export const headphone = e("\u{1F3A7}", "Headphone");
export const videoGame = e("\u{1F3AE}", "Video Game");
export const lightBulb = e("\u{1F4A1}", "Light Bulb");
export const computerDisk = e("\u{1F4BD}", "Computer Disk");
export const floppyDisk = e("\u{1F4BE}", "Floppy Disk");
export const opticalDisk = e("\u{1F4BF}", "Optical Disk");
export const dvd = e("\u{1F4C0}", "DVD");
export const telephoneReceiver = e("\u{1F4DE}", "Telephone Receiver");
export const pager = e("\u{1F4DF}", "Pager");
export const faxMachine = e("\u{1F4E0}", "Fax Machine");
export const satelliteAntenna = e("\u{1F4E1}", "Satellite Antenna");
export const loudspeaker = e("\u{1F4E2}", "Loudspeaker");
export const megaphone = e("\u{1F4E3}", "Megaphone");
export const mobilePhone = e("\u{1F4F1}", "Mobile Phone");
export const mobilePhoneWithArrow = e("\u{1F4F2}", "Mobile Phone with Arrow");
export const mobilePhoneVibrating = e("\u{1F4F3}", "Mobile Phone Vibrating");
export const mobilePhoneOff = e("\u{1F4F4}", "Mobile Phone Off");
export const noMobilePhone = e("\u{1F4F5}", "No Mobile Phone");
export const antennaBars = e("\u{1F4F6}", "Antenna Bars");
export const camera = e("\u{1F4F7}", "Camera");
export const cameraWithFlash = e("\u{1F4F8}", "Camera with Flash");
export const videoCamera = e("\u{1F4F9}", "Video Camera");
export const television = e("\u{1F4FA}", "Television");
export const radio = e("\u{1F4FB}", "Radio");
export const videocassette = e("\u{1F4FC}", "Videocassette");
export const filmProjector = e("\u{1F4FD}\u{FE0F}", "Film Projector");
export const portableStereo = e("\u{1F4FE}\u{FE0F}", "Portable Stereo");
export const dimButton = e("\u{1F505}", "Dim Button");
export const brightButton = e("\u{1F506}", "Bright Button");
export const mutedSpeaker = e("\u{1F507}", "Muted Speaker");
export const speakerLowVolume = e("\u{1F508}", "Speaker Low Volume");
export const speakerMediumVolume = e("\u{1F509}", "Speaker Medium Volume");
export const speakerHighVolume = e("\u{1F50A}", "Speaker High Volume");
export const battery = e("\u{1F50B}", "Battery");
export const electricPlug = e("\u{1F50C}", "Electric Plug");
export const magnifyingGlassTiltedLeft = e("\u{1F50D}", "Magnifying Glass Tilted Left");
export const magnifyingGlassTiltedRight = e("\u{1F50E}", "Magnifying Glass Tilted Right");
export const lockedWithPen = e("\u{1F50F}", "Locked with Pen");
export const lockedWithKey = e("\u{1F510}", "Locked with Key");
export const key = e("\u{1F511}", "Key");
export const locked = e("\u{1F512}", "Locked");
export const unlocked = e("\u{1F513}", "Unlocked");
export const bell = e("\u{1F514}", "Bell");
export const bellWithSlash = e("\u{1F515}", "Bell with Slash");
export const bookmark = e("\u{1F516}", "Bookmark");
export const link = e("\u{1F517}", "Link");
export const joystick = e("\u{1F579}\u{FE0F}", "Joystick");
export const desktopComputer = e("\u{1F5A5}\u{FE0F}", "Desktop Computer");
export const printer = e("\u{1F5A8}\u{FE0F}", "Printer");
export const computerMouse = e("\u{1F5B1}\u{FE0F}", "Computer Mouse");
export const trackball = e("\u{1F5B2}\u{FE0F}", "Trackball");
export const blackFolder = e("\u{1F5BF}", "Black Folder");
export const folder = e("\u{1F5C0}", "Folder");
export const openFolder = e("\u{1F5C1}", "Open Folder");
export const cardIndexDividers = e("\u{1F5C2}", "Card Index Dividers");
export const cardFileBox = e("\u{1F5C3}", "Card File Box");
export const fileCabinet = e("\u{1F5C4}", "File Cabinet");
export const emptyNote = e("\u{1F5C5}", "Empty Note");
export const emptyNotePage = e("\u{1F5C6}", "Empty Note Page");
export const emptyNotePad = e("\u{1F5C7}", "Empty Note Pad");
export const note = e("\u{1F5C8}", "Note");
export const notePage = e("\u{1F5C9}", "Note Page");
export const notePad = e("\u{1F5CA}", "Note Pad");
export const emptyDocument = e("\u{1F5CB}", "Empty Document");
export const emptyPage = e("\u{1F5CC}", "Empty Page");
export const emptyPages = e("\u{1F5CD}", "Empty Pages");
export const documentIcon = e("\u{1F5CE}", "Document");
export const page = e("\u{1F5CF}", "Page");
export const pages = e("\u{1F5D0}", "Pages");
export const wastebasket = e("\u{1F5D1}", "Wastebasket");
export const spiralNotePad = e("\u{1F5D2}", "Spiral Note Pad");
export const spiralCalendar = e("\u{1F5D3}", "Spiral Calendar");
export const desktopWindow = e("\u{1F5D4}", "Desktop Window");
export const minimize = e("\u{1F5D5}", "Minimize");
export const maximize = e("\u{1F5D6}", "Maximize");
export const overlap = e("\u{1F5D7}", "Overlap");
export const reload = e("\u{1F5D8}", "Reload");
export const close = e("\u{1F5D9}", "Close");
export const increaseFontSize = e("\u{1F5DA}", "Increase Font Size");
export const decreaseFontSize = e("\u{1F5DB}", "Decrease Font Size");
export const compression = e("\u{1F5DC}", "Compression");
export const oldKey = e("\u{1F5DD}", "Old Key");
export const tech = g("Technology", "Technology", joystick, videoGame, lightBulb, laptop, briefcase, computerDisk, floppyDisk, opticalDisk, dvd, desktopComputer, keyboard, printer, computerMouse, trackball, telephone, telephoneReceiver, pager, faxMachine, satelliteAntenna, loudspeaker, megaphone, television, radio, videocassette, filmProjector, studioMicrophone, levelSlider, controlKnobs, microphone, movieCamera, headphone, camera, cameraWithFlash, videoCamera, mobilePhone, mobilePhoneOff, mobilePhoneWithArrow, lockedWithPen, lockedWithKey, locked, unlocked, bell, bellWithSlash, bookmark, link, mobilePhoneVibrating, antennaBars, dimButton, brightButton, mutedSpeaker, speakerLowVolume, speakerMediumVolume, speakerHighVolume, battery, electricPlug);
export const mail = g("Mail", "Mail", e("\u{1F4E4}", "Outbox Tray"), e("\u{1F4E5}", "Inbox Tray"), e("\u{1F4E6}", "Package"), e("\u{1F4E7}", "E-Mail"), e("\u{1F4E8}", "Incoming Envelope"), e("\u{1F4E9}", "Envelope with Arrow"), e("\u{1F4EA}", "Closed Mailbox with Lowered Flag"), e("\u{1F4EB}", "Closed Mailbox with Raised Flag"), e("\u{1F4EC}", "Open Mailbox with Raised Flag"), e("\u{1F4ED}", "Open Mailbox with Lowered Flag"), e("\u{1F4EE}", "Postbox"), e("\u{1F4EF}", "Postal Horn"));
export const celebration = g("Celebration", "Celebration", e("\u{1F380}", "Ribbon"), e("\u{1F381}", "Wrapped Gift"), e("\u{1F383}", "Jack-O-Lantern"), e("\u{1F384}", "Christmas Tree"), e("\u{1F9E8}", "Firecracker"), e("\u{1F386}", "Fireworks"), e("\u{1F387}", "Sparkler"), e("\u{2728}", "Sparkles"), e("\u{2747}\u{FE0F}", "Sparkle"), e("\u{1F388}", "Balloon"), e("\u{1F389}", "Party Popper"), e("\u{1F38A}", "Confetti Ball"), e("\u{1F38B}", "Tanabata Tree"), e("\u{1F38D}", "Pine Decoration"), e("\u{1F38E}", "Japanese Dolls"), e("\u{1F38F}", "Carp Streamer"), e("\u{1F390}", "Wind Chime"), e("\u{1F391}", "Moon Viewing Ceremony"), e("\u{1F392}", "Backpack"), graduationCap, e("\u{1F9E7}", "Red Envelope"), e("\u{1F3EE}", "Red Paper Lantern"), e("\u{1F396}\u{FE0F}", "Military Medal"));
export const tools = g("Tools", "Tools", e("\u{1F3A3}", "Fishing Pole"), e("\u{1F526}", "Flashlight"), wrench, e("\u{1F528}", "Hammer"), e("\u{1F529}", "Nut and Bolt"), e("\u{1F6E0}\u{FE0F}", "Hammer and Wrench"), e("\u{1F9ED}", "Compass"), e("\u{1F9EF}", "Fire Extinguisher"), e("\u{1F9F0}", "Toolbox"), e("\u{1F9F1}", "Brick"), e("\u{1FA93}", "Axe"), e("\u{2692}\u{FE0F}", "Hammer and Pick"), e("\u{26CF}\u{FE0F}", "Pick"), e("\u{26D1}\u{FE0F}", "Rescue Worker’s Helmet"), e("\u{26D3}\u{FE0F}", "Chains"), compression);
export const office = g("Office", "Office", e("\u{1F4C1}", "File Folder"), e("\u{1F4C2}", "Open File Folder"), e("\u{1F4C3}", "Page with Curl"), e("\u{1F4C4}", "Page Facing Up"), e("\u{1F4C5}", "Calendar"), e("\u{1F4C6}", "Tear-Off Calendar"), e("\u{1F4C7}", "Card Index"), cardIndexDividers, cardFileBox, fileCabinet, wastebasket, spiralNotePad, spiralCalendar, e("\u{1F4C8}", "Chart Increasing"), e("\u{1F4C9}", "Chart Decreasing"), e("\u{1F4CA}", "Bar Chart"), e("\u{1F4CB}", "Clipboard"), e("\u{1F4CC}", "Pushpin"), e("\u{1F4CD}", "Round Pushpin"), e("\u{1F4CE}", "Paperclip"), e("\u{1F587}\u{FE0F}", "Linked Paperclips"), e("\u{1F4CF}", "Straight Ruler"), e("\u{1F4D0}", "Triangular Ruler"), e("\u{1F4D1}", "Bookmark Tabs"), e("\u{1F4D2}", "Ledger"), e("\u{1F4D3}", "Notebook"), e("\u{1F4D4}", "Notebook with Decorative Cover"), e("\u{1F4D5}", "Closed Book"), e("\u{1F4D6}", "Open Book"), e("\u{1F4D7}", "Green Book"), e("\u{1F4D8}", "Blue Book"), e("\u{1F4D9}", "Orange Book"), e("\u{1F4DA}", "Books"), e("\u{1F4DB}", "Name Badge"), e("\u{1F4DC}", "Scroll"), e("\u{1F4DD}", "Memo"), e("\u{2702}\u{FE0F}", "Scissors"), e("\u{2709}\u{FE0F}", "Envelope"));
export const signs = g("Signs", "Signs", e("\u{1F3A6}", "Cinema"), noMobilePhone, e("\u{1F51E}", "No One Under Eighteen"), e("\u{1F6AB}", "Prohibited"), e("\u{1F6AC}", "Cigarette"), e("\u{1F6AD}", "No Smoking"), e("\u{1F6AE}", "Litter in Bin Sign"), e("\u{1F6AF}", "No Littering"), e("\u{1F6B0}", "Potable Water"), e("\u{1F6B1}", "Non-Potable Water"), e("\u{1F6B3}", "No Bicycles"), e("\u{1F6B7}", "No Pedestrians"), e("\u{1F6B8}", "Children Crossing"), e("\u{1F6B9}", "Men’s Room"), e("\u{1F6BA}", "Women’s Room"), e("\u{1F6BB}", "Restroom"), e("\u{1F6BC}", "Baby Symbol"), e("\u{1F6BE}", "Water Closet"), e("\u{1F6C2}", "Passport Control"), e("\u{1F6C3}", "Customs"), e("\u{1F6C4}", "Baggage Claim"), e("\u{1F6C5}", "Left Luggage"), e("\u{1F17F}\u{FE0F}", "Parking Button"), e("\u{267F}", "Wheelchair Symbol"), e("\u{2622}\u{FE0F}", "Radioactive"), e("\u{2623}\u{FE0F}", "Biohazard"), e("\u{26A0}\u{FE0F}", "Warning"), e("\u{26A1}", "High Voltage"), e("\u{26D4}", "No Entry"), e("\u{267B}\u{FE0F}", "Recycling Symbol"), female, male, e("\u{26A7}\u{FE0F}", "Transgender Symbol"));
export const religion = g("Religion", "Religion", e("\u{1F52F}", "Dotted Six-Pointed Star"), e("\u{2721}\u{FE0F}", "Star of David"), e("\u{1F549}\u{FE0F}", "Om"), e("\u{1F54B}", "Kaaba"), e("\u{1F54C}", "Mosque"), e("\u{1F54D}", "Synagogue"), e("\u{1F54E}", "Menorah"), e("\u{1F6D0}", "Place of Worship"), e("\u{1F6D5}", "Hindu Temple"), e("\u{2626}\u{FE0F}", "Orthodox Cross"), e("\u{271D}\u{FE0F}", "Latin Cross"), e("\u{262A}\u{FE0F}", "Star and Crescent"), e("\u{262E}\u{FE0F}", "Peace Symbol"), e("\u{262F}\u{FE0F}", "Yin Yang"), e("\u{2638}\u{FE0F}", "Wheel of Dharma"), e("\u{267E}\u{FE0F}", "Infinity"), e("\u{1FA94}", "Diya Lamp"), e("\u{26E9}\u{FE0F}", "Shinto Shrine"), e("\u{26EA}", "Church"), e("\u{2734}\u{FE0F}", "Eight-Pointed Star"), e("\u{1F4FF}", "Prayer Beads"));
export const door = e("\u{1F6AA}", "Door");
export const household = g("Household", "Household", e("\u{1F484}", "Lipstick"), e("\u{1F48D}", "Ring"), e("\u{1F48E}", "Gem Stone"), e("\u{1F4F0}", "Newspaper"), key, e("\u{1F525}", "Fire"), e("\u{1F52B}", "Pistol"), e("\u{1F56F}\u{FE0F}", "Candle"), e("\u{1F5BC}\u{FE0F}", "Framed Picture"), oldKey, e("\u{1F5DE}\u{FE0F}", "Rolled-Up Newspaper"), e("\u{1F5FA}\u{FE0F}", "World Map"), door, e("\u{1F6BD}", "Toilet"), e("\u{1F6BF}", "Shower"), e("\u{1F6C1}", "Bathtub"), e("\u{1F6CB}\u{FE0F}", "Couch and Lamp"), e("\u{1F6CF}\u{FE0F}", "Bed"), e("\u{1F9F4}", "Lotion Bottle"), e("\u{1F9F5}", "Thread"), e("\u{1F9F6}", "Yarn"), e("\u{1F9F7}", "Safety Pin"), e("\u{1F9F8}", "Teddy Bear"), e("\u{1F9F9}", "Broom"), e("\u{1F9FA}", "Basket"), e("\u{1F9FB}", "Roll of Paper"), e("\u{1F9FC}", "Soap"), e("\u{1F9FD}", "Sponge"), e("\u{1FA91}", "Chair"), e("\u{1FA92}", "Razor"), e("\u{1F397}\u{FE0F}", "Reminder Ribbon"));
export const activities = g("Activities", "Activities", e("\u{1F39E}\u{FE0F}", "Film Frames"), e("\u{1F39F}\u{FE0F}", "Admission Tickets"), e("\u{1F3A0}", "Carousel Horse"), e("\u{1F3A1}", "Ferris Wheel"), e("\u{1F3A2}", "Roller Coaster"), artistPalette, e("\u{1F3AA}", "Circus Tent"), e("\u{1F3AB}", "Ticket"), e("\u{1F3AC}", "Clapper Board"), e("\u{1F3AD}", "Performing Arts"));
export const travel = g("Travel", "Travel", e("\u{1F3F7}\u{FE0F}", "Label"), e("\u{1F30B}", "Volcano"), e("\u{1F3D4}\u{FE0F}", "Snow-Capped Mountain"), e("\u{26F0}\u{FE0F}", "Mountain"), e("\u{1F3D5}\u{FE0F}", "Camping"), e("\u{1F3D6}\u{FE0F}", "Beach with Umbrella"), e("\u{26F1}\u{FE0F}", "Umbrella on Ground"), e("\u{1F3EF}", "Japanese Castle"), e("\u{1F463}", "Footprints"), e("\u{1F5FB}", "Mount Fuji"), e("\u{1F5FC}", "Tokyo Tower"), e("\u{1F5FD}", "Statue of Liberty"), e("\u{1F5FE}", "Map of Japan"), e("\u{1F5FF}", "Moai"), e("\u{1F6CE}\u{FE0F}", "Bellhop Bell"), e("\u{1F9F3}", "Luggage"), e("\u{26F3}", "Flag in Hole"), e("\u{26FA}", "Tent"), e("\u{2668}\u{FE0F}", "Hot Springs"));
export const medieval = g("Medieval", "Medieval", e("\u{1F3F0}", "Castle"), e("\u{1F3F9}", "Bow and Arrow"), crown, e("\u{1F531}", "Trident Emblem"), e("\u{1F5E1}\u{FE0F}", "Dagger"), e("\u{1F6E1}\u{FE0F}", "Shield"), e("\u{1F52E}", "Crystal Ball"), e("\u{2694}\u{FE0F}", "Crossed Swords"), e("\u{269C}\u{FE0F}", "Fleur-de-lis"));
export const doubleExclamationMark = e("\u{203C}\u{FE0F}", "Double Exclamation Mark");
export const interrobang = e("\u{2049}\u{FE0F}", "Exclamation Question Mark");
export const information = e("\u{2139}\u{FE0F}", "Information");
export const circledM = e("\u{24C2}\u{FE0F}", "Circled M");
export const checkMarkButton = e("\u{2705}", "Check Mark Button");
export const checkMark = e("\u{2714}\u{FE0F}", "Check Mark");
export const eightSpokedAsterisk = e("\u{2733}\u{FE0F}", "Eight-Spoked Asterisk");
export const crossMark = e("\u{274C}", "Cross Mark");
export const crossMarkButton = e("\u{274E}", "Cross Mark Button");
export const questionMark = e("\u{2753}", "Question Mark");
export const whiteQuestionMark = e("\u{2754}", "White Question Mark");
export const whiteExclamationMark = e("\u{2755}", "White Exclamation Mark");
export const exclamationMark = e("\u{2757}", "Exclamation Mark");
export const curlyLoop = e("\u{27B0}", "Curly Loop");
export const doubleCurlyLoop = e("\u{27BF}", "Double Curly Loop");
export const wavyDash = e("\u{3030}\u{FE0F}", "Wavy Dash");
export const partAlternationMark = e("\u{303D}\u{FE0F}", "Part Alternation Mark");
export const tradeMark = e("\u{2122}\u{FE0F}", "Trade Mark");
export const copyright = e("\u{A9}\u{FE0F}", "Copyright");
export const registered = e("\u{AE}\u{FE0F}", "Registered");
export const squareFourCourners = e("\u{26F6}\u{FE0F}", "Square: Four Corners");
export const marks = gg("Marks", "Marks", {
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
});
export const droplet = e("\u{1F4A7}", "Droplet");
export const dropOfBlood = e("\u{1FA78}", "Drop of Blood");
export const adhesiveBandage = e("\u{1FA79}", "Adhesive Bandage");
export const stethoscope = e("\u{1FA7A}", "Stethoscope");
export const syringe = e("\u{1F489}", "Syringe");
export const pill = e("\u{1F48A}", "Pill");
export const testTube = e("\u{1F9EA}", "Test Tube");
export const petriDish = e("\u{1F9EB}", "Petri Dish");
export const dna = e("\u{1F9EC}", "DNA");
export const abacus = e("\u{1F9EE}", "Abacus");
export const magnet = e("\u{1F9F2}", "Magnet");
export const telescope = e("\u{1F52D}", "Telescope");
export const science = gg("Science", "Science", {
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stethoscope,
    syringe,
    pill,
    microscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medical,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
});
export const whiteChessKing = e("\u{2654}", "White Chess King");
export const whiteChessQueen = e("\u{2655}", "White Chess Queen");
export const whiteChessRook = e("\u{2656}", "White Chess Rook");
export const whiteChessBishop = e("\u{2657}", "White Chess Bishop");
export const whiteChessKnight = e("\u{2658}", "White Chess Knight");
export const whiteChessPawn = e("\u{2659}", "White Chess Pawn");
export const whiteChessPieces = gg(whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value, "White Chess Pieces", {
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn
});
export const blackChessKing = e("\u{265A}", "Black Chess King");
export const blackChessQueen = e("\u{265B}", "Black Chess Queen");
export const blackChessRook = e("\u{265C}", "Black Chess Rook");
export const blackChessBishop = e("\u{265D}", "Black Chess Bishop");
export const blackChessKnight = e("\u{265E}", "Black Chess Knight");
export const blackChessPawn = e("\u{265F}", "Black Chess Pawn");
export const blackChessPieces = gg(blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value, "Black Chess Pieces", {
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn
});
export const chessPawns = gg(whiteChessPawn.value + blackChessPawn.value, "Chess Pawns", {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
export const chessRooks = gg(whiteChessRook.value + blackChessRook.value, "Chess Rooks", {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
export const chessBishops = gg(whiteChessBishop.value + blackChessBishop.value, "Chess Bishops", {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
export const chessKnights = gg(whiteChessKnight.value + blackChessKnight.value, "Chess Knights", {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
export const chessQueens = gg(whiteChessQueen.value + blackChessQueen.value, "Chess Queens", {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
export const chessKings = gg(whiteChessKing.value + blackChessKing.value, "Chess Kings", {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});
export const chess = gg("Chess Pieces", "Chess Pieces", {
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
export const dice1 = e("\u2680", "Dice: Side 1");
export const dice2 = e("\u2681", "Dice: Side 2");
export const dice3 = e("\u2682", "Dice: Side 3");
export const dice4 = e("\u2683", "Dice: Side 4");
export const dice5 = e("\u2684", "Dice: Side 5");
export const dice6 = e("\u2685", "Dice: Side 6");
export const dice = gg("Dice", "Dice", {
    dice1,
    dice2,
    dice3,
    dice4,
    dice5,
    dice6
});
export const allIcons = gg("All Icons", "All Icons", {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy,
    animals,
    plants,
    food,
    flags,
    vehicles,
    clocks,
    arrows,
    shapes,
    buttons,
    zodiac,
    chess,
    dice,
    math,
    games,
    sportsEquipment,
    clothing,
    town,
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
    medieval
});
//# sourceMappingURL=emojis.js.map