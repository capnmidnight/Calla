const verts = new Float32Array([
    //           vertices
    /* 0 TLF */ -1, 1, -1,
    /* 1 TRF */  1, 1, -1,
    /* 2 BLF */ -1, -1, -1,
    /* 3 BRF */  1, -1, -1,
    /* 4 TLB */ -1, 1, 1,
    /* 5 TRB */  1, 1, 1,
    /* 6 BLB */ -1, -1, 1,
    /* 7 BRB */  1, -1, 1
]);

export const invCube = {
    verts,
    indices: new Uint8Array([
        /* F */  0, 2, 1,
        /* F */  1, 2, 3,
        /* B */  5, 7, 4,
        /* B */  4, 7, 6,
        /* R */  1, 3, 5,
        /* R */  5, 3, 7,
        /* L */  4, 6, 0,
        /* L */  0, 6, 2,
        /* D */  2, 6, 3,
        /* D */  3, 6, 7,
        /* U */  4, 0, 5,
        /* U */  5, 0, 1,
    ])
};

export const cube = {
    verts,
    indices: new Uint8Array([
        /* F */  0, 1, 2,
        /* F */  2, 1, 3,
        /* B */  5, 4, 7,
        /* B */  7, 4, 6,
        /* R */  1, 5, 3,
        /* R */  3, 5, 7,
        /* L */  4, 0, 6,
        /* L */  6, 0, 2,
        /* D */  2, 3, 6,
        /* D */  6, 3, 7,
        /* U */  4, 5, 0,
        /* U */  0, 5, 1,
    ])
};