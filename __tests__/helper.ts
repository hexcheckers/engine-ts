import Cell from "../src/Cell.js";
import Move from "../src/Move.js";

export const getDefaultBoard6x6HcFen = ():string => "6x6/aaaaaa/aaaaaa///bbbbbb/bbbbbb";

export const getDefaultBoard6x8HcFen = ():string => "6x8/aaaaaa/aaaaaa/aaaaaa///bbbbbb/bbbbbb/bbbbbb";

export const getDefaultBoard8x6HcFen = ():string => "8x6/aaaaaaaa/aaaaaaaa///bbbbbbbb/bbbbbbbb";

export const getDefaultBoard8x8HcFen = ():string => "8x8/aaaaaaaa/aaaaaaaa/aaaaaaaa///bbbbbbbb/bbbbbbbb/bbbbbbbb";

export const getDefaultBoard8x10HcFen = ():string => "8x10/aaaaaaaa/aaaaaaaa/aaaaaaaa/aaaaaaaa///bbbbbbbb/bbbbbbbb/bbbbbbbb/bbbbbbbb";

export const getDefaultBoard10x8HcFen = ():string => "10x8/aaaaaaaaaa/aaaaaaaaaa/aaaaaaaaaa///bbbbbbbbbb/bbbbbbbbbb/bbbbbbbbbb";

export const getDefaultBoard10x10HcFen = ():string =>  "10x10/aaaaaaaaaa/aaaaaaaaaa/aaaaaaaaaa/aaaaaaaaaa///bbbbbbbbbb/bbbbbbbbbb/bbbbbbbbbb/bbbbbbbbbb";
export const getEmptyBoard6x6HcFen = ():string => "6x6//////";

//       ___     ___     ___
//   ___/   \___/   \___/ b \
//6 /   \___/   \___/ b \___/
//  \___/   \___/   \___/   \
//5 /   \___/ B \___/   \___/
//  \___/   \___/ a \___/   \
//4 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//3 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//2 / a \___/   \___/   \___/
//  \___/   \___/   \___/   \
//1 / a \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_1HcFen = ():string => "6x6/a/a//---a/--B/----bb";

//       ___     ___     ___
//   ___/   \___/   \___/   \
//6 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//5 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//4 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//3 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//2 /   \___/   \___/   \___/
//  \___/ A \___/   \___/   \
//1 /   \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_2HcFen = ():string => "6x6/-A/////";

//       ___     ___     ___
//   ___/   \___/   \___/   \
//6 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//5 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//4 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//3 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//2 /   \___/ b \___/   \___/
//  \___/ a \___/   \___/   \
//1 /   \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_3HcFen = ():string => "6x6/-a/--b////";

//       ___     ___     ___
//   ___/   \___/   \___/   \
//6 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//5 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//4 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//3 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//2 /   \___/ b \___/   \___/
//  \___/ A \___/   \___/   \
//1 /   \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_4HcFen = ():string => "6x6/-A/--b////";

//       ___     ___     ___
//   ___/   \___/   \___/   \
//6 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//5 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//4 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//3 /   \___/ b \___/ b \___/
//  \___/   \___/   \___/   \
//2 /   \___/ b \___/   \___/
//  \___/ a \___/   \___/   \
//1 /   \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_5HcFen = ():string => "6x6/-a/--b/--b-b///";

//       ___     ___     ___
//   ___/   \___/   \___/   \
//6 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//5 /   \___/   \___/   \___/
//  \___/ b \___/   \___/   \
//4 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//3 /   \___/ b \___/ b \___/
//  \___/   \___/   \___/   \
//2 /   \___/ b \___/   \___/
//  \___/ a \___/   \___/   \
//1 /   \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_6HcFen = ():string => "6x6/-a/--b/--b-b/-b//";

//       ___     ___     ___
//   ___/   \___/   \___/   \
//6 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//5 /   \___/ b \___/   \___/
//  \___/   \___/   \___/   \
//4 /   \___/   \___/   \___/
//  \___/ b \___/   \___/   \
//3 /   \___/   \___/   \___/
//  \___/   \___/   \___/   \
//2 /   \___/ b \___/   \___/
//  \___/ A \___/   \___/   \
//1 /   \___/   \___/   \___/
//  \___/   \___/   \___/
//    a   b   c   d   e   f
export const getCustomBoard6x6_7HcFen = ():string => "6x6/-A/--b/-b//--b/";

/**
 * Return string of cell's siblings cells starts from TOP_MIDDLE by hour hand.
 * For example, for cell "b2" result will be "b3c3c2b1a1a2".
 */
export const getCellSiblingsAsString = (cell: Cell): string => {
    return (cell.topMiddle?.name || "  ")
        + (cell.topRight?.name || "  ")
        + (cell.bottomRight?.name || "  ")
        + (cell.bottomMiddle?.name || "  ")
        + (cell.bottomLeft?.name || "  ")
        + (cell.topLeft?.name || "  ");
};

/**
 * Render in ASCII cell's siblings cells names
 * For example, for cell "b2" result will be:
 *     b3
 *  a2    c3
 *     b2
 *  a1    c2
 *     b1
 */
export const renderCellSiblings = (cell: Cell): void => {
    console.log("   " + (cell.topMiddle?.name || "  "));
    console.log((cell.topLeft?.name || "  ") + "    " + (cell.topRight?.name || "  "));
    console.log("   " + cell.name);
    console.log((cell.bottomLeft?.name || "  ") + "    " + (cell.bottomRight?.name || "  "));
    console.log("   " + (cell.bottomMiddle?.name || "  "));
};

/**
 * Convert list of Move to list of its string representation
 * List<Move> -> List<String>
 */
export const movesListToStringList = (moves: Move[]): string[] => {
    return moves.map(move => move.toString());
};
