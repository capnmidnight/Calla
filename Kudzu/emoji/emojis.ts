import { Emoji } from "./Emoji";
import { C, EmojiGroup, G, J } from "./EmojiGroup";

export function isSurfer(e: Emoji | string) {
    return surfers.contains(e)
        || rowers.contains(e)
        || swimmers.contains(e)
        || merpeople.contains(e);
}

function skin(v: string | Emoji, d: string, ...rest: Emoji[]) {
    v = v instanceof Emoji ? v.value : v;
    const person = new Emoji(v, d),
        light = C(person, skinL),
        mediumLight = C(person, skinML),
        medium = C(person, skinM),
        mediumDark = C(person, skinMD),
        dark = C(person, skinD);
    return G(person.value, person.desc, {
        default: person,
        light,
        mediumLight,
        medium,
        mediumDark,
        dark
    }, ...rest);
}

function sex(person: Emoji) {
    const man = J(person, male),
        woman = J(person, female);

    return G(person.value, person.desc, {
        default: person,
        man,
        woman
    });
}

function skinAndSex(v: string | Emoji, d: string) {
    v = v instanceof Emoji ? v.value : v;
    return sex(skin(v, d));
}

function skinAndHair(v: string | Emoji, d: string, ...rest: Emoji[]) {
    v = v instanceof Emoji ? v.value : v;
    const people = skin(v, d),
        red = J(people, hairRed),
        curly = J(people, hairCurly),
        white = J(people, hairWhite),
        bald = J(people, hairBald);
    return G(people.value, people.desc, {
        default: people,
        red,
        curly,
        white,
        bald
    }, ...rest);
}

function sym(symbol: Emoji, name: string) {
    const j = new Emoji(symbol.value, name),
        men = J((man as any).default as Emoji, j),
        women = J((woman as any).default as Emoji, j);
    return G(symbol.value, symbol.desc, {
        symbol,
        men,
        women
    });
}


export const textStyle = new Emoji("\uFE0E", "Variation Selector-15: text style");
export const emojiStyle = new Emoji("\uFE0F", "Variation Selector-16: emoji style");
export const zeroWidthJoiner = new Emoji("\u200D", "Zero Width Joiner");
export const combiningEnclosingKeycap = new Emoji("\u20E3", "Combining Enclosing Keycap");

export const female = new Emoji("\u2640\uFE0F", "Female");
export const male = new Emoji("\u2642\uFE0F", "Male");
export const transgender = new Emoji("\u26A7\uFE0F", "Transgender Symbol");
export const sexes = [
    female,
    male,
    transgender
];

export const skinL = new Emoji("\u{1F3FB}", "Light Skin Tone");
export const skinML = new Emoji("\u{1F3FC}", "Medium-Light Skin Tone");
export const skinM = new Emoji("\u{1F3FD}", "Medium Skin Tone");
export const skinMD = new Emoji("\u{1F3FE}", "Medium-Dark Skin Tone");
export const skinD = new Emoji("\u{1F3FF}", "Dark Skin Tone");
export const skinTones = [
    skinL,
    skinML,
    skinM,
    skinMD,
    skinD,
];
export const hairRed = new Emoji("\u{1F9B0}", "Red Hair");
export const hairCurly = new Emoji("\u{1F9B1}", "Curly Hair");
export const hairWhite = new Emoji("\u{1F9B3}", "White Hair");
export const hairBald = new Emoji("\u{1F9B2}", "Bald");
export const hairColors = [
    hairRed,
    hairCurly,
    hairWhite,
    hairBald,
];

export const frowning = new Emoji("\u{1F64D}", "Frowning");
export const frowners = skinAndSex(frowning, "Frowning");
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

export const gestures = new EmojiGroup(
    "Gestures", "Gestures",
    frowners,
    pouters,
    gesturingNo,
    gesturingOK,
    tippingHand,
    raisingHand,
    bowing,
    facePalming,
    shrugging,
    cantHear,
    gettingMassage,
    gettingHaircut);


export const baby = skin("\u{1F476}", "Baby");
export const child = skin("\u{1F9D2}", "Child");
export const boy = skin("\u{1F466}", "Boy");
export const girl = skin("\u{1F467}", "Girl");
export const children = G(child.value, child.desc, {
    default: child,
    male: boy,
    female: girl
});


export const blondes = skinAndSex("\u{1F471}", "Blond Person");
export const person = skin("\u{1F9D1}", "Person",
    (blondes as any).default as Emoji,
    (wearingTurban as any).default as Emoji);

export const beardedMan = skin("\u{1F9D4}", "Bearded Man");
export const manInSuitLevitating = new Emoji("\u{1F574}\uFE0F", "Man in Suit, Levitating");
export const manWithChineseCap = skin("\u{1F472}", "Man With Chinese Cap");
export const manInTuxedo = skin("\u{1F935}", "Man in Tuxedo");
export const man = skinAndHair("\u{1F468}", "Man",
    (blondes as any).man as Emoji,
    beardedMan,
    manInSuitLevitating,
    manWithChineseCap,
    (wearingTurban as any).man as Emoji,
    manInTuxedo);

export const pregnantWoman = skin("\u{1F930}", "Pregnant Woman");
export const breastFeeding = skin("\u{1F931}", "Breast-Feeding");
export const womanWithHeadscarf = skin("\u{1F9D5}", "Woman With Headscarf");
export const brideWithVeil = skin("\u{1F470}", "Bride With Veil");
export const woman = skinAndHair("\u{1F469}", "Woman",
    (blondes as any).woman as Emoji,
    pregnantWoman,
    breastFeeding,
    womanWithHeadscarf,
    (wearingTurban as any).woman as Emoji,
    brideWithVeil);
export const adults = G(
    person.value, "Adult", {
    default: person,
    male: man,
    female: woman
});

export const olderPerson = skin("\u{1F9D3}", "Older Person");
export const oldMan = skin("\u{1F474}", "Old Man");
export const oldWoman = skin("\u{1F475}", "Old Woman");
export const elderly = G(
    olderPerson.value, olderPerson.desc, {
    default: olderPerson,
    male: oldMan,
    female: oldWoman
});

export const medical = new Emoji("\u2695\uFE0F", "Medical");
export const healthCareWorkers = sym(medical, "Health Care");

export const graduationCap = new Emoji("\u{1F393}", "Graduation Cap");
export const students = sym(graduationCap, "Student");

export const school = new Emoji("\u{1F3EB}", "School");
export const teachers = sym(school, "Teacher");

export const balanceScale = new Emoji("\u2696\uFE0F", "Balance Scale");
export const judges = sym(balanceScale, "Judge");

export const sheafOfRice = new Emoji("\u{1F33E}", "Sheaf of Rice");
export const farmers = sym(sheafOfRice, "Farmer");

export const cooking = new Emoji("\u{1F373}", "Cooking");
export const cooks = sym(cooking, "Cook");

export const wrench = new Emoji("\u{1F527}", "Wrench");
export const mechanics = sym(wrench, "Mechanic");

export const factory = new Emoji("\u{1F3ED}", "Factory");
export const factoryWorkers = sym(factory, "Factory Worker");

export const briefcase = new Emoji("\u{1F4BC}", "Briefcase");
export const officeWorkers = sym(briefcase, "Office Worker");

export const fireEngine = new Emoji("\u{1F692}", "Fire Engine");
export const fireFighters = sym(fireEngine, "Fire Fighter");

export const rocket = new Emoji("\u{1F680}", "Rocket");
export const astronauts = sym(rocket, "Astronaut");

export const airplane = new Emoji("\u2708\uFE0F", "Airplane");
export const pilots = sym(airplane, "Pilot");

export const artistPalette = new Emoji("\u{1F3A8}", "Artist Palette");
export const artists = sym(artistPalette, "Artist");

export const microphone = new Emoji("\u{1F3A4}", "Microphone");
export const singers = sym(microphone, "Singer");

export const laptop = new Emoji("\u{1F4BB}", "Laptop");
export const technologists = sym(laptop, "Technologist");

export const microscope = new Emoji("\u{1F52C}", "Microscope");
export const scientists = sym(microscope, "Scientist");

export const crown = new Emoji("\u{1F451}", "Crown");
export const genie = new Emoji("\u{1F9DE}", "Genie");
export const zombie = new Emoji("\u{1F9DF}", "Zombie");
export const safetyVest = new Emoji("\u{1F9BA}", "Safety Vest");
export const whiteCane = new Emoji("\u{1F9AF}", "Probing Cane");
export const motorizedWheelchair = new Emoji("\u{1F9BC}", "Motorized Wheelchair");
export const manualWheelchair = new Emoji("\u{1F9BD}", "Manual Wheelchair");
export const fencer = new Emoji("\u{1F93A}", "Fencer");
export const skier = new Emoji("\u26F7\uFE0F", "Skier");

export const princes = skin("\u{1F934}", "Princes");
export const princesses = skin("\u{1F478}", "Princesses");
export const royalty = G(
    crown.value, crown.desc, {
    symbol: crown,
    male: princes,
    female: princesses
});

export const roles = G(
    "Roles", "Depictions of people working", {
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

export const cherubs = skin("\u{1F47C}", "Cherub");
export const santaClauses = skin("\u{1F385}", "Santa Claus");
export const mrsClauses = skin("\u{1F936}", "Mrs. Claus");

export const genies = sex(genie);
export const zombies = sex(zombie);

export const fantasy = G(
    "Fantasy", "Depictions of fantasy characters", {
    cherubs,
    santaClauses,
    mrsClauses,
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
export const withProbingCane = sym(whiteCane, "Probing");

export const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");

export const inManualWheelchair = sym(manualWheelchair, "In Manual Wheelchair");


export const manDancing = skin("\u{1F57A}", "Man Dancing");
export const womanDancing = skin("\u{1F483}", "Woman Dancing");
export const dancers = G(
    manDancing.value, "Dancing", {
    male: manDancing,
    female: womanDancing
});

export const jugglers = skinAndSex("\u{1F939}", "Juggler");

export const climbers = skinAndSex("\u{1F9D7}", "Climber");
export const jockeys = skin("\u{1F3C7}", "Jockey");
export const snowboarders = skin("\u{1F3C2}", "Snowboarder");
export const golfers = skinAndSex("\u{1F3CC}" + emojiStyle.value, "Golfer");
export const surfers = skinAndSex("\u{1F3C4}", "Surfing");
export const rowers = skinAndSex("\u{1F6A3}", "Rowing Boat");
export const swimmers = skinAndSex("\u{1F3CA}", "Swimming");
export const basketballers = skinAndSex("\u26F9" + emojiStyle.value, "Basket Baller");
export const weightLifters = skinAndSex("\u{1F3CB}" + emojiStyle.value, "Weight Lifter");
export const bikers = skinAndSex("\u{1F6B4}", "Biker");
export const mountainBikers = skinAndSex("\u{1F6B5}", "Mountain Biker");
export const cartwheelers = skinAndSex("\u{1F938}", "Cartwheeler");
export const wrestlers = sex(new Emoji("\u{1F93C}", "Wrestler"));
export const waterPoloers = skinAndSex("\u{1F93D}", "Water Polo Player");
export const handBallers = skinAndSex("\u{1F93E}", "Hand Baller");

export const inMotion = G(
    "In Motion", "Depictions of people in motion", {
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
export const resting = G(
    "Resting", "Depictions of people at rest", {
    inLotusPosition,
    inBath,
    inBed,
    inSauna
});

export const babies = new EmojiGroup(baby.value, baby.desc, baby, cherubs);
export const people = G(
    "People", "People", {
    babies,
    children,
    adults,
    elderly
});

export const allPeople = G(
    "All People", "All People", {
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy
});

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
//export const smilingFaceWithTear = new Emoji("\u{1F972}", "Smiling Face with Tear");
export const partyingFace = new Emoji("\u{1F973}", "Partying Face");
export const woozyFace = new Emoji("\u{1F974}", "Woozy Face");
export const hotFace = new Emoji("\u{1F975}", "Hot Face");
export const coldFace = new Emoji("\u{1F976}", "Cold Face");
//export const disguisedFace = new Emoji("\u{1F978}", "Disguised Face");
export const pleadingFace = new Emoji("\u{1F97A}", "Pleading Face");
export const faceWithMonocle = new Emoji("\u{1F9D0}", "Face with Monocle");
export const skullAndCrossbones = new Emoji("\u2620\uFE0F", "Skull and Crossbones");
export const frowningFace = new Emoji("\u2639\uFE0F", "Frowning Face");
export const smilingFace = new Emoji("\u263A\uFE0F", "Smiling Face");
export const speakingHead = new Emoji("\u{1F5E3}\uFE0F", "Speaking Head");
export const bust = new Emoji("\u{1F464}", "Bust in Silhouette");
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
export const heartExclamation = new Emoji("\u2763\uFE0F", "Heart Exclamation");
export const redHeart = new Emoji("\u2764\uFE0F", "Red Heart");
export const angerSymbol = new Emoji("\u{1F4A2}", "Anger Symbol");
export const bomb = new Emoji("\u{1F4A3}", "Bomb");
export const zzz = new Emoji("\u{1F4A4}", "Zzz");
export const collision = new Emoji("\u{1F4A5}", "Collision");
export const sweatDroplets = new Emoji("\u{1F4A6}", "Sweat Droplets");
export const dashingAway = new Emoji("\u{1F4A8}", "Dashing Away");
export const dizzy = new Emoji("\u{1F4AB}", "Dizzy");
export const speechBalloon = new Emoji("\u{1F4AC}", "Speech Balloon");
export const thoughtBalloon = new Emoji("\u{1F4AD}", "Thought Balloon");
export const hundredPoints = new Emoji("\u{1F4AF}", "Hundred Points");
export const hole = new Emoji("\u{1F573}\uFE0F", "Hole");
export const leftSpeechBubble = new Emoji("\u{1F5E8}\uFE0F", "Left Speech Bubble");
export const rightSpeechBubble = new Emoji("\u{1F5E9}\uFE0F", "Right Speech Bubble");
export const conversationBubbles2 = new Emoji("\u{1F5EA}\uFE0F", "Conversation Bubbles 2");
export const conversationBubbles3 = new Emoji("\u{1F5EB}\uFE0F", "Conversation Bubbles 3");
export const leftThoughtBubble = new Emoji("\u{1F5EC}\uFE0F", "Left Thought Bubble");
export const rightThoughtBubble = new Emoji("\u{1F5ED}\uFE0F", "Right Thought Bubble");
export const leftAngerBubble = new Emoji("\u{1F5EE}\uFE0F", "Left Anger Bubble");
export const rightAngerBubble = new Emoji("\u{1F5EF}\uFE0F", "Right Anger Bubble");
export const angerBubble = new Emoji("\u{1F5F0}\uFE0F", "Anger Bubble");
export const angerBubbleLightningBolt = new Emoji("\u{1F5F1}\uFE0F", "Anger Bubble Lightning");
export const lightningBolt = new Emoji("\u{1F5F2}\uFE0F", "Lightning Bolt");

export const backhandIndexPointingUp = new Emoji("\u{1F446}", "Backhand Index Pointing Up");
export const backhandIndexPointingDown = new Emoji("\u{1F447}", "Backhand Index Pointing Down");
export const backhandIndexPointingLeft = new Emoji("\u{1F448}", "Backhand Index Pointing Left");
export const backhandIndexPointingRight = new Emoji("\u{1F449}", "Backhand Index Pointing Right");
export const oncomingFist = new Emoji("\u{1F44A}", "Oncoming Fist");
export const wavingHand = new Emoji("\u{1F44B}", "Waving Hand");
export const okHand = new Emoji("\u{1F58F}", "OK Hand");
export const thumbsUp = new Emoji("\u{1F44D}", "Thumbs Up");
export const thumbsDown = new Emoji("\u{1F44E}", "Thumbs Down");
export const clappingHands = new Emoji("\u{1F44F}", "Clapping Hands");
export const openHands = new Emoji("\u{1F450}", "Open Hands");
export const nailPolish = new Emoji("\u{1F485}", "Nail Polish");
export const handsWithFingersSplayed = new Emoji("\u{1F590}\uFE0F", "Hand with Fingers Splayed");
export const handsWithFingersSplayed2 = new Emoji("\u{1F591}\uFE0F", "Hand with Fingers Splayed 2");
export const thumbsUp2 = new Emoji("\u{1F592}", "Thumbs Up 2");
export const thumbsDown2 = new Emoji("\u{1F593}", "Thumbs Down 2");
export const peaceFingers = new Emoji("\u{1F594}", "Peace Fingers");
export const middleFinger = new Emoji("\u{1F595}", "Middle Finger");
export const vulcanSalute = new Emoji("\u{1F596}", "Vulcan Salute");
export const handPointingDown = new Emoji("\u{1F597}", "Hand Pointing Down");
export const handPointingLeft = new Emoji("\u{1F598}", "Hand Pointing Left");
export const handPointingRight = new Emoji("\u{1F599}", "Hand Pointing Right");
export const handPointingLeft2 = new Emoji("\u{1F59A}", "Hand Pointing Left 2");
export const handPointingRight2 = new Emoji("\u{1F59B}", "Hand Pointing Right 2");
export const indexPointingLeft = new Emoji("\u{1F59C}", "Index Pointing Left");
export const indexPointingRight = new Emoji("\u{1F59D}", "Index Pointing Right");
export const indexPointingUp = new Emoji("\u{1F59E}", "Index Pointing Up");
export const indexPointingDown = new Emoji("\u{1F59F}", "Index Pointing Down");
export const indexPointingUp2 = new Emoji("\u{1F5A0}", "Index Pointing Up 2");
export const indexPointingDown2 = new Emoji("\u{1F5A1}", "Index Pointing Down 2");
export const indexPointingUp3 = new Emoji("\u{1F5A2}", "Index Pointing Up 3");
export const indexPointingDown3 = new Emoji("\u{1F5A3}", "Index Pointing Down 3");
export const raisingHands = new Emoji("\u{1F64C}", "Raising Hands");
export const foldedHands = new Emoji("\u{1F64F}", "Folded Hands");
export const pinchedFingers = new Emoji("\u{1F90C}", "Pinched Fingers");
export const pinchingHand = new Emoji("\u{1F90F}", "Pinching Hand");
export const signOfTheHorns = new Emoji("\u{1F918}", "Sign of the Horns");
export const callMeHand = new Emoji("\u{1F919}", "Call Me Hand");
export const rasiedBackOfHand = new Emoji("\u{1F91A}", "Raised Back of Hand");
export const leftFacingFist = new Emoji("\u{1F91B}", "Left-Facing Fist");
export const rightFacingFist = new Emoji("\u{1F91C}", "Right-Facing Fist");
export const handshake = new Emoji("\u{1F91D}", "Handshake");
export const crossedFingers = new Emoji("\u{1F91E}", "Crossed Fingers");
export const loveYouGesture = new Emoji("\u{1F91F}", "Love-You Gesture");
export const palmsUpTogether = new Emoji("\u{1F932}", "Palms Up Together");
export const indexPointingUp4 = new Emoji("\u261D\uFE0F", "Index Pointing Up 4");
export const raisedFist = new Emoji("\u270A", "Raised Fist");
export const raisedHand = new Emoji("\u270B", "Raised Hand");
export const victoryHand = new Emoji("\u270C\uFE0F", "Victory Hand");
export const writingHand = new Emoji("\u270D\uFE0F", "Writing Hand");

export const redCircle = new Emoji("\u{1F534}", "Red Circle");
export const blueCircle = new Emoji("\u{1F535}", "Blue Circle");
export const largeOrangeDiamond = new Emoji("\u{1F536}", "Large Orange Diamond");
export const largeBlueDiamond = new Emoji("\u{1F537}", "Large Blue Diamond");
export const smallOrangeDiamond = new Emoji("\u{1F538}", "Small Orange Diamond");
export const smallBlueDiamond = new Emoji("\u{1F539}", "Small Blue Diamond");
export const redTrianglePointedUp = new Emoji("\u{1F53A}", "Red Triangle Pointed Up");
export const redTrianglePointedDown = new Emoji("\u{1F53B}", "Red Triangle Pointed Down");
export const orangeCircle = new Emoji("\u{1F7E0}", "Orange Circle");
export const yellowCircle = new Emoji("\u{1F7E1}", "Yellow Circle");
export const greenCircle = new Emoji("\u{1F7E2}", "Green Circle");
export const purpleCircle = new Emoji("\u{1F7E3}", "Purple Circle");
export const brownCircle = new Emoji("\u{1F7E4}", "Brown Circle");
export const hollowRedCircle = new Emoji("\u2B55", "Hollow Red Circle");
export const whiteCircle = new Emoji("\u26AA", "White Circle");
export const blackCircle = new Emoji("\u26AB", "Black Circle");
export const redSquare = new Emoji("\u{1F7E5}", "Red Square");
export const blueSquare = new Emoji("\u{1F7E6}", "Blue Square");
export const orangeSquare = new Emoji("\u{1F7E7}", "Orange Square");
export const yellowSquare = new Emoji("\u{1F7E8}", "Yellow Square");
export const greenSquare = new Emoji("\u{1F7E9}", "Green Square");
export const purpleSquare = new Emoji("\u{1F7EA}", "Purple Square");
export const brownSquare = new Emoji("\u{1F7EB}", "Brown Square");
export const blackSquareButton = new Emoji("\u{1F532}", "Black Square Button");
export const whiteSquareButton = new Emoji("\u{1F533}", "White Square Button");
export const blackSmallSquare = new Emoji("\u25AA\uFE0F", "Black Small Square");
export const whiteSmallSquare = new Emoji("\u25AB\uFE0F", "White Small Square");
export const whiteMediumSmallSquare = new Emoji("\u25FD", "White Medium-Small Square");
export const blackMediumSmallSquare = new Emoji("\u25FE", "Black Medium-Small Square");
export const whiteMediumSquare = new Emoji("\u25FB\uFE0F", "White Medium Square");
export const blackMediumSquare = new Emoji("\u25FC\uFE0F", "Black Medium Square");
export const blackLargeSquare = new Emoji("\u2B1B", "Black Large Square");
export const whiteLargeSquare = new Emoji("\u2B1C", "White Large Square");
export const star = new Emoji("\u2B50", "Star");
export const diamondWithADot = new Emoji("\u{1F4A0}", "Diamond with a Dot");

export const eye = new Emoji("\u{1F441}\uFE0F", "Eye");
export const eyeInSpeechBubble = J(eye, leftSpeechBubble, "Eye in Speech Bubble");
export const eyes = new Emoji("\u{1F440}", "Eyes");
export const ear = new Emoji("\u{1F442}", "Ear");
export const nose = new Emoji("\u{1F443}", "Nose");
export const mouth = new Emoji("\u{1F444}", "Mouth");
export const tongue = new Emoji("\u{1F445}", "Tongue");
export const flexedBiceps = new Emoji("\u{1F4AA}", "Flexed Biceps");
export const selfie = new Emoji("\u{1F933}", "Selfie");
export const bone = new Emoji("\u{1F9B4}", "Bone");
export const leg = new Emoji("\u{1F9B5}", "Leg");
export const foot = new Emoji("\u{1F9B6}", "Foot");
export const tooth = new Emoji("\u{1F9B7}", "Tooth");
export const earWithHearingAid = new Emoji("\u{1F9BB}", "Ear with Hearing Aid");
export const mechanicalArm = new Emoji("\u{1F9BE}", "Mechanical Arm");
export const mechanicalLeg = new Emoji("\u{1F9BF}", "Mechanical Leg");
export const anatomicalHeart = new Emoji("\u{1FAC0}", "Anatomical Heart");
export const lungs = new Emoji("\u{1FAC1}", "Lungs");
export const brain = new Emoji("\u{1F9E0}", "Brain");

export const snowflake = new Emoji("\u2744\uFE0F", "Snowflake");
export const rainbow = new Emoji("\u{1F308}", "Rainbow");
export const sunriseOverMountains = new Emoji("\u{1F304}", "Sunrise Over Mountains");
export const sunrise = new Emoji("\u{1F305}", "Sunrise");
export const cityscapeAtDusk = new Emoji("\u{1F306}", "Cityscape at Dusk");
export const sunset = new Emoji("\u{1F307}", "Sunset");
export const nightWithStars = new Emoji("\u{1F303}", "Night with Stars");
export const closedUmbrella = new Emoji("\u{1F302}", "Closed Umbrella");
export const umbrella = new Emoji("\u2602\uFE0F", "Umbrella");
export const umbrellaWithRainDrops = new Emoji("\u2614\uFE0F", "Umbrella with Rain Drops");
export const snowman = new Emoji("\u2603\uFE0F", "Snowman");
export const snowmanWithoutSnow = new Emoji("\u26C4", "Snowman Without Snow");
export const sun = new Emoji("\u2600\uFE0F", "Sun");
export const cloud = new Emoji("\u2601\uFE0F", "Cloud");
export const sunBehindSmallCloud = new Emoji("\u{1F324}\uFE0F", "Sun Behind Small Cloud");
export const sunBehindCloud = new Emoji("\u26C5", "Sun Behind Cloud");
export const sunBehindLargeCloud = new Emoji("\u{1F325}\uFE0F", "Sun Behind Large Cloud");
export const sunBehindRainCloud = new Emoji("\u{1F326}\uFE0F", "Sun Behind Rain Cloud");
export const cloudWithRain = new Emoji("\u{1F327}\uFE0F", "Cloud with Rain");
export const cloudWithSnow = new Emoji("\u{1F328}\uFE0F", "Cloud with Snow");
export const cloudWithLightning = new Emoji("\u{1F329}\uFE0F", "Cloud with Lightning");
export const cloudWithLightningAndRain = new Emoji("\u26C8\uFE0F", "Cloud with Lightning and Rain");
export const cyclone = new Emoji("\u{1F300}", "Cyclone");
export const tornado = new Emoji("\u{1F32A}\uFE0F", "Tornado");
export const windFace = new Emoji("\u{1F32C}\uFE0F", "Wind Face");
export const waterWave = new Emoji("\u{1F30A}", "Water Wave");
export const fog = new Emoji("\u{1F32B}\uFE0F", "Fog");
export const foggy = new Emoji("\u{1F301}", "Foggy");
export const thermometer = new Emoji("\u{1F321}\uFE0F", "Thermometer");

export const cat = new Emoji("\u{1F408}", "Cat");
export const blackCat = J(cat, blackLargeSquare, "Black Cat");
export const dog = new Emoji("\u{1F415}", "Dog");
export const serviceDog = J(dog, safetyVest, "Service Dog");
export const bear = new Emoji("\u{1F43B}", "Bear");
export const polarBear = J(bear, snowflake, "Polar Bear");
export const rat = new Emoji("\u{1F400}", "Rat");
export const mouse = new Emoji("\u{1F401}", "Mouse");
export const ox = new Emoji("\u{1F402}", "Ox");
export const waterBuffalo = new Emoji("\u{1F403}", "Water Buffalo");
export const cow = new Emoji("\u{1F404}", "Cow");
export const tiger = new Emoji("\u{1F405}", "Tiger");
export const leopard = new Emoji("\u{1F406}", "Leopard");
export const rabbit = new Emoji("\u{1F407}", "Rabbit");
export const dragon = new Emoji("\u{1F409}", "Dragon");
export const crocodile = new Emoji("\u{1F40A}", "Crocodile");
export const whale = new Emoji("\u{1F40B}", "Whale");
export const snail = new Emoji("\u{1F40C}", "Snail");
export const snake = new Emoji("\u{1F40D}", "Snake");
export const horse = new Emoji("\u{1F40E}", "Horse");
export const ram = new Emoji("\u{1F40F}", "Ram");
export const goat = new Emoji("\u{1F410}", "Goat");
export const ewe = new Emoji("\u{1F411}", "Ewe");
export const monkey = new Emoji("\u{1F412}", "Monkey");
export const rooster = new Emoji("\u{1F413}", "Rooster");
export const chicken = new Emoji("\u{1F414}", "Chicken");
export const pig = new Emoji("\u{1F416}", "Pig");
export const boar = new Emoji("\u{1F417}", "Boar");
export const elephant = new Emoji("\u{1F418}", "Elephant");
export const octopus = new Emoji("\u{1F419}", "Octopus");
export const spiralShell = new Emoji("\u{1F41A}", "Spiral Shell");
export const bug = new Emoji("\u{1F41B}", "Bug");
export const ant = new Emoji("\u{1F41C}", "Ant");
export const honeybee = new Emoji("\u{1F41D}", "Honeybee");
export const ladyBeetle = new Emoji("\u{1F41E}", "Lady Beetle");
export const fish = new Emoji("\u{1F41F}", "Fish");
export const tropicalFish = new Emoji("\u{1F420}", "Tropical Fish");
export const blowfish = new Emoji("\u{1F421}", "Blowfish");
export const turtle = new Emoji("\u{1F422}", "Turtle");
export const hatchingChick = new Emoji("\u{1F423}", "Hatching Chick");
export const babyChick = new Emoji("\u{1F424}", "Baby Chick");
export const frontFacingBabyChick = new Emoji("\u{1F425}", "Front-Facing Baby Chick");
export const bird = new Emoji("\u{1F426}", "Bird");
export const penguin = new Emoji("\u{1F427}", "Penguin");
export const koala = new Emoji("\u{1F428}", "Koala");
export const poodle = new Emoji("\u{1F429}", "Poodle");
export const camel = new Emoji("\u{1F42A}", "Camel");
export const twoHumpCamel = new Emoji("\u{1F42B}", "Two-Hump Camel");
export const dolphin = new Emoji("\u{1F42C}", "Dolphin");
export const mouseFace = new Emoji("\u{1F42D}", "Mouse Face");
export const cowFace = new Emoji("\u{1F42E}", "Cow Face");
export const tigerFace = new Emoji("\u{1F42F}", "Tiger Face");
export const rabbitFace = new Emoji("\u{1F430}", "Rabbit Face");
export const catFace = new Emoji("\u{1F431}", "Cat Face");
export const dragonFace = new Emoji("\u{1F432}", "Dragon Face");
export const spoutingWhale = new Emoji("\u{1F433}", "Spouting Whale");
export const horseFace = new Emoji("\u{1F434}", "Horse Face");
export const monkeyFace = new Emoji("\u{1F435}", "Monkey Face");
export const dogFace = new Emoji("\u{1F436}", "Dog Face");
export const pigFace = new Emoji("\u{1F437}", "Pig Face");
export const frog = new Emoji("\u{1F438}", "Frog");
export const hamster = new Emoji("\u{1F439}", "Hamster");
export const wolf = new Emoji("\u{1F43A}", "Wolf");
export const panda = new Emoji("\u{1F43C}", "Panda");
export const pigNose = new Emoji("\u{1F43D}", "Pig Nose");
export const pawPrints = new Emoji("\u{1F43E}", "Paw Prints");
export const chipmunk = new Emoji("\u{1F43F}\uFE0F", "Chipmunk");
export const dove = new Emoji("\u{1F54A}\uFE0F", "Dove");
export const spider = new Emoji("\u{1F577}\uFE0F", "Spider");
export const spiderWeb = new Emoji("\u{1F578}\uFE0F", "Spider Web");
export const lion = new Emoji("\u{1F981}", "Lion");
export const scorpion = new Emoji("\u{1F982}", "Scorpion");
export const turkey = new Emoji("\u{1F983}", "Turkey");
export const unicorn = new Emoji("\u{1F984}", "Unicorn");
export const eagle = new Emoji("\u{1F985}", "Eagle");
export const duck = new Emoji("\u{1F986}", "Duck");
export const bat = new Emoji("\u{1F987}", "Bat");
export const shark = new Emoji("\u{1F988}", "Shark");
export const owl = new Emoji("\u{1F989}", "Owl");
export const fox = new Emoji("\u{1F98A}", "Fox");
export const butterfly = new Emoji("\u{1F98B}", "Butterfly");
export const deer = new Emoji("\u{1F98C}", "Deer");
export const gorilla = new Emoji("\u{1F98D}", "Gorilla");
export const lizard = new Emoji("\u{1F98E}", "Lizard");
export const rhinoceros = new Emoji("\u{1F98F}", "Rhinoceros");
export const giraffe = new Emoji("\u{1F992}", "Giraffe");
export const zebra = new Emoji("\u{1F993}", "Zebra");
export const hedgehog = new Emoji("\u{1F994}", "Hedgehog");
export const sauropod = new Emoji("\u{1F995}", "Sauropod");
export const tRex = new Emoji("\u{1F996}", "T-Rex");
export const cricket = new Emoji("\u{1F997}", "Cricket");
export const kangaroo = new Emoji("\u{1F998}", "Kangaroo");
export const llama = new Emoji("\u{1F999}", "Llama");
export const peacock = new Emoji("\u{1F99A}", "Peacock");
export const hippopotamus = new Emoji("\u{1F99B}", "Hippopotamus");
export const parrot = new Emoji("\u{1F99C}", "Parrot");
export const raccoon = new Emoji("\u{1F99D}", "Raccoon");
export const mosquito = new Emoji("\u{1F99F}", "Mosquito");
export const microbe = new Emoji("\u{1F9A0}", "Microbe");
export const badger = new Emoji("\u{1F9A1}", "Badger");
export const swan = new Emoji("\u{1F9A2}", "Swan");
//export const mammoth = new Emoji("\u{1F9A3}", "Mammoth");
//export const dodo = new Emoji("\u{1F9A4}", "Dodo");
export const sloth = new Emoji("\u{1F9A5}", "Sloth");
export const otter = new Emoji("\u{1F9A6}", "Otter");
export const orangutan = new Emoji("\u{1F9A7}", "Orangutan");
export const skunk = new Emoji("\u{1F9A8}", "Skunk");
export const flamingo = new Emoji("\u{1F9A9}", "Flamingo");
//export const beaver = new Emoji("\u{1F9AB}", "Beaver");
//export const bison = new Emoji("\u{1F9AC}", "Bison");
//export const seal = new Emoji("\u{1F9AD}", "Seal");
//export const fly = new Emoji("\u{1FAB0}", "Fly");
//export const worm = new Emoji("\u{1FAB1}", "Worm");
//export const beetle = new Emoji("\u{1FAB2}", "Beetle");
//export const cockroach = new Emoji("\u{1FAB3}", "Cockroach");
//export const feather = new Emoji("\u{1FAB6}", "Feather");
export const guideDog = new Emoji("\u{1F9AE}", "Guide Dog");

export const whiteFlower = new Emoji("\u{1F4AE}", "White Flower");
export const seedling = new Emoji("\u{1F331}", "Seedling");
export const evergreenTree = new Emoji("\u{1F332}", "Evergreen Tree");
export const deciduousTree = new Emoji("\u{1F333}", "Deciduous Tree");
export const palmTree = new Emoji("\u{1F334}", "Palm Tree");
export const cactus = new Emoji("\u{1F335}", "Cactus");
export const tulip = new Emoji("\u{1F337}", "Tulip");
export const cherryBlossom = new Emoji("\u{1F338}", "Cherry Blossom");
export const rose = new Emoji("\u{1F339}", "Rose");
export const hibiscus = new Emoji("\u{1F33A}", "Hibiscus");
export const sunflower = new Emoji("\u{1F33B}", "Sunflower");
export const blossom = new Emoji("\u{1F33C}", "Blossom");
export const herb = new Emoji("\u{1F33F}", "Herb");
export const fourLeafClover = new Emoji("\u{1F340}", "Four Leaf Clover");
export const mapleLeaf = new Emoji("\u{1F341}", "Maple Leaf");
export const fallenLeaf = new Emoji("\u{1F342}", "Fallen Leaf");
export const leafFlutteringInWind = new Emoji("\u{1F343}", "Leaf Fluttering in Wind");
export const rosette = new Emoji("\u{1F3F5}\uFE0F", "Rosette");
export const bouquet = new Emoji("\u{1F490}", "Bouquet");
export const wiltedFlower = new Emoji("\u{1F940}", "Wilted Flower");
//export const pottedPlant = new Emoji("\u{1FAB4}", "Potted Plant");
export const shamrock = new Emoji("\u2618\uFE0F", "Shamrock");

export const banana = new Emoji("\u{1F34C}", "Banana");
export const hotDog = new Emoji("\u{1F32D}", "Hot Dog");
export const taco = new Emoji("\u{1F32E}", "Taco");
export const burrito = new Emoji("\u{1F32F}", "Burrito");
export const chestnut = new Emoji("\u{1F330}", "Chestnut");
export const hotPepper = new Emoji("\u{1F336}\uFE0F", "Hot Pepper");
export const earOfCorn = new Emoji("\u{1F33D}", "Ear of Corn");
export const mushroom = new Emoji("\u{1F344}", "Mushroom");
export const tomato = new Emoji("\u{1F345}", "Tomato");
export const eggplant = new Emoji("\u{1F346}", "Eggplant");
export const grapes = new Emoji("\u{1F347}", "Grapes");
export const melon = new Emoji("\u{1F348}", "Melon");
export const watermelon = new Emoji("\u{1F349}", "Watermelon");
export const tangerine = new Emoji("\u{1F34A}", "Tangerine");
export const lemon = new Emoji("\u{1F34B}", "Lemon");
export const pineapple = new Emoji("\u{1F34D}", "Pineapple");
export const redApple = new Emoji("\u{1F34E}", "Red Apple");
export const greenApple = new Emoji("\u{1F34F}", "Green Apple");
export const pear = new Emoji("\u{1F350}", "Pear");
export const peach = new Emoji("\u{1F351}", "Peach");
export const cherries = new Emoji("\u{1F352}", "Cherries");
export const strawberry = new Emoji("\u{1F353}", "Strawberry");
export const hamburger = new Emoji("\u{1F354}", "Hamburger");
export const pizza = new Emoji("\u{1F355}", "Pizza");
export const meatOnBone = new Emoji("\u{1F356}", "Meat on Bone");
export const poultryLeg = new Emoji("\u{1F357}", "Poultry Leg");
export const riceCracker = new Emoji("\u{1F358}", "Rice Cracker");
export const riceBall = new Emoji("\u{1F359}", "Rice Ball");
export const cookedRice = new Emoji("\u{1F35A}", "Cooked Rice");
export const curryRice = new Emoji("\u{1F35B}", "Curry Rice");
export const steamingBowl = new Emoji("\u{1F35C}", "Steaming Bowl");
export const spaghetti = new Emoji("\u{1F35D}", "Spaghetti");
export const bread = new Emoji("\u{1F35E}", "Bread");
export const frenchFries = new Emoji("\u{1F35F}", "French Fries");
export const roastedSweetPotato = new Emoji("\u{1F360}", "Roasted Sweet Potato");
export const dango = new Emoji("\u{1F361}", "Dango");
export const oden = new Emoji("\u{1F362}", "Oden");
export const sushi = new Emoji("\u{1F363}", "Sushi");
export const friedShrimp = new Emoji("\u{1F364}", "Fried Shrimp");
export const fishCakeWithSwirl = new Emoji("\u{1F365}", "Fish Cake with Swirl");
export const bentoBox = new Emoji("\u{1F371}", "Bento Box");
export const potOfFood = new Emoji("\u{1F372}", "Pot of Food");
export const popcorn = new Emoji("\u{1F37F}", "Popcorn");
export const croissant = new Emoji("\u{1F950}", "Croissant");
export const avocado = new Emoji("\u{1F951}", "Avocado");
export const cucumber = new Emoji("\u{1F952}", "Cucumber");
export const bacon = new Emoji("\u{1F953}", "Bacon");
export const potato = new Emoji("\u{1F954}", "Potato");
export const carrot = new Emoji("\u{1F955}", "Carrot");
export const baguetteBread = new Emoji("\u{1F956}", "Baguette Bread");
export const greenSalad = new Emoji("\u{1F957}", "Green Salad");
export const shallowPanOfFood = new Emoji("\u{1F958}", "Shallow Pan of Food");
export const stuffedFlatbread = new Emoji("\u{1F959}", "Stuffed Flatbread");
export const egg = new Emoji("\u{1F95A}", "Egg");
export const peanuts = new Emoji("\u{1F95C}", "Peanuts");
export const kiwiFruit = new Emoji("\u{1F95D}", "Kiwi Fruit");
export const pancakes = new Emoji("\u{1F95E}", "Pancakes");
export const dumpling = new Emoji("\u{1F95F}", "Dumpling");
export const fortuneCookie = new Emoji("\u{1F960}", "Fortune Cookie");
export const takeoutBox = new Emoji("\u{1F961}", "Takeout Box");
export const bowlWithSpoon = new Emoji("\u{1F963}", "Bowl with Spoon");
export const coconut = new Emoji("\u{1F965}", "Coconut");
export const broccoli = new Emoji("\u{1F966}", "Broccoli");
export const pretzel = new Emoji("\u{1F968}", "Pretzel");
export const cutOfMeat = new Emoji("\u{1F969}", "Cut of Meat");
export const sandwich = new Emoji("\u{1F96A}", "Sandwich");
export const cannedFood = new Emoji("\u{1F96B}", "Canned Food");
export const leafyGreen = new Emoji("\u{1F96C}", "Leafy Green");
export const mango = new Emoji("\u{1F96D}", "Mango");
export const moonCake = new Emoji("\u{1F96E}", "Moon Cake");
export const bagel = new Emoji("\u{1F96F}", "Bagel");
export const crab = new Emoji("\u{1F980}", "Crab");
export const shrimp = new Emoji("\u{1F990}", "Shrimp");
export const squid = new Emoji("\u{1F991}", "Squid");
export const lobster = new Emoji("\u{1F99E}", "Lobster");
export const oyster = new Emoji("\u{1F9AA}", "Oyster");
export const cheeseWedge = new Emoji("\u{1F9C0}", "Cheese Wedge");
export const salt = new Emoji("\u{1F9C2}", "Salt");
export const garlic = new Emoji("\u{1F9C4}", "Garlic");
export const onion = new Emoji("\u{1F9C5}", "Onion");
export const falafel = new Emoji("\u{1F9C6}", "Falafel");
export const waffle = new Emoji("\u{1F9C7}", "Waffle");
export const butter = new Emoji("\u{1F9C8}", "Butter");
//export const blueberries = new Emoji("\u{1FAD0}", "Blueberries");
//export const bellPepper = new Emoji("\u{1FAD1}", "Bell Pepper");
//export const olive = new Emoji("\u{1FAD2}", "Olive");
//export const flatbread = new Emoji("\u{1FAD3}", "Flatbread");
//export const tamale = new Emoji("\u{1FAD4}", "Tamale");
//export const fondue = new Emoji("\u{1FAD5}", "Fondue");
export const softIceCream = new Emoji("\u{1F366}", "Soft Ice Cream");
export const shavedIce = new Emoji("\u{1F367}", "Shaved Ice");
export const iceCream = new Emoji("\u{1F368}", "Ice Cream");
export const doughnut = new Emoji("\u{1F369}", "Doughnut");
export const cookie = new Emoji("\u{1F36A}", "Cookie");
export const chocolateBar = new Emoji("\u{1F36B}", "Chocolate Bar");
export const candy = new Emoji("\u{1F36C}", "Candy");
export const lollipop = new Emoji("\u{1F36D}", "Lollipop");
export const custard = new Emoji("\u{1F36E}", "Custard");
export const honeyPot = new Emoji("\u{1F36F}", "Honey Pot");
export const shortcake = new Emoji("\u{1F370}", "Shortcake");
export const birthdayCake = new Emoji("\u{1F382}", "Birthday Cake");
export const pie = new Emoji("\u{1F967}", "Pie");
export const cupcake = new Emoji("\u{1F9C1}", "Cupcake");
export const teacupWithoutHandle = new Emoji("\u{1F375}", "Teacup Without Handle");
export const sake = new Emoji("\u{1F376}", "Sake");
export const wineGlass = new Emoji("\u{1F377}", "Wine Glass");
export const cocktailGlass = new Emoji("\u{1F378}", "Cocktail Glass");
export const tropicalDrink = new Emoji("\u{1F379}", "Tropical Drink");
export const beerMug = new Emoji("\u{1F37A}", "Beer Mug");
export const clinkingBeerMugs = new Emoji("\u{1F37B}", "Clinking Beer Mugs");
export const babyBottle = new Emoji("\u{1F37C}", "Baby Bottle");
export const bottleWithPoppingCork = new Emoji("\u{1F37E}", "Bottle with Popping Cork");
export const clinkingGlasses = new Emoji("\u{1F942}", "Clinking Glasses");
export const tumblerGlass = new Emoji("\u{1F943}", "Tumbler Glass");
export const glassOfMilk = new Emoji("\u{1F95B}", "Glass of Milk");
export const cupWithStraw = new Emoji("\u{1F964}", "Cup with Straw");
export const beverageBox = new Emoji("\u{1F9C3}", "Beverage Box");
export const mate = new Emoji("\u{1F9C9}", "Mate");
export const ice = new Emoji("\u{1F9CA}", "Ice");
//export const bubbleTea = new Emoji("\u{1F9CB}", "Bubble Tea");
//export const teapot = new Emoji("\u{1FAD6}", "Teapot");
export const hotBeverage = new Emoji("\u2615", "Hot Beverage");
export const forkAndKnife = new Emoji("\u{1F374}", "Fork and Knife");
export const forkAndKnifeWithPlate = new Emoji("\u{1F37D}\uFE0F", "Fork and Knife with Plate");
export const amphora = new Emoji("\u{1F3FA}", "Amphora");
export const kitchenKnife = new Emoji("\u{1F52A}", "Kitchen Knife");
export const spoon = new Emoji("\u{1F944}", "Spoon");
export const chopsticks = new Emoji("\u{1F962}", "Chopsticks");

export const flagAscensionIsland = new Emoji("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island");
export const flagAndorra = new Emoji("\u{1F1E6}\u{1F1E9}", "Flag: Andorra");
export const flagUnitedArabEmirates = new Emoji("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates");
export const flagAfghanistan = new Emoji("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan");
export const flagAntiguaBarbuda = new Emoji("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda");
export const flagAnguilla = new Emoji("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla");
export const flagAlbania = new Emoji("\u{1F1E6}\u{1F1F1}", "Flag: Albania");
export const flagArmenia = new Emoji("\u{1F1E6}\u{1F1F2}", "Flag: Armenia");
export const flagAngola = new Emoji("\u{1F1E6}\u{1F1F4}", "Flag: Angola");
export const flagAntarctica = new Emoji("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica");
export const flagArgentina = new Emoji("\u{1F1E6}\u{1F1F7}", "Flag: Argentina");
export const flagAmericanSamoa = new Emoji("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa");
export const flagAustria = new Emoji("\u{1F1E6}\u{1F1F9}", "Flag: Austria");
export const flagAustralia = new Emoji("\u{1F1E6}\u{1F1FA}", "Flag: Australia");
export const flagAruba = new Emoji("\u{1F1E6}\u{1F1FC}", "Flag: Aruba");
export const flagLandIslands = new Emoji("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands");
export const flagAzerbaijan = new Emoji("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan");
export const flagBosniaHerzegovina = new Emoji("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina");
export const flagBarbados = new Emoji("\u{1F1E7}\u{1F1E7}", "Flag: Barbados");
export const flagBangladesh = new Emoji("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh");
export const flagBelgium = new Emoji("\u{1F1E7}\u{1F1EA}", "Flag: Belgium");
export const flagBurkinaFaso = new Emoji("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso");
export const flagBulgaria = new Emoji("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria");
export const flagBahrain = new Emoji("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain");
export const flagBurundi = new Emoji("\u{1F1E7}\u{1F1EE}", "Flag: Burundi");
export const flagBenin = new Emoji("\u{1F1E7}\u{1F1EF}", "Flag: Benin");
export const flagStBarthlemy = new Emoji("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy");
export const flagBermuda = new Emoji("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda");
export const flagBrunei = new Emoji("\u{1F1E7}\u{1F1F3}", "Flag: Brunei");
export const flagBolivia = new Emoji("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia");
export const flagCaribbeanNetherlands = new Emoji("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands");
export const flagBrazil = new Emoji("\u{1F1E7}\u{1F1F7}", "Flag: Brazil");
export const flagBahamas = new Emoji("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas");
export const flagBhutan = new Emoji("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan");
export const flagBouvetIsland = new Emoji("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island");
export const flagBotswana = new Emoji("\u{1F1E7}\u{1F1FC}", "Flag: Botswana");
export const flagBelarus = new Emoji("\u{1F1E7}\u{1F1FE}", "Flag: Belarus");
export const flagBelize = new Emoji("\u{1F1E7}\u{1F1FF}", "Flag: Belize");
export const flagCanada = new Emoji("\u{1F1E8}\u{1F1E6}", "Flag: Canada");
export const flagCocosKeelingIslands = new Emoji("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands");
export const flagCongoKinshasa = new Emoji("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa");
export const flagCentralAfricanRepublic = new Emoji("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic");
export const flagCongoBrazzaville = new Emoji("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville");
export const flagSwitzerland = new Emoji("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland");
export const flagCteDIvoire = new Emoji("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire");
export const flagCookIslands = new Emoji("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands");
export const flagChile = new Emoji("\u{1F1E8}\u{1F1F1}", "Flag: Chile");
export const flagCameroon = new Emoji("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon");
export const flagChina = new Emoji("\u{1F1E8}\u{1F1F3}", "Flag: China");
export const flagColombia = new Emoji("\u{1F1E8}\u{1F1F4}", "Flag: Colombia");
export const flagClippertonIsland = new Emoji("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island");
export const flagCostaRica = new Emoji("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica");
export const flagCuba = new Emoji("\u{1F1E8}\u{1F1FA}", "Flag: Cuba");
export const flagCapeVerde = new Emoji("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde");
export const flagCuraao = new Emoji("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao");
export const flagChristmasIsland = new Emoji("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island");
export const flagCyprus = new Emoji("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus");
export const flagCzechia = new Emoji("\u{1F1E8}\u{1F1FF}", "Flag: Czechia");
export const flagGermany = new Emoji("\u{1F1E9}\u{1F1EA}", "Flag: Germany");
export const flagDiegoGarcia = new Emoji("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia");
export const flagDjibouti = new Emoji("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti");
export const flagDenmark = new Emoji("\u{1F1E9}\u{1F1F0}", "Flag: Denmark");
export const flagDominica = new Emoji("\u{1F1E9}\u{1F1F2}", "Flag: Dominica");
export const flagDominicanRepublic = new Emoji("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic");
export const flagAlgeria = new Emoji("\u{1F1E9}\u{1F1FF}", "Flag: Algeria");
export const flagCeutaMelilla = new Emoji("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla");
export const flagEcuador = new Emoji("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador");
export const flagEstonia = new Emoji("\u{1F1EA}\u{1F1EA}", "Flag: Estonia");
export const flagEgypt = new Emoji("\u{1F1EA}\u{1F1EC}", "Flag: Egypt");
export const flagWesternSahara = new Emoji("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara");
export const flagEritrea = new Emoji("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea");
export const flagSpain = new Emoji("\u{1F1EA}\u{1F1F8}", "Flag: Spain");
export const flagEthiopia = new Emoji("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia");
export const flagEuropeanUnion = new Emoji("\u{1F1EA}\u{1F1FA}", "Flag: European Union");
export const flagFinland = new Emoji("\u{1F1EB}\u{1F1EE}", "Flag: Finland");
export const flagFiji = new Emoji("\u{1F1EB}\u{1F1EF}", "Flag: Fiji");
export const flagFalklandIslands = new Emoji("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands");
export const flagMicronesia = new Emoji("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia");
export const flagFaroeIslands = new Emoji("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands");
export const flagFrance = new Emoji("\u{1F1EB}\u{1F1F7}", "Flag: France");
export const flagGabon = new Emoji("\u{1F1EC}\u{1F1E6}", "Flag: Gabon");
export const flagUnitedKingdom = new Emoji("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom");
export const flagGrenada = new Emoji("\u{1F1EC}\u{1F1E9}", "Flag: Grenada");
export const flagGeorgia = new Emoji("\u{1F1EC}\u{1F1EA}", "Flag: Georgia");
export const flagFrenchGuiana = new Emoji("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana");
export const flagGuernsey = new Emoji("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey");
export const flagGhana = new Emoji("\u{1F1EC}\u{1F1ED}", "Flag: Ghana");
export const flagGibraltar = new Emoji("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar");
export const flagGreenland = new Emoji("\u{1F1EC}\u{1F1F1}", "Flag: Greenland");
export const flagGambia = new Emoji("\u{1F1EC}\u{1F1F2}", "Flag: Gambia");
export const flagGuinea = new Emoji("\u{1F1EC}\u{1F1F3}", "Flag: Guinea");
export const flagGuadeloupe = new Emoji("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe");
export const flagEquatorialGuinea = new Emoji("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea");
export const flagGreece = new Emoji("\u{1F1EC}\u{1F1F7}", "Flag: Greece");
export const flagSouthGeorgiaSouthSandwichIslands = new Emoji("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands");
export const flagGuatemala = new Emoji("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala");
export const flagGuam = new Emoji("\u{1F1EC}\u{1F1FA}", "Flag: Guam");
export const flagGuineaBissau = new Emoji("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau");
export const flagGuyana = new Emoji("\u{1F1EC}\u{1F1FE}", "Flag: Guyana");
export const flagHongKongSARChina = new Emoji("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China");
export const flagHeardMcDonaldIslands = new Emoji("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands");
export const flagHonduras = new Emoji("\u{1F1ED}\u{1F1F3}", "Flag: Honduras");
export const flagCroatia = new Emoji("\u{1F1ED}\u{1F1F7}", "Flag: Croatia");
export const flagHaiti = new Emoji("\u{1F1ED}\u{1F1F9}", "Flag: Haiti");
export const flagHungary = new Emoji("\u{1F1ED}\u{1F1FA}", "Flag: Hungary");
export const flagCanaryIslands = new Emoji("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands");
export const flagIndonesia = new Emoji("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia");
export const flagIreland = new Emoji("\u{1F1EE}\u{1F1EA}", "Flag: Ireland");
export const flagIsrael = new Emoji("\u{1F1EE}\u{1F1F1}", "Flag: Israel");
export const flagIsleOfMan = new Emoji("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man");
export const flagIndia = new Emoji("\u{1F1EE}\u{1F1F3}", "Flag: India");
export const flagBritishIndianOceanTerritory = new Emoji("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory");
export const flagIraq = new Emoji("\u{1F1EE}\u{1F1F6}", "Flag: Iraq");
export const flagIran = new Emoji("\u{1F1EE}\u{1F1F7}", "Flag: Iran");
export const flagIceland = new Emoji("\u{1F1EE}\u{1F1F8}", "Flag: Iceland");
export const flagItaly = new Emoji("\u{1F1EE}\u{1F1F9}", "Flag: Italy");
export const flagJersey = new Emoji("\u{1F1EF}\u{1F1EA}", "Flag: Jersey");
export const flagJamaica = new Emoji("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica");
export const flagJordan = new Emoji("\u{1F1EF}\u{1F1F4}", "Flag: Jordan");
export const flagJapan = new Emoji("\u{1F1EF}\u{1F1F5}", "Flag: Japan");
export const flagKenya = new Emoji("\u{1F1F0}\u{1F1EA}", "Flag: Kenya");
export const flagKyrgyzstan = new Emoji("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan");
export const flagCambodia = new Emoji("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia");
export const flagKiribati = new Emoji("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati");
export const flagComoros = new Emoji("\u{1F1F0}\u{1F1F2}", "Flag: Comoros");
export const flagStKittsNevis = new Emoji("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis");
export const flagNorthKorea = new Emoji("\u{1F1F0}\u{1F1F5}", "Flag: North Korea");
export const flagSouthKorea = new Emoji("\u{1F1F0}\u{1F1F7}", "Flag: South Korea");
export const flagKuwait = new Emoji("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait");
export const flagCaymanIslands = new Emoji("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands");
export const flagKazakhstan = new Emoji("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan");
export const flagLaos = new Emoji("\u{1F1F1}\u{1F1E6}", "Flag: Laos");
export const flagLebanon = new Emoji("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon");
export const flagStLucia = new Emoji("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia");
export const flagLiechtenstein = new Emoji("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein");
export const flagSriLanka = new Emoji("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka");
export const flagLiberia = new Emoji("\u{1F1F1}\u{1F1F7}", "Flag: Liberia");
export const flagLesotho = new Emoji("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho");
export const flagLithuania = new Emoji("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania");
export const flagLuxembourg = new Emoji("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg");
export const flagLatvia = new Emoji("\u{1F1F1}\u{1F1FB}", "Flag: Latvia");
export const flagLibya = new Emoji("\u{1F1F1}\u{1F1FE}", "Flag: Libya");
export const flagMorocco = new Emoji("\u{1F1F2}\u{1F1E6}", "Flag: Morocco");
export const flagMonaco = new Emoji("\u{1F1F2}\u{1F1E8}", "Flag: Monaco");
export const flagMoldova = new Emoji("\u{1F1F2}\u{1F1E9}", "Flag: Moldova");
export const flagMontenegro = new Emoji("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro");
export const flagStMartin = new Emoji("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin");
export const flagMadagascar = new Emoji("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar");
export const flagMarshallIslands = new Emoji("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands");
export const flagNorthMacedonia = new Emoji("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia");
export const flagMali = new Emoji("\u{1F1F2}\u{1F1F1}", "Flag: Mali");
export const flagMyanmarBurma = new Emoji("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)");
export const flagMongolia = new Emoji("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia");
export const flagMacaoSarChina = new Emoji("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China");
export const flagNorthernMarianaIslands = new Emoji("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands");
export const flagMartinique = new Emoji("\u{1F1F2}\u{1F1F6}", "Flag: Martinique");
export const flagMauritania = new Emoji("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania");
export const flagMontserrat = new Emoji("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat");
export const flagMalta = new Emoji("\u{1F1F2}\u{1F1F9}", "Flag: Malta");
export const flagMauritius = new Emoji("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius");
export const flagMaldives = new Emoji("\u{1F1F2}\u{1F1FB}", "Flag: Maldives");
export const flagMalawi = new Emoji("\u{1F1F2}\u{1F1FC}", "Flag: Malawi");
export const flagMexico = new Emoji("\u{1F1F2}\u{1F1FD}", "Flag: Mexico");
export const flagMalaysia = new Emoji("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia");
export const flagMozambique = new Emoji("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique");
export const flagNamibia = new Emoji("\u{1F1F3}\u{1F1E6}", "Flag: Namibia");
export const flagNewCaledonia = new Emoji("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia");
export const flagNiger = new Emoji("\u{1F1F3}\u{1F1EA}", "Flag: Niger");
export const flagNorfolkIsland = new Emoji("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island");
export const flagNigeria = new Emoji("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria");
export const flagNicaragua = new Emoji("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua");
export const flagNetherlands = new Emoji("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands");
export const flagNorway = new Emoji("\u{1F1F3}\u{1F1F4}", "Flag: Norway");
export const flagNepal = new Emoji("\u{1F1F3}\u{1F1F5}", "Flag: Nepal");
export const flagNauru = new Emoji("\u{1F1F3}\u{1F1F7}", "Flag: Nauru");
export const flagNiue = new Emoji("\u{1F1F3}\u{1F1FA}", "Flag: Niue");
export const flagNewZealand = new Emoji("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand");
export const flagOman = new Emoji("\u{1F1F4}\u{1F1F2}", "Flag: Oman");
export const flagPanama = new Emoji("\u{1F1F5}\u{1F1E6}", "Flag: Panama");
export const flagPeru = new Emoji("\u{1F1F5}\u{1F1EA}", "Flag: Peru");
export const flagFrenchPolynesia = new Emoji("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia");
export const flagPapuaNewGuinea = new Emoji("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea");
export const flagPhilippines = new Emoji("\u{1F1F5}\u{1F1ED}", "Flag: Philippines");
export const flagPakistan = new Emoji("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan");
export const flagPoland = new Emoji("\u{1F1F5}\u{1F1F1}", "Flag: Poland");
export const flagStPierreMiquelon = new Emoji("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon");
export const flagPitcairnIslands = new Emoji("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands");
export const flagPuertoRico = new Emoji("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico");
export const flagPalestinianTerritories = new Emoji("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories");
export const flagPortugal = new Emoji("\u{1F1F5}\u{1F1F9}", "Flag: Portugal");
export const flagPalau = new Emoji("\u{1F1F5}\u{1F1FC}", "Flag: Palau");
export const flagParaguay = new Emoji("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay");
export const flagQatar = new Emoji("\u{1F1F6}\u{1F1E6}", "Flag: Qatar");
export const flagRunion = new Emoji("\u{1F1F7}\u{1F1EA}", "Flag: Réunion");
export const flagRomania = new Emoji("\u{1F1F7}\u{1F1F4}", "Flag: Romania");
export const flagSerbia = new Emoji("\u{1F1F7}\u{1F1F8}", "Flag: Serbia");
export const flagRussia = new Emoji("\u{1F1F7}\u{1F1FA}", "Flag: Russia");
export const flagRwanda = new Emoji("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda");
export const flagSaudiArabia = new Emoji("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia");
export const flagSolomonIslands = new Emoji("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands");
export const flagSeychelles = new Emoji("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles");
export const flagSudan = new Emoji("\u{1F1F8}\u{1F1E9}", "Flag: Sudan");
export const flagSweden = new Emoji("\u{1F1F8}\u{1F1EA}", "Flag: Sweden");
export const flagSingapore = new Emoji("\u{1F1F8}\u{1F1EC}", "Flag: Singapore");
export const flagStHelena = new Emoji("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena");
export const flagSlovenia = new Emoji("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia");
export const flagSvalbardJanMayen = new Emoji("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen");
export const flagSlovakia = new Emoji("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia");
export const flagSierraLeone = new Emoji("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone");
export const flagSanMarino = new Emoji("\u{1F1F8}\u{1F1F2}", "Flag: San Marino");
export const flagSenegal = new Emoji("\u{1F1F8}\u{1F1F3}", "Flag: Senegal");
export const flagSomalia = new Emoji("\u{1F1F8}\u{1F1F4}", "Flag: Somalia");
export const flagSuriname = new Emoji("\u{1F1F8}\u{1F1F7}", "Flag: Suriname");
export const flagSouthSudan = new Emoji("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan");
export const flagSoTomPrncipe = new Emoji("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe");
export const flagElSalvador = new Emoji("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador");
export const flagSintMaarten = new Emoji("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten");
export const flagSyria = new Emoji("\u{1F1F8}\u{1F1FE}", "Flag: Syria");
export const flagEswatini = new Emoji("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini");
export const flagTristanDaCunha = new Emoji("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha");
export const flagTurksCaicosIslands = new Emoji("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands");
export const flagChad = new Emoji("\u{1F1F9}\u{1F1E9}", "Flag: Chad");
export const flagFrenchSouthernTerritories = new Emoji("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories");
export const flagTogo = new Emoji("\u{1F1F9}\u{1F1EC}", "Flag: Togo");
export const flagThailand = new Emoji("\u{1F1F9}\u{1F1ED}", "Flag: Thailand");
export const flagTajikistan = new Emoji("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan");
export const flagTokelau = new Emoji("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau");
export const flagTimorLeste = new Emoji("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste");
export const flagTurkmenistan = new Emoji("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan");
export const flagTunisia = new Emoji("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia");
export const flagTonga = new Emoji("\u{1F1F9}\u{1F1F4}", "Flag: Tonga");
export const flagTurkey = new Emoji("\u{1F1F9}\u{1F1F7}", "Flag: Turkey");
export const flagTrinidadTobago = new Emoji("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago");
export const flagTuvalu = new Emoji("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu");
export const flagTaiwan = new Emoji("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan");
export const flagTanzania = new Emoji("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania");
export const flagUkraine = new Emoji("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine");
export const flagUganda = new Emoji("\u{1F1FA}\u{1F1EC}", "Flag: Uganda");
export const flagUSOutlyingIslands = new Emoji("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands");
export const flagUnitedNations = new Emoji("\u{1F1FA}\u{1F1F3}", "Flag: United Nations");
export const flagUnitedStates = new Emoji("\u{1F1FA}\u{1F1F8}", "Flag: United States");
export const flagUruguay = new Emoji("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay");
export const flagUzbekistan = new Emoji("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan");
export const flagVaticanCity = new Emoji("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City");
export const flagStVincentGrenadines = new Emoji("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines");
export const flagVenezuela = new Emoji("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela");
export const flagBritishVirginIslands = new Emoji("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands");
export const flagUSVirginIslands = new Emoji("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands");
export const flagVietnam = new Emoji("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam");
export const flagVanuatu = new Emoji("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu");
export const flagWallisFutuna = new Emoji("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna");
export const flagSamoa = new Emoji("\u{1F1FC}\u{1F1F8}", "Flag: Samoa");
export const flagKosovo = new Emoji("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo");
export const flagYemen = new Emoji("\u{1F1FE}\u{1F1EA}", "Flag: Yemen");
export const flagMayotte = new Emoji("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte");
export const flagSouthAfrica = new Emoji("\u{1F1FF}\u{1F1E6}", "Flag: South Africa");
export const flagZambia = new Emoji("\u{1F1FF}\u{1F1F2}", "Flag: Zambia");
export const flagZimbabwe = new Emoji("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe");

export const whiteFlag = new Emoji("\u{1F3F3}\uFE0F", "White Flag");
export const rainbowFlag = J(whiteFlag, rainbow, "Rainbow Flag");
export const transgenderFlag = J(whiteFlag, transgender, "Transgender Flag");
export const blackFlag = new Emoji("\u{1F3F4}", "Black Flag");
export const pirateFlag = J(blackFlag, skullAndCrossbones, "Pirate Flag");
export const crossedFlags = new Emoji("\u{1F38C}", "Crossed Flags");
export const chequeredFlag = new Emoji("\u{1F3C1}", "Chequered Flag");
export const flagEngland = new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England");
export const flagScotland = new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland");
export const flagWales = new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales");
export const triangularFlag = new Emoji("\u{1F6A9}", "Triangular Flag");

export const motorcycle = new Emoji("\u{1F3CD}\uFE0F", "Motorcycle");
export const racingCar = new Emoji("\u{1F3CE}\uFE0F", "Racing Car");
export const seat = new Emoji("\u{1F4BA}", "Seat");
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
export const oilDrum = new Emoji("\u{1F6E2}\uFE0F", "Oil Drum");
export const motorway = new Emoji("\u{1F6E3}\uFE0F", "Motorway");
export const railwayTrack = new Emoji("\u{1F6E4}\uFE0F", "Railway Track");
export const motorBoat = new Emoji("\u{1F6E5}\uFE0F", "Motor Boat");
export const smallAirplane = new Emoji("\u{1F6E9}\uFE0F", "Small Airplane");
export const airplaneDeparture = new Emoji("\u{1F6EB}", "Airplane Departure");
export const airplaneArrival = new Emoji("\u{1F6EC}", "Airplane Arrival");
export const satellite = new Emoji("\u{1F6F0}\uFE0F", "Satellite");
export const passengerShip = new Emoji("\u{1F6F3}\uFE0F", "Passenger Ship");
export const kickScooter = new Emoji("\u{1F6F4}", "Kick Scooter");
export const motorScooter = new Emoji("\u{1F6F5}", "Motor Scooter");
export const canoe = new Emoji("\u{1F6F6}", "Canoe");
export const flyingSaucer = new Emoji("\u{1F6F8}", "Flying Saucer");
export const skateboard = new Emoji("\u{1F6F9}", "Skateboard");
export const autoRickshaw = new Emoji("\u{1F6FA}", "Auto Rickshaw");
//export const pickupTruck = new Emoji("\u{1F6FB}", "Pickup Truck");
//export const rollerSkate = new Emoji("\u{1F6FC}", "Roller Skate");
export const parachute = new Emoji("\u{1FA82}", "Parachute");
export const anchor = new Emoji("\u2693", "Anchor");
export const ferry = new Emoji("\u26F4\uFE0F", "Ferry");
export const sailboat = new Emoji("\u26F5", "Sailboat");
export const fuelPump = new Emoji("\u26FD", "Fuel Pump");

export const bloodTypeAButton = new Emoji("\u{1F170}", "A Button (Blood Type)");
export const bButtonBloodType = new Emoji("\u{1F171}", "B Button (Blood Type)");
export const oButtonBloodType = new Emoji("\u{1F17E}", "O Button (Blood Type)");
export const aBButtonBloodType = new Emoji("\u{1F18E}", "AB Button (Blood Type)");

export const regionalIndicatorSymbolLetterA = new Emoji("\u{1F1E6}", "Regional Indicator Symbol Letter A");
export const regionalIndicatorSymbolLetterB = new Emoji("\u{1F1E7}", "Regional Indicator Symbol Letter B");
export const regionalIndicatorSymbolLetterC = new Emoji("\u{1F1E8}", "Regional Indicator Symbol Letter C");
export const regionalIndicatorSymbolLetterD = new Emoji("\u{1F1E9}", "Regional Indicator Symbol Letter D");
export const regionalIndicatorSymbolLetterE = new Emoji("\u{1F1EA}", "Regional Indicator Symbol Letter E");
export const regionalIndicatorSymbolLetterF = new Emoji("\u{1F1EB}", "Regional Indicator Symbol Letter F");
export const regionalIndicatorSymbolLetterG = new Emoji("\u{1F1EC}", "Regional Indicator Symbol Letter G");
export const regionalIndicatorSymbolLetterH = new Emoji("\u{1F1ED}", "Regional Indicator Symbol Letter H");
export const regionalIndicatorSymbolLetterI = new Emoji("\u{1F1EE}", "Regional Indicator Symbol Letter I");
export const regionalIndicatorSymbolLetterJ = new Emoji("\u{1F1EF}", "Regional Indicator Symbol Letter J");
export const regionalIndicatorSymbolLetterK = new Emoji("\u{1F1F0}", "Regional Indicator Symbol Letter K");
export const regionalIndicatorSymbolLetterL = new Emoji("\u{1F1F1}", "Regional Indicator Symbol Letter L");
export const regionalIndicatorSymbolLetterM = new Emoji("\u{1F1F2}", "Regional Indicator Symbol Letter M");
export const regionalIndicatorSymbolLetterN = new Emoji("\u{1F1F3}", "Regional Indicator Symbol Letter N");
export const regionalIndicatorSymbolLetterO = new Emoji("\u{1F1F4}", "Regional Indicator Symbol Letter O");
export const regionalIndicatorSymbolLetterP = new Emoji("\u{1F1F5}", "Regional Indicator Symbol Letter P");
export const regionalIndicatorSymbolLetterQ = new Emoji("\u{1F1F6}", "Regional Indicator Symbol Letter Q");
export const regionalIndicatorSymbolLetterR = new Emoji("\u{1F1F7}", "Regional Indicator Symbol Letter R");
export const regionalIndicatorSymbolLetterS = new Emoji("\u{1F1F8}", "Regional Indicator Symbol Letter S");
export const regionalIndicatorSymbolLetterT = new Emoji("\u{1F1F9}", "Regional Indicator Symbol Letter T");
export const regionalIndicatorSymbolLetterU = new Emoji("\u{1F1FA}", "Regional Indicator Symbol Letter U");
export const regionalIndicatorSymbolLetterV = new Emoji("\u{1F1FB}", "Regional Indicator Symbol Letter V");
export const regionalIndicatorSymbolLetterW = new Emoji("\u{1F1FC}", "Regional Indicator Symbol Letter W");
export const regionalIndicatorSymbolLetterX = new Emoji("\u{1F1FD}", "Regional Indicator Symbol Letter X");
export const regionalIndicatorSymbolLetterY = new Emoji("\u{1F1FE}", "Regional Indicator Symbol Letter Y");
export const regionalIndicatorSymbolLetterZ = new Emoji("\u{1F1FF}", "Regional Indicator Symbol Letter Z");

export const japaneseSymbolForBeginner = new Emoji("\u{1F530}", "Japanese Symbol for Beginner");
export const japaneseHereButton = new Emoji("\u{1F201}", "Japanese “Here” Button");
export const japaneseServiceChargeButton = new Emoji("\u{1F202}\uFE0F", "Japanese “Service Charge” Button");
export const japaneseFreeOfChargeButton = new Emoji("\u{1F21A}", "Japanese “Free of Charge” Button");
export const japaneseReservedButton = new Emoji("\u{1F22F}", "Japanese “Reserved” Button");
export const japaneseProhibitedButton = new Emoji("\u{1F232}", "Japanese “Prohibited” Button");
export const japaneseVacancyButton = new Emoji("\u{1F233}", "Japanese “Vacancy” Button");
export const japanesePassingGradeButton = new Emoji("\u{1F234}", "Japanese “Passing Grade” Button");
export const japaneseNoVacancyButton = new Emoji("\u{1F235}", "Japanese “No Vacancy” Button");
export const japaneseNotFreeOfChargeButton = new Emoji("\u{1F236}", "Japanese “Not Free of Charge” Button");
export const japaneseMonthlyAmountButton = new Emoji("\u{1F237}\uFE0F", "Japanese “Monthly Amount” Button");
export const japaneseApplicationButton = new Emoji("\u{1F238}", "Japanese “Application” Button");
export const japaneseDiscountButton = new Emoji("\u{1F239}", "Japanese “Discount” Button");
export const japaneseOpenForBusinessButton = new Emoji("\u{1F23A}", "Japanese “Open for Business” Button");
export const japaneseBargainButton = new Emoji("\u{1F250}", "Japanese “Bargain” Button");
export const japaneseAcceptableButton = new Emoji("\u{1F251}", "Japanese “Acceptable” Button");
export const japaneseCongratulationsButton = new Emoji("\u3297\uFE0F", "Japanese “Congratulations” Button");
export const japaneseSecretButton = new Emoji("\u3299\uFE0F", "Japanese “Secret” Button");

export const oneOClock = new Emoji("\u{1F550}", "One O’Clock");
export const twoOClock = new Emoji("\u{1F551}", "Two O’Clock");
export const threeOClock = new Emoji("\u{1F552}", "Three O’Clock");
export const fourOClock = new Emoji("\u{1F553}", "Four O’Clock");
export const fiveOClock = new Emoji("\u{1F554}", "Five O’Clock");
export const sixOClock = new Emoji("\u{1F555}", "Six O’Clock");
export const sevenOClock = new Emoji("\u{1F556}", "Seven O’Clock");
export const eightOClock = new Emoji("\u{1F557}", "Eight O’Clock");
export const nineOClock = new Emoji("\u{1F558}", "Nine O’Clock");
export const tenOClock = new Emoji("\u{1F559}", "Ten O’Clock");
export const elevenOClock = new Emoji("\u{1F55A}", "Eleven O’Clock");
export const twelveOClock = new Emoji("\u{1F55B}", "Twelve O’Clock");
export const oneThirty = new Emoji("\u{1F55C}", "One-Thirty");
export const twoThirty = new Emoji("\u{1F55D}", "Two-Thirty");
export const threeThirty = new Emoji("\u{1F55E}", "Three-Thirty");
export const fourThirty = new Emoji("\u{1F55F}", "Four-Thirty");
export const fiveThirty = new Emoji("\u{1F560}", "Five-Thirty");
export const sixThirty = new Emoji("\u{1F561}", "Six-Thirty");
export const sevenThirty = new Emoji("\u{1F562}", "Seven-Thirty");
export const eightThirty = new Emoji("\u{1F563}", "Eight-Thirty");
export const nineThirty = new Emoji("\u{1F564}", "Nine-Thirty");
export const tenThirty = new Emoji("\u{1F565}", "Ten-Thirty");
export const elevenThirty = new Emoji("\u{1F566}", "Eleven-Thirty");
export const twelveThirty = new Emoji("\u{1F567}", "Twelve-Thirty");
export const mantelpieceClock = new Emoji("\u{1F570}\uFE0F", "Mantelpiece Clock");
export const watch = new Emoji("\u231A", "Watch");
export const alarmClock = new Emoji("\u23F0", "Alarm Clock");
export const stopwatch = new Emoji("\u23F1\uFE0F", "Stopwatch");
export const timerClock = new Emoji("\u23F2\uFE0F", "Timer Clock");
export const hourglassDone = new Emoji("\u231B", "Hourglass Done");
export const hourglassNotDone = new Emoji("\u23F3", "Hourglass Not Done");

export const clockwiseVerticalArrows = new Emoji("\u{1F503}\uFE0F", "Clockwise Vertical Arrows");
export const counterclockwiseArrowsButton = new Emoji("\u{1F504}\uFE0F", "Counterclockwise Arrows Button");
export const leftRightArrow = new Emoji("\u2194\uFE0F", "Left-Right Arrow");
export const upDownArrow = new Emoji("\u2195\uFE0F", "Up-Down Arrow");
export const upLeftArrow = new Emoji("\u2196\uFE0F", "Up-Left Arrow");
export const upRightArrow = new Emoji("\u2197\uFE0F", "Up-Right Arrow");
export const downRightArrow = new Emoji("\u2198", "Down-Right Arrow");
export const downRightArrowText = new Emoji("\u2198" + textStyle.value, "Down-Right Arrow");
export const downRightArrowEmoji = new Emoji("\u2198\uFE0F", "Down-Right Arrow");
export const downLeftArrow = new Emoji("\u2199\uFE0F", "Down-Left Arrow");
export const rightArrowCurvingLeft = new Emoji("\u21A9\uFE0F", "Right Arrow Curving Left");
export const leftArrowCurvingRight = new Emoji("\u21AA\uFE0F", "Left Arrow Curving Right");
export const rightArrow = new Emoji("\u27A1\uFE0F", "Right Arrow");
export const rightArrowCurvingUp = new Emoji("\u2934\uFE0F", "Right Arrow Curving Up");
export const rightArrowCurvingDown = new Emoji("\u2935\uFE0F", "Right Arrow Curving Down");
export const leftArrow = new Emoji("\u2B05\uFE0F", "Left Arrow");
export const upArrow = new Emoji("\u2B06\uFE0F", "Up Arrow");
export const downArrow = new Emoji("\u2B07\uFE0F", "Down Arrow");

export const clearButton = new Emoji("\u{1F191}", "CL Button");
export const coolButton = new Emoji("\u{1F192}", "Cool Button");
export const freeButton = new Emoji("\u{1F193}", "Free Button");
export const idButton = new Emoji("\u{1F194}", "ID Button");
export const newButton = new Emoji("\u{1F195}", "New Button");
export const ngButton = new Emoji("\u{1F196}", "NG Button");
export const okButton = new Emoji("\u{1F197}", "OK Button");
export const sosButton = new Emoji("\u{1F198}", "SOS Button");
export const upButton = new Emoji("\u{1F199}", "Up! Button");
export const vsButton = new Emoji("\u{1F19A}", "Vs Button");
export const radioButton = new Emoji("\u{1F518}", "Radio Button");
export const backArrow = new Emoji("\u{1F519}", "Back Arrow");
export const endArrow = new Emoji("\u{1F51A}", "End Arrow");
export const onArrow = new Emoji("\u{1F51B}", "On! Arrow");
export const soonArrow = new Emoji("\u{1F51C}", "Soon Arrow");
export const topArrow = new Emoji("\u{1F51D}", "Top Arrow");
export const checkBoxWithCheck = new Emoji("\u2611\uFE0F", "Check Box with Check");
export const inputLatinUppercase = new Emoji("\u{1F520}", "Input Latin Uppercase");
export const inputLatinLowercase = new Emoji("\u{1F521}", "Input Latin Lowercase");
export const inputNumbers = new Emoji("\u{1F522}", "Input Numbers");
export const inputSymbols = new Emoji("\u{1F523}", "Input Symbols");
export const inputLatinLetters = new Emoji("\u{1F524}", "Input Latin Letters");
export const shuffleTracksButton = new Emoji("\u{1F500}", "Shuffle Tracks Button");
export const repeatButton = new Emoji("\u{1F501}", "Repeat Button");
export const repeatSingleButton = new Emoji("\u{1F502}", "Repeat Single Button");
export const upwardsButton = new Emoji("\u{1F53C}", "Upwards Button");
export const downwardsButton = new Emoji("\u{1F53D}", "Downwards Button");
export const playButton = new Emoji("\u25B6\uFE0F", "Play Button");
export const reverseButton = new Emoji("\u25C0\uFE0F", "Reverse Button");
export const ejectButton = new Emoji("\u23CF\uFE0F", "Eject Button");
export const fastForwardButton = new Emoji("\u23E9", "Fast-Forward Button");
export const fastReverseButton = new Emoji("\u23EA", "Fast Reverse Button");
export const fastUpButton = new Emoji("\u23EB", "Fast Up Button");
export const fastDownButton = new Emoji("\u23EC", "Fast Down Button");
export const nextTrackButton = new Emoji("\u23ED\uFE0F", "Next Track Button");
export const lastTrackButton = new Emoji("\u23EE\uFE0F", "Last Track Button");
export const playOrPauseButton = new Emoji("\u23EF\uFE0F", "Play or Pause Button");
export const pauseButton = new Emoji("\u23F8\uFE0F", "Pause Button");
export const stopButton = new Emoji("\u23F9\uFE0F", "Stop Button");
export const recordButton = new Emoji("\u23FA\uFE0F", "Record Button");

export const aries = new Emoji("\u2648", "Aries");
export const taurus = new Emoji("\u2649", "Taurus");
export const gemini = new Emoji("\u264A", "Gemini");
export const cancer = new Emoji("\u264B", "Cancer");
export const leo = new Emoji("\u264C", "Leo");
export const virgo = new Emoji("\u264D", "Virgo");
export const libra = new Emoji("\u264E", "Libra");
export const scorpio = new Emoji("\u264F", "Scorpio");
export const sagittarius = new Emoji("\u2650", "Sagittarius");
export const capricorn = new Emoji("\u2651", "Capricorn");
export const aquarius = new Emoji("\u2652", "Aquarius");
export const pisces = new Emoji("\u2653", "Pisces");
export const ophiuchus = new Emoji("\u26CE", "Ophiuchus");

export const digit0 = new Emoji("0\uFE0F", "Digit Zero");
export const digit1 = new Emoji("1\uFE0F", "Digit One");
export const digit2 = new Emoji("2\uFE0F", "Digit Two");
export const digit3 = new Emoji("3\uFE0F", "Digit Three");
export const digit4 = new Emoji("4\uFE0F", "Digit Four");
export const digit5 = new Emoji("5\uFE0F", "Digit Five");
export const digit6 = new Emoji("6\uFE0F", "Digit Six");
export const digit7 = new Emoji("7\uFE0F", "Digit Seven");
export const digit8 = new Emoji("8\uFE0F", "Digit Eight");
export const digit9 = new Emoji("9\uFE0F", "Digit Nine");
export const asterisk = new Emoji("\u002A\uFE0F", "Asterisk");
export const numberSign = new Emoji("\u0023\uFE0F", "Number Sign");

export const keycapDigit0 = C(digit0, combiningEnclosingKeycap, "Keycap Digit Zero");
export const keycapDigit1 = C(digit1, combiningEnclosingKeycap, "Keycap Digit One");
export const keycapDigit2 = C(digit2, combiningEnclosingKeycap, "Keycap Digit Two");
export const keycapDigit3 = C(digit3, combiningEnclosingKeycap, "Keycap Digit Three");
export const keycapDigit4 = C(digit4, combiningEnclosingKeycap, "Keycap Digit Four");
export const keycapDigit5 = C(digit5, combiningEnclosingKeycap, "Keycap Digit Five");
export const keycapDigit6 = C(digit6, combiningEnclosingKeycap, "Keycap Digit Six");
export const keycapDigit7 = C(digit7, combiningEnclosingKeycap, "Keycap Digit Seven");
export const keycapDigit8 = C(digit8, combiningEnclosingKeycap, "Keycap Digit Eight");
export const keycapDigit9 = C(digit9, combiningEnclosingKeycap, "Keycap Digit Nine");
export const keycapAsterisk = C(asterisk, combiningEnclosingKeycap, "Keycap Asterisk");
export const keycapNumberSign = C(numberSign, combiningEnclosingKeycap, "Keycap Number Sign");
export const keycap10 = new Emoji("\u{1F51F}", "Keycap: 10");

export const tagPlusSign = new Emoji("\u{E002B}", "Tag Plus Sign");
export const tagMinusHyphen = new Emoji("\u{E002D}", "Tag Hyphen-Minus");
export const tagSpace = new Emoji("\u{E0020}", "Tag Space");
export const tagExclamationMark = new Emoji("\u{E0021}", "Tag Exclamation Mark");
export const tagQuotationMark = new Emoji("\u{E0022}", "Tag Quotation Mark");
export const tagNumberSign = new Emoji("\u{E0023}", "Tag Number Sign");
export const tagDollarSign = new Emoji("\u{E0024}", "Tag Dollar Sign");
export const tagPercentSign = new Emoji("\u{E0025}", "Tag Percent Sign");
export const tagAmpersand = new Emoji("\u{E0026}", "Tag Ampersand");
export const tagApostrophe = new Emoji("\u{E0027}", "Tag Apostrophe");
export const tagLeftParenthesis = new Emoji("\u{E0028}", "Tag Left Parenthesis");
export const tagRightParenthesis = new Emoji("\u{E0029}", "Tag Right Parenthesis");
export const tagAsterisk = new Emoji("\u{E002A}", "Tag Asterisk");
export const tagComma = new Emoji("\u{E002C}", "Tag Comma");
export const tagFullStop = new Emoji("\u{E002E}", "Tag Full Stop");
export const tagSolidus = new Emoji("\u{E002F}", "Tag Solidus");
export const tagDigitZero = new Emoji("\u{E0030}", "Tag Digit Zero");
export const tagDigitOne = new Emoji("\u{E0031}", "Tag Digit One");
export const tagDigitTwo = new Emoji("\u{E0032}", "Tag Digit Two");
export const tagDigitThree = new Emoji("\u{E0033}", "Tag Digit Three");
export const tagDigitFour = new Emoji("\u{E0034}", "Tag Digit Four");
export const tagDigitFive = new Emoji("\u{E0035}", "Tag Digit Five");
export const tagDigitSix = new Emoji("\u{E0036}", "Tag Digit Six");
export const tagDigitSeven = new Emoji("\u{E0037}", "Tag Digit Seven");
export const tagDigitEight = new Emoji("\u{E0038}", "Tag Digit Eight");
export const tagDigitNine = new Emoji("\u{E0039}", "Tag Digit Nine");
export const tagColon = new Emoji("\u{E003A}", "Tag Colon");
export const tagSemicolon = new Emoji("\u{E003B}", "Tag Semicolon");
export const tagLessThanSign = new Emoji("\u{E003C}", "Tag Less-Than Sign");
export const tagEqualsSign = new Emoji("\u{E003D}", "Tag Equals Sign");
export const tagGreaterThanSign = new Emoji("\u{E003E}", "Tag Greater-Than Sign");
export const tagQuestionMark = new Emoji("\u{E003F}", "Tag Question Mark");
export const tagCommercialAt = new Emoji("\u{E0040}", "Tag Commercial at");
export const tagLatinCapitalLetterA = new Emoji("\u{E0041}", "Tag Latin Capital Letter a");
export const tagLatinCapitalLetterB = new Emoji("\u{E0042}", "Tag Latin Capital Letter B");
export const tagLatinCapitalLetterC = new Emoji("\u{E0043}", "Tag Latin Capital Letter C");
export const tagLatinCapitalLetterD = new Emoji("\u{E0044}", "Tag Latin Capital Letter D");
export const tagLatinCapitalLetterE = new Emoji("\u{E0045}", "Tag Latin Capital Letter E");
export const tagLatinCapitalLetterF = new Emoji("\u{E0046}", "Tag Latin Capital Letter F");
export const tagLatinCapitalLetterG = new Emoji("\u{E0047}", "Tag Latin Capital Letter G");
export const tagLatinCapitalLetterH = new Emoji("\u{E0048}", "Tag Latin Capital Letter H");
export const tagLatinCapitalLetterI = new Emoji("\u{E0049}", "Tag Latin Capital Letter I");
export const tagLatinCapitalLetterJ = new Emoji("\u{E004A}", "Tag Latin Capital Letter J");
export const tagLatinCapitalLetterK = new Emoji("\u{E004B}", "Tag Latin Capital Letter K");
export const tagLatinCapitalLetterL = new Emoji("\u{E004C}", "Tag Latin Capital Letter L");
export const tagLatinCapitalLetterM = new Emoji("\u{E004D}", "Tag Latin Capital Letter M");
export const tagLatinCapitalLetterN = new Emoji("\u{E004E}", "Tag Latin Capital Letter N");
export const tagLatinCapitalLetterO = new Emoji("\u{E004F}", "Tag Latin Capital Letter O");
export const tagLatinCapitalLetterP = new Emoji("\u{E0050}", "Tag Latin Capital Letter P");
export const tagLatinCapitalLetterQ = new Emoji("\u{E0051}", "Tag Latin Capital Letter Q");
export const tagLatinCapitalLetterR = new Emoji("\u{E0052}", "Tag Latin Capital Letter R");
export const tagLatinCapitalLetterS = new Emoji("\u{E0053}", "Tag Latin Capital Letter S");
export const tagLatinCapitalLetterT = new Emoji("\u{E0054}", "Tag Latin Capital Letter T");
export const tagLatinCapitalLetterU = new Emoji("\u{E0055}", "Tag Latin Capital Letter U");
export const tagLatinCapitalLetterV = new Emoji("\u{E0056}", "Tag Latin Capital Letter V");
export const tagLatinCapitalLetterW = new Emoji("\u{E0057}", "Tag Latin Capital Letter W");
export const tagLatinCapitalLetterX = new Emoji("\u{E0058}", "Tag Latin Capital Letter X");
export const tagLatinCapitalLetterY = new Emoji("\u{E0059}", "Tag Latin Capital Letter Y");
export const tagLatinCapitalLetterZ = new Emoji("\u{E005A}", "Tag Latin Capital Letter Z");
export const tagLeftSquareBracket = new Emoji("\u{E005B}", "Tag Left Square Bracket");
export const tagReverseSolidus = new Emoji("\u{E005C}", "Tag Reverse Solidus");
export const tagRightSquareBracket = new Emoji("\u{E005D}", "Tag Right Square Bracket");
export const tagCircumflexAccent = new Emoji("\u{E005E}", "Tag Circumflex Accent");
export const tagLowLine = new Emoji("\u{E005F}", "Tag Low Line");
export const tagGraveAccent = new Emoji("\u{E0060}", "Tag Grave Accent");
export const tagLatinSmallLetterA = new Emoji("\u{E0061}", "Tag Latin Small Letter a");
export const tagLatinSmallLetterB = new Emoji("\u{E0062}", "Tag Latin Small Letter B");
export const tagLatinSmallLetterC = new Emoji("\u{E0063}", "Tag Latin Small Letter C");
export const tagLatinSmallLetterD = new Emoji("\u{E0064}", "Tag Latin Small Letter D");
export const tagLatinSmallLetterE = new Emoji("\u{E0065}", "Tag Latin Small Letter E");
export const tagLatinSmallLetterF = new Emoji("\u{E0066}", "Tag Latin Small Letter F");
export const tagLatinSmallLetterG = new Emoji("\u{E0067}", "Tag Latin Small Letter G");
export const tagLatinSmallLetterH = new Emoji("\u{E0068}", "Tag Latin Small Letter H");
export const tagLatinSmallLetterI = new Emoji("\u{E0069}", "Tag Latin Small Letter I");
export const tagLatinSmallLetterJ = new Emoji("\u{E006A}", "Tag Latin Small Letter J");
export const tagLatinSmallLetterK = new Emoji("\u{E006B}", "Tag Latin Small Letter K");
export const tagLatinSmallLetterL = new Emoji("\u{E006C}", "Tag Latin Small Letter L");
export const tagLatinSmallLetterM = new Emoji("\u{E006D}", "Tag Latin Small Letter M");
export const tagLatinSmallLetterN = new Emoji("\u{E006E}", "Tag Latin Small Letter N");
export const tagLatinSmallLetterO = new Emoji("\u{E006F}", "Tag Latin Small Letter O");
export const tagLatinSmallLetterP = new Emoji("\u{E0070}", "Tag Latin Small Letter P");
export const tagLatinSmallLetterQ = new Emoji("\u{E0071}", "Tag Latin Small Letter Q");
export const tagLatinSmallLetterR = new Emoji("\u{E0072}", "Tag Latin Small Letter R");
export const tagLatinSmallLetterS = new Emoji("\u{E0073}", "Tag Latin Small Letter S");
export const tagLatinSmallLetterT = new Emoji("\u{E0074}", "Tag Latin Small Letter T");
export const tagLatinSmallLetterU = new Emoji("\u{E0075}", "Tag Latin Small Letter U");
export const tagLatinSmallLetterV = new Emoji("\u{E0076}", "Tag Latin Small Letter V");
export const tagLatinSmallLetterW = new Emoji("\u{E0077}", "Tag Latin Small Letter W");
export const tagLatinSmallLetterX = new Emoji("\u{E0078}", "Tag Latin Small Letter X");
export const tagLatinSmallLetterY = new Emoji("\u{E0079}", "Tag Latin Small Letter Y");
export const tagLatinSmallLetterZ = new Emoji("\u{E007A}", "Tag Latin Small Letter Z");
export const tagLeftCurlyBracket = new Emoji("\u{E007B}", "Tag Left Curly Bracket");
export const tagVerticalLine = new Emoji("\u{E007C}", "Tag Vertical Line");
export const tagRightCurlyBracket = new Emoji("\u{E007D}", "Tag Right Curly Bracket");
export const tagTilde = new Emoji("\u{E007E}", "Tag Tilde");
export const cancelTag = new Emoji("\u{E007F}", "Cancel Tag");

export const multiply = new Emoji("\u2716\uFE0F", "Multiply");
export const plus = new Emoji("\u2795", "Plus");
export const minus = new Emoji("\u2796", "Minus");
export const divide = new Emoji("\u2797", "Divide");

export const spadeSuit = new Emoji("\u2660\uFE0F", "Spade Suit");
export const clubSuit = new Emoji("\u2663\uFE0F", "Club Suit");
export const heartSuit = new Emoji("\u2665\uFE0F", "Heart Suit", { color: "red" });
export const diamondSuit = new Emoji("\u2666\uFE0F", "Diamond Suit", { color: "red" });
export const mahjongRedDragon = new Emoji("\u{1F004}", "Mahjong Red Dragon");
export const joker = new Emoji("\u{1F0CF}", "Joker");
export const directHit = new Emoji("\u{1F3AF}", "Direct Hit");
export const slotMachine = new Emoji("\u{1F3B0}", "Slot Machine");
export const poolBall = new Emoji("\u{1F3B1}", "Pool 8 Ball");
export const gameDie = new Emoji("\u{1F3B2}", "Game Die");
export const bowling = new Emoji("\u{1F3B3}", "Bowling");
export const flowerPlayingCards = new Emoji("\u{1F3B4}", "Flower Playing Cards");
export const puzzlePiece = new Emoji("\u{1F9E9}", "Puzzle Piece");
export const chessPawn = new Emoji("\u265F\uFE0F", "Chess Pawn");
export const yoYo = new Emoji("\u{1FA80}", "Yo-Yo");
//export const boomerang = new Emoji("\u{1FA83}", "Boomerang");
//export const nestingDolls = new Emoji("\u{1FA86}", "Nesting Dolls");
export const kite = new Emoji("\u{1FA81}", "Kite");

export const runningShirt = new Emoji("\u{1F3BD}", "Running Shirt");
export const tennis = new Emoji("\u{1F3BE}", "Tennis");
export const skis = new Emoji("\u{1F3BF}", "Skis");
export const basketball = new Emoji("\u{1F3C0}", "Basketball");
export const sportsMedal = new Emoji("\u{1F3C5}", "Sports Medal");
export const trophy = new Emoji("\u{1F3C6}", "Trophy");
export const americanFootball = new Emoji("\u{1F3C8}", "American Football");
export const rugbyFootball = new Emoji("\u{1F3C9}", "Rugby Football");
export const cricketGame = new Emoji("\u{1F3CF}", "Cricket Game");
export const volleyball = new Emoji("\u{1F3D0}", "Volleyball");
export const fieldHockey = new Emoji("\u{1F3D1}", "Field Hockey");
export const iceHockey = new Emoji("\u{1F3D2}", "Ice Hockey");
export const pingPong = new Emoji("\u{1F3D3}", "Ping Pong");
export const badminton = new Emoji("\u{1F3F8}", "Badminton");
export const sled = new Emoji("\u{1F6F7}", "Sled");
export const goalNet = new Emoji("\u{1F945}", "Goal Net");
export const stPlaceMedal = new Emoji("\u{1F947}", "1st Place Medal");
export const ndPlaceMedal = new Emoji("\u{1F948}", "2nd Place Medal");
export const rdPlaceMedal = new Emoji("\u{1F949}", "3rd Place Medal");
export const boxingGlove = new Emoji("\u{1F94A}", "Boxing Glove");
export const curlingStone = new Emoji("\u{1F94C}", "Curling Stone");
export const lacrosse = new Emoji("\u{1F94D}", "Lacrosse");
export const softball = new Emoji("\u{1F94E}", "Softball");
export const flyingDisc = new Emoji("\u{1F94F}", "Flying Disc");
export const soccerBall = new Emoji("\u26BD", "Soccer Ball");
export const baseball = new Emoji("\u26BE", "Baseball");
export const iceSkate = new Emoji("\u26F8\uFE0F", "Ice Skate");

export const topHat = new Emoji("\u{1F3A9}", "Top Hat");
export const divingMask = new Emoji("\u{1F93F}", "Diving Mask");
export const womansHat = new Emoji("\u{1F452}", "Woman’s Hat");
export const glasses = new Emoji("\u{1F453}", "Glasses");
export const sunglasses = new Emoji("\u{1F576}\uFE0F", "Sunglasses");
export const necktie = new Emoji("\u{1F454}", "Necktie");
export const tShirt = new Emoji("\u{1F455}", "T-Shirt");
export const jeans = new Emoji("\u{1F456}", "Jeans");
export const dress = new Emoji("\u{1F457}", "Dress");
export const kimono = new Emoji("\u{1F458}", "Kimono");
export const bikini = new Emoji("\u{1F459}", "Bikini");
export const womansClothes = new Emoji("\u{1F45A}", "Woman’s Clothes");
export const purse = new Emoji("\u{1F45B}", "Purse");
export const handbag = new Emoji("\u{1F45C}", "Handbag");
export const clutchBag = new Emoji("\u{1F45D}", "Clutch Bag");
export const mansShoe = new Emoji("\u{1F45E}", "Man’s Shoe");
export const runningShoe = new Emoji("\u{1F45F}", "Running Shoe");
export const highHeeledShoe = new Emoji("\u{1F460}", "High-Heeled Shoe");
export const womansSandal = new Emoji("\u{1F461}", "Woman’s Sandal");
export const womansBoot = new Emoji("\u{1F462}", "Woman’s Boot");
export const martialArtsUniform = new Emoji("\u{1F94B}", "Martial Arts Uniform");
export const sari = new Emoji("\u{1F97B}", "Sari");
export const labCoat = new Emoji("\u{1F97C}", "Lab Coat");
export const goggles = new Emoji("\u{1F97D}", "Goggles");
export const hikingBoot = new Emoji("\u{1F97E}", "Hiking Boot");
export const flatShoe = new Emoji("\u{1F97F}", "Flat Shoe");
export const billedCap = new Emoji("\u{1F9E2}", "Billed Cap");
export const scarf = new Emoji("\u{1F9E3}", "Scarf");
export const gloves = new Emoji("\u{1F9E4}", "Gloves");
export const coat = new Emoji("\u{1F9E5}", "Coat");
export const socks = new Emoji("\u{1F9E6}", "Socks");
export const nazarAmulet = new Emoji("\u{1F9FF}", "Nazar Amulet");
export const balletShoes = new Emoji("\u{1FA70}", "Ballet Shoes");
export const onePieceSwimsuit = new Emoji("\u{1FA71}", "One-Piece Swimsuit");
export const briefs = new Emoji("\u{1FA72}", "Briefs");
export const shorts = new Emoji("\u{1FA73}", "Shorts");

export const buildingConstruction = new Emoji("\u{1F3D7}\uFE0F", "Building Construction");
export const houses = new Emoji("\u{1F3D8}\uFE0F", "Houses");
export const cityscape = new Emoji("\u{1F3D9}\uFE0F", "Cityscape");
export const derelictHouse = new Emoji("\u{1F3DA}\uFE0F", "Derelict House");
export const classicalBuilding = new Emoji("\u{1F3DB}\uFE0F", "Classical Building");
export const desert = new Emoji("\u{1F3DC}\uFE0F", "Desert");
export const desertIsland = new Emoji("\u{1F3DD}\uFE0F", "Desert Island");
export const nationalPark = new Emoji("\u{1F3DE}\uFE0F", "National Park");
export const stadium = new Emoji("\u{1F3DF}\uFE0F", "Stadium");
export const house = new Emoji("\u{1F3E0}", "House");
export const houseWithGarden = new Emoji("\u{1F3E1}", "House with Garden");
export const officeBuilding = new Emoji("\u{1F3E2}", "Office Building");
export const japanesePostOffice = new Emoji("\u{1F3E3}", "Japanese Post Office");
export const postOffice = new Emoji("\u{1F3E4}", "Post Office");
export const hospital = new Emoji("\u{1F3E5}", "Hospital");
export const bank = new Emoji("\u{1F3E6}", "Bank");
export const aTMSign = new Emoji("\u{1F3E7}", "ATM Sign");
export const hotel = new Emoji("\u{1F3E8}", "Hotel");
export const loveHotel = new Emoji("\u{1F3E9}", "Love Hotel");
export const convenienceStore = new Emoji("\u{1F3EA}", "Convenience Store");
export const departmentStore = new Emoji("\u{1F3EC}", "Department Store");
export const bridgeAtNight = new Emoji("\u{1F309}", "Bridge at Night");
export const fountain = new Emoji("\u26F2", "Fountain");
export const shoppingBags = new Emoji("\u{1F6CD}\uFE0F", "Shopping Bags");
export const receipt = new Emoji("\u{1F9FE}", "Receipt");
export const shoppingCart = new Emoji("\u{1F6D2}", "Shopping Cart");
export const barberPole = new Emoji("\u{1F488}", "Barber Pole");
export const wedding = new Emoji("\u{1F492}", "Wedding");
export const ballotBoxWithBallot = new Emoji("\u{1F5F3}\uFE0F", "Ballot Box with Ballot");

export const musicalScore = new Emoji("\u{1F3BC}", "Musical Score");
export const musicalNotes = new Emoji("\u{1F3B6}", "Musical Notes");
export const musicalNote = new Emoji("\u{1F3B5}", "Musical Note");
export const saxophone = new Emoji("\u{1F3B7}", "Saxophone");
export const guitar = new Emoji("\u{1F3B8}", "Guitar");
export const musicalKeyboard = new Emoji("\u{1F3B9}", "Musical Keyboard");
export const trumpet = new Emoji("\u{1F3BA}", "Trumpet");
export const violin = new Emoji("\u{1F3BB}", "Violin");
export const drum = new Emoji("\u{1F941}", "Drum");
//export const accordion = new Emoji("\u{1FA97}", "Accordion");
//export const longDrum = new Emoji("\u{1FA98}", "Long Drum");
export const banjo = new Emoji("\u{1FA95}", "Banjo");

export const globeShowingAmericas = new Emoji("\u{1F30E}", "Globe Showing Americas");

export const milkyWay = new Emoji("\u{1F30C}", "Milky Way");
export const globeShowingEuropeAfrica = new Emoji("\u{1F30D}", "Globe Showing Europe-Africa");
export const globeShowingAsiaAustralia = new Emoji("\u{1F30F}", "Globe Showing Asia-Australia");
export const globeWithMeridians = new Emoji("\u{1F310}", "Globe with Meridians");
export const newMoon = new Emoji("\u{1F311}", "New Moon");
export const waxingCrescentMoon = new Emoji("\u{1F312}", "Waxing Crescent Moon");
export const firstQuarterMoon = new Emoji("\u{1F313}", "First Quarter Moon");
export const waxingGibbousMoon = new Emoji("\u{1F314}", "Waxing Gibbous Moon");
export const fullMoon = new Emoji("\u{1F315}", "Full Moon");
export const waningGibbousMoon = new Emoji("\u{1F316}", "Waning Gibbous Moon");
export const lastQuarterMoon = new Emoji("\u{1F317}", "Last Quarter Moon");
export const waningCrescentMoon = new Emoji("\u{1F318}", "Waning Crescent Moon");
export const crescentMoon = new Emoji("\u{1F319}", "Crescent Moon");
export const newMoonFace = new Emoji("\u{1F31A}", "New Moon Face");
export const firstQuarterMoonFace = new Emoji("\u{1F31B}", "First Quarter Moon Face");
export const lastQuarterMoonFace = new Emoji("\u{1F31C}", "Last Quarter Moon Face");
export const fullMoonFace = new Emoji("\u{1F31D}", "Full Moon Face");
export const sunWithFace = new Emoji("\u{1F31E}", "Sun with Face");
export const glowingStar = new Emoji("\u{1F31F}", "Glowing Star");
export const shootingStar = new Emoji("\u{1F320}", "Shooting Star");
export const comet = new Emoji("\u2604\uFE0F", "Comet");
export const ringedPlanet = new Emoji("\u{1FA90}", "Ringed Planet");

export const moneyBag = new Emoji("\u{1F4B0}", "Money Bag");
export const currencyExchange = new Emoji("\u{1F4B1}", "Currency Exchange");
export const heavyDollarSign = new Emoji("\u{1F4B2}", "Heavy Dollar Sign");
export const creditCard = new Emoji("\u{1F4B3}", "Credit Card");
export const yenBanknote = new Emoji("\u{1F4B4}", "Yen Banknote");
export const dollarBanknote = new Emoji("\u{1F4B5}", "Dollar Banknote");
export const euroBanknote = new Emoji("\u{1F4B6}", "Euro Banknote");
export const poundBanknote = new Emoji("\u{1F4B7}", "Pound Banknote");
export const moneyWithWings = new Emoji("\u{1F4B8}", "Money with Wings");
//export const coin = new Emoji("\u{1FA99}", "Coin");
export const chartIncreasingWithYen = new Emoji("\u{1F4B9}", "Chart Increasing with Yen");

export const pen = new Emoji("\u{1F58A}\uFE0F", "Pen");
export const fountainPen = new Emoji("\u{1F58B}\uFE0F", "Fountain Pen");
export const paintbrush = new Emoji("\u{1F58C}\uFE0F", "Paintbrush");
export const crayon = new Emoji("\u{1F58D}\uFE0F", "Crayon");
export const pencil = new Emoji("\u270F\uFE0F", "Pencil");
export const blackNib = new Emoji("\u2712\uFE0F", "Black Nib");

export const alembic = new Emoji("\u2697\uFE0F", "Alembic");
export const gear = new Emoji("\u2699\uFE0F", "Gear");
export const atomSymbol = new Emoji("\u269B\uFE0F", "Atom Symbol");
export const keyboard = new Emoji("\u2328\uFE0F", "Keyboard");
export const telephone = new Emoji("\u260E\uFE0F", "Telephone");
export const studioMicrophone = new Emoji("\u{1F399}\uFE0F", "Studio Microphone");
export const levelSlider = new Emoji("\u{1F39A}\uFE0F", "Level Slider");
export const controlKnobs = new Emoji("\u{1F39B}\uFE0F", "Control Knobs");
export const movieCamera = new Emoji("\u{1F3A5}", "Movie Camera");
export const headphone = new Emoji("\u{1F3A7}", "Headphone");
export const videoGame = new Emoji("\u{1F3AE}", "Video Game");
export const lightBulb = new Emoji("\u{1F4A1}", "Light Bulb");
export const computerDisk = new Emoji("\u{1F4BD}", "Computer Disk");
export const floppyDisk = new Emoji("\u{1F4BE}", "Floppy Disk");
export const opticalDisk = new Emoji("\u{1F4BF}", "Optical Disk");
export const dvd = new Emoji("\u{1F4C0}", "DVD");
export const telephoneReceiver = new Emoji("\u{1F4DE}", "Telephone Receiver");
export const pager = new Emoji("\u{1F4DF}", "Pager");
export const faxMachine = new Emoji("\u{1F4E0}", "Fax Machine");
export const satelliteAntenna = new Emoji("\u{1F4E1}", "Satellite Antenna");
export const loudspeaker = new Emoji("\u{1F4E2}", "Loudspeaker");
export const megaphone = new Emoji("\u{1F4E3}", "Megaphone");
export const mobilePhone = new Emoji("\u{1F4F1}", "Mobile Phone");
export const mobilePhoneWithArrow = new Emoji("\u{1F4F2}", "Mobile Phone with Arrow");
export const mobilePhoneVibrating = new Emoji("\u{1F4F3}", "Mobile Phone Vibrating");
export const mobilePhoneOff = new Emoji("\u{1F4F4}", "Mobile Phone Off");
export const noMobilePhone = new Emoji("\u{1F4F5}", "No Mobile Phone");
export const antennaBars = new Emoji("\u{1F4F6}", "Antenna Bars");
export const camera = new Emoji("\u{1F4F7}", "Camera");
export const cameraWithFlash = new Emoji("\u{1F4F8}", "Camera with Flash");
export const videoCamera = new Emoji("\u{1F4F9}", "Video Camera");
export const television = new Emoji("\u{1F4FA}", "Television");
export const radio = new Emoji("\u{1F4FB}", "Radio");
export const videocassette = new Emoji("\u{1F4FC}", "Videocassette");
export const filmProjector = new Emoji("\u{1F4FD}\uFE0F", "Film Projector");
export const portableStereo = new Emoji("\u{1F4FE}\uFE0F", "Portable Stereo");
export const dimButton = new Emoji("\u{1F505}", "Dim Button");
export const brightButton = new Emoji("\u{1F506}", "Bright Button");
export const mutedSpeaker = new Emoji("\u{1F507}", "Muted Speaker");
export const speakerLowVolume = new Emoji("\u{1F508}", "Speaker Low Volume");
export const speakerMediumVolume = new Emoji("\u{1F509}", "Speaker Medium Volume");
export const speakerHighVolume = new Emoji("\u{1F50A}", "Speaker High Volume");
export const battery = new Emoji("\u{1F50B}", "Battery");
export const electricPlug = new Emoji("\u{1F50C}", "Electric Plug");
export const magnifyingGlassTiltedLeft = new Emoji("\u{1F50D}", "Magnifying Glass Tilted Left");
export const magnifyingGlassTiltedRight = new Emoji("\u{1F50E}", "Magnifying Glass Tilted Right");
export const lockedWithPen = new Emoji("\u{1F50F}", "Locked with Pen");
export const lockedWithKey = new Emoji("\u{1F510}", "Locked with Key");
export const key = new Emoji("\u{1F511}", "Key");
export const locked = new Emoji("\u{1F512}", "Locked");
export const unlocked = new Emoji("\u{1F513}", "Unlocked");
export const bell = new Emoji("\u{1F514}", "Bell");
export const bellWithSlash = new Emoji("\u{1F515}", "Bell with Slash");
export const bookmark = new Emoji("\u{1F516}", "Bookmark");
export const link = new Emoji("\u{1F517}", "Link");
export const joystick = new Emoji("\u{1F579}\uFE0F", "Joystick");
export const desktopComputer = new Emoji("\u{1F5A5}\uFE0F", "Desktop Computer");
export const printer = new Emoji("\u{1F5A8}\uFE0F", "Printer");
export const computerMouse = new Emoji("\u{1F5B1}\uFE0F", "Computer Mouse");
export const trackball = new Emoji("\u{1F5B2}\uFE0F", "Trackball");
export const blackFolder = new Emoji("\u{1F5BF}", "Black Folder");
export const folder = new Emoji("\u{1F5C0}", "Folder");
export const openFolder = new Emoji("\u{1F5C1}", "Open Folder");
export const cardIndexDividers = new Emoji("\u{1F5C2}", "Card Index Dividers");
export const cardFileBox = new Emoji("\u{1F5C3}", "Card File Box");
export const fileCabinet = new Emoji("\u{1F5C4}", "File Cabinet");
export const emptyNote = new Emoji("\u{1F5C5}", "Empty Note");
export const emptyNotePage = new Emoji("\u{1F5C6}", "Empty Note Page");
export const emptyNotePad = new Emoji("\u{1F5C7}", "Empty Note Pad");
export const note = new Emoji("\u{1F5C8}", "Note");
export const notePage = new Emoji("\u{1F5C9}", "Note Page");
export const notePad = new Emoji("\u{1F5CA}", "Note Pad");
export const emptyDocument = new Emoji("\u{1F5CB}", "Empty Document");
export const emptyPage = new Emoji("\u{1F5CC}", "Empty Page");
export const emptyPages = new Emoji("\u{1F5CD}", "Empty Pages");
export const documentIcon = new Emoji("\u{1F5CE}", "Document");
export const page = new Emoji("\u{1F5CF}", "Page");
export const pages = new Emoji("\u{1F5D0}", "Pages");
export const wastebasket = new Emoji("\u{1F5D1}", "Wastebasket");
export const spiralNotePad = new Emoji("\u{1F5D2}", "Spiral Note Pad");
export const spiralCalendar = new Emoji("\u{1F5D3}", "Spiral Calendar");
export const desktopWindow = new Emoji("\u{1F5D4}", "Desktop Window");
export const minimize = new Emoji("\u{1F5D5}", "Minimize");
export const maximize = new Emoji("\u{1F5D6}", "Maximize");
export const overlap = new Emoji("\u{1F5D7}", "Overlap");
export const reload = new Emoji("\u{1F5D8}", "Reload");
export const close = new Emoji("\u{1F5D9}", "Close");
export const increaseFontSize = new Emoji("\u{1F5DA}", "Increase Font Size");
export const decreaseFontSize = new Emoji("\u{1F5DB}", "Decrease Font Size");
export const compression = new Emoji("\u{1F5DC}", "Compression");
export const oldKey = new Emoji("\u{1F5DD}", "Old Key");

export const outboxTray = new Emoji("\u{1F4E4}", "Outbox Tray");
export const inboxTray = new Emoji("\u{1F4E5}", "Inbox Tray");
export const packageBox = new Emoji("\u{1F4E6}", "Package");
export const eMail = new Emoji("\u{1F4E7}", "E-Mail");
export const incomingEnvelope = new Emoji("\u{1F4E8}", "Incoming Envelope");
export const envelopeWithArrow = new Emoji("\u{1F4E9}", "Envelope with Arrow");
export const closedMailboxWithLoweredFlag = new Emoji("\u{1F4EA}", "Closed Mailbox with Lowered Flag");
export const closedMailboxWithRaisedFlag = new Emoji("\u{1F4EB}", "Closed Mailbox with Raised Flag");
export const openMailboxWithRaisedFlag = new Emoji("\u{1F4EC}", "Open Mailbox with Raised Flag");
export const openMailboxWithLoweredFlag = new Emoji("\u{1F4ED}", "Open Mailbox with Lowered Flag");
export const postbox = new Emoji("\u{1F4EE}", "Postbox");
export const postalHorn = new Emoji("\u{1F4EF}", "Postal Horn");

export const ribbon = new Emoji("\u{1F380}", "Ribbon");
export const wrappedGift = new Emoji("\u{1F381}", "Wrapped Gift");
export const jackOLantern = new Emoji("\u{1F383}", "Jack-O-Lantern");
export const christmasTree = new Emoji("\u{1F384}", "Christmas Tree");
export const firecracker = new Emoji("\u{1F9E8}", "Firecracker");
export const fireworks = new Emoji("\u{1F386}", "Fireworks");
export const sparkler = new Emoji("\u{1F387}", "Sparkler");
export const sparkles = new Emoji("\u2728", "Sparkles");
export const sparkle = new Emoji("\u2747\uFE0F", "Sparkle");
export const balloon = new Emoji("\u{1F388}", "Balloon");
export const partyPopper = new Emoji("\u{1F389}", "Party Popper");
export const confettiBall = new Emoji("\u{1F38A}", "Confetti Ball");
export const tanabataTree = new Emoji("\u{1F38B}", "Tanabata Tree");
export const pineDecoration = new Emoji("\u{1F38D}", "Pine Decoration");
export const japaneseDolls = new Emoji("\u{1F38E}", "Japanese Dolls");
export const carpStreamer = new Emoji("\u{1F38F}", "Carp Streamer");
export const windChime = new Emoji("\u{1F390}", "Wind Chime");
export const moonViewingCeremony = new Emoji("\u{1F391}", "Moon Viewing Ceremony");
export const backpack = new Emoji("\u{1F392}", "Backpack");
export const redEnvelope = new Emoji("\u{1F9E7}", "Red Envelope");
export const redPaperLantern = new Emoji("\u{1F3EE}", "Red Paper Lantern");
export const militaryMedal = new Emoji("\u{1F396}\uFE0F", "Military Medal");

export const fishingPole = new Emoji("\u{1F3A3}", "Fishing Pole");
export const flashlight = new Emoji("\u{1F526}", "Flashlight");
export const hammer = new Emoji("\u{1F528}", "Hammer");
export const nutAndBolt = new Emoji("\u{1F529}", "Nut and Bolt");
export const hammerAndWrench = new Emoji("\u{1F6E0}\uFE0F", "Hammer and Wrench");
export const compass = new Emoji("\u{1F9ED}", "Compass");
export const fireExtinguisher = new Emoji("\u{1F9EF}", "Fire Extinguisher");
export const toolbox = new Emoji("\u{1F9F0}", "Toolbox");
export const brick = new Emoji("\u{1F9F1}", "Brick");
export const axe = new Emoji("\u{1FA93}", "Axe");
export const hammerAndPick = new Emoji("\u2692\uFE0F", "Hammer and Pick");
export const pick = new Emoji("\u26CF\uFE0F", "Pick");
export const rescueWorkersHelmet = new Emoji("\u26D1\uFE0F", "Rescue Worker’s Helmet");
export const chains = new Emoji("\u26D3\uFE0F", "Chains");

export const fileFolder = new Emoji("\u{1F4C1}", "File Folder");
export const openFileFolder = new Emoji("\u{1F4C2}", "Open File Folder");
export const pageWithCurl = new Emoji("\u{1F4C3}", "Page with Curl");
export const pageFacingUp = new Emoji("\u{1F4C4}", "Page Facing Up");
export const calendar = new Emoji("\u{1F4C5}", "Calendar");
export const tearOffCalendar = new Emoji("\u{1F4C6}", "Tear-Off Calendar");
export const cardIndex = new Emoji("\u{1F4C7}", "Card Index");
export const chartIncreasing = new Emoji("\u{1F4C8}", "Chart Increasing");
export const chartDecreasing = new Emoji("\u{1F4C9}", "Chart Decreasing");
export const barChart = new Emoji("\u{1F4CA}", "Bar Chart");
export const clipboard = new Emoji("\u{1F4CB}", "Clipboard");
export const pushpin = new Emoji("\u{1F4CC}", "Pushpin");
export const roundPushpin = new Emoji("\u{1F4CD}", "Round Pushpin");
export const paperclip = new Emoji("\u{1F4CE}", "Paperclip");
export const linkedPaperclips = new Emoji("\u{1F587}\uFE0F", "Linked Paperclips");
export const straightRuler = new Emoji("\u{1F4CF}", "Straight Ruler");
export const triangularRuler = new Emoji("\u{1F4D0}", "Triangular Ruler");
export const bookmarkTabs = new Emoji("\u{1F4D1}", "Bookmark Tabs");
export const ledger = new Emoji("\u{1F4D2}", "Ledger");
export const notebook = new Emoji("\u{1F4D3}", "Notebook");
export const notebookWithDecorativeCover = new Emoji("\u{1F4D4}", "Notebook with Decorative Cover");
export const closedBook = new Emoji("\u{1F4D5}", "Closed Book");
export const openBook = new Emoji("\u{1F4D6}", "Open Book");
export const greenBook = new Emoji("\u{1F4D7}", "Green Book");
export const blueBook = new Emoji("\u{1F4D8}", "Blue Book");
export const orangeBook = new Emoji("\u{1F4D9}", "Orange Book");
export const books = new Emoji("\u{1F4DA}", "Books");
export const nameBadge = new Emoji("\u{1F4DB}", "Name Badge");
export const scroll = new Emoji("\u{1F4DC}", "Scroll");
export const memo = new Emoji("\u{1F4DD}", "Memo");
export const scissors = new Emoji("\u2702\uFE0F", "Scissors");
export const envelope = new Emoji("\u2709\uFE0F", "Envelope");

export const cinema = new Emoji("\u{1F3A6}", "Cinema");
export const noOneUnderEighteen = new Emoji("\u{1F51E}", "No One Under Eighteen");
export const prohibited = new Emoji("\u{1F6AB}", "Prohibited");
export const cigarette = new Emoji("\u{1F6AC}", "Cigarette");
export const noSmoking = new Emoji("\u{1F6AD}", "No Smoking");
export const litterInBinSign = new Emoji("\u{1F6AE}", "Litter in Bin Sign");
export const noLittering = new Emoji("\u{1F6AF}", "No Littering");
export const potableWater = new Emoji("\u{1F6B0}", "Potable Water");
export const nonPotableWater = new Emoji("\u{1F6B1}", "Non-Potable Water");
export const noBicycles = new Emoji("\u{1F6B3}", "No Bicycles");
export const noPedestrians = new Emoji("\u{1F6B7}", "No Pedestrians");
export const childrenCrossing = new Emoji("\u{1F6B8}", "Children Crossing");
export const mensRoom = new Emoji("\u{1F6B9}", "Men’s Room");
export const womensRoom = new Emoji("\u{1F6BA}", "Women’s Room");
export const restroom = new Emoji("\u{1F6BB}", "Restroom");
export const babySymbol = new Emoji("\u{1F6BC}", "Baby Symbol");
export const waterCloset = new Emoji("\u{1F6BE}", "Water Closet");
export const passportControl = new Emoji("\u{1F6C2}", "Passport Control");
export const customs = new Emoji("\u{1F6C3}", "Customs");
export const baggageClaim = new Emoji("\u{1F6C4}", "Baggage Claim");
export const leftLuggage = new Emoji("\u{1F6C5}", "Left Luggage");
export const parkingButton = new Emoji("\u{1F17F}\uFE0F", "Parking Button");
export const wheelchairSymbol = new Emoji("\u267F", "Wheelchair Symbol");
export const radioactive = new Emoji("\u2622\uFE0F", "Radioactive");
export const biohazard = new Emoji("\u2623\uFE0F", "Biohazard");
export const warning = new Emoji("\u26A0\uFE0F", "Warning");
export const highVoltage = new Emoji("\u26A1", "High Voltage");
export const noEntry = new Emoji("\u26D4", "No Entry");
export const recyclingSymbol = new Emoji("\u267B\uFE0F", "Recycling Symbol");

export const dottedSixPointedStar = new Emoji("\u{1F52F}", "Dotted Six-Pointed Star");
export const starOfDavid = new Emoji("\u2721\uFE0F", "Star of David");
export const om = new Emoji("\u{1F549}\uFE0F", "Om");
export const kaaba = new Emoji("\u{1F54B}", "Kaaba");
export const mosque = new Emoji("\u{1F54C}", "Mosque");
export const synagogue = new Emoji("\u{1F54D}", "Synagogue");
export const menorah = new Emoji("\u{1F54E}", "Menorah");
export const placeOfWorship = new Emoji("\u{1F6D0}", "Place of Worship");
export const hinduTemple = new Emoji("\u{1F6D5}", "Hindu Temple");
export const orthodoxCross = new Emoji("\u2626\uFE0F", "Orthodox Cross");
export const latinCross = new Emoji("\u271D\uFE0F", "Latin Cross");
export const starAndCrescent = new Emoji("\u262A\uFE0F", "Star and Crescent");
export const peaceSymbol = new Emoji("\u262E\uFE0F", "Peace Symbol");
export const yinYang = new Emoji("\u262F\uFE0F", "Yin Yang");
export const wheelOfDharma = new Emoji("\u2638\uFE0F", "Wheel of Dharma");
export const infinity = new Emoji("\u267E\uFE0F", "Infinity");
export const diyaLamp = new Emoji("\u{1FA94}", "Diya Lamp");
export const shintoShrine = new Emoji("\u26E9\uFE0F", "Shinto Shrine");
export const church = new Emoji("\u26EA", "Church");
export const eightPointedStar = new Emoji("\u2734\uFE0F", "Eight-Pointed Star");
export const prayerBeads = new Emoji("\u{1F4FF}", "Prayer Beads");

export const door = new Emoji("\u{1F6AA}", "Door");
export const lipstick = new Emoji("\u{1F484}", "Lipstick");
export const ring = new Emoji("\u{1F48D}", "Ring");
export const gemStone = new Emoji("\u{1F48E}", "Gem Stone");
export const newspaper = new Emoji("\u{1F4F0}", "Newspaper");
export const fire = new Emoji("\u{1F525}", "Fire");
export const pistol = new Emoji("\u{1F52B}", "Pistol");
export const candle = new Emoji("\u{1F56F}\uFE0F", "Candle");
export const framedPicture = new Emoji("\u{1F5BC}\uFE0F", "Framed Picture");
export const rolledUpNewspaper = new Emoji("\u{1F5DE}\uFE0F", "Rolled-Up Newspaper");
export const worldMap = new Emoji("\u{1F5FA}\uFE0F", "World Map");
export const toilet = new Emoji("\u{1F6BD}", "Toilet");
export const shower = new Emoji("\u{1F6BF}", "Shower");
export const bathtub = new Emoji("\u{1F6C1}", "Bathtub");
export const couchAndLamp = new Emoji("\u{1F6CB}\uFE0F", "Couch and Lamp");
export const bed = new Emoji("\u{1F6CF}\uFE0F", "Bed");
export const lotionBottle = new Emoji("\u{1F9F4}", "Lotion Bottle");
export const thread = new Emoji("\u{1F9F5}", "Thread");
export const yarn = new Emoji("\u{1F9F6}", "Yarn");
export const safetyPin = new Emoji("\u{1F9F7}", "Safety Pin");
export const teddyBear = new Emoji("\u{1F9F8}", "Teddy Bear");
export const broom = new Emoji("\u{1F9F9}", "Broom");
export const basket = new Emoji("\u{1F9FA}", "Basket");
export const rollOfPaper = new Emoji("\u{1F9FB}", "Roll of Paper");
export const soap = new Emoji("\u{1F9FC}", "Soap");
export const sponge = new Emoji("\u{1F9FD}", "Sponge");
export const chair = new Emoji("\u{1FA91}", "Chair");
export const razor = new Emoji("\u{1FA92}", "Razor");
export const reminderRibbon = new Emoji("\u{1F397}\uFE0F", "Reminder Ribbon");

export const filmFrames = new Emoji("\u{1F39E}\uFE0F", "Film Frames");
export const admissionTickets = new Emoji("\u{1F39F}\uFE0F", "Admission Tickets");
export const carouselHorse = new Emoji("\u{1F3A0}", "Carousel Horse");
export const ferrisWheel = new Emoji("\u{1F3A1}", "Ferris Wheel");
export const rollerCoaster = new Emoji("\u{1F3A2}", "Roller Coaster");
export const circusTent = new Emoji("\u{1F3AA}", "Circus Tent");
export const ticket = new Emoji("\u{1F3AB}", "Ticket");
export const clapperBoard = new Emoji("\u{1F3AC}", "Clapper Board");
export const performingArts = new Emoji("\u{1F3AD}", "Performing Arts");

export const label = new Emoji("\u{1F3F7}\uFE0F", "Label");
export const volcano = new Emoji("\u{1F30B}", "Volcano");
export const snowCappedMountain = new Emoji("\u{1F3D4}\uFE0F", "Snow-Capped Mountain");
export const mountain = new Emoji("\u26F0\uFE0F", "Mountain");
export const camping = new Emoji("\u{1F3D5}\uFE0F", "Camping");
export const beachWithUmbrella = new Emoji("\u{1F3D6}\uFE0F", "Beach with Umbrella");
export const umbrellaOnGround = new Emoji("\u26F1\uFE0F", "Umbrella on Ground");
export const japaneseCastle = new Emoji("\u{1F3EF}", "Japanese Castle");
export const footprints = new Emoji("\u{1F463}", "Footprints");
export const mountFuji = new Emoji("\u{1F5FB}", "Mount Fuji");
export const tokyoTower = new Emoji("\u{1F5FC}", "Tokyo Tower");
export const statueOfLiberty = new Emoji("\u{1F5FD}", "Statue of Liberty");
export const mapOfJapan = new Emoji("\u{1F5FE}", "Map of Japan");
export const moai = new Emoji("\u{1F5FF}", "Moai");
export const bellhopBell = new Emoji("\u{1F6CE}\uFE0F", "Bellhop Bell");
export const luggage = new Emoji("\u{1F9F3}", "Luggage");
export const flagInHole = new Emoji("\u26F3", "Flag in Hole");
export const tent = new Emoji("\u26FA", "Tent");
export const hotSprings = new Emoji("\u2668\uFE0F", "Hot Springs");

export const castle = new Emoji("\u{1F3F0}", "Castle");
export const bowAndArrow = new Emoji("\u{1F3F9}", "Bow and Arrow");
export const tridentEmblem = new Emoji("\u{1F531}", "Trident Emblem");
export const dagger = new Emoji("\u{1F5E1}\uFE0F", "Dagger");
export const shield = new Emoji("\u{1F6E1}\uFE0F", "Shield");
export const crystalBall = new Emoji("\u{1F52E}", "Crystal Ball");
export const crossedSwords = new Emoji("\u2694\uFE0F", "Crossed Swords");
export const fleurDeLis = new Emoji("\u269C\uFE0F", "Fleur-de-lis");

export const doubleExclamationMark = new Emoji("\u203C\uFE0F", "Double Exclamation Mark");
export const interrobang = new Emoji("\u2049\uFE0F", "Exclamation Question Mark");
export const information = new Emoji("\u2139\uFE0F", "Information");
export const circledM = new Emoji("\u24C2\uFE0F", "Circled M");
export const checkMarkButton = new Emoji("\u2705", "Check Mark Button");
export const checkMark = new Emoji("\u2714\uFE0F", "Check Mark");
export const eightSpokedAsterisk = new Emoji("\u2733\uFE0F", "Eight-Spoked Asterisk");
export const crossMark = new Emoji("\u274C", "Cross Mark");
export const crossMarkButton = new Emoji("\u274E", "Cross Mark Button");
export const questionMark = new Emoji("\u2753", "Question Mark");
export const whiteQuestionMark = new Emoji("\u2754", "White Question Mark");
export const whiteExclamationMark = new Emoji("\u2755", "White Exclamation Mark");
export const exclamationMark = new Emoji("\u2757", "Exclamation Mark");
export const curlyLoop = new Emoji("\u27B0", "Curly Loop");
export const doubleCurlyLoop = new Emoji("\u27BF", "Double Curly Loop");
export const wavyDash = new Emoji("\u3030\uFE0F", "Wavy Dash");
export const partAlternationMark = new Emoji("\u303D\uFE0F", "Part Alternation Mark");
export const tradeMark = new Emoji("\u2122\uFE0F", "Trade Mark");
export const copyright = new Emoji("\u00A9\uFE0F", "Copyright");
export const registered = new Emoji("\u00AE\uFE0F", "Registered");
export const squareFourCourners = new Emoji("\u26F6\uFE0F", "Square: Four Corners");

export const droplet = new Emoji("\u{1F4A7}", "Droplet");
export const dropOfBlood = new Emoji("\u{1FA78}", "Drop of Blood");
export const adhesiveBandage = new Emoji("\u{1FA79}", "Adhesive Bandage");
export const stethoscope = new Emoji("\u{1FA7A}", "Stethoscope");
export const syringe = new Emoji("\u{1F489}", "Syringe");
export const pill = new Emoji("\u{1F48A}", "Pill");
export const testTube = new Emoji("\u{1F9EA}", "Test Tube");
export const petriDish = new Emoji("\u{1F9EB}", "Petri Dish");
export const dna = new Emoji("\u{1F9EC}", "DNA");
export const abacus = new Emoji("\u{1F9EE}", "Abacus");
export const magnet = new Emoji("\u{1F9F2}", "Magnet");
export const telescope = new Emoji("\u{1F52D}", "Telescope");
export const whiteChessKing = new Emoji("\u2654", "White Chess King");
export const whiteChessQueen = new Emoji("\u2655", "White Chess Queen");
export const whiteChessRook = new Emoji("\u2656", "White Chess Rook");
export const whiteChessBishop = new Emoji("\u2657", "White Chess Bishop");
export const whiteChessKnight = new Emoji("\u2658", "White Chess Knight");
export const whiteChessPawn = new Emoji("\u2659", "White Chess Pawn");
export const blackChessKing = new Emoji("\u265A", "Black Chess King");
export const blackChessQueen = new Emoji("\u265B", "Black Chess Queen");
export const blackChessRook = new Emoji("\u265C", "Black Chess Rook");
export const blackChessBishop = new Emoji("\u265D", "Black Chess Bishop");
export const blackChessKnight = new Emoji("\u265E", "Black Chess Knight");
export const blackChessPawn = new Emoji("\u265F", "Black Chess Pawn");
