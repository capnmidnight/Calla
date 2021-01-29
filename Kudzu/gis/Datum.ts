const FalseNorthing: number = 10000000.0;
const invF: number = 298.257223563;
const equatorialRadius: number = 6378137;
const pointScaleFactor: number = 0.9996;
const E0: number = 500000;

const flattening: number = 1 / invF;
const flatteningComp: number = 1 - flattening;
const n: number = flattening / (2 - flattening);
const A: number = (equatorialRadius / (1 + n)) * (1 + (n * n / 4) + (n * n * n * n / 64));

const e: number = Math.sqrt(1 - (flatteningComp * flatteningComp));
const esq: number = 1 - (flatteningComp * flatteningComp);
const e0sq: number = e * e / (1 - (e * e));

const alpha1: number = 1 - (esq * ((1.0 / 4.0) + (esq * ((3.0 / 64.0) + (5.0 * esq / 256.0)))));
const alpha2: number = esq * ((3.0 / 8.0) + (esq * ((3.0 / 32.0) + (45.0 * esq / 1024.0))));
const alpha3: number = esq * esq * ((15.0 / 256.0) + (esq * 45.0 / 1024.0));
const alpha4: number = esq * esq * esq * (35.0 / 3072.0);

const beta: number[] = [
    (n / 2) - (2 * n * n / 3) + (37 * n * n * n / 96),
    (n * n / 48) + (n * n * n / 15),
    17 * n * n * n / 480
];

const delta: number[] = [
    (2 * n) - (2 * n * n / 3),
    (7 * n * n / 3) - (8 * n * n * n / 5),
    56 * n * n * n / 15
];

export const DatumWGS_84 = {
    FalseNorthing,
    equatorialRadius,
    pointScaleFactor,
    E0,

    A,
    flattening,
    
    e,
    esq,
    e0sq,

    alpha1,
    alpha2,
    alpha3,
    alpha4,

    beta,
    delta
};