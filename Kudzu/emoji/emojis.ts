import { Emoji } from "./Emoji";
import { C, EmojiGroup, G, J } from "./EmojiGroup";

export function isSurfer(e: Emoji | string) {
    return surfers.contains(e)
        || rowers.contains(e)
        || swimmers.contains(e)
        || merpeople.contains(e);
}

function skin(v: string, d: string, ...rest: Emoji[]) {
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

function skinAndSex(v: string, d: string) {
    return sex(skin(v, d));
}

function skinAndHair(v: string, d: string, ...rest: Emoji[]) {
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
export const combiners = [
    textStyle,
    emojiStyle,
    zeroWidthJoiner,
    combiningEnclosingKeycap,
];

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
export const prince = skin("\u{1F934}", "Prince");
export const princess = skin("\u{1F478}", "Princess");
export const royalty = G(
    crown.value, crown.desc, {
    symbol: crown,
    male: prince,
    female: princess
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

export const cherub = skin("\u{1F47C}", "Cherub");
export const santaClaus = skin("\u{1F385}", "Santa Claus");
export const mrsClaus = skin("\u{1F936}", "Mrs. Claus");

export const genies = sex(new Emoji("\u{1F9DE}", "Genie"));
export const zombies = sex(new Emoji("\u{1F9DF}", "Zombie"));

export const fantasy = G(
    "Fantasy", "Depictions of fantasy characters", {
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

export const safetyVest = new Emoji("\u{1F9BA}", "Safety Vest");
export const whiteCane = new Emoji("\u{1F9AF}", "Probing Cane");
export const withProbingCane = sym(whiteCane, "Probing");

export const motorizedWheelchair = new Emoji("\u{1F9BC}", "Motorized Wheelchair");
export const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");

export const manualWheelchair = new Emoji("\u{1F9BD}", "Manual Wheelchair");
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
export const fencer = new Emoji("\u{1F93A}", "Fencer");
export const jockeys = skin("\u{1F3C7}", "Jockey");
export const skier = new Emoji("\u26F7\uFE0F", "Skier");
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

export const babies = new EmojiGroup(baby.value, baby.desc, baby, cherub);
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
export const faces = G(
    "Faces", "Round emoji faces", {
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
export const love = G(
    "Love", "Hearts and kisses", {
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

export const cartoon = new EmojiGroup(
    "Cartoon", "Cartoon symbols",
    angerSymbol,
    bomb,
    zzz,
    collision,
    sweatDroplets,
    dashingAway,
    dizzy,
    speechBalloon,
    thoughtBalloon,
    hundredPoints,
    hole,
    leftSpeechBubble,
    rightSpeechBubble,
    conversationBubbles2,
    conversationBubbles3,
    leftThoughtBubble,
    rightThoughtBubble,
    leftAngerBubble,
    rightAngerBubble,
    angerBubble,
    angerBubbleLightningBolt,
    lightningBolt);

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
export const hands = new EmojiGroup(
    "Hands", "Hands pointing at things",
    backhandIndexPointingUp,
    backhandIndexPointingDown,
    backhandIndexPointingLeft,
    backhandIndexPointingRight,
    oncomingFist,
    wavingHand,
    okHand,
    thumbsUp,
    thumbsDown,
    clappingHands,
    openHands,
    nailPolish,
    handsWithFingersSplayed,
    handsWithFingersSplayed2,
    handsWithFingersSplayed2,
    thumbsUp2,
    thumbsDown2,
    peaceFingers,
    middleFinger,
    vulcanSalute,
    handPointingDown,
    handPointingLeft,
    handPointingRight,
    handPointingLeft2,
    handPointingRight2,
    indexPointingLeft,
    indexPointingRight,
    indexPointingUp,
    indexPointingDown,
    indexPointingUp2,
    indexPointingDown2,
    indexPointingUp3,
    indexPointingDown3,
    raisingHands,
    foldedHands,
    pinchedFingers,
    pinchingHand,
    signOfTheHorns,
    callMeHand,
    rasiedBackOfHand,
    leftFacingFist,
    rightFacingFist,
    handshake,
    crossedFingers,
    loveYouGesture,
    palmsUpTogether,
    indexPointingUp4,
    raisedFist,
    raisedHand,
    victoryHand,
    writingHand);

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
export const shapes = new EmojiGroup(
    "Shapes", "Colored shapes",
    redCircle,
    blueCircle,
    largeOrangeDiamond,
    largeBlueDiamond,
    smallOrangeDiamond,
    smallBlueDiamond,
    redTrianglePointedUp,
    redTrianglePointedDown,
    orangeCircle,
    yellowCircle,
    greenCircle,
    purpleCircle,
    brownCircle,
    hollowRedCircle,
    whiteCircle,
    blackCircle,
    redSquare,
    blueSquare,
    orangeSquare,
    yellowSquare,
    greenSquare,
    purpleSquare,
    brownSquare,
    blackSquareButton,
    whiteSquareButton,
    blackSmallSquare,
    whiteSmallSquare,
    whiteMediumSmallSquare,
    blackMediumSmallSquare,
    whiteMediumSquare,
    blackMediumSquare,
    blackLargeSquare,
    whiteLargeSquare,
    star,
    diamondWithADot);

export const eye = new Emoji("\u{1F441}\uFE0F", "Eye");
export const eyeInSpeechBubble = J(eye, leftSpeechBubble, "Eye in Speech Bubble");
export const bodyParts = new EmojiGroup(
    "Body Parts", "General body parts",
    new Emoji("\u{1F440}", "Eyes"),
    eye,
    eyeInSpeechBubble,
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
    new Emoji("\u{1FAC0}", "Anatomical Heart"),
    new Emoji("\u{1FAC1}", "Lungs"),
    new Emoji("\u{1F9E0}", "Brain"));

export const snowflake = new Emoji("\u2744\uFE0F", "Snowflake");
export const rainbow = new Emoji("\u{1F308}", "Rainbow");
export const weather = new EmojiGroup(
    "Weather", "Weather",
    new Emoji("\u{1F304}", "Sunrise Over Mountains"),
    new Emoji("\u{1F305}", "Sunrise"),
    new Emoji("\u{1F306}", "Cityscape at Dusk"),
    new Emoji("\u{1F307}", "Sunset"),
    new Emoji("\u{1F303}", "Night with Stars"),
    new Emoji("\u{1F302}", "Closed Umbrella"),
    new Emoji("\u2602\uFE0F", "Umbrella"),
    new Emoji("\u2614\uFE0F", "Umbrella with Rain Drops"),
    new Emoji("\u2603\uFE0F", "Snowman"),
    new Emoji("\u26C4", "Snowman Without Snow"),
    new Emoji("\u2600\uFE0F", "Sun"),
    new Emoji("\u2601\uFE0F", "Cloud"),
    new Emoji("\u{1F324}\uFE0F", "Sun Behind Small Cloud"),
    new Emoji("\u26C5", "Sun Behind Cloud"),
    new Emoji("\u{1F325}\uFE0F", "Sun Behind Large Cloud"),
    new Emoji("\u{1F326}\uFE0F", "Sun Behind Rain Cloud"),
    new Emoji("\u{1F327}\uFE0F", "Cloud with Rain"),
    new Emoji("\u{1F328}\uFE0F", "Cloud with Snow"),
    new Emoji("\u{1F329}\uFE0F", "Cloud with Lightning"),
    new Emoji("\u26C8\uFE0F", "Cloud with Lightning and Rain"),
    snowflake,
    new Emoji("\u{1F300}", "Cyclone"),
    new Emoji("\u{1F32A}\uFE0F", "Tornado"),
    new Emoji("\u{1F32C}\uFE0F", "Wind Face"),
    new Emoji("\u{1F30A}", "Water Wave"),
    new Emoji("\u{1F32B}\uFE0F", "Fog"),
    new Emoji("\u{1F301}", "Foggy"),
    rainbow,
    new Emoji("\u{1F321}\uFE0F", "Thermometer"));

export const cat = new Emoji("\u{1F408}", "Cat");
export const blackCat = J(cat, blackLargeSquare, "Black Cat");
export const dog = new Emoji("\u{1F415}", "Dog");
export const serviceDog = J(dog, safetyVest, "Service Dog");
export const bear = new Emoji("\u{1F43B}", "Bear");
export const polarBear = J(bear, snowflake, "Polar Bear");
export const animals = new EmojiGroup(
    "Animals", "Animals and insects",
    new Emoji("\u{1F400}", "Rat"),
    new Emoji("\u{1F401}", "Mouse"),
    new Emoji("\u{1F402}", "Ox"),
    new Emoji("\u{1F403}", "Water Buffalo"),
    new Emoji("\u{1F404}", "Cow"),
    new Emoji("\u{1F405}", "Tiger"),
    new Emoji("\u{1F406}", "Leopard"),
    new Emoji("\u{1F407}", "Rabbit"),
    cat,
    blackCat,
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
    dog,
    serviceDog,
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
    bear,
    polarBear,
    new Emoji("\u{1F43C}", "Panda"),
    new Emoji("\u{1F43D}", "Pig Nose"),
    new Emoji("\u{1F43E}", "Paw Prints"),
    new Emoji("\u{1F43F}\uFE0F", "Chipmunk"),
    new Emoji("\u{1F54A}\uFE0F", "Dove"),
    new Emoji("\u{1F577}\uFE0F", "Spider"),
    new Emoji("\u{1F578}\uFE0F", "Spider Web"),
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
    //new Emoji("\u{1F9A3}", "Mammoth"),
    //new Emoji("\u{1F9A4}", "Dodo"),
    new Emoji("\u{1F9A5}", "Sloth"),
    new Emoji("\u{1F9A6}", "Otter"),
    new Emoji("\u{1F9A7}", "Orangutan"),
    new Emoji("\u{1F9A8}", "Skunk"),
    new Emoji("\u{1F9A9}", "Flamingo"),
    //new Emoji("\u{1F9AB}", "Beaver"),
    //new Emoji("\u{1F9AC}", "Bison"),
    //new Emoji("\u{1F9AD}", "Seal"),
    //new Emoji("\u{1FAB0}", "Fly"),
    //new Emoji("\u{1FAB1}", "Worm"),
    //new Emoji("\u{1FAB2}", "Beetle"),
    //new Emoji("\u{1FAB3}", "Cockroach"),
    //new Emoji("\u{1FAB6}", "Feather"),
    new Emoji("\u{1F9AE}", "Guide Dog"));

export const whiteFlower = new Emoji("\u{1F4AE}", "White Flower");
export const plants = new EmojiGroup(
    "Plants", "Flowers, trees, and things",
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
    sheafOfRice,
    new Emoji("\u{1F33F}", "Herb"),
    new Emoji("\u{1F340}", "Four Leaf Clover"),
    new Emoji("\u{1F341}", "Maple Leaf"),
    new Emoji("\u{1F342}", "Fallen Leaf"),
    new Emoji("\u{1F343}", "Leaf Fluttering in Wind"),
    new Emoji("\u{1F3F5}\uFE0F", "Rosette"),
    new Emoji("\u{1F490}", "Bouquet"),
    whiteFlower,
    new Emoji("\u{1F940}", "Wilted Flower"),
    //new Emoji("\u{1FAB4}", "Potted Plant"),
    new Emoji("\u2618\uFE0F", "Shamrock"));

export const banana = new Emoji("\u{1F34C}", "Banana");
export const food = new EmojiGroup(
    "Food", "Food, drink, and utensils",
    new Emoji("\u{1F32D}", "Hot Dog"),
    new Emoji("\u{1F32E}", "Taco"),
    new Emoji("\u{1F32F}", "Burrito"),
    new Emoji("\u{1F330}", "Chestnut"),
    new Emoji("\u{1F336}\uFE0F", "Hot Pepper"),
    new Emoji("\u{1F33D}", "Ear of Corn"),
    new Emoji("\u{1F344}", "Mushroom"),
    new Emoji("\u{1F345}", "Tomato"),
    new Emoji("\u{1F346}", "Eggplant"),
    new Emoji("\u{1F347}", "Grapes"),
    new Emoji("\u{1F348}", "Melon"),
    new Emoji("\u{1F349}", "Watermelon"),
    new Emoji("\u{1F34A}", "Tangerine"),
    new Emoji("\u{1F34B}", "Lemon"),
    banana,
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
    cooking,
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
    //new Emoji("\u{1FAD0}", "Blueberries"),
    //new Emoji("\u{1FAD1}", "Bell Pepper"),
    //new Emoji("\u{1FAD2}", "Olive"),
    //new Emoji("\u{1FAD3}", "Flatbread"),
    //new Emoji("\u{1FAD4}", "Tamale"),
    //new Emoji("\u{1FAD5}", "Fondue"),
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
    //new Emoji("\u{1F9CB}", "Bubble Tea"),
    //new Emoji("\u{1FAD6}", "Teapot"),
    new Emoji("\u2615", "Hot Beverage"),
    new Emoji("\u{1F374}", "Fork and Knife"),
    new Emoji("\u{1F37D}\uFE0F", "Fork and Knife with Plate"),
    new Emoji("\u{1F3FA}", "Amphora"),
    new Emoji("\u{1F52A}", "Kitchen Knife"),
    new Emoji("\u{1F944}", "Spoon"),
    new Emoji("\u{1F962}", "Chopsticks"));

export const nations = new EmojiGroup(
    "National Flags", "Flags of countries from around the world",
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
    new Emoji("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"));

export const whiteFlag = new Emoji("\u{1F3F3}\uFE0F", "White Flag");
export const rainbowFlag = J(whiteFlag, rainbow, "Rainbow Flag");
export const transgenderFlag = J(whiteFlag, transgender, "Transgender Flag");
export const blackFlag = new Emoji("\u{1F3F4}", "Black Flag");
export const pirateFlag = J(blackFlag, skullAndCrossbones, "Pirate Flag");
export const flags = new EmojiGroup(
    "Flags", "Basic flags",
    new Emoji("\u{1F38C}", "Crossed Flags"),
    new Emoji("\u{1F3C1}", "Chequered Flag"),
    whiteFlag,
    rainbowFlag,
    transgenderFlag,
    blackFlag,
    pirateFlag,
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"),
    new Emoji("\u{1F6A9}", "Triangular Flag"));

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
export const vehicles = new EmojiGroup(
    "Vehicles", "Things that go",
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
    //pickupTruck,
    //rollerSkate,
    motorizedWheelchair,
    manualWheelchair,
    parachute,
    anchor,
    ferry,
    sailboat,
    fuelPump,
    airplane);

export const bloodTypes = new EmojiGroup(
    "Blood Types", "Blood types",
    new Emoji("\u{1F170}", "A Button (Blood Type)"),
    new Emoji("\u{1F171}", "B Button (Blood Type)"),
    new Emoji("\u{1F17E}", "O Button (Blood Type)"),
    new Emoji("\u{1F18E}", "AB Button (Blood Type)"));

export const regionIndicators = new EmojiGroup(
    "Regions", "Region indicators",
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
    new Emoji("\u{1F1FF}", "Regional Indicator Symbol Letter Z"));

export const japanese = new EmojiGroup(
    "Japanese", "Japanse symbology",
    new Emoji("\u{1F530}", "Japanese Symbol for Beginner"),
    new Emoji("\u{1F201}", "Japanese “Here” Button"),
    new Emoji("\u{1F202}\uFE0F", "Japanese “Service Charge” Button"),
    new Emoji("\u{1F21A}", "Japanese “Free of Charge” Button"),
    new Emoji("\u{1F22F}", "Japanese “Reserved” Button"),
    new Emoji("\u{1F232}", "Japanese “Prohibited” Button"),
    new Emoji("\u{1F233}", "Japanese “Vacancy” Button"),
    new Emoji("\u{1F234}", "Japanese “Passing Grade” Button"),
    new Emoji("\u{1F235}", "Japanese “No Vacancy” Button"),
    new Emoji("\u{1F236}", "Japanese “Not Free of Charge” Button"),
    new Emoji("\u{1F237}\uFE0F", "Japanese “Monthly Amount” Button"),
    new Emoji("\u{1F238}", "Japanese “Application” Button"),
    new Emoji("\u{1F239}", "Japanese “Discount” Button"),
    new Emoji("\u{1F23A}", "Japanese “Open for Business” Button"),
    new Emoji("\u{1F250}", "Japanese “Bargain” Button"),
    new Emoji("\u{1F251}", "Japanese “Acceptable” Button"),
    new Emoji("\u3297\uFE0F", "Japanese “Congratulations” Button"),
    new Emoji("\u3299\uFE0F", "Japanese “Secret” Button"));

export const clocks = new EmojiGroup(
    "Clocks", "Time-keeping pieces",
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
    new Emoji("\u{1F570}\uFE0F", "Mantelpiece Clock"),
    new Emoji("\u231A", "Watch"),
    new Emoji("\u23F0", "Alarm Clock"),
    new Emoji("\u23F1\uFE0F", "Stopwatch"),
    new Emoji("\u23F2\uFE0F", "Timer Clock"),
    new Emoji("\u231B", "Hourglass Done"),
    new Emoji("\u23F3", "Hourglass Not Done"));

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
export const arrows = new EmojiGroup(
    "Arrows", "Arrows pointing in different directions",
    clockwiseVerticalArrows,
    counterclockwiseArrowsButton,
    leftRightArrow,
    upDownArrow,
    upLeftArrow,
    upRightArrow,
    downRightArrowEmoji,
    downLeftArrow,
    rightArrowCurvingLeft,
    leftArrowCurvingRight,
    rightArrow,
    rightArrowCurvingUp,
    rightArrowCurvingDown,
    leftArrow,
    upArrow,
    downArrow);

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
export const buttons = new EmojiGroup(
    "Buttons", "Buttons",
    clearButton,
    coolButton,
    freeButton,
    idButton,
    newButton,
    ngButton,
    okButton,
    sosButton,
    upButton,
    vsButton,
    radioButton,
    backArrow,
    endArrow,
    onArrow,
    soonArrow,
    topArrow,
    checkBoxWithCheck,
    inputLatinUppercase,
    inputLatinLowercase,
    inputNumbers,
    inputSymbols,
    inputLatinLetters,
    shuffleTracksButton,
    repeatButton,
    repeatSingleButton,
    upwardsButton,
    downwardsButton,
    playButton,
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
    recordButton);

export const zodiac = new EmojiGroup(
    "Zodiac", "The symbology of astrology",
    new Emoji("\u2648", "Aries"),
    new Emoji("\u2649", "Taurus"),
    new Emoji("\u264A", "Gemini"),
    new Emoji("\u264B", "Cancer"),
    new Emoji("\u264C", "Leo"),
    new Emoji("\u264D", "Virgo"),
    new Emoji("\u264E", "Libra"),
    new Emoji("\u264F", "Scorpio"),
    new Emoji("\u2650", "Sagittarius"),
    new Emoji("\u2651", "Capricorn"),
    new Emoji("\u2652", "Aquarius"),
    new Emoji("\u2653", "Pisces"),
    new Emoji("\u26CE", "Ophiuchus"));

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

export const numbers = new EmojiGroup(
    "Numbers", "Numbers",
    digit0,
    digit1,
    digit2,
    digit3,
    digit4,
    digit5,
    digit6,
    digit7,
    digit8,
    digit9,
    asterisk,
    numberSign,
    keycapDigit0,
    keycapDigit1,
    keycapDigit2,
    keycapDigit3,
    keycapDigit4,
    keycapDigit5,
    keycapDigit6,
    keycapDigit7,
    keycapDigit8,
    keycapDigit9,
    keycapAsterisk,
    keycapNumberSign,
    keycap10);

export const tagPlusSign = new Emoji("\u{E002B}", "Tag Plus Sign");
export const tagMinusHyphen = new Emoji("\u{E002D}", "Tag Hyphen-Minus");
export const tags = new EmojiGroup(
    "Tags", "Tags",
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
    tagPlusSign,
    new Emoji("\u{E002C}", "Tag Comma"),
    tagMinusHyphen,
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
    new Emoji("\u{E007F}", "Cancel Tag"));

export const math = new EmojiGroup(
    "Math", "Math",
    new Emoji("\u2716\uFE0F", "Multiply"),
    new Emoji("\u2795", "Plus"),
    new Emoji("\u2796", "Minus"),
    new Emoji("\u2797", "Divide"));

export const games = new EmojiGroup(
    "Games", "Games",
    new Emoji("\u2660\uFE0F", "Spade Suit"),
    new Emoji("\u2663\uFE0F", "Club Suit"),
    new Emoji("\u2665\uFE0F", "Heart Suit", { color: "red" }),
    new Emoji("\u2666\uFE0F", "Diamond Suit", { color: "red" }),
    new Emoji("\u{1F004}", "Mahjong Red Dragon"),
    new Emoji("\u{1F0CF}", "Joker"),
    new Emoji("\u{1F3AF}", "Direct Hit"),
    new Emoji("\u{1F3B0}", "Slot Machine"),
    new Emoji("\u{1F3B1}", "Pool 8 Ball"),
    new Emoji("\u{1F3B2}", "Game Die"),
    new Emoji("\u{1F3B3}", "Bowling"),
    new Emoji("\u{1F3B4}", "Flower Playing Cards"),
    new Emoji("\u{1F9E9}", "Puzzle Piece"),
    new Emoji("\u265F\uFE0F", "Chess Pawn"),
    new Emoji("\u{1FA80}", "Yo-Yo"),
    //new Emoji("\u{1FA83}", "Boomerang"),
    //new Emoji("\u{1FA86}", "Nesting Dolls"),
    new Emoji("\u{1FA81}", "Kite"));

export const sportsEquipment = new EmojiGroup(
    "Sports Equipment", "Sports equipment",
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
    new Emoji("\u26BD", "Soccer Ball"),
    new Emoji("\u26BE", "Baseball"),
    new Emoji("\u26F8\uFE0F", "Ice Skate"));

export const clothing = new EmojiGroup(
    "Clothing", "Clothing",
    new Emoji("\u{1F3A9}", "Top Hat"),
    new Emoji("\u{1F93F}", "Diving Mask"),
    new Emoji("\u{1F452}", "Woman’s Hat"),
    new Emoji("\u{1F453}", "Glasses"),
    new Emoji("\u{1F576}\uFE0F", "Sunglasses"),
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
    whiteCane,
    safetyVest,
    new Emoji("\u{1F9E2}", "Billed Cap"),
    new Emoji("\u{1F9E3}", "Scarf"),
    new Emoji("\u{1F9E4}", "Gloves"),
    new Emoji("\u{1F9E5}", "Coat"),
    new Emoji("\u{1F9E6}", "Socks"),
    new Emoji("\u{1F9FF}", "Nazar Amulet"),
    new Emoji("\u{1FA70}", "Ballet Shoes"),
    new Emoji("\u{1FA71}", "One-Piece Swimsuit"),
    new Emoji("\u{1FA72}", "Briefs"),
    new Emoji("\u{1FA73}", "Shorts"));

export const town = new EmojiGroup(
    "Town", "Town",
    new Emoji("\u{1F3D7}\uFE0F", "Building Construction"),
    new Emoji("\u{1F3D8}\uFE0F", "Houses"),
    new Emoji("\u{1F3D9}\uFE0F", "Cityscape"),
    new Emoji("\u{1F3DA}\uFE0F", "Derelict House"),
    new Emoji("\u{1F3DB}\uFE0F", "Classical Building"),
    new Emoji("\u{1F3DC}\uFE0F", "Desert"),
    new Emoji("\u{1F3DD}\uFE0F", "Desert Island"),
    new Emoji("\u{1F3DE}\uFE0F", "National Park"),
    new Emoji("\u{1F3DF}\uFE0F", "Stadium"),
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
    school,
    new Emoji("\u{1F3EC}", "Department Store"),
    factory,
    new Emoji("\u{1F309}", "Bridge at Night"),
    new Emoji("\u26F2", "Fountain"),
    new Emoji("\u{1F6CD}\uFE0F", "Shopping Bags"),
    new Emoji("\u{1F9FE}", "Receipt"),
    new Emoji("\u{1F6D2}", "Shopping Cart"),
    new Emoji("\u{1F488}", "Barber Pole"),
    new Emoji("\u{1F492}", "Wedding"),
    new Emoji("\u{1F5F3}\uFE0F", "Ballot Box with Ballot"));

export const music = new EmojiGroup(
    "Music", "Music",
    new Emoji("\u{1F3BC}", "Musical Score"),
    new Emoji("\u{1F3B6}", "Musical Notes"),
    new Emoji("\u{1F3B5}", "Musical Note"),
    new Emoji("\u{1F3B7}", "Saxophone"),
    new Emoji("\u{1F3B8}", "Guitar"),
    new Emoji("\u{1F3B9}", "Musical Keyboard"),
    new Emoji("\u{1F3BA}", "Trumpet"),
    new Emoji("\u{1F3BB}", "Violin"),
    new Emoji("\u{1F941}", "Drum"),
    //new Emoji("\u{1FA97}", "Accordion"),
    //new Emoji("\u{1FA98}", "Long Drum"),
    new Emoji("\u{1FA95}", "Banjo"));

export const globeShowingAmericas = new Emoji("\u{1F30E}", "Globe Showing Americas");

export const astro = new EmojiGroup(
    "Astronomy", "Astronomy",
    new Emoji("\u{1F30C}", "Milky Way"),
    new Emoji("\u{1F30D}", "Globe Showing Europe-Africa"),
    globeShowingAmericas,
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
    new Emoji("\u2604\uFE0F", "Comet"),
    new Emoji("\u{1FA90}", "Ringed Planet"));

export const finance = new EmojiGroup(
    "Finance", "Finance",
    new Emoji("\u{1F4B0}", "Money Bag"),
    new Emoji("\u{1F4B1}", "Currency Exchange"),
    new Emoji("\u{1F4B2}", "Heavy Dollar Sign"),
    new Emoji("\u{1F4B3}", "Credit Card"),
    new Emoji("\u{1F4B4}", "Yen Banknote"),
    new Emoji("\u{1F4B5}", "Dollar Banknote"),
    new Emoji("\u{1F4B6}", "Euro Banknote"),
    new Emoji("\u{1F4B7}", "Pound Banknote"),
    new Emoji("\u{1F4B8}", "Money with Wings"),
    //new Emoji("\u{1FA99}", "Coin"),
    new Emoji("\u{1F4B9}", "Chart Increasing with Yen"));

export const writing = new EmojiGroup(
    "Writing", "Writing",
    new Emoji("\u{1F58A}\uFE0F", "Pen"),
    new Emoji("\u{1F58B}\uFE0F", "Fountain Pen"),
    new Emoji("\u{1F58C}\uFE0F", "Paintbrush"),
    new Emoji("\u{1F58D}\uFE0F", "Crayon"),
    new Emoji("\u270F\uFE0F", "Pencil"),
    new Emoji("\u2712\uFE0F", "Black Nib"));

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
export const tech = new EmojiGroup(
    "Technology", "Technology",
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
    filmProjector,
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
    mobilePhoneVibrating,
    antennaBars,
    dimButton,
    brightButton,
    mutedSpeaker,
    speakerLowVolume,
    speakerMediumVolume,
    speakerHighVolume,
    battery,
    electricPlug);

export const mail = new EmojiGroup(
    "Mail", "Mail",
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
    new Emoji("\u{1F4EF}", "Postal Horn"));

export const celebration = new EmojiGroup(
    "Celebration", "Celebration",
    new Emoji("\u{1F380}", "Ribbon"),
    new Emoji("\u{1F381}", "Wrapped Gift"),
    new Emoji("\u{1F383}", "Jack-O-Lantern"),
    new Emoji("\u{1F384}", "Christmas Tree"),
    new Emoji("\u{1F9E8}", "Firecracker"),
    new Emoji("\u{1F386}", "Fireworks"),
    new Emoji("\u{1F387}", "Sparkler"),
    new Emoji("\u2728", "Sparkles"),
    new Emoji("\u2747\uFE0F", "Sparkle"),
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
    graduationCap,
    new Emoji("\u{1F9E7}", "Red Envelope"),
    new Emoji("\u{1F3EE}", "Red Paper Lantern"),
    new Emoji("\u{1F396}\uFE0F", "Military Medal"));

export const tools = new EmojiGroup(
    "Tools", "Tools",
    new Emoji("\u{1F3A3}", "Fishing Pole"),
    new Emoji("\u{1F526}", "Flashlight"),
    wrench,
    new Emoji("\u{1F528}", "Hammer"),
    new Emoji("\u{1F529}", "Nut and Bolt"),
    new Emoji("\u{1F6E0}\uFE0F", "Hammer and Wrench"),
    new Emoji("\u{1F9ED}", "Compass"),
    new Emoji("\u{1F9EF}", "Fire Extinguisher"),
    new Emoji("\u{1F9F0}", "Toolbox"),
    new Emoji("\u{1F9F1}", "Brick"),
    new Emoji("\u{1FA93}", "Axe"),
    new Emoji("\u2692\uFE0F", "Hammer and Pick"),
    new Emoji("\u26CF\uFE0F", "Pick"),
    new Emoji("\u26D1\uFE0F", "Rescue Worker’s Helmet"),
    new Emoji("\u26D3\uFE0F", "Chains"),
    compression);

export const office = new EmojiGroup(
    "Office", "Office",
    new Emoji("\u{1F4C1}", "File Folder"),
    new Emoji("\u{1F4C2}", "Open File Folder"),
    new Emoji("\u{1F4C3}", "Page with Curl"),
    new Emoji("\u{1F4C4}", "Page Facing Up"),
    new Emoji("\u{1F4C5}", "Calendar"),
    new Emoji("\u{1F4C6}", "Tear-Off Calendar"),
    new Emoji("\u{1F4C7}", "Card Index"),
    cardIndexDividers,
    cardFileBox,
    fileCabinet,
    wastebasket,
    spiralNotePad,
    spiralCalendar,
    new Emoji("\u{1F4C8}", "Chart Increasing"),
    new Emoji("\u{1F4C9}", "Chart Decreasing"),
    new Emoji("\u{1F4CA}", "Bar Chart"),
    new Emoji("\u{1F4CB}", "Clipboard"),
    new Emoji("\u{1F4CC}", "Pushpin"),
    new Emoji("\u{1F4CD}", "Round Pushpin"),
    new Emoji("\u{1F4CE}", "Paperclip"),
    new Emoji("\u{1F587}\uFE0F", "Linked Paperclips"),
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
    new Emoji("\u2702\uFE0F", "Scissors"),
    new Emoji("\u2709\uFE0F", "Envelope"));

export const signs = new EmojiGroup(
    "Signs", "Signs",
    new Emoji("\u{1F3A6}", "Cinema"),
    noMobilePhone,
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
    new Emoji("\u{1F17F}\uFE0F", "Parking Button"),
    new Emoji("\u267F", "Wheelchair Symbol"),
    new Emoji("\u2622\uFE0F", "Radioactive"),
    new Emoji("\u2623\uFE0F", "Biohazard"),
    new Emoji("\u26A0\uFE0F", "Warning"),
    new Emoji("\u26A1", "High Voltage"),
    new Emoji("\u26D4", "No Entry"),
    new Emoji("\u267B\uFE0F", "Recycling Symbol"),
    female,
    male,
    transgender);

export const religion = new EmojiGroup(
    "Religion", "Religion",
    new Emoji("\u{1F52F}", "Dotted Six-Pointed Star"),
    new Emoji("\u2721\uFE0F", "Star of David"),
    new Emoji("\u{1F549}\uFE0F", "Om"),
    new Emoji("\u{1F54B}", "Kaaba"),
    new Emoji("\u{1F54C}", "Mosque"),
    new Emoji("\u{1F54D}", "Synagogue"),
    new Emoji("\u{1F54E}", "Menorah"),
    new Emoji("\u{1F6D0}", "Place of Worship"),
    new Emoji("\u{1F6D5}", "Hindu Temple"),
    new Emoji("\u2626\uFE0F", "Orthodox Cross"),
    new Emoji("\u271D\uFE0F", "Latin Cross"),
    new Emoji("\u262A\uFE0F", "Star and Crescent"),
    new Emoji("\u262E\uFE0F", "Peace Symbol"),
    new Emoji("\u262F\uFE0F", "Yin Yang"),
    new Emoji("\u2638\uFE0F", "Wheel of Dharma"),
    new Emoji("\u267E\uFE0F", "Infinity"),
    new Emoji("\u{1FA94}", "Diya Lamp"),
    new Emoji("\u26E9\uFE0F", "Shinto Shrine"),
    new Emoji("\u26EA", "Church"),
    new Emoji("\u2734\uFE0F", "Eight-Pointed Star"),
    new Emoji("\u{1F4FF}", "Prayer Beads"));

export const door = new Emoji("\u{1F6AA}", "Door");
export const household = new EmojiGroup(
    "Household", "Household",
    new Emoji("\u{1F484}", "Lipstick"),
    new Emoji("\u{1F48D}", "Ring"),
    new Emoji("\u{1F48E}", "Gem Stone"),
    new Emoji("\u{1F4F0}", "Newspaper"),
    key,
    new Emoji("\u{1F525}", "Fire"),
    new Emoji("\u{1F52B}", "Pistol"),
    new Emoji("\u{1F56F}\uFE0F", "Candle"),
    new Emoji("\u{1F5BC}\uFE0F", "Framed Picture"),
    oldKey,
    new Emoji("\u{1F5DE}\uFE0F", "Rolled-Up Newspaper"),
    new Emoji("\u{1F5FA}\uFE0F", "World Map"),
    door,
    new Emoji("\u{1F6BD}", "Toilet"),
    new Emoji("\u{1F6BF}", "Shower"),
    new Emoji("\u{1F6C1}", "Bathtub"),
    new Emoji("\u{1F6CB}\uFE0F", "Couch and Lamp"),
    new Emoji("\u{1F6CF}\uFE0F", "Bed"),
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
    new Emoji("\u{1F397}\uFE0F", "Reminder Ribbon"));

export const activities = new EmojiGroup(
    "Activities", "Activities",
    new Emoji("\u{1F39E}\uFE0F", "Film Frames"),
    new Emoji("\u{1F39F}\uFE0F", "Admission Tickets"),
    new Emoji("\u{1F3A0}", "Carousel Horse"),
    new Emoji("\u{1F3A1}", "Ferris Wheel"),
    new Emoji("\u{1F3A2}", "Roller Coaster"),
    artistPalette,
    new Emoji("\u{1F3AA}", "Circus Tent"),
    new Emoji("\u{1F3AB}", "Ticket"),
    new Emoji("\u{1F3AC}", "Clapper Board"),
    new Emoji("\u{1F3AD}", "Performing Arts"));

export const travel = new EmojiGroup(
    "Travel", "Travel",
    new Emoji("\u{1F3F7}\uFE0F", "Label"),
    new Emoji("\u{1F30B}", "Volcano"),
    new Emoji("\u{1F3D4}\uFE0F", "Snow-Capped Mountain"),
    new Emoji("\u26F0\uFE0F", "Mountain"),
    new Emoji("\u{1F3D5}\uFE0F", "Camping"),
    new Emoji("\u{1F3D6}\uFE0F", "Beach with Umbrella"),
    new Emoji("\u26F1\uFE0F", "Umbrella on Ground"),
    new Emoji("\u{1F3EF}", "Japanese Castle"),
    new Emoji("\u{1F463}", "Footprints"),
    new Emoji("\u{1F5FB}", "Mount Fuji"),
    new Emoji("\u{1F5FC}", "Tokyo Tower"),
    new Emoji("\u{1F5FD}", "Statue of Liberty"),
    new Emoji("\u{1F5FE}", "Map of Japan"),
    new Emoji("\u{1F5FF}", "Moai"),
    new Emoji("\u{1F6CE}\uFE0F", "Bellhop Bell"),
    new Emoji("\u{1F9F3}", "Luggage"),
    new Emoji("\u26F3", "Flag in Hole"),
    new Emoji("\u26FA", "Tent"),
    new Emoji("\u2668\uFE0F", "Hot Springs"));

export const medieval = new EmojiGroup(
    "Medieval", "Medieval",
    new Emoji("\u{1F3F0}", "Castle"),
    new Emoji("\u{1F3F9}", "Bow and Arrow"),
    crown,
    new Emoji("\u{1F531}", "Trident Emblem"),
    new Emoji("\u{1F5E1}\uFE0F", "Dagger"),
    new Emoji("\u{1F6E1}\uFE0F", "Shield"),
    new Emoji("\u{1F52E}", "Crystal Ball"),
    new Emoji("\u2694\uFE0F", "Crossed Swords"),
    new Emoji("\u269C\uFE0F", "Fleur-de-lis"));

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

export const marks = G(
    "Marks", "Marks", {
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

export const science = G(
    "Science", "Science", {
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
export const whiteChessKing = new Emoji("\u2654", "White Chess King");
export const whiteChessQueen = new Emoji("\u2655", "White Chess Queen");
export const whiteChessRook = new Emoji("\u2656", "White Chess Rook");
export const whiteChessBishop = new Emoji("\u2657", "White Chess Bishop");
export const whiteChessKnight = new Emoji("\u2658", "White Chess Knight");
export const whiteChessPawn = new Emoji("\u2659", "White Chess Pawn");
export const whiteChessPieces = G(whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value, "White Chess Pieces", {
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn
});
export const blackChessKing = new Emoji("\u265A", "Black Chess King");
export const blackChessQueen = new Emoji("\u265B", "Black Chess Queen");
export const blackChessRook = new Emoji("\u265C", "Black Chess Rook");
export const blackChessBishop = new Emoji("\u265D", "Black Chess Bishop");
export const blackChessKnight = new Emoji("\u265E", "Black Chess Knight");
export const blackChessPawn = new Emoji("\u265F", "Black Chess Pawn");
export const blackChessPieces = G(blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value, "Black Chess Pieces", {
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn
});
export const chessPawns = G(whiteChessPawn.value + blackChessPawn.value, "Chess Pawns", {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
export const chessRooks = G(whiteChessRook.value + blackChessRook.value, "Chess Rooks", {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
export const chessBishops = G(whiteChessBishop.value + blackChessBishop.value, "Chess Bishops", {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
export const chessKnights = G(whiteChessKnight.value + blackChessKnight.value, "Chess Knights", {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
export const chessQueens = G(whiteChessQueen.value + blackChessQueen.value, "Chess Queens", {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
export const chessKings = G(whiteChessKing.value + blackChessKing.value, "Chess Kings", {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});

export const chess = G("Chess Pieces", "Chess Pieces", {
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

