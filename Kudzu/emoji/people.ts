import { EmojiGroup } from "./EmojiGroup";
import { female, male, transgenderSymbol, lightSkinTone, mediumLightSkinTone, mediumSkinTone, mediumDarkSkinTone, darkSkinTone, redHair, curlyHair, whiteHair, bald, frowning, frowningLightSkinTone, frowningMediumLightSkinTone, frowningMediumSkinTone, frowningMediumDarkSkinTone, frowningDarkSkinTone, frowningMale, frowningLightSkinToneMale, frowningMediumLightSkinToneMale, frowningMediumSkinToneMale, frowningMediumDarkSkinToneMale, frowningDarkSkinToneMale, frowningFemale, frowningLightSkinToneFemale, frowningMediumLightSkinToneFemale, frowningMediumSkinToneFemale, frowningMediumDarkSkinToneFemale, frowningDarkSkinToneFemale, pouting, poutingLightSkinTone, poutingMediumLightSkinTone, poutingMediumSkinTone, poutingMediumDarkSkinTone, poutingDarkSkinTone, poutingMale, poutingLightSkinToneMale, poutingMediumLightSkinToneMale, poutingMediumSkinToneMale, poutingMediumDarkSkinToneMale, poutingDarkSkinToneMale, poutingFemale, poutingLightSkinToneFemale, poutingMediumLightSkinToneFemale, poutingMediumSkinToneFemale, poutingMediumDarkSkinToneFemale, poutingDarkSkinToneFemale, gesturingNO, gesturingNOLightSkinTone, gesturingNOMediumLightSkinTone, gesturingNOMediumSkinTone, gesturingNOMediumDarkSkinTone, gesturingNODarkSkinTone, gesturingNOMale, gesturingNOLightSkinToneMale, gesturingNOMediumLightSkinToneMale, gesturingNOMediumSkinToneMale, gesturingNOMediumDarkSkinToneMale, gesturingNODarkSkinToneMale, gesturingNOFemale, gesturingNOLightSkinToneFemale, gesturingNOMediumLightSkinToneFemale, gesturingNOMediumSkinToneFemale, gesturingNOMediumDarkSkinToneFemale, gesturingNODarkSkinToneFemale, gesturingOK, gesturingOKLightSkinTone, gesturingOKMediumLightSkinTone, gesturingOKMediumSkinTone, gesturingOKMediumDarkSkinTone, gesturingOKDarkSkinTone, gesturingOKMale, gesturingOKLightSkinToneMale, gesturingOKMediumLightSkinToneMale, gesturingOKMediumSkinToneMale, gesturingOKMediumDarkSkinToneMale, gesturingOKDarkSkinToneMale, gesturingOKFemale, gesturingOKLightSkinToneFemale, gesturingOKMediumLightSkinToneFemale, gesturingOKMediumSkinToneFemale, gesturingOKMediumDarkSkinToneFemale, gesturingOKDarkSkinToneFemale, tippingHand, tippingHandLightSkinTone, tippingHandMediumLightSkinTone, tippingHandMediumSkinTone, tippingHandMediumDarkSkinTone, tippingHandDarkSkinTone, tippingHandMale, tippingHandLightSkinToneMale, tippingHandMediumLightSkinToneMale, tippingHandMediumSkinToneMale, tippingHandMediumDarkSkinToneMale, tippingHandDarkSkinToneMale, tippingHandFemale, tippingHandLightSkinToneFemale, tippingHandMediumLightSkinToneFemale, tippingHandMediumSkinToneFemale, tippingHandMediumDarkSkinToneFemale, tippingHandDarkSkinToneFemale, raisingHand, raisingHandLightSkinTone, raisingHandMediumLightSkinTone, raisingHandMediumSkinTone, raisingHandMediumDarkSkinTone, raisingHandDarkSkinTone, raisingHandMale, raisingHandLightSkinToneMale, raisingHandMediumLightSkinToneMale, raisingHandMediumSkinToneMale, raisingHandMediumDarkSkinToneMale, raisingHandDarkSkinToneMale, raisingHandFemale, raisingHandLightSkinToneFemale, raisingHandMediumLightSkinToneFemale, raisingHandMediumSkinToneFemale, raisingHandMediumDarkSkinToneFemale, raisingHandDarkSkinToneFemale, bowing, bowingLightSkinTone, bowingMediumLightSkinTone, bowingMediumSkinTone, bowingMediumDarkSkinTone, bowingDarkSkinTone, bowingMale, bowingLightSkinToneMale, bowingMediumLightSkinToneMale, bowingMediumSkinToneMale, bowingMediumDarkSkinToneMale, bowingDarkSkinToneMale, bowingFemale, bowingLightSkinToneFemale, bowingMediumLightSkinToneFemale, bowingMediumSkinToneFemale, bowingMediumDarkSkinToneFemale, bowingDarkSkinToneFemale, facepalming, facepalmingLightSkinTone, facepalmingMediumLightSkinTone, facepalmingMediumSkinTone, facepalmingMediumDarkSkinTone, facepalmingDarkSkinTone, facepalmingMale, facepalmingLightSkinToneMale, facepalmingMediumLightSkinToneMale, facepalmingMediumSkinToneMale, facepalmingMediumDarkSkinToneMale, facepalmingDarkSkinToneMale, facepalmingFemale, facepalmingLightSkinToneFemale, facepalmingMediumLightSkinToneFemale, facepalmingMediumSkinToneFemale, facepalmingMediumDarkSkinToneFemale, facepalmingDarkSkinToneFemale, shrugging, shruggingLightSkinTone, shruggingMediumLightSkinTone, shruggingMediumSkinTone, shruggingMediumDarkSkinTone, shruggingDarkSkinTone, shruggingMale, shruggingLightSkinToneMale, shruggingMediumLightSkinToneMale, shruggingMediumSkinToneMale, shruggingMediumDarkSkinToneMale, shruggingDarkSkinToneMale, shruggingFemale, shruggingLightSkinToneFemale, shruggingMediumLightSkinToneFemale, shruggingMediumSkinToneFemale, shruggingMediumDarkSkinToneFemale, shruggingDarkSkinToneFemale, cantHear, cantHearLightSkinTone, cantHearMediumLightSkinTone, cantHearMediumSkinTone, cantHearMediumDarkSkinTone, cantHearDarkSkinTone, cantHearMale, cantHearLightSkinToneMale, cantHearMediumLightSkinToneMale, cantHearMediumSkinToneMale, cantHearMediumDarkSkinToneMale, cantHearDarkSkinToneMale, cantHearFemale, cantHearLightSkinToneFemale, cantHearMediumLightSkinToneFemale, cantHearMediumSkinToneFemale, cantHearMediumDarkSkinToneFemale, cantHearDarkSkinToneFemale, gettingMassage, gettingMassageLightSkinTone, gettingMassageMediumLightSkinTone, gettingMassageMediumSkinTone, gettingMassageMediumDarkSkinTone, gettingMassageDarkSkinTone, gettingMassageMale, gettingMassageLightSkinToneMale, gettingMassageMediumLightSkinToneMale, gettingMassageMediumSkinToneMale, gettingMassageMediumDarkSkinToneMale, gettingMassageDarkSkinToneMale, gettingMassageFemale, gettingMassageLightSkinToneFemale, gettingMassageMediumLightSkinToneFemale, gettingMassageMediumSkinToneFemale, gettingMassageMediumDarkSkinToneFemale, gettingMassageDarkSkinToneFemale, gettingHaircut, gettingHaircutLightSkinTone, gettingHaircutMediumLightSkinTone, gettingHaircutMediumSkinTone, gettingHaircutMediumDarkSkinTone, gettingHaircutDarkSkinTone, gettingHaircutMale, gettingHaircutLightSkinToneMale, gettingHaircutMediumLightSkinToneMale, gettingHaircutMediumSkinToneMale, gettingHaircutMediumDarkSkinToneMale, gettingHaircutDarkSkinToneMale, gettingHaircutFemale, gettingHaircutLightSkinToneFemale, gettingHaircutMediumLightSkinToneFemale, gettingHaircutMediumSkinToneFemale, gettingHaircutMediumDarkSkinToneFemale, gettingHaircutDarkSkinToneFemale, constructionWorker, constructionWorkerLightSkinTone, constructionWorkerMediumLightSkinTone, constructionWorkerMediumSkinTone, constructionWorkerMediumDarkSkinTone, constructionWorkerDarkSkinTone, constructionWorkerMale, constructionWorkerLightSkinToneMale, constructionWorkerMediumLightSkinToneMale, constructionWorkerMediumSkinToneMale, constructionWorkerMediumDarkSkinToneMale, constructionWorkerDarkSkinToneMale, constructionWorkerFemale, constructionWorkerLightSkinToneFemale, constructionWorkerMediumLightSkinToneFemale, constructionWorkerMediumSkinToneFemale, constructionWorkerMediumDarkSkinToneFemale, constructionWorkerDarkSkinToneFemale, guard, guardLightSkinTone, guardMediumLightSkinTone, guardMediumSkinTone, guardMediumDarkSkinTone, guardDarkSkinTone, guardMale, guardLightSkinToneMale, guardMediumLightSkinToneMale, guardMediumSkinToneMale, guardMediumDarkSkinToneMale, guardDarkSkinToneMale, guardFemale, guardLightSkinToneFemale, guardMediumLightSkinToneFemale, guardMediumSkinToneFemale, guardMediumDarkSkinToneFemale, guardDarkSkinToneFemale, spy, spyLightSkinTone, spyMediumLightSkinTone, spyMediumSkinTone, spyMediumDarkSkinTone, spyDarkSkinTone, spyMale, spyLightSkinToneMale, spyMediumLightSkinToneMale, spyMediumSkinToneMale, spyMediumDarkSkinToneMale, spyDarkSkinToneMale, spyFemale, spyLightSkinToneFemale, spyMediumLightSkinToneFemale, spyMediumSkinToneFemale, spyMediumDarkSkinToneFemale, spyDarkSkinToneFemale, police, policeLightSkinTone, policeMediumLightSkinTone, policeMediumSkinTone, policeMediumDarkSkinTone, policeDarkSkinTone, policeMale, policeLightSkinToneMale, policeMediumLightSkinToneMale, policeMediumSkinToneMale, policeMediumDarkSkinToneMale, policeDarkSkinToneMale, policeFemale, policeLightSkinToneFemale, policeMediumLightSkinToneFemale, policeMediumSkinToneFemale, policeMediumDarkSkinToneFemale, policeDarkSkinToneFemale, wearingTurban, wearingTurbanLightSkinTone, wearingTurbanMediumLightSkinTone, wearingTurbanMediumSkinTone, wearingTurbanMediumDarkSkinTone, wearingTurbanDarkSkinTone, wearingTurbanMale, wearingTurbanLightSkinToneMale, wearingTurbanMediumLightSkinToneMale, wearingTurbanMediumSkinToneMale, wearingTurbanMediumDarkSkinToneMale, wearingTurbanDarkSkinToneMale, wearingTurbanFemale, wearingTurbanLightSkinToneFemale, wearingTurbanMediumLightSkinToneFemale, wearingTurbanMediumSkinToneFemale, wearingTurbanMediumDarkSkinToneFemale, wearingTurbanDarkSkinToneFemale, superhero, superheroLightSkinTone, superheroMediumLightSkinTone, superheroMediumSkinTone, superheroMediumDarkSkinTone, superheroDarkSkinTone, superheroMale, superheroLightSkinToneMale, superheroMediumLightSkinToneMale, superheroMediumSkinToneMale, superheroMediumDarkSkinToneMale, superheroDarkSkinToneMale, superheroFemale, superheroLightSkinToneFemale, superheroMediumLightSkinToneFemale, superheroMediumSkinToneFemale, superheroMediumDarkSkinToneFemale, superheroDarkSkinToneFemale, supervillain, supervillainLightSkinTone, supervillainMediumLightSkinTone, supervillainMediumSkinTone, supervillainMediumDarkSkinTone, supervillainDarkSkinTone, supervillainMale, supervillainLightSkinToneMale, supervillainMediumLightSkinToneMale, supervillainMediumSkinToneMale, supervillainMediumDarkSkinToneMale, supervillainDarkSkinToneMale, supervillainFemale, supervillainLightSkinToneFemale, supervillainMediumLightSkinToneFemale, supervillainMediumSkinToneFemale, supervillainMediumDarkSkinToneFemale, supervillainDarkSkinToneFemale, mage, mageLightSkinTone, mageMediumLightSkinTone, mageMediumSkinTone, mageMediumDarkSkinTone, mageDarkSkinTone, mageMale, mageLightSkinToneMale, mageMediumLightSkinToneMale, mageMediumSkinToneMale, mageMediumDarkSkinToneMale, mageDarkSkinToneMale, mageFemale, mageLightSkinToneFemale, mageMediumLightSkinToneFemale, mageMediumSkinToneFemale, mageMediumDarkSkinToneFemale, mageDarkSkinToneFemale, fairy, fairyLightSkinTone, fairyMediumLightSkinTone, fairyMediumSkinTone, fairyMediumDarkSkinTone, fairyDarkSkinTone, fairyMale, fairyLightSkinToneMale, fairyMediumLightSkinToneMale, fairyMediumSkinToneMale, fairyMediumDarkSkinToneMale, fairyDarkSkinToneMale, fairyFemale, fairyLightSkinToneFemale, fairyMediumLightSkinToneFemale, fairyMediumSkinToneFemale, fairyMediumDarkSkinToneFemale, fairyDarkSkinToneFemale, vampire, vampireLightSkinTone, vampireMediumLightSkinTone, vampireMediumSkinTone, vampireMediumDarkSkinTone, vampireDarkSkinTone, vampireMale, vampireLightSkinToneMale, vampireMediumLightSkinToneMale, vampireMediumSkinToneMale, vampireMediumDarkSkinToneMale, vampireDarkSkinToneMale, vampireFemale, vampireLightSkinToneFemale, vampireMediumLightSkinToneFemale, vampireMediumSkinToneFemale, vampireMediumDarkSkinToneFemale, vampireDarkSkinToneFemale, merperson, merpersonLightSkinTone, merpersonMediumLightSkinTone, merpersonMediumSkinTone, merpersonMediumDarkSkinTone, merpersonDarkSkinTone, merpersonMale, merpersonLightSkinToneMale, merpersonMediumLightSkinToneMale, merpersonMediumSkinToneMale, merpersonMediumDarkSkinToneMale, merpersonDarkSkinToneMale, merpersonFemale, merpersonLightSkinToneFemale, merpersonMediumLightSkinToneFemale, merpersonMediumSkinToneFemale, merpersonMediumDarkSkinToneFemale, merpersonDarkSkinToneFemale, elf, elfLightSkinTone, elfMediumLightSkinTone, elfMediumSkinTone, elfMediumDarkSkinTone, elfDarkSkinTone, elfMale, elfLightSkinToneMale, elfMediumLightSkinToneMale, elfMediumSkinToneMale, elfMediumDarkSkinToneMale, elfDarkSkinToneMale, elfFemale, elfLightSkinToneFemale, elfMediumLightSkinToneFemale, elfMediumSkinToneFemale, elfMediumDarkSkinToneFemale, elfDarkSkinToneFemale, walking, walkingLightSkinTone, walkingMediumLightSkinTone, walkingMediumSkinTone, walkingMediumDarkSkinTone, walkingDarkSkinTone, walkingMale, walkingLightSkinToneMale, walkingMediumLightSkinToneMale, walkingMediumSkinToneMale, walkingMediumDarkSkinToneMale, walkingDarkSkinToneMale, walkingFemale, walkingLightSkinToneFemale, walkingMediumLightSkinToneFemale, walkingMediumSkinToneFemale, walkingMediumDarkSkinToneFemale, walkingDarkSkinToneFemale, standing, standingLightSkinTone, standingMediumLightSkinTone, standingMediumSkinTone, standingMediumDarkSkinTone, standingDarkSkinTone, standingMale, standingLightSkinToneMale, standingMediumLightSkinToneMale, standingMediumSkinToneMale, standingMediumDarkSkinToneMale, standingDarkSkinToneMale, standingFemale, standingLightSkinToneFemale, standingMediumLightSkinToneFemale, standingMediumSkinToneFemale, standingMediumDarkSkinToneFemale, standingDarkSkinToneFemale, kneeling, kneelingLightSkinTone, kneelingMediumLightSkinTone, kneelingMediumSkinTone, kneelingMediumDarkSkinTone, kneelingDarkSkinTone, kneelingMale, kneelingLightSkinToneMale, kneelingMediumLightSkinToneMale, kneelingMediumSkinToneMale, kneelingMediumDarkSkinToneMale, kneelingDarkSkinToneMale, kneelingFemale, kneelingLightSkinToneFemale, kneelingMediumLightSkinToneFemale, kneelingMediumSkinToneFemale, kneelingMediumDarkSkinToneFemale, kneelingDarkSkinToneFemale, running, runningLightSkinTone, runningMediumLightSkinTone, runningMediumSkinTone, runningMediumDarkSkinTone, runningDarkSkinTone, runningMale, runningLightSkinToneMale, runningMediumLightSkinToneMale, runningMediumSkinToneMale, runningMediumDarkSkinToneMale, runningDarkSkinToneMale, runningFemale, runningLightSkinToneFemale, runningMediumLightSkinToneFemale, runningMediumSkinToneFemale, runningMediumDarkSkinToneFemale, runningDarkSkinToneFemale, baby, babyLightSkinTone, babyMediumLightSkinTone, babyMediumSkinTone, babyMediumDarkSkinTone, babyDarkSkinTone, child, childLightSkinTone, childMediumLightSkinTone, childMediumSkinTone, childMediumDarkSkinTone, childDarkSkinTone, boy, boyLightSkinTone, boyMediumLightSkinTone, boyMediumSkinTone, boyMediumDarkSkinTone, boyDarkSkinTone, girl, girlLightSkinTone, girlMediumLightSkinTone, girlMediumSkinTone, girlMediumDarkSkinTone, girlDarkSkinTone, blondPerson, blondPersonLightSkinTone, blondPersonMediumLightSkinTone, blondPersonMediumSkinTone, blondPersonMediumDarkSkinTone, blondPersonDarkSkinTone, blondPersonMale, blondPersonLightSkinToneMale, blondPersonMediumLightSkinToneMale, blondPersonMediumSkinToneMale, blondPersonMediumDarkSkinToneMale, blondPersonDarkSkinToneMale, blondPersonFemale, blondPersonLightSkinToneFemale, blondPersonMediumLightSkinToneFemale, blondPersonMediumSkinToneFemale, blondPersonMediumDarkSkinToneFemale, blondPersonDarkSkinToneFemale, person, personLightSkinTone, personMediumLightSkinTone, personMediumSkinTone, personMediumDarkSkinTone, personDarkSkinTone, beardedMan, beardedManLightSkinTone, beardedManMediumLightSkinTone, beardedManMediumSkinTone, beardedManMediumDarkSkinTone, beardedManDarkSkinTone, manWithChineseCap, manWithChineseCapLightSkinTone, manWithChineseCapMediumLightSkinTone, manWithChineseCapMediumSkinTone, manWithChineseCapMediumDarkSkinTone, manWithChineseCapDarkSkinTone, manInTuxedo, manInTuxedoLightSkinTone, manInTuxedoMediumLightSkinTone, manInTuxedoMediumSkinTone, manInTuxedoMediumDarkSkinTone, manInTuxedoDarkSkinTone, man, manLightSkinTone, manMediumLightSkinTone, manMediumSkinTone, manMediumDarkSkinTone, manDarkSkinTone, manRedHair, manLightSkinToneRedHair, manMediumLightSkinToneRedHair, manMediumSkinToneRedHair, manMediumDarkSkinToneRedHair, manDarkSkinToneRedHair, manCurlyHair, manLightSkinToneCurlyHair, manMediumLightSkinToneCurlyHair, manMediumSkinToneCurlyHair, manMediumDarkSkinToneCurlyHair, manDarkSkinToneCurlyHair, manWhiteHair, manLightSkinToneWhiteHair, manMediumLightSkinToneWhiteHair, manMediumSkinToneWhiteHair, manMediumDarkSkinToneWhiteHair, manDarkSkinToneWhiteHair, manBald, manLightSkinToneBald, manMediumLightSkinToneBald, manMediumSkinToneBald, manMediumDarkSkinToneBald, manDarkSkinToneBald, manInSuitLevitating, pregnantWoman, pregnantWomanLightSkinTone, pregnantWomanMediumLightSkinTone, pregnantWomanMediumSkinTone, pregnantWomanMediumDarkSkinTone, pregnantWomanDarkSkinTone, breastFeeding, breastFeedingLightSkinTone, breastFeedingMediumLightSkinTone, breastFeedingMediumSkinTone, breastFeedingMediumDarkSkinTone, breastFeedingDarkSkinTone, womanWithHeadscarf, womanWithHeadscarfLightSkinTone, womanWithHeadscarfMediumLightSkinTone, womanWithHeadscarfMediumSkinTone, womanWithHeadscarfMediumDarkSkinTone, womanWithHeadscarfDarkSkinTone, brideWithVeil, brideWithVeilLightSkinTone, brideWithVeilMediumLightSkinTone, brideWithVeilMediumSkinTone, brideWithVeilMediumDarkSkinTone, brideWithVeilDarkSkinTone, woman, womanLightSkinTone, womanMediumLightSkinTone, womanMediumSkinTone, womanMediumDarkSkinTone, womanDarkSkinTone, womanRedHair, womanLightSkinToneRedHair, womanMediumLightSkinToneRedHair, womanMediumSkinToneRedHair, womanMediumDarkSkinToneRedHair, womanDarkSkinToneRedHair, womanCurlyHair, womanLightSkinToneCurlyHair, womanMediumLightSkinToneCurlyHair, womanMediumSkinToneCurlyHair, womanMediumDarkSkinToneCurlyHair, womanDarkSkinToneCurlyHair, womanWhiteHair, womanLightSkinToneWhiteHair, womanMediumLightSkinToneWhiteHair, womanMediumSkinToneWhiteHair, womanMediumDarkSkinToneWhiteHair, womanDarkSkinToneWhiteHair, womanBald, womanLightSkinToneBald, womanMediumLightSkinToneBald, womanMediumSkinToneBald, womanMediumDarkSkinToneBald, womanDarkSkinToneBald, olderPerson, olderPersonLightSkinTone, olderPersonMediumLightSkinTone, olderPersonMediumSkinTone, olderPersonMediumDarkSkinTone, olderPersonDarkSkinTone, oldMan, oldManLightSkinTone, oldManMediumLightSkinTone, oldManMediumSkinTone, oldManMediumDarkSkinTone, oldManDarkSkinTone, oldWoman, oldWomanLightSkinTone, oldWomanMediumLightSkinTone, oldWomanMediumSkinTone, oldWomanMediumDarkSkinTone, oldWomanDarkSkinTone, manHealthCare, manLightSkinToneHealthCare, manMediumLightSkinToneHealthCare, manMediumSkinToneHealthCare, manMediumDarkSkinToneHealthCare, manDarkSkinToneHealthCare, womanHealthCare, womanLightSkinToneHealthCare, womanMediumLightSkinToneHealthCare, womanMediumSkinToneHealthCare, womanMediumDarkSkinToneHealthCare, womanDarkSkinToneHealthCare, medical, manStudent, manLightSkinToneStudent, manMediumLightSkinToneStudent, manMediumSkinToneStudent, manMediumDarkSkinToneStudent, manDarkSkinToneStudent, womanStudent, womanLightSkinToneStudent, womanMediumLightSkinToneStudent, womanMediumSkinToneStudent, womanMediumDarkSkinToneStudent, womanDarkSkinToneStudent, graduationCap, manTeacher, manLightSkinToneTeacher, manMediumLightSkinToneTeacher, manMediumSkinToneTeacher, manMediumDarkSkinToneTeacher, manDarkSkinToneTeacher, womanTeacher, womanLightSkinToneTeacher, womanMediumLightSkinToneTeacher, womanMediumSkinToneTeacher, womanMediumDarkSkinToneTeacher, womanDarkSkinToneTeacher, school, manJudge, manLightSkinToneJudge, manMediumLightSkinToneJudge, manMediumSkinToneJudge, manMediumDarkSkinToneJudge, manDarkSkinToneJudge, womanJudge, womanLightSkinToneJudge, womanMediumLightSkinToneJudge, womanMediumSkinToneJudge, womanMediumDarkSkinToneJudge, womanDarkSkinToneJudge, balanceScale, manFarmer, manLightSkinToneFarmer, manMediumLightSkinToneFarmer, manMediumSkinToneFarmer, manMediumDarkSkinToneFarmer, manDarkSkinToneFarmer, womanFarmer, womanLightSkinToneFarmer, womanMediumLightSkinToneFarmer, womanMediumSkinToneFarmer, womanMediumDarkSkinToneFarmer, womanDarkSkinToneFarmer, sheafOfRice, manCook, manLightSkinToneCook, manMediumLightSkinToneCook, manMediumSkinToneCook, manMediumDarkSkinToneCook, manDarkSkinToneCook, womanCook, womanLightSkinToneCook, womanMediumLightSkinToneCook, womanMediumSkinToneCook, womanMediumDarkSkinToneCook, womanDarkSkinToneCook, cooking, manMechanic, manLightSkinToneMechanic, manMediumLightSkinToneMechanic, manMediumSkinToneMechanic, manMediumDarkSkinToneMechanic, manDarkSkinToneMechanic, womanMechanic, womanLightSkinToneMechanic, womanMediumLightSkinToneMechanic, womanMediumSkinToneMechanic, womanMediumDarkSkinToneMechanic, womanDarkSkinToneMechanic, wrench, manFactoryWorker, manLightSkinToneFactoryWorker, manMediumLightSkinToneFactoryWorker, manMediumSkinToneFactoryWorker, manMediumDarkSkinToneFactoryWorker, manDarkSkinToneFactoryWorker, womanFactoryWorker, womanLightSkinToneFactoryWorker, womanMediumLightSkinToneFactoryWorker, womanMediumSkinToneFactoryWorker, womanMediumDarkSkinToneFactoryWorker, womanDarkSkinToneFactoryWorker, factory, manOfficeWorker, manLightSkinToneOfficeWorker, manMediumLightSkinToneOfficeWorker, manMediumSkinToneOfficeWorker, manMediumDarkSkinToneOfficeWorker, manDarkSkinToneOfficeWorker, womanOfficeWorker, womanLightSkinToneOfficeWorker, womanMediumLightSkinToneOfficeWorker, womanMediumSkinToneOfficeWorker, womanMediumDarkSkinToneOfficeWorker, womanDarkSkinToneOfficeWorker, briefcase, manFireFighter, manLightSkinToneFireFighter, manMediumLightSkinToneFireFighter, manMediumSkinToneFireFighter, manMediumDarkSkinToneFireFighter, manDarkSkinToneFireFighter, womanFireFighter, womanLightSkinToneFireFighter, womanMediumLightSkinToneFireFighter, womanMediumSkinToneFireFighter, womanMediumDarkSkinToneFireFighter, womanDarkSkinToneFireFighter, fireEngine, manAstronaut, manLightSkinToneAstronaut, manMediumLightSkinToneAstronaut, manMediumSkinToneAstronaut, manMediumDarkSkinToneAstronaut, manDarkSkinToneAstronaut, womanAstronaut, womanLightSkinToneAstronaut, womanMediumLightSkinToneAstronaut, womanMediumSkinToneAstronaut, womanMediumDarkSkinToneAstronaut, womanDarkSkinToneAstronaut, rocket, manPilot, manLightSkinTonePilot, manMediumLightSkinTonePilot, manMediumSkinTonePilot, manMediumDarkSkinTonePilot, manDarkSkinTonePilot, womanPilot, womanLightSkinTonePilot, womanMediumLightSkinTonePilot, womanMediumSkinTonePilot, womanMediumDarkSkinTonePilot, womanDarkSkinTonePilot, airplane, manArtist, manLightSkinToneArtist, manMediumLightSkinToneArtist, manMediumSkinToneArtist, manMediumDarkSkinToneArtist, manDarkSkinToneArtist, womanArtist, womanLightSkinToneArtist, womanMediumLightSkinToneArtist, womanMediumSkinToneArtist, womanMediumDarkSkinToneArtist, womanDarkSkinToneArtist, artistPalette, manSinger, manLightSkinToneSinger, manMediumLightSkinToneSinger, manMediumSkinToneSinger, manMediumDarkSkinToneSinger, manDarkSkinToneSinger, womanSinger, womanLightSkinToneSinger, womanMediumLightSkinToneSinger, womanMediumSkinToneSinger, womanMediumDarkSkinToneSinger, womanDarkSkinToneSinger, microphone, manTechnologist, manLightSkinToneTechnologist, manMediumLightSkinToneTechnologist, manMediumSkinToneTechnologist, manMediumDarkSkinToneTechnologist, manDarkSkinToneTechnologist, womanTechnologist, womanLightSkinToneTechnologist, womanMediumLightSkinToneTechnologist, womanMediumSkinToneTechnologist, womanMediumDarkSkinToneTechnologist, womanDarkSkinToneTechnologist, laptop, manScientist, manLightSkinToneScientist, manMediumLightSkinToneScientist, manMediumSkinToneScientist, manMediumDarkSkinToneScientist, manDarkSkinToneScientist, womanScientist, womanLightSkinToneScientist, womanMediumLightSkinToneScientist, womanMediumSkinToneScientist, womanMediumDarkSkinToneScientist, womanDarkSkinToneScientist, microscope, prince, princeLightSkinTone, princeMediumLightSkinTone, princeMediumSkinTone, princeMediumDarkSkinTone, princeDarkSkinTone, princess, princessLightSkinTone, princessMediumLightSkinTone, princessMediumSkinTone, princessMediumDarkSkinTone, princessDarkSkinTone, crown, cherub, cherubLightSkinTone, cherubMediumLightSkinTone, cherubMediumSkinTone, cherubMediumDarkSkinTone, cherubDarkSkinTone, santaClaus, santaClausLightSkinTone, santaClausMediumLightSkinTone, santaClausMediumSkinTone, santaClausMediumDarkSkinTone, santaClausDarkSkinTone, mrsClaus, mrsClausLightSkinTone, mrsClausMediumLightSkinTone, mrsClausMediumSkinTone, mrsClausMediumDarkSkinTone, mrsClausDarkSkinTone, genie, genieMale, genieFemale, zombie, zombieMale, zombieFemale, manProbing, manLightSkinToneProbing, manMediumLightSkinToneProbing, manMediumSkinToneProbing, manMediumDarkSkinToneProbing, manDarkSkinToneProbing, womanProbing, womanLightSkinToneProbing, womanMediumLightSkinToneProbing, womanMediumSkinToneProbing, womanMediumDarkSkinToneProbing, womanDarkSkinToneProbing, probingCane, manInMotorizedWheelchair, manLightSkinToneInMotorizedWheelchair, manMediumLightSkinToneInMotorizedWheelchair, manMediumSkinToneInMotorizedWheelchair, manMediumDarkSkinToneInMotorizedWheelchair, manDarkSkinToneInMotorizedWheelchair, womanInMotorizedWheelchair, womanLightSkinToneInMotorizedWheelchair, womanMediumLightSkinToneInMotorizedWheelchair, womanMediumSkinToneInMotorizedWheelchair, womanMediumDarkSkinToneInMotorizedWheelchair, womanDarkSkinToneInMotorizedWheelchair, motorizedWheelchair, manInManualWheelchair, manLightSkinToneInManualWheelchair, manMediumLightSkinToneInManualWheelchair, manMediumSkinToneInManualWheelchair, manMediumDarkSkinToneInManualWheelchair, manDarkSkinToneInManualWheelchair, womanInManualWheelchair, womanLightSkinToneInManualWheelchair, womanMediumLightSkinToneInManualWheelchair, womanMediumSkinToneInManualWheelchair, womanMediumDarkSkinToneInManualWheelchair, womanDarkSkinToneInManualWheelchair, manualWheelchair, manDancing, manDancingLightSkinTone, manDancingMediumLightSkinTone, manDancingMediumSkinTone, manDancingMediumDarkSkinTone, manDancingDarkSkinTone, womanDancing, womanDancingLightSkinTone, womanDancingMediumLightSkinTone, womanDancingMediumSkinTone, womanDancingMediumDarkSkinTone, womanDancingDarkSkinTone, juggler, jugglerLightSkinTone, jugglerMediumLightSkinTone, jugglerMediumSkinTone, jugglerMediumDarkSkinTone, jugglerDarkSkinTone, jugglerMale, jugglerLightSkinToneMale, jugglerMediumLightSkinToneMale, jugglerMediumSkinToneMale, jugglerMediumDarkSkinToneMale, jugglerDarkSkinToneMale, jugglerFemale, jugglerLightSkinToneFemale, jugglerMediumLightSkinToneFemale, jugglerMediumSkinToneFemale, jugglerMediumDarkSkinToneFemale, jugglerDarkSkinToneFemale, climber, climberLightSkinTone, climberMediumLightSkinTone, climberMediumSkinTone, climberMediumDarkSkinTone, climberDarkSkinTone, climberMale, climberLightSkinToneMale, climberMediumLightSkinToneMale, climberMediumSkinToneMale, climberMediumDarkSkinToneMale, climberDarkSkinToneMale, climberFemale, climberLightSkinToneFemale, climberMediumLightSkinToneFemale, climberMediumSkinToneFemale, climberMediumDarkSkinToneFemale, climberDarkSkinToneFemale, jockey, jockeyLightSkinTone, jockeyMediumLightSkinTone, jockeyMediumSkinTone, jockeyMediumDarkSkinTone, jockeyDarkSkinTone, snowboarder, snowboarderLightSkinTone, snowboarderMediumLightSkinTone, snowboarderMediumSkinTone, snowboarderMediumDarkSkinTone, snowboarderDarkSkinTone, golfer, golferLightSkinTone, golferMediumLightSkinTone, golferMediumSkinTone, golferMediumDarkSkinTone, golferDarkSkinTone, golferMale, golferLightSkinToneMale, golferMediumLightSkinToneMale, golferMediumSkinToneMale, golferMediumDarkSkinToneMale, golferDarkSkinToneMale, golferFemale, golferLightSkinToneFemale, golferMediumLightSkinToneFemale, golferMediumSkinToneFemale, golferMediumDarkSkinToneFemale, golferDarkSkinToneFemale, surfing, surfingLightSkinTone, surfingMediumLightSkinTone, surfingMediumSkinTone, surfingMediumDarkSkinTone, surfingDarkSkinTone, surfingMale, surfingLightSkinToneMale, surfingMediumLightSkinToneMale, surfingMediumSkinToneMale, surfingMediumDarkSkinToneMale, surfingDarkSkinToneMale, surfingFemale, surfingLightSkinToneFemale, surfingMediumLightSkinToneFemale, surfingMediumSkinToneFemale, surfingMediumDarkSkinToneFemale, surfingDarkSkinToneFemale, rowingBoat, rowingBoatLightSkinTone, rowingBoatMediumLightSkinTone, rowingBoatMediumSkinTone, rowingBoatMediumDarkSkinTone, rowingBoatDarkSkinTone, rowingBoatMale, rowingBoatLightSkinToneMale, rowingBoatMediumLightSkinToneMale, rowingBoatMediumSkinToneMale, rowingBoatMediumDarkSkinToneMale, rowingBoatDarkSkinToneMale, rowingBoatFemale, rowingBoatLightSkinToneFemale, rowingBoatMediumLightSkinToneFemale, rowingBoatMediumSkinToneFemale, rowingBoatMediumDarkSkinToneFemale, rowingBoatDarkSkinToneFemale, swimming, swimmingLightSkinTone, swimmingMediumLightSkinTone, swimmingMediumSkinTone, swimmingMediumDarkSkinTone, swimmingDarkSkinTone, swimmingMale, swimmingLightSkinToneMale, swimmingMediumLightSkinToneMale, swimmingMediumSkinToneMale, swimmingMediumDarkSkinToneMale, swimmingDarkSkinToneMale, swimmingFemale, swimmingLightSkinToneFemale, swimmingMediumLightSkinToneFemale, swimmingMediumSkinToneFemale, swimmingMediumDarkSkinToneFemale, swimmingDarkSkinToneFemale, basketBaller, basketBallerLightSkinTone, basketBallerMediumLightSkinTone, basketBallerMediumSkinTone, basketBallerMediumDarkSkinTone, basketBallerDarkSkinTone, basketBallerMale, basketBallerLightSkinToneMale, basketBallerMediumLightSkinToneMale, basketBallerMediumSkinToneMale, basketBallerMediumDarkSkinToneMale, basketBallerDarkSkinToneMale, basketBallerFemale, basketBallerLightSkinToneFemale, basketBallerMediumLightSkinToneFemale, basketBallerMediumSkinToneFemale, basketBallerMediumDarkSkinToneFemale, basketBallerDarkSkinToneFemale, weightLifter, weightLifterLightSkinTone, weightLifterMediumLightSkinTone, weightLifterMediumSkinTone, weightLifterMediumDarkSkinTone, weightLifterDarkSkinTone, weightLifterMale, weightLifterLightSkinToneMale, weightLifterMediumLightSkinToneMale, weightLifterMediumSkinToneMale, weightLifterMediumDarkSkinToneMale, weightLifterDarkSkinToneMale, weightLifterFemale, weightLifterLightSkinToneFemale, weightLifterMediumLightSkinToneFemale, weightLifterMediumSkinToneFemale, weightLifterMediumDarkSkinToneFemale, weightLifterDarkSkinToneFemale, biker, bikerLightSkinTone, bikerMediumLightSkinTone, bikerMediumSkinTone, bikerMediumDarkSkinTone, bikerDarkSkinTone, bikerMale, bikerLightSkinToneMale, bikerMediumLightSkinToneMale, bikerMediumSkinToneMale, bikerMediumDarkSkinToneMale, bikerDarkSkinToneMale, bikerFemale, bikerLightSkinToneFemale, bikerMediumLightSkinToneFemale, bikerMediumSkinToneFemale, bikerMediumDarkSkinToneFemale, bikerDarkSkinToneFemale, mountainBiker, mountainBikerLightSkinTone, mountainBikerMediumLightSkinTone, mountainBikerMediumSkinTone, mountainBikerMediumDarkSkinTone, mountainBikerDarkSkinTone, mountainBikerMale, mountainBikerLightSkinToneMale, mountainBikerMediumLightSkinToneMale, mountainBikerMediumSkinToneMale, mountainBikerMediumDarkSkinToneMale, mountainBikerDarkSkinToneMale, mountainBikerFemale, mountainBikerLightSkinToneFemale, mountainBikerMediumLightSkinToneFemale, mountainBikerMediumSkinToneFemale, mountainBikerMediumDarkSkinToneFemale, mountainBikerDarkSkinToneFemale, cartwheeler, cartwheelerLightSkinTone, cartwheelerMediumLightSkinTone, cartwheelerMediumSkinTone, cartwheelerMediumDarkSkinTone, cartwheelerDarkSkinTone, cartwheelerMale, cartwheelerLightSkinToneMale, cartwheelerMediumLightSkinToneMale, cartwheelerMediumSkinToneMale, cartwheelerMediumDarkSkinToneMale, cartwheelerDarkSkinToneMale, cartwheelerFemale, cartwheelerLightSkinToneFemale, cartwheelerMediumLightSkinToneFemale, cartwheelerMediumSkinToneFemale, cartwheelerMediumDarkSkinToneFemale, cartwheelerDarkSkinToneFemale, wrestler, wrestlerMale, wrestlerFemale, waterPoloPlayer, waterPoloPlayerLightSkinTone, waterPoloPlayerMediumLightSkinTone, waterPoloPlayerMediumSkinTone, waterPoloPlayerMediumDarkSkinTone, waterPoloPlayerDarkSkinTone, waterPoloPlayerMale, waterPoloPlayerLightSkinToneMale, waterPoloPlayerMediumLightSkinToneMale, waterPoloPlayerMediumSkinToneMale, waterPoloPlayerMediumDarkSkinToneMale, waterPoloPlayerDarkSkinToneMale, waterPoloPlayerFemale, waterPoloPlayerLightSkinToneFemale, waterPoloPlayerMediumLightSkinToneFemale, waterPoloPlayerMediumSkinToneFemale, waterPoloPlayerMediumDarkSkinToneFemale, waterPoloPlayerDarkSkinToneFemale, handBaller, handBallerLightSkinTone, handBallerMediumLightSkinTone, handBallerMediumSkinTone, handBallerMediumDarkSkinTone, handBallerDarkSkinTone, handBallerMale, handBallerLightSkinToneMale, handBallerMediumLightSkinToneMale, handBallerMediumSkinToneMale, handBallerMediumDarkSkinToneMale, handBallerDarkSkinToneMale, handBallerFemale, handBallerLightSkinToneFemale, handBallerMediumLightSkinToneFemale, handBallerMediumSkinToneFemale, handBallerMediumDarkSkinToneFemale, handBallerDarkSkinToneFemale, fencer, skier, inLotusPosition, inLotusPositionLightSkinTone, inLotusPositionMediumLightSkinTone, inLotusPositionMediumSkinTone, inLotusPositionMediumDarkSkinTone, inLotusPositionDarkSkinTone, inLotusPositionMale, inLotusPositionLightSkinToneMale, inLotusPositionMediumLightSkinToneMale, inLotusPositionMediumSkinToneMale, inLotusPositionMediumDarkSkinToneMale, inLotusPositionDarkSkinToneMale, inLotusPositionFemale, inLotusPositionLightSkinToneFemale, inLotusPositionMediumLightSkinToneFemale, inLotusPositionMediumSkinToneFemale, inLotusPositionMediumDarkSkinToneFemale, inLotusPositionDarkSkinToneFemale, inBath, inBathLightSkinTone, inBathMediumLightSkinTone, inBathMediumSkinTone, inBathMediumDarkSkinTone, inBathDarkSkinTone, inBed, inBedLightSkinTone, inBedMediumLightSkinTone, inBedMediumSkinTone, inBedMediumDarkSkinTone, inBedDarkSkinTone, inSauna, inSaunaLightSkinTone, inSaunaMediumLightSkinTone, inSaunaMediumSkinTone, inSaunaMediumDarkSkinTone, inSaunaDarkSkinTone, inSaunaMale, inSaunaLightSkinToneMale, inSaunaMediumLightSkinToneMale, inSaunaMediumSkinToneMale, inSaunaMediumDarkSkinToneMale, inSaunaDarkSkinToneMale, inSaunaFemale, inSaunaLightSkinToneFemale, inSaunaMediumLightSkinToneFemale, inSaunaMediumSkinToneFemale, inSaunaMediumDarkSkinToneFemale, inSaunaDarkSkinToneFemale } from "./emojis";



export const sexes = [
    female,
    male,
    transgenderSymbol
];

export const skinTones = [
    lightSkinTone,
    mediumLightSkinTone,
    mediumSkinTone,
    mediumDarkSkinTone,
    darkSkinTone
];

export const hairStyles = [
    redHair,
    curlyHair,
    whiteHair,
    bald
];

export const allFrowning = [
    frowning,
    frowningLightSkinTone,
    frowningMediumLightSkinTone,
    frowningMediumSkinTone,
    frowningMediumDarkSkinTone,
    frowningDarkSkinTone
];

export const allFrowningGroup = new EmojiGroup("\u{1F64D}\uDE4D", "Frowning", ...allFrowning);

export const allFrowningMale = [
    frowningMale,
    frowningLightSkinToneMale,
    frowningMediumLightSkinToneMale,
    frowningMediumSkinToneMale,
    frowningMediumDarkSkinToneMale,
    frowningDarkSkinToneMale
];

export const allFrowningMaleGroup = new EmojiGroup("\u{1F64D}\uDE4D\u200D\u2642\uFE0F", "Frowning: Male", ...allFrowningMale);

export const allFrowningFemale = [
    frowningFemale,
    frowningLightSkinToneFemale,
    frowningMediumLightSkinToneFemale,
    frowningMediumSkinToneFemale,
    frowningMediumDarkSkinToneFemale,
    frowningDarkSkinToneFemale
];

export const allFrowningFemaleGroup = new EmojiGroup("\u{1F64D}\uDE4D\u200D\u2640\uFE0F", "Frowning: Female", ...allFrowningFemale);

export const allFrowners = [
    allFrowningGroup,
    allFrowningMaleGroup,
    allFrowningFemaleGroup
];

export const allFrownersGroup = new EmojiGroup("\u{1F64D}\uDE4D", "Frowning", ...allFrowners);

export const allPouting = [
    pouting,
    poutingLightSkinTone,
    poutingMediumLightSkinTone,
    poutingMediumSkinTone,
    poutingMediumDarkSkinTone,
    poutingDarkSkinTone
];

export const allPoutingGroup = new EmojiGroup("\u{1F64E}\uDE4E", "Pouting", ...allPouting);

export const allPoutingMale = [
    poutingMale,
    poutingLightSkinToneMale,
    poutingMediumLightSkinToneMale,
    poutingMediumSkinToneMale,
    poutingMediumDarkSkinToneMale,
    poutingDarkSkinToneMale
];

export const allPoutingMaleGroup = new EmojiGroup("\u{1F64E}\uDE4E\u200D\u2642\uFE0F", "Pouting: Male", ...allPoutingMale);

export const allPoutingFemale = [
    poutingFemale,
    poutingLightSkinToneFemale,
    poutingMediumLightSkinToneFemale,
    poutingMediumSkinToneFemale,
    poutingMediumDarkSkinToneFemale,
    poutingDarkSkinToneFemale
];

export const allPoutingFemaleGroup = new EmojiGroup("\u{1F64E}\uDE4E\u200D\u2640\uFE0F", "Pouting: Female", ...allPoutingFemale);

export const allPouters = [
    allPoutingGroup,
    allPoutingMaleGroup,
    allPoutingFemaleGroup
];

export const allPoutersGroup = new EmojiGroup("\u{1F64E}\uDE4E", "Pouting", ...allPouters);

export const allGesturingNO = [
    gesturingNO,
    gesturingNOLightSkinTone,
    gesturingNOMediumLightSkinTone,
    gesturingNOMediumSkinTone,
    gesturingNOMediumDarkSkinTone,
    gesturingNODarkSkinTone
];

export const allGesturingNOGroup = new EmojiGroup("\u{1F645}\uDE45", "Gesturing NO", ...allGesturingNO);

export const allGesturingNOMale = [
    gesturingNOMale,
    gesturingNOLightSkinToneMale,
    gesturingNOMediumLightSkinToneMale,
    gesturingNOMediumSkinToneMale,
    gesturingNOMediumDarkSkinToneMale,
    gesturingNODarkSkinToneMale
];

export const allGesturingNOMaleGroup = new EmojiGroup("\u{1F645}\uDE45\u200D\u2642\uFE0F", "Gesturing NO: Male", ...allGesturingNOMale);

export const allGesturingNOFemale = [
    gesturingNOFemale,
    gesturingNOLightSkinToneFemale,
    gesturingNOMediumLightSkinToneFemale,
    gesturingNOMediumSkinToneFemale,
    gesturingNOMediumDarkSkinToneFemale,
    gesturingNODarkSkinToneFemale
];

export const allGesturingNOFemaleGroup = new EmojiGroup("\u{1F645}\uDE45\u200D\u2640\uFE0F", "Gesturing NO: Female", ...allGesturingNOFemale);

export const allNoGuesturerersGroup = [
    allGesturingNOGroup,
    allGesturingNOMaleGroup,
    allGesturingNOFemaleGroup
];

export const allNoGuesturerersGroupGroup = new EmojiGroup("\u{1F645}\uDE45", "Gesturing NO", ...allNoGuesturerersGroup);

export const allGesturingOK = [
    gesturingOK,
    gesturingOKLightSkinTone,
    gesturingOKMediumLightSkinTone,
    gesturingOKMediumSkinTone,
    gesturingOKMediumDarkSkinTone,
    gesturingOKDarkSkinTone
];

export const allGesturingOKGroup = new EmojiGroup("\u{1F646}\uDE46", "Gesturing OK", ...allGesturingOK);

export const allGesturingOKMale = [
    gesturingOKMale,
    gesturingOKLightSkinToneMale,
    gesturingOKMediumLightSkinToneMale,
    gesturingOKMediumSkinToneMale,
    gesturingOKMediumDarkSkinToneMale,
    gesturingOKDarkSkinToneMale
];

export const allGesturingOKMaleGroup = new EmojiGroup("\u{1F646}\uDE46\u200D\u2642\uFE0F", "Gesturing OK: Male", ...allGesturingOKMale);

export const allGesturingOKFemale = [
    gesturingOKFemale,
    gesturingOKLightSkinToneFemale,
    gesturingOKMediumLightSkinToneFemale,
    gesturingOKMediumSkinToneFemale,
    gesturingOKMediumDarkSkinToneFemale,
    gesturingOKDarkSkinToneFemale
];

export const allGesturingOKFemaleGroup = new EmojiGroup("\u{1F646}\uDE46\u200D\u2640\uFE0F", "Gesturing OK: Female", ...allGesturingOKFemale);

export const allOKGesturerersGroup = [
    allGesturingOKGroup,
    allGesturingOKMaleGroup,
    allGesturingOKFemaleGroup
];

export const allOKGesturerersGroupGroup = new EmojiGroup("\u{1F646}\uDE46", "Gesturing OK", ...allOKGesturerersGroup);

export const allTippingHand = [
    tippingHand,
    tippingHandLightSkinTone,
    tippingHandMediumLightSkinTone,
    tippingHandMediumSkinTone,
    tippingHandMediumDarkSkinTone,
    tippingHandDarkSkinTone
];

export const allTippingHandGroup = new EmojiGroup("\u{1F481}\uDC81", "Tipping Hand", ...allTippingHand);

export const allTippingHandMale = [
    tippingHandMale,
    tippingHandLightSkinToneMale,
    tippingHandMediumLightSkinToneMale,
    tippingHandMediumSkinToneMale,
    tippingHandMediumDarkSkinToneMale,
    tippingHandDarkSkinToneMale
];

export const allTippingHandMaleGroup = new EmojiGroup("\u{1F481}\uDC81\u200D\u2642\uFE0F", "Tipping Hand: Male", ...allTippingHandMale);

export const allTippingHandFemale = [
    tippingHandFemale,
    tippingHandLightSkinToneFemale,
    tippingHandMediumLightSkinToneFemale,
    tippingHandMediumSkinToneFemale,
    tippingHandMediumDarkSkinToneFemale,
    tippingHandDarkSkinToneFemale
];

export const allTippingHandFemaleGroup = new EmojiGroup("\u{1F481}\uDC81\u200D\u2640\uFE0F", "Tipping Hand: Female", ...allTippingHandFemale);

export const allHandTippersGroup = [
    allTippingHandGroup,
    allTippingHandMaleGroup,
    allTippingHandFemaleGroup
];

export const allHandTippersGroupGroup = new EmojiGroup("\u{1F481}\uDC81", "Tipping Hand", ...allHandTippersGroup);

export const allRaisingHand = [
    raisingHand,
    raisingHandLightSkinTone,
    raisingHandMediumLightSkinTone,
    raisingHandMediumSkinTone,
    raisingHandMediumDarkSkinTone,
    raisingHandDarkSkinTone
];

export const allRaisingHandGroup = new EmojiGroup("\u{1F64B}\uDE4B", "Raising Hand", ...allRaisingHand);

export const allRaisingHandMale = [
    raisingHandMale,
    raisingHandLightSkinToneMale,
    raisingHandMediumLightSkinToneMale,
    raisingHandMediumSkinToneMale,
    raisingHandMediumDarkSkinToneMale,
    raisingHandDarkSkinToneMale
];

export const allRaisingHandMaleGroup = new EmojiGroup("\u{1F64B}\uDE4B\u200D\u2642\uFE0F", "Raising Hand: Male", ...allRaisingHandMale);

export const allRaisingHandFemale = [
    raisingHandFemale,
    raisingHandLightSkinToneFemale,
    raisingHandMediumLightSkinToneFemale,
    raisingHandMediumSkinToneFemale,
    raisingHandMediumDarkSkinToneFemale,
    raisingHandDarkSkinToneFemale
];

export const allRaisingHandFemaleGroup = new EmojiGroup("\u{1F64B}\uDE4B\u200D\u2640\uFE0F", "Raising Hand: Female", ...allRaisingHandFemale);

export const allHandRaisers = [
    allRaisingHandGroup,
    allRaisingHandMaleGroup,
    allRaisingHandFemaleGroup
];

export const allHandRaisersGroup = new EmojiGroup("\u{1F64B}\uDE4B", "Raising Hand", ...allHandRaisers);

export const allBowing = [
    bowing,
    bowingLightSkinTone,
    bowingMediumLightSkinTone,
    bowingMediumSkinTone,
    bowingMediumDarkSkinTone,
    bowingDarkSkinTone
];

export const allBowingGroup = new EmojiGroup("\u{1F647}\uDE47", "Bowing", ...allBowing);

export const allBowingMale = [
    bowingMale,
    bowingLightSkinToneMale,
    bowingMediumLightSkinToneMale,
    bowingMediumSkinToneMale,
    bowingMediumDarkSkinToneMale,
    bowingDarkSkinToneMale
];

export const allBowingMaleGroup = new EmojiGroup("\u{1F647}\uDE47\u200D\u2642\uFE0F", "Bowing: Male", ...allBowingMale);

export const allBowingFemale = [
    bowingFemale,
    bowingLightSkinToneFemale,
    bowingMediumLightSkinToneFemale,
    bowingMediumSkinToneFemale,
    bowingMediumDarkSkinToneFemale,
    bowingDarkSkinToneFemale
];

export const allBowingFemaleGroup = new EmojiGroup("\u{1F647}\uDE47\u200D\u2640\uFE0F", "Bowing: Female", ...allBowingFemale);

export const allBowers = [
    allBowingGroup,
    allBowingMaleGroup,
    allBowingFemaleGroup
];

export const allBowersGroup = new EmojiGroup("\u{1F647}\uDE47", "Bowing", ...allBowers);

export const allFacepalming = [
    facepalming,
    facepalmingLightSkinTone,
    facepalmingMediumLightSkinTone,
    facepalmingMediumSkinTone,
    facepalmingMediumDarkSkinTone,
    facepalmingDarkSkinTone
];

export const allFacepalmingGroup = new EmojiGroup("\u{1F926}\uDD26", "Facepalming", ...allFacepalming);

export const allFacepalmingMale = [
    facepalmingMale,
    facepalmingLightSkinToneMale,
    facepalmingMediumLightSkinToneMale,
    facepalmingMediumSkinToneMale,
    facepalmingMediumDarkSkinToneMale,
    facepalmingDarkSkinToneMale
];

export const allFacepalmingMaleGroup = new EmojiGroup("\u{1F926}\uDD26\u200D\u2642\uFE0F", "Facepalming: Male", ...allFacepalmingMale);

export const allFacepalmingFemale = [
    facepalmingFemale,
    facepalmingLightSkinToneFemale,
    facepalmingMediumLightSkinToneFemale,
    facepalmingMediumSkinToneFemale,
    facepalmingMediumDarkSkinToneFemale,
    facepalmingDarkSkinToneFemale
];

export const allFacepalmingFemaleGroup = new EmojiGroup("\u{1F926}\uDD26\u200D\u2640\uFE0F", "Facepalming: Female", ...allFacepalmingFemale);

export const allFacepalmers = [
    allFacepalmingGroup,
    allFacepalmingMaleGroup,
    allFacepalmingFemaleGroup
];

export const allFacepalmersGroup = new EmojiGroup("\u{1F926}\uDD26", "Facepalming", ...allFacepalmers);

export const allShrugging = [
    shrugging,
    shruggingLightSkinTone,
    shruggingMediumLightSkinTone,
    shruggingMediumSkinTone,
    shruggingMediumDarkSkinTone,
    shruggingDarkSkinTone
];

export const allShruggingGroup = new EmojiGroup("\u{1F937}\uDD37", "Shrugging", ...allShrugging);

export const allShruggingMale = [
    shruggingMale,
    shruggingLightSkinToneMale,
    shruggingMediumLightSkinToneMale,
    shruggingMediumSkinToneMale,
    shruggingMediumDarkSkinToneMale,
    shruggingDarkSkinToneMale
];

export const allShruggingMaleGroup = new EmojiGroup("\u{1F937}\uDD37\u200D\u2642\uFE0F", "Shrugging: Male", ...allShruggingMale);

export const allShruggingFemale = [
    shruggingFemale,
    shruggingLightSkinToneFemale,
    shruggingMediumLightSkinToneFemale,
    shruggingMediumSkinToneFemale,
    shruggingMediumDarkSkinToneFemale,
    shruggingDarkSkinToneFemale
];

export const allShruggingFemaleGroup = new EmojiGroup("\u{1F937}\uDD37\u200D\u2640\uFE0F", "Shrugging: Female", ...allShruggingFemale);

export const allShruggers = [
    allShruggingGroup,
    allShruggingMaleGroup,
    allShruggingFemaleGroup
];

export const allShruggersGroup = new EmojiGroup("\u{1F937}\uDD37", "Shrugging", ...allShruggers);

export const allCantHear = [
    cantHear,
    cantHearLightSkinTone,
    cantHearMediumLightSkinTone,
    cantHearMediumSkinTone,
    cantHearMediumDarkSkinTone,
    cantHearDarkSkinTone
];

export const allCantHearGroup = new EmojiGroup("\u{1F9CF}\uDDCF", "Can't Hear", ...allCantHear);

export const allCantHearMale = [
    cantHearMale,
    cantHearLightSkinToneMale,
    cantHearMediumLightSkinToneMale,
    cantHearMediumSkinToneMale,
    cantHearMediumDarkSkinToneMale,
    cantHearDarkSkinToneMale
];

export const allCantHearMaleGroup = new EmojiGroup("\u{1F9CF}\uDDCF\u200D\u2642\uFE0F", "Can't Hear: Male", ...allCantHearMale);

export const allCantHearFemale = [
    cantHearFemale,
    cantHearLightSkinToneFemale,
    cantHearMediumLightSkinToneFemale,
    cantHearMediumSkinToneFemale,
    cantHearMediumDarkSkinToneFemale,
    cantHearDarkSkinToneFemale
];

export const allCantHearFemaleGroup = new EmojiGroup("\u{1F9CF}\uDDCF\u200D\u2640\uFE0F", "Can't Hear: Female", ...allCantHearFemale);

export const allCantHearers = [
    allCantHearGroup,
    allCantHearMaleGroup,
    allCantHearFemaleGroup
];

export const allCantHearersGroup = new EmojiGroup("\u{1F9CF}\uDDCF", "Can't Hear", ...allCantHearers);

export const allGettingMassage = [
    gettingMassage,
    gettingMassageLightSkinTone,
    gettingMassageMediumLightSkinTone,
    gettingMassageMediumSkinTone,
    gettingMassageMediumDarkSkinTone,
    gettingMassageDarkSkinTone
];

export const allGettingMassageGroup = new EmojiGroup("\u{1F486}\uDC86", "Getting Massage", ...allGettingMassage);

export const allGettingMassageMale = [
    gettingMassageMale,
    gettingMassageLightSkinToneMale,
    gettingMassageMediumLightSkinToneMale,
    gettingMassageMediumSkinToneMale,
    gettingMassageMediumDarkSkinToneMale,
    gettingMassageDarkSkinToneMale
];

export const allGettingMassageMaleGroup = new EmojiGroup("\u{1F486}\uDC86\u200D\u2642\uFE0F", "Getting Massage: Male", ...allGettingMassageMale);

export const allGettingMassageFemale = [
    gettingMassageFemale,
    gettingMassageLightSkinToneFemale,
    gettingMassageMediumLightSkinToneFemale,
    gettingMassageMediumSkinToneFemale,
    gettingMassageMediumDarkSkinToneFemale,
    gettingMassageDarkSkinToneFemale
];

export const allGettingMassageFemaleGroup = new EmojiGroup("\u{1F486}\uDC86\u200D\u2640\uFE0F", "Getting Massage: Female", ...allGettingMassageFemale);

export const allGettingMassaged = [
    allGettingMassageGroup,
    allGettingMassageMaleGroup,
    allGettingMassageFemaleGroup
];

export const allGettingMassagedGroup = new EmojiGroup("\u{1F486}\uDC86", "Getting Massage", ...allGettingMassaged);

export const allGettingHaircut = [
    gettingHaircut,
    gettingHaircutLightSkinTone,
    gettingHaircutMediumLightSkinTone,
    gettingHaircutMediumSkinTone,
    gettingHaircutMediumDarkSkinTone,
    gettingHaircutDarkSkinTone
];

export const allGettingHaircutGroup = new EmojiGroup("\u{1F487}\uDC87", "Getting Haircut", ...allGettingHaircut);

export const allGettingHaircutMale = [
    gettingHaircutMale,
    gettingHaircutLightSkinToneMale,
    gettingHaircutMediumLightSkinToneMale,
    gettingHaircutMediumSkinToneMale,
    gettingHaircutMediumDarkSkinToneMale,
    gettingHaircutDarkSkinToneMale
];

export const allGettingHaircutMaleGroup = new EmojiGroup("\u{1F487}\uDC87\u200D\u2642\uFE0F", "Getting Haircut: Male", ...allGettingHaircutMale);

export const allGettingHaircutFemale = [
    gettingHaircutFemale,
    gettingHaircutLightSkinToneFemale,
    gettingHaircutMediumLightSkinToneFemale,
    gettingHaircutMediumSkinToneFemale,
    gettingHaircutMediumDarkSkinToneFemale,
    gettingHaircutDarkSkinToneFemale
];

export const allGettingHaircutFemaleGroup = new EmojiGroup("\u{1F487}\uDC87\u200D\u2640\uFE0F", "Getting Haircut: Female", ...allGettingHaircutFemale);

export const allHairCutters = [
    allGettingHaircutGroup,
    allGettingHaircutMaleGroup,
    allGettingHaircutFemaleGroup
];

export const allHairCuttersGroup = new EmojiGroup("\u{1F487}\uDC87", "Getting Haircut", ...allHairCutters);

export const allConstructionWorker = [
    constructionWorker,
    constructionWorkerLightSkinTone,
    constructionWorkerMediumLightSkinTone,
    constructionWorkerMediumSkinTone,
    constructionWorkerMediumDarkSkinTone,
    constructionWorkerDarkSkinTone
];

export const allConstructionWorkerGroup = new EmojiGroup("\u{1F477}\uDC77", "Construction Worker", ...allConstructionWorker);

export const allConstructionWorkerMale = [
    constructionWorkerMale,
    constructionWorkerLightSkinToneMale,
    constructionWorkerMediumLightSkinToneMale,
    constructionWorkerMediumSkinToneMale,
    constructionWorkerMediumDarkSkinToneMale,
    constructionWorkerDarkSkinToneMale
];

export const allConstructionWorkerMaleGroup = new EmojiGroup("\u{1F477}\uDC77\u200D\u2642\uFE0F", "Construction Worker: Male", ...allConstructionWorkerMale);

export const allConstructionWorkerFemale = [
    constructionWorkerFemale,
    constructionWorkerLightSkinToneFemale,
    constructionWorkerMediumLightSkinToneFemale,
    constructionWorkerMediumSkinToneFemale,
    constructionWorkerMediumDarkSkinToneFemale,
    constructionWorkerDarkSkinToneFemale
];

export const allConstructionWorkerFemaleGroup = new EmojiGroup("\u{1F477}\uDC77\u200D\u2640\uFE0F", "Construction Worker: Female", ...allConstructionWorkerFemale);

export const allConstructionWorkers = [
    allConstructionWorkerGroup,
    allConstructionWorkerMaleGroup,
    allConstructionWorkerFemaleGroup
];

export const allConstructionWorkersGroup = new EmojiGroup("\u{1F477}\uDC77", "Construction Worker", ...allConstructionWorkers);

export const allGuard = [
    guard,
    guardLightSkinTone,
    guardMediumLightSkinTone,
    guardMediumSkinTone,
    guardMediumDarkSkinTone,
    guardDarkSkinTone
];

export const allGuardGroup = new EmojiGroup("\u{1F482}\uDC82", "Guard", ...allGuard);

export const allGuardMale = [
    guardMale,
    guardLightSkinToneMale,
    guardMediumLightSkinToneMale,
    guardMediumSkinToneMale,
    guardMediumDarkSkinToneMale,
    guardDarkSkinToneMale
];

export const allGuardMaleGroup = new EmojiGroup("\u{1F482}\uDC82\u200D\u2642\uFE0F", "Guard: Male", ...allGuardMale);

export const allGuardFemale = [
    guardFemale,
    guardLightSkinToneFemale,
    guardMediumLightSkinToneFemale,
    guardMediumSkinToneFemale,
    guardMediumDarkSkinToneFemale,
    guardDarkSkinToneFemale
];

export const allGuardFemaleGroup = new EmojiGroup("\u{1F482}\uDC82\u200D\u2640\uFE0F", "Guard: Female", ...allGuardFemale);

export const allGuards = [
    allGuardGroup,
    allGuardMaleGroup,
    allGuardFemaleGroup
];

export const allGuardsGroup = new EmojiGroup("\u{1F482}\uDC82", "Guard", ...allGuards);

export const allSpy = [
    spy,
    spyLightSkinTone,
    spyMediumLightSkinTone,
    spyMediumSkinTone,
    spyMediumDarkSkinTone,
    spyDarkSkinTone
];

export const allSpyGroup = new EmojiGroup("\u{1F575}\uDD75", "Spy", ...allSpy);

export const allSpyMale = [
    spyMale,
    spyLightSkinToneMale,
    spyMediumLightSkinToneMale,
    spyMediumSkinToneMale,
    spyMediumDarkSkinToneMale,
    spyDarkSkinToneMale
];

export const allSpyMaleGroup = new EmojiGroup("\u{1F575}\uDD75\u200D\u2642\uFE0F", "Spy: Male", ...allSpyMale);

export const allSpyFemale = [
    spyFemale,
    spyLightSkinToneFemale,
    spyMediumLightSkinToneFemale,
    spyMediumSkinToneFemale,
    spyMediumDarkSkinToneFemale,
    spyDarkSkinToneFemale
];

export const allSpyFemaleGroup = new EmojiGroup("\u{1F575}\uDD75\u200D\u2640\uFE0F", "Spy: Female", ...allSpyFemale);

export const allSpies = [
    allSpyGroup,
    allSpyMaleGroup,
    allSpyFemaleGroup
];

export const allSpiesGroup = new EmojiGroup("\u{1F575}\uDD75", "Spy", ...allSpies);

export const allPolice = [
    police,
    policeLightSkinTone,
    policeMediumLightSkinTone,
    policeMediumSkinTone,
    policeMediumDarkSkinTone,
    policeDarkSkinTone
];

export const allPoliceGroup = new EmojiGroup("\u{1F46E}\uDC6E", "Police", ...allPolice);

export const allPoliceMale = [
    policeMale,
    policeLightSkinToneMale,
    policeMediumLightSkinToneMale,
    policeMediumSkinToneMale,
    policeMediumDarkSkinToneMale,
    policeDarkSkinToneMale
];

export const allPoliceMaleGroup = new EmojiGroup("\u{1F46E}\uDC6E\u200D\u2642\uFE0F", "Police: Male", ...allPoliceMale);

export const allPoliceFemale = [
    policeFemale,
    policeLightSkinToneFemale,
    policeMediumLightSkinToneFemale,
    policeMediumSkinToneFemale,
    policeMediumDarkSkinToneFemale,
    policeDarkSkinToneFemale
];

export const allPoliceFemaleGroup = new EmojiGroup("\u{1F46E}\uDC6E\u200D\u2640\uFE0F", "Police: Female", ...allPoliceFemale);

export const allCops = [
    allPoliceGroup,
    allPoliceMaleGroup,
    allPoliceFemaleGroup
];

export const allCopsGroup = new EmojiGroup("\u{1F46E}\uDC6E", "Police", ...allCops);

export const allWearingTurban = [
    wearingTurban,
    wearingTurbanLightSkinTone,
    wearingTurbanMediumLightSkinTone,
    wearingTurbanMediumSkinTone,
    wearingTurbanMediumDarkSkinTone,
    wearingTurbanDarkSkinTone
];

export const allWearingTurbanGroup = new EmojiGroup("\u{1F473}\uDC73", "Wearing Turban", ...allWearingTurban);

export const allWearingTurbanMale = [
    wearingTurbanMale,
    wearingTurbanLightSkinToneMale,
    wearingTurbanMediumLightSkinToneMale,
    wearingTurbanMediumSkinToneMale,
    wearingTurbanMediumDarkSkinToneMale,
    wearingTurbanDarkSkinToneMale
];

export const allWearingTurbanMaleGroup = new EmojiGroup("\u{1F473}\uDC73\u200D\u2642\uFE0F", "Wearing Turban: Male", ...allWearingTurbanMale);

export const allWearingTurbanFemale = [
    wearingTurbanFemale,
    wearingTurbanLightSkinToneFemale,
    wearingTurbanMediumLightSkinToneFemale,
    wearingTurbanMediumSkinToneFemale,
    wearingTurbanMediumDarkSkinToneFemale,
    wearingTurbanDarkSkinToneFemale
];

export const allWearingTurbanFemaleGroup = new EmojiGroup("\u{1F473}\uDC73\u200D\u2640\uFE0F", "Wearing Turban: Female", ...allWearingTurbanFemale);

export const allTurbanWearers = [
    allWearingTurbanGroup,
    allWearingTurbanMaleGroup,
    allWearingTurbanFemaleGroup
];

export const allTurbanWearersGroup = new EmojiGroup("\u{1F473}\uDC73", "Wearing Turban", ...allTurbanWearers);

export const allSuperhero = [
    superhero,
    superheroLightSkinTone,
    superheroMediumLightSkinTone,
    superheroMediumSkinTone,
    superheroMediumDarkSkinTone,
    superheroDarkSkinTone
];

export const allSuperheroGroup = new EmojiGroup("\u{1F9B8}\uDDB8", "Superhero", ...allSuperhero);

export const allSuperheroMale = [
    superheroMale,
    superheroLightSkinToneMale,
    superheroMediumLightSkinToneMale,
    superheroMediumSkinToneMale,
    superheroMediumDarkSkinToneMale,
    superheroDarkSkinToneMale
];

export const allSuperheroMaleGroup = new EmojiGroup("\u{1F9B8}\uDDB8\u200D\u2642\uFE0F", "Superhero: Male", ...allSuperheroMale);

export const allSuperheroFemale = [
    superheroFemale,
    superheroLightSkinToneFemale,
    superheroMediumLightSkinToneFemale,
    superheroMediumSkinToneFemale,
    superheroMediumDarkSkinToneFemale,
    superheroDarkSkinToneFemale
];

export const allSuperheroFemaleGroup = new EmojiGroup("\u{1F9B8}\uDDB8\u200D\u2640\uFE0F", "Superhero: Female", ...allSuperheroFemale);

export const allSuperheroes = [
    allSuperheroGroup,
    allSuperheroMaleGroup,
    allSuperheroFemaleGroup
];

export const allSuperheroesGroup = new EmojiGroup("\u{1F9B8}\uDDB8", "Superhero", ...allSuperheroes);

export const allSupervillain = [
    supervillain,
    supervillainLightSkinTone,
    supervillainMediumLightSkinTone,
    supervillainMediumSkinTone,
    supervillainMediumDarkSkinTone,
    supervillainDarkSkinTone
];

export const allSupervillainGroup = new EmojiGroup("\u{1F9B9}\uDDB9", "Supervillain", ...allSupervillain);

export const allSupervillainMale = [
    supervillainMale,
    supervillainLightSkinToneMale,
    supervillainMediumLightSkinToneMale,
    supervillainMediumSkinToneMale,
    supervillainMediumDarkSkinToneMale,
    supervillainDarkSkinToneMale
];

export const allSupervillainMaleGroup = new EmojiGroup("\u{1F9B9}\uDDB9\u200D\u2642\uFE0F", "Supervillain: Male", ...allSupervillainMale);

export const allSupervillainFemale = [
    supervillainFemale,
    supervillainLightSkinToneFemale,
    supervillainMediumLightSkinToneFemale,
    supervillainMediumSkinToneFemale,
    supervillainMediumDarkSkinToneFemale,
    supervillainDarkSkinToneFemale
];

export const allSupervillainFemaleGroup = new EmojiGroup("\u{1F9B9}\uDDB9\u200D\u2640\uFE0F", "Supervillain: Female", ...allSupervillainFemale);

export const allSupervillains = [
    allSupervillainGroup,
    allSupervillainMaleGroup,
    allSupervillainFemaleGroup
];

export const allSupervillainsGroup = new EmojiGroup("\u{1F9B9}\uDDB9", "Supervillain", ...allSupervillains);

export const allMage = [
    mage,
    mageLightSkinTone,
    mageMediumLightSkinTone,
    mageMediumSkinTone,
    mageMediumDarkSkinTone,
    mageDarkSkinTone
];

export const allMageGroup = new EmojiGroup("\u{1F9D9}\uDDD9", "Mage", ...allMage);

export const allMageMale = [
    mageMale,
    mageLightSkinToneMale,
    mageMediumLightSkinToneMale,
    mageMediumSkinToneMale,
    mageMediumDarkSkinToneMale,
    mageDarkSkinToneMale
];

export const allMageMaleGroup = new EmojiGroup("\u{1F9D9}\uDDD9\u200D\u2642\uFE0F", "Mage: Male", ...allMageMale);

export const allMageFemale = [
    mageFemale,
    mageLightSkinToneFemale,
    mageMediumLightSkinToneFemale,
    mageMediumSkinToneFemale,
    mageMediumDarkSkinToneFemale,
    mageDarkSkinToneFemale
];

export const allMageFemaleGroup = new EmojiGroup("\u{1F9D9}\uDDD9\u200D\u2640\uFE0F", "Mage: Female", ...allMageFemale);

export const allMages = [
    allMageGroup,
    allMageMaleGroup,
    allMageFemaleGroup
];

export const allMagesGroup = new EmojiGroup("\u{1F9D9}\uDDD9", "Mage", ...allMages);

export const allFairy = [
    fairy,
    fairyLightSkinTone,
    fairyMediumLightSkinTone,
    fairyMediumSkinTone,
    fairyMediumDarkSkinTone,
    fairyDarkSkinTone
];

export const allFairyGroup = new EmojiGroup("\u{1F9DA}\uDDDA", "Fairy", ...allFairy);

export const allFairyMale = [
    fairyMale,
    fairyLightSkinToneMale,
    fairyMediumLightSkinToneMale,
    fairyMediumSkinToneMale,
    fairyMediumDarkSkinToneMale,
    fairyDarkSkinToneMale
];

export const allFairyMaleGroup = new EmojiGroup("\u{1F9DA}\uDDDA\u200D\u2642\uFE0F", "Fairy: Male", ...allFairyMale);

export const allFairyFemale = [
    fairyFemale,
    fairyLightSkinToneFemale,
    fairyMediumLightSkinToneFemale,
    fairyMediumSkinToneFemale,
    fairyMediumDarkSkinToneFemale,
    fairyDarkSkinToneFemale
];

export const allFairyFemaleGroup = new EmojiGroup("\u{1F9DA}\uDDDA\u200D\u2640\uFE0F", "Fairy: Female", ...allFairyFemale);

export const allFairies = [
    allFairyGroup,
    allFairyMaleGroup,
    allFairyFemaleGroup
];

export const allFairiesGroup = new EmojiGroup("\u{1F9DA}\uDDDA", "Fairy", ...allFairies);

export const allVampire = [
    vampire,
    vampireLightSkinTone,
    vampireMediumLightSkinTone,
    vampireMediumSkinTone,
    vampireMediumDarkSkinTone,
    vampireDarkSkinTone
];

export const allVampireGroup = new EmojiGroup("\u{1F9DB}\uDDDB", "Vampire", ...allVampire);

export const allVampireMale = [
    vampireMale,
    vampireLightSkinToneMale,
    vampireMediumLightSkinToneMale,
    vampireMediumSkinToneMale,
    vampireMediumDarkSkinToneMale,
    vampireDarkSkinToneMale
];

export const allVampireMaleGroup = new EmojiGroup("\u{1F9DB}\uDDDB\u200D\u2642\uFE0F", "Vampire: Male", ...allVampireMale);

export const allVampireFemale = [
    vampireFemale,
    vampireLightSkinToneFemale,
    vampireMediumLightSkinToneFemale,
    vampireMediumSkinToneFemale,
    vampireMediumDarkSkinToneFemale,
    vampireDarkSkinToneFemale
];

export const allVampireFemaleGroup = new EmojiGroup("\u{1F9DB}\uDDDB\u200D\u2640\uFE0F", "Vampire: Female", ...allVampireFemale);

export const allVampires = [
    allVampireGroup,
    allVampireMaleGroup,
    allVampireFemaleGroup
];

export const allVampiresGroup = new EmojiGroup("\u{1F9DB}\uDDDB", "Vampire", ...allVampires);

export const allMerperson = [
    merperson,
    merpersonLightSkinTone,
    merpersonMediumLightSkinTone,
    merpersonMediumSkinTone,
    merpersonMediumDarkSkinTone,
    merpersonDarkSkinTone
];

export const allMerpersonGroup = new EmojiGroup("\u{1F9DC}\uDDDC", "Merperson", ...allMerperson);

export const allMerpersonMale = [
    merpersonMale,
    merpersonLightSkinToneMale,
    merpersonMediumLightSkinToneMale,
    merpersonMediumSkinToneMale,
    merpersonMediumDarkSkinToneMale,
    merpersonDarkSkinToneMale
];

export const allMerpersonMaleGroup = new EmojiGroup("\u{1F9DC}\uDDDC\u200D\u2642\uFE0F", "Merperson: Male", ...allMerpersonMale);

export const allMerpersonFemale = [
    merpersonFemale,
    merpersonLightSkinToneFemale,
    merpersonMediumLightSkinToneFemale,
    merpersonMediumSkinToneFemale,
    merpersonMediumDarkSkinToneFemale,
    merpersonDarkSkinToneFemale
];

export const allMerpersonFemaleGroup = new EmojiGroup("\u{1F9DC}\uDDDC\u200D\u2640\uFE0F", "Merperson: Female", ...allMerpersonFemale);

export const allMerpeople = [
    allMerpersonGroup,
    allMerpersonMaleGroup,
    allMerpersonFemaleGroup
];

export const allMerpeopleGroup = new EmojiGroup("\u{1F9DC}\uDDDC", "Merperson", ...allMerpeople);

export const allElf = [
    elf,
    elfLightSkinTone,
    elfMediumLightSkinTone,
    elfMediumSkinTone,
    elfMediumDarkSkinTone,
    elfDarkSkinTone
];

export const allElfGroup = new EmojiGroup("\u{1F9DD}\uDDDD", "Elf", ...allElf);

export const allElfMale = [
    elfMale,
    elfLightSkinToneMale,
    elfMediumLightSkinToneMale,
    elfMediumSkinToneMale,
    elfMediumDarkSkinToneMale,
    elfDarkSkinToneMale
];

export const allElfMaleGroup = new EmojiGroup("\u{1F9DD}\uDDDD\u200D\u2642\uFE0F", "Elf: Male", ...allElfMale);

export const allElfFemale = [
    elfFemale,
    elfLightSkinToneFemale,
    elfMediumLightSkinToneFemale,
    elfMediumSkinToneFemale,
    elfMediumDarkSkinToneFemale,
    elfDarkSkinToneFemale
];

export const allElfFemaleGroup = new EmojiGroup("\u{1F9DD}\uDDDD\u200D\u2640\uFE0F", "Elf: Female", ...allElfFemale);

export const allElves = [
    allElfGroup,
    allElfMaleGroup,
    allElfFemaleGroup
];

export const allElvesGroup = new EmojiGroup("\u{1F9DD}\uDDDD", "Elf", ...allElves);

export const allWalking = [
    walking,
    walkingLightSkinTone,
    walkingMediumLightSkinTone,
    walkingMediumSkinTone,
    walkingMediumDarkSkinTone,
    walkingDarkSkinTone
];

export const allWalkingGroup = new EmojiGroup("\u{1F6B6}\uDEB6", "Walking", ...allWalking);

export const allWalkingMale = [
    walkingMale,
    walkingLightSkinToneMale,
    walkingMediumLightSkinToneMale,
    walkingMediumSkinToneMale,
    walkingMediumDarkSkinToneMale,
    walkingDarkSkinToneMale
];

export const allWalkingMaleGroup = new EmojiGroup("\u{1F6B6}\uDEB6\u200D\u2642\uFE0F", "Walking: Male", ...allWalkingMale);

export const allWalkingFemale = [
    walkingFemale,
    walkingLightSkinToneFemale,
    walkingMediumLightSkinToneFemale,
    walkingMediumSkinToneFemale,
    walkingMediumDarkSkinToneFemale,
    walkingDarkSkinToneFemale
];

export const allWalkingFemaleGroup = new EmojiGroup("\u{1F6B6}\uDEB6\u200D\u2640\uFE0F", "Walking: Female", ...allWalkingFemale);

export const allWalkers = [
    allWalkingGroup,
    allWalkingMaleGroup,
    allWalkingFemaleGroup
];

export const allWalkersGroup = new EmojiGroup("\u{1F6B6}\uDEB6", "Walking", ...allWalkers);

export const allStanding = [
    standing,
    standingLightSkinTone,
    standingMediumLightSkinTone,
    standingMediumSkinTone,
    standingMediumDarkSkinTone,
    standingDarkSkinTone
];

export const allStandingGroup = new EmojiGroup("\u{1F9CD}\uDDCD", "Standing", ...allStanding);

export const allStandingMale = [
    standingMale,
    standingLightSkinToneMale,
    standingMediumLightSkinToneMale,
    standingMediumSkinToneMale,
    standingMediumDarkSkinToneMale,
    standingDarkSkinToneMale
];

export const allStandingMaleGroup = new EmojiGroup("\u{1F9CD}\uDDCD\u200D\u2642\uFE0F", "Standing: Male", ...allStandingMale);

export const allStandingFemale = [
    standingFemale,
    standingLightSkinToneFemale,
    standingMediumLightSkinToneFemale,
    standingMediumSkinToneFemale,
    standingMediumDarkSkinToneFemale,
    standingDarkSkinToneFemale
];

export const allStandingFemaleGroup = new EmojiGroup("\u{1F9CD}\uDDCD\u200D\u2640\uFE0F", "Standing: Female", ...allStandingFemale);

export const allStanders = [
    allStandingGroup,
    allStandingMaleGroup,
    allStandingFemaleGroup
];

export const allStandersGroup = new EmojiGroup("\u{1F9CD}\uDDCD", "Standing", ...allStanders);

export const allKneeling = [
    kneeling,
    kneelingLightSkinTone,
    kneelingMediumLightSkinTone,
    kneelingMediumSkinTone,
    kneelingMediumDarkSkinTone,
    kneelingDarkSkinTone
];

export const allKneelingGroup = new EmojiGroup("\u{1F9CE}\uDDCE", "Kneeling", ...allKneeling);

export const allKneelingMale = [
    kneelingMale,
    kneelingLightSkinToneMale,
    kneelingMediumLightSkinToneMale,
    kneelingMediumSkinToneMale,
    kneelingMediumDarkSkinToneMale,
    kneelingDarkSkinToneMale
];

export const allKneelingMaleGroup = new EmojiGroup("\u{1F9CE}\uDDCE\u200D\u2642\uFE0F", "Kneeling: Male", ...allKneelingMale);

export const allKneelingFemale = [
    kneelingFemale,
    kneelingLightSkinToneFemale,
    kneelingMediumLightSkinToneFemale,
    kneelingMediumSkinToneFemale,
    kneelingMediumDarkSkinToneFemale,
    kneelingDarkSkinToneFemale
];

export const allKneelingFemaleGroup = new EmojiGroup("\u{1F9CE}\uDDCE\u200D\u2640\uFE0F", "Kneeling: Female", ...allKneelingFemale);

export const allKneelers = [
    allKneelingGroup,
    allKneelingMaleGroup,
    allKneelingFemaleGroup
];

export const allKneelersGroup = new EmojiGroup("\u{1F9CE}\uDDCE", "Kneeling", ...allKneelers);

export const allRunning = [
    running,
    runningLightSkinTone,
    runningMediumLightSkinTone,
    runningMediumSkinTone,
    runningMediumDarkSkinTone,
    runningDarkSkinTone
];

export const allRunningGroup = new EmojiGroup("\u{1F3C3}\uDFC3", "Running", ...allRunning);

export const allRunningMale = [
    runningMale,
    runningLightSkinToneMale,
    runningMediumLightSkinToneMale,
    runningMediumSkinToneMale,
    runningMediumDarkSkinToneMale,
    runningDarkSkinToneMale
];

export const allRunningMaleGroup = new EmojiGroup("\u{1F3C3}\uDFC3\u200D\u2642\uFE0F", "Running: Male", ...allRunningMale);

export const allRunningFemale = [
    runningFemale,
    runningLightSkinToneFemale,
    runningMediumLightSkinToneFemale,
    runningMediumSkinToneFemale,
    runningMediumDarkSkinToneFemale,
    runningDarkSkinToneFemale
];

export const allRunningFemaleGroup = new EmojiGroup("\u{1F3C3}\uDFC3\u200D\u2640\uFE0F", "Running: Female", ...allRunningFemale);

export const allRunners = [
    allRunningGroup,
    allRunningMaleGroup,
    allRunningFemaleGroup
];

export const allRunnersGroup = new EmojiGroup("\u{1F3C3}\uDFC3", "Running", ...allRunners);

export const allGesturing = [
    allFrownersGroup,
    allPoutersGroup,
    allNoGuesturerersGroupGroup,
    allOKGesturerersGroupGroup,
    allHandTippersGroupGroup,
    allHandRaisersGroup,
    allBowersGroup,
    allFacepalmersGroup,
    allShruggersGroup,
    allCantHearersGroup,
    allGettingMassagedGroup,
    allHairCuttersGroup
];

export const allGesturingGroup = new EmojiGroup("\u0047\u0065\u0073\u0074\u0075\u0072\u0065\u0073", "Gestures", ...allGesturing);

export const allBaby = [
    baby,
    babyLightSkinTone,
    babyMediumLightSkinTone,
    babyMediumSkinTone,
    babyMediumDarkSkinTone,
    babyDarkSkinTone
];

export const allBabyGroup = new EmojiGroup("\u{1F476}\uDC76", "Baby", ...allBaby);

export const allChild = [
    child,
    childLightSkinTone,
    childMediumLightSkinTone,
    childMediumSkinTone,
    childMediumDarkSkinTone,
    childDarkSkinTone
];

export const allChildGroup = new EmojiGroup("\u{1F9D2}\uDDD2", "Child", ...allChild);

export const allBoy = [
    boy,
    boyLightSkinTone,
    boyMediumLightSkinTone,
    boyMediumSkinTone,
    boyMediumDarkSkinTone,
    boyDarkSkinTone
];

export const allBoyGroup = new EmojiGroup("\u{1F466}\uDC66", "Boy", ...allBoy);

export const allGirl = [
    girl,
    girlLightSkinTone,
    girlMediumLightSkinTone,
    girlMediumSkinTone,
    girlMediumDarkSkinTone,
    girlDarkSkinTone
];

export const allGirlGroup = new EmojiGroup("\u{1F467}\uDC67", "Girl", ...allGirl);

export const allChildren = [
    allChildGroup,
    allBoyGroup,
    allGirlGroup
];

export const allChildrenGroup = new EmojiGroup("\u{1F9D2}\uDDD2", "Child", ...allChildren);

export const allBlondPerson = [
    blondPerson,
    blondPersonLightSkinTone,
    blondPersonMediumLightSkinTone,
    blondPersonMediumSkinTone,
    blondPersonMediumDarkSkinTone,
    blondPersonDarkSkinTone
];

export const allBlondPersonGroup = new EmojiGroup("\u{1F471}\uDC71", "Blond Person", ...allBlondPerson);

export const allBlondPersonMale = [
    blondPersonMale,
    blondPersonLightSkinToneMale,
    blondPersonMediumLightSkinToneMale,
    blondPersonMediumSkinToneMale,
    blondPersonMediumDarkSkinToneMale,
    blondPersonDarkSkinToneMale
];

export const allBlondPersonMaleGroup = new EmojiGroup("\u{1F471}\uDC71\u200D\u2642\uFE0F", "Blond Person: Male", ...allBlondPersonMale);

export const allBlondPersonFemale = [
    blondPersonFemale,
    blondPersonLightSkinToneFemale,
    blondPersonMediumLightSkinToneFemale,
    blondPersonMediumSkinToneFemale,
    blondPersonMediumDarkSkinToneFemale,
    blondPersonDarkSkinToneFemale
];

export const allBlondPersonFemaleGroup = new EmojiGroup("\u{1F471}\uDC71\u200D\u2640\uFE0F", "Blond Person: Female", ...allBlondPersonFemale);

export const allBlondePeople = [
    allBlondPersonGroup,
    allBlondPersonMaleGroup,
    allBlondPersonFemaleGroup
];

export const allBlondePeopleGroup = new EmojiGroup("\u{1F471}\uDC71", "Blond Person", ...allBlondePeople);

export const allPerson = [
    person,
    personLightSkinTone,
    personMediumLightSkinTone,
    personMediumSkinTone,
    personMediumDarkSkinTone,
    personDarkSkinTone,
    allBlondPersonGroup,
    allWearingTurbanGroup
];

export const allPersonGroup = new EmojiGroup("\u{1F9D1}\uDDD1", "Person", ...allPerson);

export const allBeardedMan = [
    beardedMan,
    beardedManLightSkinTone,
    beardedManMediumLightSkinTone,
    beardedManMediumSkinTone,
    beardedManMediumDarkSkinTone,
    beardedManDarkSkinTone
];

export const allBeardedManGroup = new EmojiGroup("\u{1F9D4}\uDDD4", "Bearded Man", ...allBeardedMan);

export const allManWithChineseCap = [
    manWithChineseCap,
    manWithChineseCapLightSkinTone,
    manWithChineseCapMediumLightSkinTone,
    manWithChineseCapMediumSkinTone,
    manWithChineseCapMediumDarkSkinTone,
    manWithChineseCapDarkSkinTone
];

export const allManWithChineseCapGroup = new EmojiGroup("\u{1F472}\uDC72", "Man With Chinese Cap", ...allManWithChineseCap);

export const allManInTuxedo = [
    manInTuxedo,
    manInTuxedoLightSkinTone,
    manInTuxedoMediumLightSkinTone,
    manInTuxedoMediumSkinTone,
    manInTuxedoMediumDarkSkinTone,
    manInTuxedoDarkSkinTone
];

export const allManInTuxedoGroup = new EmojiGroup("\u{1F935}\uDD35", "Man in Tuxedo", ...allManInTuxedo);

export const allMan = [
    man,
    manLightSkinTone,
    manMediumLightSkinTone,
    manMediumSkinTone,
    manMediumDarkSkinTone,
    manDarkSkinTone
];

export const allManGroup = new EmojiGroup("\u{1F468}\uDC68", "Man", ...allMan);

export const allManRedHair = [
    manRedHair,
    manLightSkinToneRedHair,
    manMediumLightSkinToneRedHair,
    manMediumSkinToneRedHair,
    manMediumDarkSkinToneRedHair,
    manDarkSkinToneRedHair
];

export const allManRedHairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B0}\uDDB0", "Man: Red Hair", ...allManRedHair);

export const allManCurlyHair = [
    manCurlyHair,
    manLightSkinToneCurlyHair,
    manMediumLightSkinToneCurlyHair,
    manMediumSkinToneCurlyHair,
    manMediumDarkSkinToneCurlyHair,
    manDarkSkinToneCurlyHair
];

export const allManCurlyHairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B1}\uDDB1", "Man: Curly Hair", ...allManCurlyHair);

export const allManWhiteHair = [
    manWhiteHair,
    manLightSkinToneWhiteHair,
    manMediumLightSkinToneWhiteHair,
    manMediumSkinToneWhiteHair,
    manMediumDarkSkinToneWhiteHair,
    manDarkSkinToneWhiteHair
];

export const allManWhiteHairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B3}\uDDB3", "Man: White Hair", ...allManWhiteHair);

export const allManBald = [
    manBald,
    manLightSkinToneBald,
    manMediumLightSkinToneBald,
    manMediumSkinToneBald,
    manMediumDarkSkinToneBald,
    manDarkSkinToneBald
];

export const allManBaldGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B2}\uDDB2", "Man: Bald", ...allManBald);

export const allMen = [
    allManGroup,
    allManRedHairGroup,
    allManCurlyHairGroup,
    allManWhiteHairGroup,
    allManBaldGroup,
    allBlondPersonMaleGroup,
    allBeardedManGroup,
    manInSuitLevitating,
    allManWithChineseCapGroup,
    allWearingTurbanMaleGroup,
    allManInTuxedoGroup
];

export const allMenGroup = new EmojiGroup("\u{1F468}\uDC68", "Man", ...allMen);

export const allPregnantWoman = [
    pregnantWoman,
    pregnantWomanLightSkinTone,
    pregnantWomanMediumLightSkinTone,
    pregnantWomanMediumSkinTone,
    pregnantWomanMediumDarkSkinTone,
    pregnantWomanDarkSkinTone
];

export const allPregnantWomanGroup = new EmojiGroup("\u{1F930}\uDD30", "Pregnant Woman", ...allPregnantWoman);

export const allBreastFeeding = [
    breastFeeding,
    breastFeedingLightSkinTone,
    breastFeedingMediumLightSkinTone,
    breastFeedingMediumSkinTone,
    breastFeedingMediumDarkSkinTone,
    breastFeedingDarkSkinTone
];

export const allBreastFeedingGroup = new EmojiGroup("\u{1F931}\uDD31", "Breast-Feeding", ...allBreastFeeding);

export const allWomanWithHeadscarf = [
    womanWithHeadscarf,
    womanWithHeadscarfLightSkinTone,
    womanWithHeadscarfMediumLightSkinTone,
    womanWithHeadscarfMediumSkinTone,
    womanWithHeadscarfMediumDarkSkinTone,
    womanWithHeadscarfDarkSkinTone
];

export const allWomanWithHeadscarfGroup = new EmojiGroup("\u{1F9D5}\uDDD5", "Woman With Headscarf", ...allWomanWithHeadscarf);

export const allBrideWithVeil = [
    brideWithVeil,
    brideWithVeilLightSkinTone,
    brideWithVeilMediumLightSkinTone,
    brideWithVeilMediumSkinTone,
    brideWithVeilMediumDarkSkinTone,
    brideWithVeilDarkSkinTone
];

export const allBrideWithVeilGroup = new EmojiGroup("\u{1F470}\uDC70", "Bride With Veil", ...allBrideWithVeil);

export const allWoman = [
    woman,
    womanLightSkinTone,
    womanMediumLightSkinTone,
    womanMediumSkinTone,
    womanMediumDarkSkinTone,
    womanDarkSkinTone
];

export const allWomanGroup = new EmojiGroup("\u{1F469}\uDC69", "Woman", ...allWoman);

export const allWomanRedHair = [
    womanRedHair,
    womanLightSkinToneRedHair,
    womanMediumLightSkinToneRedHair,
    womanMediumSkinToneRedHair,
    womanMediumDarkSkinToneRedHair,
    womanDarkSkinToneRedHair
];

export const allWomanRedHairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B0}\uDDB0", "Woman: Red Hair", ...allWomanRedHair);

export const allWomanCurlyHair = [
    womanCurlyHair,
    womanLightSkinToneCurlyHair,
    womanMediumLightSkinToneCurlyHair,
    womanMediumSkinToneCurlyHair,
    womanMediumDarkSkinToneCurlyHair,
    womanDarkSkinToneCurlyHair
];

export const allWomanCurlyHairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B1}\uDDB1", "Woman: Curly Hair", ...allWomanCurlyHair);

export const allWomanWhiteHair = [
    womanWhiteHair,
    womanLightSkinToneWhiteHair,
    womanMediumLightSkinToneWhiteHair,
    womanMediumSkinToneWhiteHair,
    womanMediumDarkSkinToneWhiteHair,
    womanDarkSkinToneWhiteHair
];

export const allWomanWhiteHairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B3}\uDDB3", "Woman: White Hair", ...allWomanWhiteHair);

export const allWomanBald = [
    womanBald,
    womanLightSkinToneBald,
    womanMediumLightSkinToneBald,
    womanMediumSkinToneBald,
    womanMediumDarkSkinToneBald,
    womanDarkSkinToneBald
];

export const allWomanBaldGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B2}\uDDB2", "Woman: Bald", ...allWomanBald);

export const allWomen = [
    allWomanGroup,
    allWomanRedHairGroup,
    allWomanCurlyHairGroup,
    allWomanWhiteHairGroup,
    allWomanBaldGroup,
    allBlondPersonFemaleGroup,
    allPregnantWomanGroup,
    allBreastFeedingGroup,
    allWomanWithHeadscarfGroup,
    allWearingTurbanFemaleGroup,
    allBrideWithVeilGroup
];

export const allWomenGroup = new EmojiGroup("\u{1F469}\uDC69", "Woman", ...allWomen);

export const allPersons = [
    allPersonGroup,
    allMenGroup,
    allWomenGroup
];

export const allPersonsGroup = new EmojiGroup("\u{1F9D1}\uDDD1", "Adult", ...allPersons);

export const allOlderPerson = [
    olderPerson,
    olderPersonLightSkinTone,
    olderPersonMediumLightSkinTone,
    olderPersonMediumSkinTone,
    olderPersonMediumDarkSkinTone,
    olderPersonDarkSkinTone
];

export const allOlderPersonGroup = new EmojiGroup("\u{1F9D3}\uDDD3", "Older Person", ...allOlderPerson);

export const allOldMan = [
    oldMan,
    oldManLightSkinTone,
    oldManMediumLightSkinTone,
    oldManMediumSkinTone,
    oldManMediumDarkSkinTone,
    oldManDarkSkinTone
];

export const allOldManGroup = new EmojiGroup("\u{1F474}\uDC74", "Old Man", ...allOldMan);

export const allOldWoman = [
    oldWoman,
    oldWomanLightSkinTone,
    oldWomanMediumLightSkinTone,
    oldWomanMediumSkinTone,
    oldWomanMediumDarkSkinTone,
    oldWomanDarkSkinTone
];

export const allOldWomanGroup = new EmojiGroup("\u{1F475}\uDC75", "Old Woman", ...allOldWoman);

export const allOlderPersons = [
    allOlderPersonGroup,
    allOldManGroup,
    allOldWomanGroup
];

export const allOlderPersonsGroup = new EmojiGroup("\u{1F9D3}\uDDD3", "Older Person", ...allOlderPersons);

export const allManHealthCare = [
    manHealthCare,
    manLightSkinToneHealthCare,
    manMediumLightSkinToneHealthCare,
    manMediumSkinToneHealthCare,
    manMediumDarkSkinToneHealthCare,
    manDarkSkinToneHealthCare
];

export const allManHealthCareGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u2695\uFE0F", "Man: Health Care", ...allManHealthCare);

export const allWomanHealthCare = [
    womanHealthCare,
    womanLightSkinToneHealthCare,
    womanMediumLightSkinToneHealthCare,
    womanMediumSkinToneHealthCare,
    womanMediumDarkSkinToneHealthCare,
    womanDarkSkinToneHealthCare
];

export const allWomanHealthCareGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u2695\uFE0F", "Woman: Health Care", ...allWomanHealthCare);

export const allMedical = [
    medical,
    allManHealthCareGroup,
    allWomanHealthCareGroup
];

export const allMedicalGroup = new EmojiGroup("\u2695\uFE0F", "Medical", ...allMedical);

export const allManStudent = [
    manStudent,
    manLightSkinToneStudent,
    manMediumLightSkinToneStudent,
    manMediumSkinToneStudent,
    manMediumDarkSkinToneStudent,
    manDarkSkinToneStudent
];

export const allManStudentGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F393}\uDF93", "Man: Student", ...allManStudent);

export const allWomanStudent = [
    womanStudent,
    womanLightSkinToneStudent,
    womanMediumLightSkinToneStudent,
    womanMediumSkinToneStudent,
    womanMediumDarkSkinToneStudent,
    womanDarkSkinToneStudent
];

export const allWomanStudentGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F393}\uDF93", "Woman: Student", ...allWomanStudent);

export const allGraduationCap = [
    graduationCap,
    allManStudentGroup,
    allWomanStudentGroup
];

export const allGraduationCapGroup = new EmojiGroup("\u{1F393}\uDF93", "Graduation Cap", ...allGraduationCap);

export const allManTeacher = [
    manTeacher,
    manLightSkinToneTeacher,
    manMediumLightSkinToneTeacher,
    manMediumSkinToneTeacher,
    manMediumDarkSkinToneTeacher,
    manDarkSkinToneTeacher
];

export const allManTeacherGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3EB}\uDFEB", "Man: Teacher", ...allManTeacher);

export const allWomanTeacher = [
    womanTeacher,
    womanLightSkinToneTeacher,
    womanMediumLightSkinToneTeacher,
    womanMediumSkinToneTeacher,
    womanMediumDarkSkinToneTeacher,
    womanDarkSkinToneTeacher
];

export const allWomanTeacherGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3EB}\uDFEB", "Woman: Teacher", ...allWomanTeacher);

export const allSchool = [
    school,
    allManTeacherGroup,
    allWomanTeacherGroup
];

export const allSchoolGroup = new EmojiGroup("\u{1F3EB}\uDFEB", "School", ...allSchool);

export const allManJudge = [
    manJudge,
    manLightSkinToneJudge,
    manMediumLightSkinToneJudge,
    manMediumSkinToneJudge,
    manMediumDarkSkinToneJudge,
    manDarkSkinToneJudge
];

export const allManJudgeGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u2696\uFE0F", "Man: Judge", ...allManJudge);

export const allWomanJudge = [
    womanJudge,
    womanLightSkinToneJudge,
    womanMediumLightSkinToneJudge,
    womanMediumSkinToneJudge,
    womanMediumDarkSkinToneJudge,
    womanDarkSkinToneJudge
];

export const allWomanJudgeGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u2696\uFE0F", "Woman: Judge", ...allWomanJudge);

export const allBalanceScale = [
    balanceScale,
    allManJudgeGroup,
    allWomanJudgeGroup
];

export const allBalanceScaleGroup = new EmojiGroup("\u2696\uFE0F", "Balance Scale", ...allBalanceScale);

export const allManFarmer = [
    manFarmer,
    manLightSkinToneFarmer,
    manMediumLightSkinToneFarmer,
    manMediumSkinToneFarmer,
    manMediumDarkSkinToneFarmer,
    manDarkSkinToneFarmer
];

export const allManFarmerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F33E}\uDF3E", "Man: Farmer", ...allManFarmer);

export const allWomanFarmer = [
    womanFarmer,
    womanLightSkinToneFarmer,
    womanMediumLightSkinToneFarmer,
    womanMediumSkinToneFarmer,
    womanMediumDarkSkinToneFarmer,
    womanDarkSkinToneFarmer
];

export const allWomanFarmerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F33E}\uDF3E", "Woman: Farmer", ...allWomanFarmer);

export const allSheafOfRice = [
    sheafOfRice,
    allManFarmerGroup,
    allWomanFarmerGroup
];

export const allSheafOfRiceGroup = new EmojiGroup("\u{1F33E}\uDF3E", "Sheaf of Rice", ...allSheafOfRice);

export const allManCook = [
    manCook,
    manLightSkinToneCook,
    manMediumLightSkinToneCook,
    manMediumSkinToneCook,
    manMediumDarkSkinToneCook,
    manDarkSkinToneCook
];

export const allManCookGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F373}\uDF73", "Man: Cook", ...allManCook);

export const allWomanCook = [
    womanCook,
    womanLightSkinToneCook,
    womanMediumLightSkinToneCook,
    womanMediumSkinToneCook,
    womanMediumDarkSkinToneCook,
    womanDarkSkinToneCook
];

export const allWomanCookGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F373}\uDF73", "Woman: Cook", ...allWomanCook);

export const allCooking = [
    cooking,
    allManCookGroup,
    allWomanCookGroup
];

export const allCookingGroup = new EmojiGroup("\u{1F373}\uDF73", "Cooking", ...allCooking);

export const allManMechanic = [
    manMechanic,
    manLightSkinToneMechanic,
    manMediumLightSkinToneMechanic,
    manMediumSkinToneMechanic,
    manMediumDarkSkinToneMechanic,
    manDarkSkinToneMechanic
];

export const allManMechanicGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F527}\uDD27", "Man: Mechanic", ...allManMechanic);

export const allWomanMechanic = [
    womanMechanic,
    womanLightSkinToneMechanic,
    womanMediumLightSkinToneMechanic,
    womanMediumSkinToneMechanic,
    womanMediumDarkSkinToneMechanic,
    womanDarkSkinToneMechanic
];

export const allWomanMechanicGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F527}\uDD27", "Woman: Mechanic", ...allWomanMechanic);

export const allWrench = [
    wrench,
    allManMechanicGroup,
    allWomanMechanicGroup
];

export const allWrenchGroup = new EmojiGroup("\u{1F527}\uDD27", "Wrench", ...allWrench);

export const allManFactoryWorker = [
    manFactoryWorker,
    manLightSkinToneFactoryWorker,
    manMediumLightSkinToneFactoryWorker,
    manMediumSkinToneFactoryWorker,
    manMediumDarkSkinToneFactoryWorker,
    manDarkSkinToneFactoryWorker
];

export const allManFactoryWorkerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3ED}\uDFED", "Man: Factory Worker", ...allManFactoryWorker);

export const allWomanFactoryWorker = [
    womanFactoryWorker,
    womanLightSkinToneFactoryWorker,
    womanMediumLightSkinToneFactoryWorker,
    womanMediumSkinToneFactoryWorker,
    womanMediumDarkSkinToneFactoryWorker,
    womanDarkSkinToneFactoryWorker
];

export const allWomanFactoryWorkerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3ED}\uDFED", "Woman: Factory Worker", ...allWomanFactoryWorker);

export const allFactory = [
    factory,
    allManFactoryWorkerGroup,
    allWomanFactoryWorkerGroup
];

export const allFactoryGroup = new EmojiGroup("\u{1F3ED}\uDFED", "Factory", ...allFactory);

export const allManOfficeWorker = [
    manOfficeWorker,
    manLightSkinToneOfficeWorker,
    manMediumLightSkinToneOfficeWorker,
    manMediumSkinToneOfficeWorker,
    manMediumDarkSkinToneOfficeWorker,
    manDarkSkinToneOfficeWorker
];

export const allManOfficeWorkerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F4BC}\uDCBC", "Man: Office Worker", ...allManOfficeWorker);

export const allWomanOfficeWorker = [
    womanOfficeWorker,
    womanLightSkinToneOfficeWorker,
    womanMediumLightSkinToneOfficeWorker,
    womanMediumSkinToneOfficeWorker,
    womanMediumDarkSkinToneOfficeWorker,
    womanDarkSkinToneOfficeWorker
];

export const allWomanOfficeWorkerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F4BC}\uDCBC", "Woman: Office Worker", ...allWomanOfficeWorker);

export const allBriefcase = [
    briefcase,
    allManOfficeWorkerGroup,
    allWomanOfficeWorkerGroup
];

export const allBriefcaseGroup = new EmojiGroup("\u{1F4BC}\uDCBC", "Briefcase", ...allBriefcase);

export const allManFireFighter = [
    manFireFighter,
    manLightSkinToneFireFighter,
    manMediumLightSkinToneFireFighter,
    manMediumSkinToneFireFighter,
    manMediumDarkSkinToneFireFighter,
    manDarkSkinToneFireFighter
];

export const allManFireFighterGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F692}\uDE92", "Man: Fire Fighter", ...allManFireFighter);

export const allWomanFireFighter = [
    womanFireFighter,
    womanLightSkinToneFireFighter,
    womanMediumLightSkinToneFireFighter,
    womanMediumSkinToneFireFighter,
    womanMediumDarkSkinToneFireFighter,
    womanDarkSkinToneFireFighter
];

export const allWomanFireFighterGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F692}\uDE92", "Woman: Fire Fighter", ...allWomanFireFighter);

export const allFireEngine = [
    fireEngine,
    allManFireFighterGroup,
    allWomanFireFighterGroup
];

export const allFireEngineGroup = new EmojiGroup("\u{1F692}\uDE92", "Fire Engine", ...allFireEngine);

export const allManAstronaut = [
    manAstronaut,
    manLightSkinToneAstronaut,
    manMediumLightSkinToneAstronaut,
    manMediumSkinToneAstronaut,
    manMediumDarkSkinToneAstronaut,
    manDarkSkinToneAstronaut
];

export const allManAstronautGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F680}\uDE80", "Man: Astronaut", ...allManAstronaut);

export const allWomanAstronaut = [
    womanAstronaut,
    womanLightSkinToneAstronaut,
    womanMediumLightSkinToneAstronaut,
    womanMediumSkinToneAstronaut,
    womanMediumDarkSkinToneAstronaut,
    womanDarkSkinToneAstronaut
];

export const allWomanAstronautGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F680}\uDE80", "Woman: Astronaut", ...allWomanAstronaut);

export const allRocket = [
    rocket,
    allManAstronautGroup,
    allWomanAstronautGroup
];

export const allRocketGroup = new EmojiGroup("\u{1F680}\uDE80", "Rocket", ...allRocket);

export const allManPilot = [
    manPilot,
    manLightSkinTonePilot,
    manMediumLightSkinTonePilot,
    manMediumSkinTonePilot,
    manMediumDarkSkinTonePilot,
    manDarkSkinTonePilot
];

export const allManPilotGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u2708\uFE0F", "Man: Pilot", ...allManPilot);

export const allWomanPilot = [
    womanPilot,
    womanLightSkinTonePilot,
    womanMediumLightSkinTonePilot,
    womanMediumSkinTonePilot,
    womanMediumDarkSkinTonePilot,
    womanDarkSkinTonePilot
];

export const allWomanPilotGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u2708\uFE0F", "Woman: Pilot", ...allWomanPilot);

export const allAirplane = [
    airplane,
    allManPilotGroup,
    allWomanPilotGroup
];

export const allAirplaneGroup = new EmojiGroup("\u2708\uFE0F", "Airplane", ...allAirplane);

export const allManArtist = [
    manArtist,
    manLightSkinToneArtist,
    manMediumLightSkinToneArtist,
    manMediumSkinToneArtist,
    manMediumDarkSkinToneArtist,
    manDarkSkinToneArtist
];

export const allManArtistGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3A8}\uDFA8", "Man: Artist", ...allManArtist);

export const allWomanArtist = [
    womanArtist,
    womanLightSkinToneArtist,
    womanMediumLightSkinToneArtist,
    womanMediumSkinToneArtist,
    womanMediumDarkSkinToneArtist,
    womanDarkSkinToneArtist
];

export const allWomanArtistGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3A8}\uDFA8", "Woman: Artist", ...allWomanArtist);

export const allArtistPalette = [
    artistPalette,
    allManArtistGroup,
    allWomanArtistGroup
];

export const allArtistPaletteGroup = new EmojiGroup("\u{1F3A8}\uDFA8", "Artist Palette", ...allArtistPalette);

export const allManSinger = [
    manSinger,
    manLightSkinToneSinger,
    manMediumLightSkinToneSinger,
    manMediumSkinToneSinger,
    manMediumDarkSkinToneSinger,
    manDarkSkinToneSinger
];

export const allManSingerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3A4}\uDFA4", "Man: Singer", ...allManSinger);

export const allWomanSinger = [
    womanSinger,
    womanLightSkinToneSinger,
    womanMediumLightSkinToneSinger,
    womanMediumSkinToneSinger,
    womanMediumDarkSkinToneSinger,
    womanDarkSkinToneSinger
];

export const allWomanSingerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3A4}\uDFA4", "Woman: Singer", ...allWomanSinger);

export const allMicrophone = [
    microphone,
    allManSingerGroup,
    allWomanSingerGroup
];

export const allMicrophoneGroup = new EmojiGroup("\u{1F3A4}\uDFA4", "Microphone", ...allMicrophone);

export const allManTechnologist = [
    manTechnologist,
    manLightSkinToneTechnologist,
    manMediumLightSkinToneTechnologist,
    manMediumSkinToneTechnologist,
    manMediumDarkSkinToneTechnologist,
    manDarkSkinToneTechnologist
];

export const allManTechnologistGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F4BB}\uDCBB", "Man: Technologist", ...allManTechnologist);

export const allWomanTechnologist = [
    womanTechnologist,
    womanLightSkinToneTechnologist,
    womanMediumLightSkinToneTechnologist,
    womanMediumSkinToneTechnologist,
    womanMediumDarkSkinToneTechnologist,
    womanDarkSkinToneTechnologist
];

export const allWomanTechnologistGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F4BB}\uDCBB", "Woman: Technologist", ...allWomanTechnologist);

export const allLaptop = [
    laptop,
    allManTechnologistGroup,
    allWomanTechnologistGroup
];

export const allLaptopGroup = new EmojiGroup("\u{1F4BB}\uDCBB", "Laptop", ...allLaptop);

export const allManScientist = [
    manScientist,
    manLightSkinToneScientist,
    manMediumLightSkinToneScientist,
    manMediumSkinToneScientist,
    manMediumDarkSkinToneScientist,
    manDarkSkinToneScientist
];

export const allManScientistGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F52C}\uDD2C", "Man: Scientist", ...allManScientist);

export const allWomanScientist = [
    womanScientist,
    womanLightSkinToneScientist,
    womanMediumLightSkinToneScientist,
    womanMediumSkinToneScientist,
    womanMediumDarkSkinToneScientist,
    womanDarkSkinToneScientist
];

export const allWomanScientistGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F52C}\uDD2C", "Woman: Scientist", ...allWomanScientist);

export const allMicroscope = [
    microscope,
    allManScientistGroup,
    allWomanScientistGroup
];

export const allMicroscopeGroup = new EmojiGroup("\u{1F52C}\uDD2C", "Microscope", ...allMicroscope);

export const allPrince = [
    prince,
    princeLightSkinTone,
    princeMediumLightSkinTone,
    princeMediumSkinTone,
    princeMediumDarkSkinTone,
    princeDarkSkinTone
];

export const allPrinceGroup = new EmojiGroup("\u{1F934}\uDD34", "Prince", ...allPrince);

export const allPrincess = [
    princess,
    princessLightSkinTone,
    princessMediumLightSkinTone,
    princessMediumSkinTone,
    princessMediumDarkSkinTone,
    princessDarkSkinTone
];

export const allPrincessGroup = new EmojiGroup("\u{1F478}\uDC78", "Princess", ...allPrincess);

export const allRoyalty = [
    crown,
    allPrinceGroup,
    allPrincessGroup
];

export const allRoyaltyGroup = new EmojiGroup("\u{1F451}\uDC51", "Crown", ...allRoyalty);

export const allOccupation = [
    allMedicalGroup,
    allGraduationCapGroup,
    allSchoolGroup,
    allBalanceScaleGroup,
    allSheafOfRiceGroup,
    allCookingGroup,
    allWrenchGroup,
    allFactoryGroup,
    allBriefcaseGroup,
    allMicroscopeGroup,
    allLaptopGroup,
    allMicrophoneGroup,
    allArtistPaletteGroup,
    allAirplaneGroup,
    allRocketGroup,
    allFireEngineGroup,
    allSpiesGroup,
    allGuardsGroup,
    allConstructionWorkersGroup,
    allRoyaltyGroup
];

export const allOccupationGroup = new EmojiGroup("\u0052\u006F\u006C\u0065\u0073", "Depictions of people working", ...allOccupation);

export const allCherub = [
    cherub,
    cherubLightSkinTone,
    cherubMediumLightSkinTone,
    cherubMediumSkinTone,
    cherubMediumDarkSkinTone,
    cherubDarkSkinTone
];

export const allCherubGroup = new EmojiGroup("\u{1F47C}\uDC7C", "Cherub", ...allCherub);

export const allSantaClaus = [
    santaClaus,
    santaClausLightSkinTone,
    santaClausMediumLightSkinTone,
    santaClausMediumSkinTone,
    santaClausMediumDarkSkinTone,
    santaClausDarkSkinTone
];

export const allSantaClausGroup = new EmojiGroup("\u{1F385}\uDF85", "Santa Claus", ...allSantaClaus);

export const allMrsClaus = [
    mrsClaus,
    mrsClausLightSkinTone,
    mrsClausMediumLightSkinTone,
    mrsClausMediumSkinTone,
    mrsClausMediumDarkSkinTone,
    mrsClausDarkSkinTone
];

export const allMrsClausGroup = new EmojiGroup("\u{1F936}\uDD36", "Mrs. Claus", ...allMrsClaus);

export const allGenie = [
    genie,
    genieMale,
    genieFemale
];

export const allGenieGroup = new EmojiGroup("\u{1F9DE}\uDDDE", "Genie", ...allGenie);

export const allZombie = [
    zombie,
    zombieMale,
    zombieFemale
];

export const allZombieGroup = new EmojiGroup("\u{1F9DF}\uDDDF", "Zombie", ...allZombie);

export const allFantasy = [
    allCherubGroup,
    allSantaClausGroup,
    allMrsClausGroup,
    allSuperheroesGroup,
    allSupervillainsGroup,
    allMagesGroup,
    allFairiesGroup,
    allVampiresGroup,
    allMerpeopleGroup,
    allElvesGroup,
    allGenieGroup,
    allZombieGroup
];

export const allFantasyGroup = new EmojiGroup("\u0046\u0061\u006E\u0074\u0061\u0073\u0079", "Depictions of fantasy characters", ...allFantasy);

export const allManProbing = [
    manProbing,
    manLightSkinToneProbing,
    manMediumLightSkinToneProbing,
    manMediumSkinToneProbing,
    manMediumDarkSkinToneProbing,
    manDarkSkinToneProbing
];

export const allManProbingGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9AF}\uDDAF", "Man: Probing", ...allManProbing);

export const allWomanProbing = [
    womanProbing,
    womanLightSkinToneProbing,
    womanMediumLightSkinToneProbing,
    womanMediumSkinToneProbing,
    womanMediumDarkSkinToneProbing,
    womanDarkSkinToneProbing
];

export const allWomanProbingGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9AF}\uDDAF", "Woman: Probing", ...allWomanProbing);

export const allProbingCane = [
    probingCane,
    allManProbingGroup,
    allWomanProbingGroup
];

export const allProbingCaneGroup = new EmojiGroup("\u{1F9AF}\uDDAF", "Probing Cane", ...allProbingCane);

export const allManInMotorizedWheelchair = [
    manInMotorizedWheelchair,
    manLightSkinToneInMotorizedWheelchair,
    manMediumLightSkinToneInMotorizedWheelchair,
    manMediumSkinToneInMotorizedWheelchair,
    manMediumDarkSkinToneInMotorizedWheelchair,
    manDarkSkinToneInMotorizedWheelchair
];

export const allManInMotorizedWheelchairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9BC}\uDDBC", "Man: In Motorized Wheelchair", ...allManInMotorizedWheelchair);

export const allWomanInMotorizedWheelchair = [
    womanInMotorizedWheelchair,
    womanLightSkinToneInMotorizedWheelchair,
    womanMediumLightSkinToneInMotorizedWheelchair,
    womanMediumSkinToneInMotorizedWheelchair,
    womanMediumDarkSkinToneInMotorizedWheelchair,
    womanDarkSkinToneInMotorizedWheelchair
];

export const allWomanInMotorizedWheelchairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9BC}\uDDBC", "Woman: In Motorized Wheelchair", ...allWomanInMotorizedWheelchair);

export const allMotorizedWheelchair = [
    motorizedWheelchair,
    allManInMotorizedWheelchairGroup,
    allWomanInMotorizedWheelchairGroup
];

export const allMotorizedWheelchairGroup = new EmojiGroup("\u{1F9BC}\uDDBC", "Motorized Wheelchair", ...allMotorizedWheelchair);

export const allManInManualWheelchair = [
    manInManualWheelchair,
    manLightSkinToneInManualWheelchair,
    manMediumLightSkinToneInManualWheelchair,
    manMediumSkinToneInManualWheelchair,
    manMediumDarkSkinToneInManualWheelchair,
    manDarkSkinToneInManualWheelchair
];

export const allManInManualWheelchairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9BD}\uDDBD", "Man: In Manual Wheelchair", ...allManInManualWheelchair);

export const allWomanInManualWheelchair = [
    womanInManualWheelchair,
    womanLightSkinToneInManualWheelchair,
    womanMediumLightSkinToneInManualWheelchair,
    womanMediumSkinToneInManualWheelchair,
    womanMediumDarkSkinToneInManualWheelchair,
    womanDarkSkinToneInManualWheelchair
];

export const allWomanInManualWheelchairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9BD}\uDDBD", "Woman: In Manual Wheelchair", ...allWomanInManualWheelchair);

export const allManualWheelchair = [
    manualWheelchair,
    allManInManualWheelchairGroup,
    allWomanInManualWheelchairGroup
];

export const allManualWheelchairGroup = new EmojiGroup("\u{1F9BD}\uDDBD", "Manual Wheelchair", ...allManualWheelchair);

export const allManDancing = [
    manDancing,
    manDancingLightSkinTone,
    manDancingMediumLightSkinTone,
    manDancingMediumSkinTone,
    manDancingMediumDarkSkinTone,
    manDancingDarkSkinTone
];

export const allManDancingGroup = new EmojiGroup("\u{1F57A}\uDD7A", "Man Dancing", ...allManDancing);

export const allWomanDancing = [
    womanDancing,
    womanDancingLightSkinTone,
    womanDancingMediumLightSkinTone,
    womanDancingMediumSkinTone,
    womanDancingMediumDarkSkinTone,
    womanDancingDarkSkinTone
];

export const allWomanDancingGroup = new EmojiGroup("\u{1F483}\uDC83", "Woman Dancing", ...allWomanDancing);

export const allMenDancing = [
    allManDancingGroup,
    allWomanDancingGroup
];

export const allMenDancingGroup = new EmojiGroup("\u{1F57A}\uDD7A", "Dancing", ...allMenDancing);

export const allJuggler = [
    juggler,
    jugglerLightSkinTone,
    jugglerMediumLightSkinTone,
    jugglerMediumSkinTone,
    jugglerMediumDarkSkinTone,
    jugglerDarkSkinTone
];

export const allJugglerGroup = new EmojiGroup("\u{1F939}\uDD39", "Juggler", ...allJuggler);

export const allJugglerMale = [
    jugglerMale,
    jugglerLightSkinToneMale,
    jugglerMediumLightSkinToneMale,
    jugglerMediumSkinToneMale,
    jugglerMediumDarkSkinToneMale,
    jugglerDarkSkinToneMale
];

export const allJugglerMaleGroup = new EmojiGroup("\u{1F939}\uDD39\u200D\u2642\uFE0F", "Juggler: Male", ...allJugglerMale);

export const allJugglerFemale = [
    jugglerFemale,
    jugglerLightSkinToneFemale,
    jugglerMediumLightSkinToneFemale,
    jugglerMediumSkinToneFemale,
    jugglerMediumDarkSkinToneFemale,
    jugglerDarkSkinToneFemale
];

export const allJugglerFemaleGroup = new EmojiGroup("\u{1F939}\uDD39\u200D\u2640\uFE0F", "Juggler: Female", ...allJugglerFemale);

export const allJugglers = [
    allJugglerGroup,
    allJugglerMaleGroup,
    allJugglerFemaleGroup
];

export const allJugglersGroup = new EmojiGroup("\u{1F939}\uDD39", "Juggler", ...allJugglers);

export const allClimber = [
    climber,
    climberLightSkinTone,
    climberMediumLightSkinTone,
    climberMediumSkinTone,
    climberMediumDarkSkinTone,
    climberDarkSkinTone
];

export const allClimberGroup = new EmojiGroup("\u{1F9D7}\uDDD7", "Climber", ...allClimber);

export const allClimberMale = [
    climberMale,
    climberLightSkinToneMale,
    climberMediumLightSkinToneMale,
    climberMediumSkinToneMale,
    climberMediumDarkSkinToneMale,
    climberDarkSkinToneMale
];

export const allClimberMaleGroup = new EmojiGroup("\u{1F9D7}\uDDD7\u200D\u2642\uFE0F", "Climber: Male", ...allClimberMale);

export const allClimberFemale = [
    climberFemale,
    climberLightSkinToneFemale,
    climberMediumLightSkinToneFemale,
    climberMediumSkinToneFemale,
    climberMediumDarkSkinToneFemale,
    climberDarkSkinToneFemale
];

export const allClimberFemaleGroup = new EmojiGroup("\u{1F9D7}\uDDD7\u200D\u2640\uFE0F", "Climber: Female", ...allClimberFemale);

export const allClimbers = [
    allClimberGroup,
    allClimberMaleGroup,
    allClimberFemaleGroup
];

export const allClimbersGroup = new EmojiGroup("\u{1F9D7}\uDDD7", "Climber", ...allClimbers);

export const allJockey = [
    jockey,
    jockeyLightSkinTone,
    jockeyMediumLightSkinTone,
    jockeyMediumSkinTone,
    jockeyMediumDarkSkinTone,
    jockeyDarkSkinTone
];

export const allJockeyGroup = new EmojiGroup("\u{1F3C7}\uDFC7", "Jockey", ...allJockey);

export const allSnowboarder = [
    snowboarder,
    snowboarderLightSkinTone,
    snowboarderMediumLightSkinTone,
    snowboarderMediumSkinTone,
    snowboarderMediumDarkSkinTone,
    snowboarderDarkSkinTone
];

export const allSnowboarderGroup = new EmojiGroup("\u{1F3C2}\uDFC2", "Snowboarder", ...allSnowboarder);

export const allGolfer = [
    golfer,
    golferLightSkinTone,
    golferMediumLightSkinTone,
    golferMediumSkinTone,
    golferMediumDarkSkinTone,
    golferDarkSkinTone
];

export const allGolferGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F", "Golfer", ...allGolfer);

export const allGolferMale = [
    golferMale,
    golferLightSkinToneMale,
    golferMediumLightSkinToneMale,
    golferMediumSkinToneMale,
    golferMediumDarkSkinToneMale,
    golferDarkSkinToneMale
];

export const allGolferMaleGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F\u200D\u2642\uFE0F", "Golfer: Male", ...allGolferMale);

export const allGolferFemale = [
    golferFemale,
    golferLightSkinToneFemale,
    golferMediumLightSkinToneFemale,
    golferMediumSkinToneFemale,
    golferMediumDarkSkinToneFemale,
    golferDarkSkinToneFemale
];

export const allGolferFemaleGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F\u200D\u2640\uFE0F", "Golfer: Female", ...allGolferFemale);

export const allGolfers = [
    allGolferGroup,
    allGolferMaleGroup,
    allGolferFemaleGroup
];

export const allGolfersGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F", "Golfer", ...allGolfers);

export const allSurfing = [
    surfing,
    surfingLightSkinTone,
    surfingMediumLightSkinTone,
    surfingMediumSkinTone,
    surfingMediumDarkSkinTone,
    surfingDarkSkinTone
];

export const allSurfingGroup = new EmojiGroup("\u{1F3C4}\uDFC4", "Surfing", ...allSurfing);

export const allSurfingMale = [
    surfingMale,
    surfingLightSkinToneMale,
    surfingMediumLightSkinToneMale,
    surfingMediumSkinToneMale,
    surfingMediumDarkSkinToneMale,
    surfingDarkSkinToneMale
];

export const allSurfingMaleGroup = new EmojiGroup("\u{1F3C4}\uDFC4\u200D\u2642\uFE0F", "Surfing: Male", ...allSurfingMale);

export const allSurfingFemale = [
    surfingFemale,
    surfingLightSkinToneFemale,
    surfingMediumLightSkinToneFemale,
    surfingMediumSkinToneFemale,
    surfingMediumDarkSkinToneFemale,
    surfingDarkSkinToneFemale
];

export const allSurfingFemaleGroup = new EmojiGroup("\u{1F3C4}\uDFC4\u200D\u2640\uFE0F", "Surfing: Female", ...allSurfingFemale);

export const allSurfers = [
    allSurfingGroup,
    allSurfingMaleGroup,
    allSurfingFemaleGroup
];

export const allSurfersGroup = new EmojiGroup("\u{1F3C4}\uDFC4", "Surfing", ...allSurfers);

export const allRowingBoat = [
    rowingBoat,
    rowingBoatLightSkinTone,
    rowingBoatMediumLightSkinTone,
    rowingBoatMediumSkinTone,
    rowingBoatMediumDarkSkinTone,
    rowingBoatDarkSkinTone
];

export const allRowingBoatGroup = new EmojiGroup("\u{1F6A3}\uDEA3", "Rowing Boat", ...allRowingBoat);

export const allRowingBoatMale = [
    rowingBoatMale,
    rowingBoatLightSkinToneMale,
    rowingBoatMediumLightSkinToneMale,
    rowingBoatMediumSkinToneMale,
    rowingBoatMediumDarkSkinToneMale,
    rowingBoatDarkSkinToneMale
];

export const allRowingBoatMaleGroup = new EmojiGroup("\u{1F6A3}\uDEA3\u200D\u2642\uFE0F", "Rowing Boat: Male", ...allRowingBoatMale);

export const allRowingBoatFemale = [
    rowingBoatFemale,
    rowingBoatLightSkinToneFemale,
    rowingBoatMediumLightSkinToneFemale,
    rowingBoatMediumSkinToneFemale,
    rowingBoatMediumDarkSkinToneFemale,
    rowingBoatDarkSkinToneFemale
];

export const allRowingBoatFemaleGroup = new EmojiGroup("\u{1F6A3}\uDEA3\u200D\u2640\uFE0F", "Rowing Boat: Female", ...allRowingBoatFemale);

export const allBoatRowers = [
    allRowingBoatGroup,
    allRowingBoatMaleGroup,
    allRowingBoatFemaleGroup
];

export const allBoatRowersGroup = new EmojiGroup("\u{1F6A3}\uDEA3", "Rowing Boat", ...allBoatRowers);

export const allSwimming = [
    swimming,
    swimmingLightSkinTone,
    swimmingMediumLightSkinTone,
    swimmingMediumSkinTone,
    swimmingMediumDarkSkinTone,
    swimmingDarkSkinTone
];

export const allSwimmingGroup = new EmojiGroup("\u{1F3CA}\uDFCA", "Swimming", ...allSwimming);

export const allSwimmingMale = [
    swimmingMale,
    swimmingLightSkinToneMale,
    swimmingMediumLightSkinToneMale,
    swimmingMediumSkinToneMale,
    swimmingMediumDarkSkinToneMale,
    swimmingDarkSkinToneMale
];

export const allSwimmingMaleGroup = new EmojiGroup("\u{1F3CA}\uDFCA\u200D\u2642\uFE0F", "Swimming: Male", ...allSwimmingMale);

export const allSwimmingFemale = [
    swimmingFemale,
    swimmingLightSkinToneFemale,
    swimmingMediumLightSkinToneFemale,
    swimmingMediumSkinToneFemale,
    swimmingMediumDarkSkinToneFemale,
    swimmingDarkSkinToneFemale
];

export const allSwimmingFemaleGroup = new EmojiGroup("\u{1F3CA}\uDFCA\u200D\u2640\uFE0F", "Swimming: Female", ...allSwimmingFemale);

export const allSwimmers = [
    allSwimmingGroup,
    allSwimmingMaleGroup,
    allSwimmingFemaleGroup
];

export const allSwimmersGroup = new EmojiGroup("\u{1F3CA}\uDFCA", "Swimming", ...allSwimmers);

export const allBasketBaller = [
    basketBaller,
    basketBallerLightSkinTone,
    basketBallerMediumLightSkinTone,
    basketBallerMediumSkinTone,
    basketBallerMediumDarkSkinTone,
    basketBallerDarkSkinTone
];

export const allBasketBallerGroup = new EmojiGroup("\u26F9\uFE0F", "Basket Baller", ...allBasketBaller);

export const allBasketBallerMale = [
    basketBallerMale,
    basketBallerLightSkinToneMale,
    basketBallerMediumLightSkinToneMale,
    basketBallerMediumSkinToneMale,
    basketBallerMediumDarkSkinToneMale,
    basketBallerDarkSkinToneMale
];

export const allBasketBallerMaleGroup = new EmojiGroup("\u26F9\uFE0F\u200D\u2642\uFE0F", "Basket Baller: Male", ...allBasketBallerMale);

export const allBasketBallerFemale = [
    basketBallerFemale,
    basketBallerLightSkinToneFemale,
    basketBallerMediumLightSkinToneFemale,
    basketBallerMediumSkinToneFemale,
    basketBallerMediumDarkSkinToneFemale,
    basketBallerDarkSkinToneFemale
];

export const allBasketBallerFemaleGroup = new EmojiGroup("\u26F9\uFE0F\u200D\u2640\uFE0F", "Basket Baller: Female", ...allBasketBallerFemale);

export const allBacketBallPlayers = [
    allBasketBallerGroup,
    allBasketBallerMaleGroup,
    allBasketBallerFemaleGroup
];

export const allBacketBallPlayersGroup = new EmojiGroup("\u26F9\uFE0F", "Basket Baller", ...allBacketBallPlayers);

export const allWeightLifter = [
    weightLifter,
    weightLifterLightSkinTone,
    weightLifterMediumLightSkinTone,
    weightLifterMediumSkinTone,
    weightLifterMediumDarkSkinTone,
    weightLifterDarkSkinTone
];

export const allWeightLifterGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F", "Weight Lifter", ...allWeightLifter);

export const allWeightLifterMale = [
    weightLifterMale,
    weightLifterLightSkinToneMale,
    weightLifterMediumLightSkinToneMale,
    weightLifterMediumSkinToneMale,
    weightLifterMediumDarkSkinToneMale,
    weightLifterDarkSkinToneMale
];

export const allWeightLifterMaleGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F\u200D\u2642\uFE0F", "Weight Lifter: Male", ...allWeightLifterMale);

export const allWeightLifterFemale = [
    weightLifterFemale,
    weightLifterLightSkinToneFemale,
    weightLifterMediumLightSkinToneFemale,
    weightLifterMediumSkinToneFemale,
    weightLifterMediumDarkSkinToneFemale,
    weightLifterDarkSkinToneFemale
];

export const allWeightLifterFemaleGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F\u200D\u2640\uFE0F", "Weight Lifter: Female", ...allWeightLifterFemale);

export const allWeightLifters = [
    allWeightLifterGroup,
    allWeightLifterMaleGroup,
    allWeightLifterFemaleGroup
];

export const allWeightLiftersGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F", "Weight Lifter", ...allWeightLifters);

export const allBiker = [
    biker,
    bikerLightSkinTone,
    bikerMediumLightSkinTone,
    bikerMediumSkinTone,
    bikerMediumDarkSkinTone,
    bikerDarkSkinTone
];

export const allBikerGroup = new EmojiGroup("\u{1F6B4}\uDEB4", "Biker", ...allBiker);

export const allBikerMale = [
    bikerMale,
    bikerLightSkinToneMale,
    bikerMediumLightSkinToneMale,
    bikerMediumSkinToneMale,
    bikerMediumDarkSkinToneMale,
    bikerDarkSkinToneMale
];

export const allBikerMaleGroup = new EmojiGroup("\u{1F6B4}\uDEB4\u200D\u2642\uFE0F", "Biker: Male", ...allBikerMale);

export const allBikerFemale = [
    bikerFemale,
    bikerLightSkinToneFemale,
    bikerMediumLightSkinToneFemale,
    bikerMediumSkinToneFemale,
    bikerMediumDarkSkinToneFemale,
    bikerDarkSkinToneFemale
];

export const allBikerFemaleGroup = new EmojiGroup("\u{1F6B4}\uDEB4\u200D\u2640\uFE0F", "Biker: Female", ...allBikerFemale);

export const allBikers = [
    allBikerGroup,
    allBikerMaleGroup,
    allBikerFemaleGroup
];

export const allBikersGroup = new EmojiGroup("\u{1F6B4}\uDEB4", "Biker", ...allBikers);

export const allMountainBiker = [
    mountainBiker,
    mountainBikerLightSkinTone,
    mountainBikerMediumLightSkinTone,
    mountainBikerMediumSkinTone,
    mountainBikerMediumDarkSkinTone,
    mountainBikerDarkSkinTone
];

export const allMountainBikerGroup = new EmojiGroup("\u{1F6B5}\uDEB5", "Mountain Biker", ...allMountainBiker);

export const allMountainBikerMale = [
    mountainBikerMale,
    mountainBikerLightSkinToneMale,
    mountainBikerMediumLightSkinToneMale,
    mountainBikerMediumSkinToneMale,
    mountainBikerMediumDarkSkinToneMale,
    mountainBikerDarkSkinToneMale
];

export const allMountainBikerMaleGroup = new EmojiGroup("\u{1F6B5}\uDEB5\u200D\u2642\uFE0F", "Mountain Biker: Male", ...allMountainBikerMale);

export const allMountainBikerFemale = [
    mountainBikerFemale,
    mountainBikerLightSkinToneFemale,
    mountainBikerMediumLightSkinToneFemale,
    mountainBikerMediumSkinToneFemale,
    mountainBikerMediumDarkSkinToneFemale,
    mountainBikerDarkSkinToneFemale
];

export const allMountainBikerFemaleGroup = new EmojiGroup("\u{1F6B5}\uDEB5\u200D\u2640\uFE0F", "Mountain Biker: Female", ...allMountainBikerFemale);

export const allMountainBikers = [
    allMountainBikerGroup,
    allMountainBikerMaleGroup,
    allMountainBikerFemaleGroup
];

export const allMountainBikersGroup = new EmojiGroup("\u{1F6B5}\uDEB5", "Mountain Biker", ...allMountainBikers);

export const allCartwheeler = [
    cartwheeler,
    cartwheelerLightSkinTone,
    cartwheelerMediumLightSkinTone,
    cartwheelerMediumSkinTone,
    cartwheelerMediumDarkSkinTone,
    cartwheelerDarkSkinTone
];

export const allCartwheelerGroup = new EmojiGroup("\u{1F938}\uDD38", "Cartwheeler", ...allCartwheeler);

export const allCartwheelerMale = [
    cartwheelerMale,
    cartwheelerLightSkinToneMale,
    cartwheelerMediumLightSkinToneMale,
    cartwheelerMediumSkinToneMale,
    cartwheelerMediumDarkSkinToneMale,
    cartwheelerDarkSkinToneMale
];

export const allCartwheelerMaleGroup = new EmojiGroup("\u{1F938}\uDD38\u200D\u2642\uFE0F", "Cartwheeler: Male", ...allCartwheelerMale);

export const allCartwheelerFemale = [
    cartwheelerFemale,
    cartwheelerLightSkinToneFemale,
    cartwheelerMediumLightSkinToneFemale,
    cartwheelerMediumSkinToneFemale,
    cartwheelerMediumDarkSkinToneFemale,
    cartwheelerDarkSkinToneFemale
];

export const allCartwheelerFemaleGroup = new EmojiGroup("\u{1F938}\uDD38\u200D\u2640\uFE0F", "Cartwheeler: Female", ...allCartwheelerFemale);

export const allCartwheelers = [
    allCartwheelerGroup,
    allCartwheelerMaleGroup,
    allCartwheelerFemaleGroup
];

export const allCartwheelersGroup = new EmojiGroup("\u{1F938}\uDD38", "Cartwheeler", ...allCartwheelers);

export const allWrestler = [
    wrestler,
    wrestlerMale,
    wrestlerFemale
];

export const allWrestlerGroup = new EmojiGroup("\u{1F93C}\uDD3C", "Wrestler", ...allWrestler);

export const allWaterPoloPlayer = [
    waterPoloPlayer,
    waterPoloPlayerLightSkinTone,
    waterPoloPlayerMediumLightSkinTone,
    waterPoloPlayerMediumSkinTone,
    waterPoloPlayerMediumDarkSkinTone,
    waterPoloPlayerDarkSkinTone
];

export const allWaterPoloPlayerGroup = new EmojiGroup("\u{1F93D}\uDD3D", "Water Polo Player", ...allWaterPoloPlayer);

export const allWaterPoloPlayerMale = [
    waterPoloPlayerMale,
    waterPoloPlayerLightSkinToneMale,
    waterPoloPlayerMediumLightSkinToneMale,
    waterPoloPlayerMediumSkinToneMale,
    waterPoloPlayerMediumDarkSkinToneMale,
    waterPoloPlayerDarkSkinToneMale
];

export const allWaterPoloPlayerMaleGroup = new EmojiGroup("\u{1F93D}\uDD3D\u200D\u2642\uFE0F", "Water Polo Player: Male", ...allWaterPoloPlayerMale);

export const allWaterPoloPlayerFemale = [
    waterPoloPlayerFemale,
    waterPoloPlayerLightSkinToneFemale,
    waterPoloPlayerMediumLightSkinToneFemale,
    waterPoloPlayerMediumSkinToneFemale,
    waterPoloPlayerMediumDarkSkinToneFemale,
    waterPoloPlayerDarkSkinToneFemale
];

export const allWaterPoloPlayerFemaleGroup = new EmojiGroup("\u{1F93D}\uDD3D\u200D\u2640\uFE0F", "Water Polo Player: Female", ...allWaterPoloPlayerFemale);

export const allWaterPoloPlayers = [
    allWaterPoloPlayerGroup,
    allWaterPoloPlayerMaleGroup,
    allWaterPoloPlayerFemaleGroup
];

export const allWaterPoloPlayersGroup = new EmojiGroup("\u{1F93D}\uDD3D", "Water Polo Player", ...allWaterPoloPlayers);

export const allHandBaller = [
    handBaller,
    handBallerLightSkinTone,
    handBallerMediumLightSkinTone,
    handBallerMediumSkinTone,
    handBallerMediumDarkSkinTone,
    handBallerDarkSkinTone
];

export const allHandBallerGroup = new EmojiGroup("\u{1F93E}\uDD3E", "Hand Baller", ...allHandBaller);

export const allHandBallerMale = [
    handBallerMale,
    handBallerLightSkinToneMale,
    handBallerMediumLightSkinToneMale,
    handBallerMediumSkinToneMale,
    handBallerMediumDarkSkinToneMale,
    handBallerDarkSkinToneMale
];

export const allHandBallerMaleGroup = new EmojiGroup("\u{1F93E}\uDD3E\u200D\u2642\uFE0F", "Hand Baller: Male", ...allHandBallerMale);

export const allHandBallerFemale = [
    handBallerFemale,
    handBallerLightSkinToneFemale,
    handBallerMediumLightSkinToneFemale,
    handBallerMediumSkinToneFemale,
    handBallerMediumDarkSkinToneFemale,
    handBallerDarkSkinToneFemale
];

export const allHandBallerFemaleGroup = new EmojiGroup("\u{1F93E}\uDD3E\u200D\u2640\uFE0F", "Hand Baller: Female", ...allHandBallerFemale);

export const allHandBallers = [
    allHandBallerGroup,
    allHandBallerMaleGroup,
    allHandBallerFemaleGroup
];

export const allHandBallersGroup = new EmojiGroup("\u{1F93E}\uDD3E", "Hand Baller", ...allHandBallers);

export const allInMotion = [
    allWalkersGroup,
    allStandersGroup,
    allKneelersGroup,
    allProbingCaneGroup,
    allMotorizedWheelchairGroup,
    allManualWheelchairGroup,
    allMenDancingGroup,
    allJugglersGroup,
    allClimbersGroup,
    fencer,
    allJockeyGroup,
    skier,
    allSnowboarderGroup,
    allGolfersGroup,
    allSurfersGroup,
    allBoatRowersGroup,
    allSwimmersGroup,
    allRunnersGroup,
    allBacketBallPlayersGroup,
    allWeightLiftersGroup,
    allBikersGroup,
    allMountainBikersGroup,
    allCartwheelersGroup,
    allWrestlerGroup,
    allWaterPoloPlayersGroup,
    allHandBallersGroup
];

export const allInMotionGroup = new EmojiGroup("\u0049\u006E\u0020\u004D\u006F\u0074\u0069\u006F\u006E", "Depictions of people in motion", ...allInMotion);

export const allInLotusPosition = [
    inLotusPosition,
    inLotusPositionLightSkinTone,
    inLotusPositionMediumLightSkinTone,
    inLotusPositionMediumSkinTone,
    inLotusPositionMediumDarkSkinTone,
    inLotusPositionDarkSkinTone
];

export const allInLotusPositionGroup = new EmojiGroup("\u{1F9D8}\uDDD8", "In Lotus Position", ...allInLotusPosition);

export const allInLotusPositionMale = [
    inLotusPositionMale,
    inLotusPositionLightSkinToneMale,
    inLotusPositionMediumLightSkinToneMale,
    inLotusPositionMediumSkinToneMale,
    inLotusPositionMediumDarkSkinToneMale,
    inLotusPositionDarkSkinToneMale
];

export const allInLotusPositionMaleGroup = new EmojiGroup("\u{1F9D8}\uDDD8\u200D\u2642\uFE0F", "In Lotus Position: Male", ...allInLotusPositionMale);

export const allInLotusPositionFemale = [
    inLotusPositionFemale,
    inLotusPositionLightSkinToneFemale,
    inLotusPositionMediumLightSkinToneFemale,
    inLotusPositionMediumSkinToneFemale,
    inLotusPositionMediumDarkSkinToneFemale,
    inLotusPositionDarkSkinToneFemale
];

export const allInLotusPositionFemaleGroup = new EmojiGroup("\u{1F9D8}\uDDD8\u200D\u2640\uFE0F", "In Lotus Position: Female", ...allInLotusPositionFemale);

export const allLotusSitters = [
    allInLotusPositionGroup,
    allInLotusPositionMaleGroup,
    allInLotusPositionFemaleGroup
];

export const allLotusSittersGroup = new EmojiGroup("\u{1F9D8}\uDDD8", "In Lotus Position", ...allLotusSitters);

export const allInBath = [
    inBath,
    inBathLightSkinTone,
    inBathMediumLightSkinTone,
    inBathMediumSkinTone,
    inBathMediumDarkSkinTone,
    inBathDarkSkinTone
];

export const allInBathGroup = new EmojiGroup("\u{1F6C0}\uDEC0", "In Bath", ...allInBath);

export const allInBed = [
    inBed,
    inBedLightSkinTone,
    inBedMediumLightSkinTone,
    inBedMediumSkinTone,
    inBedMediumDarkSkinTone,
    inBedDarkSkinTone
];

export const allInBedGroup = new EmojiGroup("\u{1F6CC}\uDECC", "In Bed", ...allInBed);

export const allInSauna = [
    inSauna,
    inSaunaLightSkinTone,
    inSaunaMediumLightSkinTone,
    inSaunaMediumSkinTone,
    inSaunaMediumDarkSkinTone,
    inSaunaDarkSkinTone
];

export const allInSaunaGroup = new EmojiGroup("\u{1F9D6}\uDDD6", "In Sauna", ...allInSauna);

export const allInSaunaMale = [
    inSaunaMale,
    inSaunaLightSkinToneMale,
    inSaunaMediumLightSkinToneMale,
    inSaunaMediumSkinToneMale,
    inSaunaMediumDarkSkinToneMale,
    inSaunaDarkSkinToneMale
];

export const allInSaunaMaleGroup = new EmojiGroup("\u{1F9D6}\uDDD6\u200D\u2642\uFE0F", "In Sauna: Male", ...allInSaunaMale);

export const allInSaunaFemale = [
    inSaunaFemale,
    inSaunaLightSkinToneFemale,
    inSaunaMediumLightSkinToneFemale,
    inSaunaMediumSkinToneFemale,
    inSaunaMediumDarkSkinToneFemale,
    inSaunaDarkSkinToneFemale
];

export const allInSaunaFemaleGroup = new EmojiGroup("\u{1F9D6}\uDDD6\u200D\u2640\uFE0F", "In Sauna: Female", ...allInSaunaFemale);

export const allSauna = [
    allInSaunaGroup,
    allInSaunaMaleGroup,
    allInSaunaFemaleGroup
];

export const allSaunaGroup = new EmojiGroup("\u{1F9D6}\uDDD6", "In Sauna", ...allSauna);

export const allResting = [
    allLotusSittersGroup,
    allInBathGroup,
    allInBedGroup,
    allSaunaGroup
];

export const allRestingGroup = new EmojiGroup("\u0052\u0065\u0073\u0074\u0069\u006E\u0067", "Depictions of people at rest", ...allResting);

export const allBabies = [
    allBabyGroup,
    allCherubGroup
];

export const allBabiesGroup = new EmojiGroup("\u{1F476}\uDC76", "Baby", ...allBabies);

export const allPeople = [
    allBabiesGroup,
    allChildrenGroup,
    allPersonsGroup,
    allOlderPersonsGroup
];

export const allPeopleGroup = new EmojiGroup("\u0050\u0065\u006F\u0070\u006C\u0065", "People", ...allPeople);

export const allCharacters = [
    allPeopleGroup,
    allGesturingGroup,
    allInMotionGroup,
    allRestingGroup,
    allOccupationGroup,
    allFantasyGroup
];

export const allCharactersGroup = new EmojiGroup("\u0041\u006C\u006C\u0020\u0050\u0065\u006F\u0070\u006C\u0065", "All People", ...allCharacters);

