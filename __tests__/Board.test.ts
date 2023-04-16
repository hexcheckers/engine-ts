import Board, {Size} from "../src/Board.js";
import {
    getCellSiblingsAsString,
    getCustomBoard6x6_1HcFen,
    getDefaultBoard10x10HcFen,
    getDefaultBoard10x8HcFen,
    getDefaultBoard6x6HcFen,
    getDefaultBoard6x8HcFen,
    getDefaultBoard8x10HcFen,
    getDefaultBoard8x6HcFen,
    getDefaultBoard8x8HcFen,
    getEmptyBoard6x6HcFen
} from "./helper.js";
import {Color} from "../src/Piece.js";

describe('Testing Board Size', () => {
    test('Board Size 6X6', () => {
        const board = new Board(Size.SIZE_6X6)
        expect(board.size).toBe(Size.SIZE_6X6);
    });

    test('Board Size 6X8', () => {
        const board = new Board(Size.SIZE_6X8)
        expect(board.size).toBe(Size.SIZE_6X8);
    });

    test('Board Size 8X8', () => {
        const board = new Board(Size.SIZE_8X8)
        expect(board.size).toBe(Size.SIZE_8X8);
    });

    test('Board Size 8X10', () => {
        const board = new Board(Size.SIZE_8X10)
        expect(board.size).toBe(Size.SIZE_8X10);
    });

    test('Board Size 10X8', () => {
        const board = new Board(Size.SIZE_10X8)
        expect(board.size).toBe(Size.SIZE_10X8);
    });

    test('Board Size 10X10', () => {
        const board = new Board(Size.SIZE_10X10)
        expect(board.size).toBe(Size.SIZE_10X10);
    });
});

describe('Testing Board render', () => {
    test('Empty Board render', () => {
        const board = new Board(Size.SIZE_6X6)
        expect(board.toHcFen()).toBe(getEmptyBoard6x6HcFen());
    });

    test('Default Board renderer', () => {
        let board = new Board(Size.SIZE_6X6, true);
        expect(board.toHcFen()).toBe(getDefaultBoard6x6HcFen());

        board = new Board(Size.SIZE_6X8, true);
        expect(board.toHcFen()).toBe(getDefaultBoard6x8HcFen());

        board = new Board(Size.SIZE_8X6, true);
        expect(board.toHcFen()).toBe(getDefaultBoard8x6HcFen());

        board = new Board(Size.SIZE_8X8, true);
        expect(board.toHcFen()).toBe(getDefaultBoard8x8HcFen());

        board = new Board(Size.SIZE_8X10, true);
        expect(board.toHcFen()).toBe(getDefaultBoard8x10HcFen());

        board = new Board(Size.SIZE_10X8, true);
        expect(board.toHcFen()).toBe(getDefaultBoard10x8HcFen());

        board = new Board(Size.SIZE_10X10, true);
        expect(board.toHcFen()).toBe(getDefaultBoard10x10HcFen());
    });

    test('Custom Board render', () => {
        const board = new Board(Size.SIZE_6X6);
        board.addPiece("a1", Color.A);
        board.addPiece("a2", Color.A);
        board.addPiece("d4", Color.A);
        board.addPiece("c5", Color.B, true);
        board.addPiece("f6", Color.B);
        board.addPiece("e6", Color.B);
        expect(board.toHcFen()).toBe(getCustomBoard6x6_1HcFen());
    });
});

describe('Testing Board copy', () => {
    test('copy Custom Board', () => {
        const board = new Board(Size.SIZE_6X6);
        board.addPiece("a1", Color.A);
        board.addPiece("a2", Color.A);
        board.addPiece("d4", Color.A);
        board.addPiece("c5", Color.B, true);
        board.addPiece("f6", Color.B);
        board.addPiece("e6", Color.B);
        expect(board.toHcFen()).toBe(getCustomBoard6x6_1HcFen());

        const boardCopy = board.copy();
        expect(boardCopy.size).toBe(Size.SIZE_6X6);
        expect(boardCopy.toHcFen()).toBe(getCustomBoard6x6_1HcFen());
    });
});

describe('Testing make Board from HcFen string', () => {
    test('make empty 6x6 Board', () => {
        const board = Board.makeFromHcFen(getEmptyBoard6x6HcFen());
        expect(board.size).toBe(Size.SIZE_6X6);
        expect(board.toHcFen()).toBe(getEmptyBoard6x6HcFen());
    });

    test('make default 6x6 Board', () => {
        const board = Board.makeFromHcFen(getDefaultBoard6x6HcFen());
        expect(board.size).toBe(Size.SIZE_6X6);
        expect(board.toHcFen()).toBe(getDefaultBoard6x6HcFen());
    });

    test('make custom 6x6 Board', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_1HcFen());
        expect(board.size).toBe(Size.SIZE_6X6);
        expect(board.toHcFen()).toBe(getCustomBoard6x6_1HcFen());
        expect(board.getPieceInCell("d4").getCellName()).toBe('d4');
        expect(board.getPieceInCell("d4").color).toBe(Color.A);
        expect(board.getPieceInCell("c5").getCellName()).toBe('c5');
        expect(board.getPieceInCell("c5").color).toBe(Color.B);
        expect(board.getPieceInCell("c5").isKing).toBe(true);
    });

    test('make Board from incorrect string', () => {
        const hcFen = "6x8/a-----b/a//aa/a-bb/b--bba/b/";
        expect(() => Board.makeFromHcFen(hcFen)).toThrow(`Invalid board representation "${hcFen}".`);
    });
});

describe('Testing getting Piece\'s in Cell\'s', () => {
    test('getting Piece\'s in Cell\'s', () => {
        let board = new Board(Size.SIZE_6X6, true);
        expect(board.getPieceInCell("a1").toString()).toBe('a@a1');
        expect(board.getPieceInCell("a6").toString()).toBe('b@a6');

        board = new Board(Size.SIZE_6X8, true)
        expect(board.getPieceInCell("f8").toString()).toBe('b@f8');
        expect(() => board.getPieceInCell("g8")).toThrow();

        board = new Board(Size.SIZE_8X6, true)
        expect(board.getPieceInCell("h6").toString()).toBe('b@h6');
        expect(() => board.getPieceInCell("h8")).toThrow();

        board = new Board(Size.SIZE_8X8, true)
        expect(board.getPieceInCell("h8").toString()).toBe('b@h8');
        expect(() => board.getPieceInCell("h10")).toThrow();

        board = new Board(Size.SIZE_8X10, true)
        expect(board.getPieceInCell("h10").toString()).toBe('b@h10');
        expect(() => board.getPieceInCell("j10")).toThrow();

        board = new Board(Size.SIZE_10X8, true)
        expect(board.getPieceInCell("j8").toString()).toBe('b@j8');
        expect(() => board.getPieceInCell("j10")).toThrow();

        board = new Board(Size.SIZE_10X10, true)
        expect(board.getPieceInCell("j10").toString()).toBe('b@j10');
    });
});

describe('Testing clear Board', () => {
    test('clear Board', () => {
        const board = new Board(Size.SIZE_6X6, true);
        expect(board.toHcFen()).toBe(getDefaultBoard6x6HcFen());

        board.clear();
        expect(board.toHcFen()).toBe(getEmptyBoard6x6HcFen());
    });
});

describe('Testing draw condition', () => {
    test('draw condition 1', () => {
        const board = new Board(Size.SIZE_6X6, true);
        expect(board.isDrawCondition()).toBe(false);
    });

    test('draw condition 2', () => {
        const board = Board.makeFromHcFen("6x6/a/////b");
        expect(board.isDrawCondition()).toBe(false);
    });

    test('draw condition 3', () => {
        const board = Board.makeFromHcFen("6x6/A/////-----B");
        expect(board.isDrawCondition()).toBe(true);
    });

    test('draw condition 4', () => {
        const board = Board.makeFromHcFen("6x6/AA/////-----B");
        expect(board.isDrawCondition()).toBe(true);
    });

    test('draw condition 5', () => {
        const board = Board.makeFromHcFen("6x6/a/////bb");
        expect(board.isDrawCondition()).toBe(false);
    });

    test('draw condition 6', () => {
        const board = Board.makeFromHcFen("6x6/a/b////");
        expect(board.isDrawCondition()).toBe(false);
    });
});

describe('Testing link Cells', () => {
    test('link Cells on 6x6 Board', () => {
        const board = new Board(Size.SIZE_6X6);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2      e1e2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3    f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4    f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5    f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6    f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("  b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("    c6b5a6  ");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("  d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("    e6d5c6  ");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("  f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("      f5e6  ");
    });

    test('link Cells on 6x8 Board', () => {
        const board = new Board(Size.SIZE_6X8);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2      e1e2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3    f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4    f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5    f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6    f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("a7b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("b7c7c6b5a6a7");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("c7d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("d7e7e6d5c6c7");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("e7f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("f7    f5e6e7");
        expect(getCellSiblingsAsString(board.cells.get("a7"))).toBe("a8b7b6a6    ");
        expect(getCellSiblingsAsString(board.cells.get("b7"))).toBe("b8c8c7b6a7a8");
        expect(getCellSiblingsAsString(board.cells.get("c7"))).toBe("c8d7d6c6b6b7");
        expect(getCellSiblingsAsString(board.cells.get("d7"))).toBe("d8e8e7d6c7c8");
        expect(getCellSiblingsAsString(board.cells.get("e7"))).toBe("e8f7f6e6d6d7");
        expect(getCellSiblingsAsString(board.cells.get("f7"))).toBe("f8    f6e7e8");
        expect(getCellSiblingsAsString(board.cells.get("a8"))).toBe("  b8b7a7    ");
        expect(getCellSiblingsAsString(board.cells.get("b8"))).toBe("    c8b7a8  ");
        expect(getCellSiblingsAsString(board.cells.get("c8"))).toBe("  d8d7c7b7b8");
        expect(getCellSiblingsAsString(board.cells.get("d8"))).toBe("    e8d7c8  ");
        expect(getCellSiblingsAsString(board.cells.get("e8"))).toBe("  f8f7e7d7d8");
        expect(getCellSiblingsAsString(board.cells.get("f8"))).toBe("      f7e8  ");
    });

    test('link Cells on 8x6 Board', () => {
        const board = new Board(Size.SIZE_8X6);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2g2g1  e1e2");
        expect(getCellSiblingsAsString(board.cells.get("g1"))).toBe("g2h1      f1");
        expect(getCellSiblingsAsString(board.cells.get("h1"))).toBe("h2      g1g2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3g3g2f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("g2"))).toBe("g3h2h1g1f1f2");
        expect(getCellSiblingsAsString(board.cells.get("h2"))).toBe("h3    h1g2g3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4g4g3f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("g3"))).toBe("g4h3h2g2f2f3");
        expect(getCellSiblingsAsString(board.cells.get("h3"))).toBe("h4    h2g3g4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5g5g4f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("g4"))).toBe("g5h4h3g3f3f4");
        expect(getCellSiblingsAsString(board.cells.get("h4"))).toBe("h5    h3g4g5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6g6g5f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("g5"))).toBe("g6h5h4g4f4f5");
        expect(getCellSiblingsAsString(board.cells.get("h5"))).toBe("h6    h4g5g6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("  b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("    c6b5a6  ");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("  d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("    e6d5c6  ");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("  f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("    g6f5e6  ");
        expect(getCellSiblingsAsString(board.cells.get("g6"))).toBe("  h6h5g5f5f6");
        expect(getCellSiblingsAsString(board.cells.get("h6"))).toBe("      h5g6  ");
    });

    test('link Cells on 8x8 Board', () => {
        const board = new Board(Size.SIZE_8X8);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2g2g1  e1e2");
        expect(getCellSiblingsAsString(board.cells.get("g1"))).toBe("g2h1      f1");
        expect(getCellSiblingsAsString(board.cells.get("h1"))).toBe("h2      g1g2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3g3g2f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("g2"))).toBe("g3h2h1g1f1f2");
        expect(getCellSiblingsAsString(board.cells.get("h2"))).toBe("h3    h1g2g3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4g4g3f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("g3"))).toBe("g4h3h2g2f2f3");
        expect(getCellSiblingsAsString(board.cells.get("h3"))).toBe("h4    h2g3g4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5g5g4f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("g4"))).toBe("g5h4h3g3f3f4");
        expect(getCellSiblingsAsString(board.cells.get("h4"))).toBe("h5    h3g4g5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6g6g5f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("g5"))).toBe("g6h5h4g4f4f5");
        expect(getCellSiblingsAsString(board.cells.get("h5"))).toBe("h6    h4g5g6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("a7b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("b7c7c6b5a6a7");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("c7d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("d7e7e6d5c6c7");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("e7f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("f7g7g6f5e6e7");
        expect(getCellSiblingsAsString(board.cells.get("g6"))).toBe("g7h6h5g5f5f6");
        expect(getCellSiblingsAsString(board.cells.get("h6"))).toBe("h7    h5g6g7");
        expect(getCellSiblingsAsString(board.cells.get("a7"))).toBe("a8b7b6a6    ");
        expect(getCellSiblingsAsString(board.cells.get("b7"))).toBe("b8c8c7b6a7a8");
        expect(getCellSiblingsAsString(board.cells.get("c7"))).toBe("c8d7d6c6b6b7");
        expect(getCellSiblingsAsString(board.cells.get("d7"))).toBe("d8e8e7d6c7c8");
        expect(getCellSiblingsAsString(board.cells.get("e7"))).toBe("e8f7f6e6d6d7");
        expect(getCellSiblingsAsString(board.cells.get("f7"))).toBe("f8g8g7f6e7e8");
        expect(getCellSiblingsAsString(board.cells.get("g7"))).toBe("g8h7h6g6f6f7");
        expect(getCellSiblingsAsString(board.cells.get("h7"))).toBe("h8    h6g7g8");
        expect(getCellSiblingsAsString(board.cells.get("a8"))).toBe("  b8b7a7    ");
        expect(getCellSiblingsAsString(board.cells.get("b8"))).toBe("    c8b7a8  ");
        expect(getCellSiblingsAsString(board.cells.get("c8"))).toBe("  d8d7c7b7b8");
        expect(getCellSiblingsAsString(board.cells.get("d8"))).toBe("    e8d7c8  ");
        expect(getCellSiblingsAsString(board.cells.get("e8"))).toBe("  f8f7e7d7d8");
        expect(getCellSiblingsAsString(board.cells.get("f8"))).toBe("    g8f7e8  ");
        expect(getCellSiblingsAsString(board.cells.get("g8"))).toBe("  h8h7g7f7f8");
        expect(getCellSiblingsAsString(board.cells.get("h8"))).toBe("      h7g8  ");
    });

    test('link Cells on 8x10 Board', () => {
        const board = new Board(Size.SIZE_8X10);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2g2g1  e1e2");
        expect(getCellSiblingsAsString(board.cells.get("g1"))).toBe("g2h1      f1");
        expect(getCellSiblingsAsString(board.cells.get("h1"))).toBe("h2      g1g2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3g3g2f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("g2"))).toBe("g3h2h1g1f1f2");
        expect(getCellSiblingsAsString(board.cells.get("h2"))).toBe("h3    h1g2g3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4g4g3f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("g3"))).toBe("g4h3h2g2f2f3");
        expect(getCellSiblingsAsString(board.cells.get("h3"))).toBe("h4    h2g3g4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5g5g4f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("g4"))).toBe("g5h4h3g3f3f4");
        expect(getCellSiblingsAsString(board.cells.get("h4"))).toBe("h5    h3g4g5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6g6g5f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("g5"))).toBe("g6h5h4g4f4f5");
        expect(getCellSiblingsAsString(board.cells.get("h5"))).toBe("h6    h4g5g6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("a7b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("b7c7c6b5a6a7");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("c7d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("d7e7e6d5c6c7");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("e7f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("f7g7g6f5e6e7");
        expect(getCellSiblingsAsString(board.cells.get("g6"))).toBe("g7h6h5g5f5f6");
        expect(getCellSiblingsAsString(board.cells.get("h6"))).toBe("h7    h5g6g7");
        expect(getCellSiblingsAsString(board.cells.get("a7"))).toBe("a8b7b6a6    ");
        expect(getCellSiblingsAsString(board.cells.get("b7"))).toBe("b8c8c7b6a7a8");
        expect(getCellSiblingsAsString(board.cells.get("c7"))).toBe("c8d7d6c6b6b7");
        expect(getCellSiblingsAsString(board.cells.get("d7"))).toBe("d8e8e7d6c7c8");
        expect(getCellSiblingsAsString(board.cells.get("e7"))).toBe("e8f7f6e6d6d7");
        expect(getCellSiblingsAsString(board.cells.get("f7"))).toBe("f8g8g7f6e7e8");
        expect(getCellSiblingsAsString(board.cells.get("g7"))).toBe("g8h7h6g6f6f7");
        expect(getCellSiblingsAsString(board.cells.get("h7"))).toBe("h8    h6g7g8");
        expect(getCellSiblingsAsString(board.cells.get("a8"))).toBe("a9b8b7a7    ");
        expect(getCellSiblingsAsString(board.cells.get("b8"))).toBe("b9c9c8b7a8a9");
        expect(getCellSiblingsAsString(board.cells.get("c8"))).toBe("c9d8d7c7b7b8");
        expect(getCellSiblingsAsString(board.cells.get("d8"))).toBe("d9e9e8d7c8c9");
        expect(getCellSiblingsAsString(board.cells.get("e8"))).toBe("e9f8f7e7d7d8");
        expect(getCellSiblingsAsString(board.cells.get("f8"))).toBe("f9g9g8f7e8e9");
        expect(getCellSiblingsAsString(board.cells.get("g8"))).toBe("g9h8h7g7f7f8");
        expect(getCellSiblingsAsString(board.cells.get("h8"))).toBe("h9    h7g8g9");
        expect(getCellSiblingsAsString(board.cells.get("a9"))).toBe("a10b9b8a8    ");
        expect(getCellSiblingsAsString(board.cells.get("a10"))).toBe("  b10b9a9    ");
        expect(getCellSiblingsAsString(board.cells.get("h10"))).toBe("      h9g10  ");
        expect(getCellSiblingsAsString(board.cells.get("c9"))).toBe("c10d9d8c8b8b9");
        expect(getCellSiblingsAsString(board.cells.get("e9"))).toBe("e10f9f8e8d8d9");
        expect(getCellSiblingsAsString(board.cells.get("g9"))).toBe("g10h9h8g8f8f9");
        expect(getCellSiblingsAsString(board.cells.get("h9"))).toBe("h10    h8g9g10");
        expect(getCellSiblingsAsString(board.cells.get("b9"))).toBe("b10c10c9b8a9a10");
        expect(getCellSiblingsAsString(board.cells.get("d9"))).toBe("d10e10e9d8c9c10");
        expect(getCellSiblingsAsString(board.cells.get("f9"))).toBe("f10g10g9f8e9e10");
        expect(getCellSiblingsAsString(board.cells.get("b10"))).toBe("    c10b9a10  ");
        expect(getCellSiblingsAsString(board.cells.get("c10"))).toBe("  d10d9c9b9b10");
        expect(getCellSiblingsAsString(board.cells.get("d10"))).toBe("    e10d9c10  ");
        expect(getCellSiblingsAsString(board.cells.get("e10"))).toBe("  f10f9e9d9d10");
        expect(getCellSiblingsAsString(board.cells.get("f10"))).toBe("    g10f9e10  ");
        expect(getCellSiblingsAsString(board.cells.get("g10"))).toBe("  h10h9g9f9f10");
    });

    test('link Cells on 10x8 Board', () => {
        const board = new Board(Size.SIZE_10X8);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2g2g1  e1e2");
        expect(getCellSiblingsAsString(board.cells.get("g1"))).toBe("g2h1      f1");
        expect(getCellSiblingsAsString(board.cells.get("h1"))).toBe("h2i2i1  g1g2");
        expect(getCellSiblingsAsString(board.cells.get("i1"))).toBe("i2j1      h1");
        expect(getCellSiblingsAsString(board.cells.get("j1"))).toBe("j2      i1i2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3g3g2f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("g2"))).toBe("g3h2h1g1f1f2");
        expect(getCellSiblingsAsString(board.cells.get("h2"))).toBe("h3i3i2h1g2g3");
        expect(getCellSiblingsAsString(board.cells.get("i2"))).toBe("i3j2j1i1h1h2");
        expect(getCellSiblingsAsString(board.cells.get("j2"))).toBe("j3    j1i2i3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4g4g3f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("g3"))).toBe("g4h3h2g2f2f3");
        expect(getCellSiblingsAsString(board.cells.get("h3"))).toBe("h4i4i3h2g3g4");
        expect(getCellSiblingsAsString(board.cells.get("i3"))).toBe("i4j3j2i2h2h3");
        expect(getCellSiblingsAsString(board.cells.get("j3"))).toBe("j4    j2i3i4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5g5g4f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("g4"))).toBe("g5h4h3g3f3f4");
        expect(getCellSiblingsAsString(board.cells.get("h4"))).toBe("h5i5i4h3g4g5");
        expect(getCellSiblingsAsString(board.cells.get("i4"))).toBe("i5j4j3i3h3h4");
        expect(getCellSiblingsAsString(board.cells.get("j4"))).toBe("j5    j3i4i5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6g6g5f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("g5"))).toBe("g6h5h4g4f4f5");
        expect(getCellSiblingsAsString(board.cells.get("h5"))).toBe("h6i6i5h4g5g6");
        expect(getCellSiblingsAsString(board.cells.get("i5"))).toBe("i6j5j4i4h4h5");
        expect(getCellSiblingsAsString(board.cells.get("j5"))).toBe("j6    j4i5i6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("a7b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("b7c7c6b5a6a7");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("c7d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("d7e7e6d5c6c7");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("e7f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("f7g7g6f5e6e7");
        expect(getCellSiblingsAsString(board.cells.get("g6"))).toBe("g7h6h5g5f5f6");
        expect(getCellSiblingsAsString(board.cells.get("h6"))).toBe("h7i7i6h5g6g7");
        expect(getCellSiblingsAsString(board.cells.get("i6"))).toBe("i7j6j5i5h5h6");
        expect(getCellSiblingsAsString(board.cells.get("j6"))).toBe("j7    j5i6i7");
        expect(getCellSiblingsAsString(board.cells.get("a7"))).toBe("a8b7b6a6    ");
        expect(getCellSiblingsAsString(board.cells.get("b7"))).toBe("b8c8c7b6a7a8");
        expect(getCellSiblingsAsString(board.cells.get("c7"))).toBe("c8d7d6c6b6b7");
        expect(getCellSiblingsAsString(board.cells.get("d7"))).toBe("d8e8e7d6c7c8");
        expect(getCellSiblingsAsString(board.cells.get("e7"))).toBe("e8f7f6e6d6d7");
        expect(getCellSiblingsAsString(board.cells.get("f7"))).toBe("f8g8g7f6e7e8");
        expect(getCellSiblingsAsString(board.cells.get("g7"))).toBe("g8h7h6g6f6f7");
        expect(getCellSiblingsAsString(board.cells.get("h7"))).toBe("h8i8i7h6g7g8");
        expect(getCellSiblingsAsString(board.cells.get("i7"))).toBe("i8j7j6i6h6h7");
        expect(getCellSiblingsAsString(board.cells.get("j7"))).toBe("j8    j6i7i8");
        expect(getCellSiblingsAsString(board.cells.get("a8"))).toBe("  b8b7a7    ");
        expect(getCellSiblingsAsString(board.cells.get("b8"))).toBe("    c8b7a8  ");
        expect(getCellSiblingsAsString(board.cells.get("c8"))).toBe("  d8d7c7b7b8");
        expect(getCellSiblingsAsString(board.cells.get("d8"))).toBe("    e8d7c8  ");
        expect(getCellSiblingsAsString(board.cells.get("e8"))).toBe("  f8f7e7d7d8");
        expect(getCellSiblingsAsString(board.cells.get("f8"))).toBe("    g8f7e8  ");
        expect(getCellSiblingsAsString(board.cells.get("g8"))).toBe("  h8h7g7f7f8");
        expect(getCellSiblingsAsString(board.cells.get("h8"))).toBe("    i8h7g8  ");
        expect(getCellSiblingsAsString(board.cells.get("i8"))).toBe("  j8j7i7h7h8");
        expect(getCellSiblingsAsString(board.cells.get("j8"))).toBe("      j7i8  ");
    });

    test('link Cells on 10x10 Board', () => {
        const board = new Board(Size.SIZE_10X10);
        expect(getCellSiblingsAsString(board.cells.get("a1"))).toBe("a2b1        ");
        expect(getCellSiblingsAsString(board.cells.get("b1"))).toBe("b2c2c1  a1a2");
        expect(getCellSiblingsAsString(board.cells.get("c1"))).toBe("c2d1      b1");
        expect(getCellSiblingsAsString(board.cells.get("d1"))).toBe("d2e2e1  c1c2");
        expect(getCellSiblingsAsString(board.cells.get("e1"))).toBe("e2f1      d1");
        expect(getCellSiblingsAsString(board.cells.get("f1"))).toBe("f2g2g1  e1e2");
        expect(getCellSiblingsAsString(board.cells.get("g1"))).toBe("g2h1      f1");
        expect(getCellSiblingsAsString(board.cells.get("h1"))).toBe("h2i2i1  g1g2");
        expect(getCellSiblingsAsString(board.cells.get("i1"))).toBe("i2j1      h1");
        expect(getCellSiblingsAsString(board.cells.get("j1"))).toBe("j2      i1i2");
        expect(getCellSiblingsAsString(board.cells.get("a2"))).toBe("a3b2b1a1    ");
        expect(getCellSiblingsAsString(board.cells.get("b2"))).toBe("b3c3c2b1a2a3");
        expect(getCellSiblingsAsString(board.cells.get("c2"))).toBe("c3d2d1c1b1b2");
        expect(getCellSiblingsAsString(board.cells.get("d2"))).toBe("d3e3e2d1c2c3");
        expect(getCellSiblingsAsString(board.cells.get("e2"))).toBe("e3f2f1e1d1d2");
        expect(getCellSiblingsAsString(board.cells.get("f2"))).toBe("f3g3g2f1e2e3");
        expect(getCellSiblingsAsString(board.cells.get("g2"))).toBe("g3h2h1g1f1f2");
        expect(getCellSiblingsAsString(board.cells.get("h2"))).toBe("h3i3i2h1g2g3");
        expect(getCellSiblingsAsString(board.cells.get("i2"))).toBe("i3j2j1i1h1h2");
        expect(getCellSiblingsAsString(board.cells.get("j2"))).toBe("j3    j1i2i3");
        expect(getCellSiblingsAsString(board.cells.get("a3"))).toBe("a4b3b2a2    ");
        expect(getCellSiblingsAsString(board.cells.get("b3"))).toBe("b4c4c3b2a3a4");
        expect(getCellSiblingsAsString(board.cells.get("c3"))).toBe("c4d3d2c2b2b3");
        expect(getCellSiblingsAsString(board.cells.get("d3"))).toBe("d4e4e3d2c3c4");
        expect(getCellSiblingsAsString(board.cells.get("e3"))).toBe("e4f3f2e2d2d3");
        expect(getCellSiblingsAsString(board.cells.get("f3"))).toBe("f4g4g3f2e3e4");
        expect(getCellSiblingsAsString(board.cells.get("g3"))).toBe("g4h3h2g2f2f3");
        expect(getCellSiblingsAsString(board.cells.get("h3"))).toBe("h4i4i3h2g3g4");
        expect(getCellSiblingsAsString(board.cells.get("i3"))).toBe("i4j3j2i2h2h3");
        expect(getCellSiblingsAsString(board.cells.get("j3"))).toBe("j4    j2i3i4");
        expect(getCellSiblingsAsString(board.cells.get("a4"))).toBe("a5b4b3a3    ");
        expect(getCellSiblingsAsString(board.cells.get("b4"))).toBe("b5c5c4b3a4a5");
        expect(getCellSiblingsAsString(board.cells.get("c4"))).toBe("c5d4d3c3b3b4");
        expect(getCellSiblingsAsString(board.cells.get("d4"))).toBe("d5e5e4d3c4c5");
        expect(getCellSiblingsAsString(board.cells.get("e4"))).toBe("e5f4f3e3d3d4");
        expect(getCellSiblingsAsString(board.cells.get("f4"))).toBe("f5g5g4f3e4e5");
        expect(getCellSiblingsAsString(board.cells.get("g4"))).toBe("g5h4h3g3f3f4");
        expect(getCellSiblingsAsString(board.cells.get("h4"))).toBe("h5i5i4h3g4g5");
        expect(getCellSiblingsAsString(board.cells.get("i4"))).toBe("i5j4j3i3h3h4");
        expect(getCellSiblingsAsString(board.cells.get("j4"))).toBe("j5    j3i4i5");
        expect(getCellSiblingsAsString(board.cells.get("a5"))).toBe("a6b5b4a4    ");
        expect(getCellSiblingsAsString(board.cells.get("b5"))).toBe("b6c6c5b4a5a6");
        expect(getCellSiblingsAsString(board.cells.get("c5"))).toBe("c6d5d4c4b4b5");
        expect(getCellSiblingsAsString(board.cells.get("d5"))).toBe("d6e6e5d4c5c6");
        expect(getCellSiblingsAsString(board.cells.get("e5"))).toBe("e6f5f4e4d4d5");
        expect(getCellSiblingsAsString(board.cells.get("f5"))).toBe("f6g6g5f4e5e6");
        expect(getCellSiblingsAsString(board.cells.get("g5"))).toBe("g6h5h4g4f4f5");
        expect(getCellSiblingsAsString(board.cells.get("h5"))).toBe("h6i6i5h4g5g6");
        expect(getCellSiblingsAsString(board.cells.get("i5"))).toBe("i6j5j4i4h4h5");
        expect(getCellSiblingsAsString(board.cells.get("j5"))).toBe("j6    j4i5i6");
        expect(getCellSiblingsAsString(board.cells.get("a6"))).toBe("a7b6b5a5    ");
        expect(getCellSiblingsAsString(board.cells.get("b6"))).toBe("b7c7c6b5a6a7");
        expect(getCellSiblingsAsString(board.cells.get("c6"))).toBe("c7d6d5c5b5b6");
        expect(getCellSiblingsAsString(board.cells.get("d6"))).toBe("d7e7e6d5c6c7");
        expect(getCellSiblingsAsString(board.cells.get("e6"))).toBe("e7f6f5e5d5d6");
        expect(getCellSiblingsAsString(board.cells.get("f6"))).toBe("f7g7g6f5e6e7");
        expect(getCellSiblingsAsString(board.cells.get("g6"))).toBe("g7h6h5g5f5f6");
        expect(getCellSiblingsAsString(board.cells.get("h6"))).toBe("h7i7i6h5g6g7");
        expect(getCellSiblingsAsString(board.cells.get("i6"))).toBe("i7j6j5i5h5h6");
        expect(getCellSiblingsAsString(board.cells.get("j6"))).toBe("j7    j5i6i7");
        expect(getCellSiblingsAsString(board.cells.get("a7"))).toBe("a8b7b6a6    ");
        expect(getCellSiblingsAsString(board.cells.get("b7"))).toBe("b8c8c7b6a7a8");
        expect(getCellSiblingsAsString(board.cells.get("c7"))).toBe("c8d7d6c6b6b7");
        expect(getCellSiblingsAsString(board.cells.get("d7"))).toBe("d8e8e7d6c7c8");
        expect(getCellSiblingsAsString(board.cells.get("e7"))).toBe("e8f7f6e6d6d7");
        expect(getCellSiblingsAsString(board.cells.get("f7"))).toBe("f8g8g7f6e7e8");
        expect(getCellSiblingsAsString(board.cells.get("g7"))).toBe("g8h7h6g6f6f7");
        expect(getCellSiblingsAsString(board.cells.get("h7"))).toBe("h8i8i7h6g7g8");
        expect(getCellSiblingsAsString(board.cells.get("i7"))).toBe("i8j7j6i6h6h7");
        expect(getCellSiblingsAsString(board.cells.get("j7"))).toBe("j8    j6i7i8");
        expect(getCellSiblingsAsString(board.cells.get("a8"))).toBe("a9b8b7a7    ");
        expect(getCellSiblingsAsString(board.cells.get("b8"))).toBe("b9c9c8b7a8a9");
        expect(getCellSiblingsAsString(board.cells.get("c8"))).toBe("c9d8d7c7b7b8");
        expect(getCellSiblingsAsString(board.cells.get("d8"))).toBe("d9e9e8d7c8c9");
        expect(getCellSiblingsAsString(board.cells.get("e8"))).toBe("e9f8f7e7d7d8");
        expect(getCellSiblingsAsString(board.cells.get("f8"))).toBe("f9g9g8f7e8e9");
        expect(getCellSiblingsAsString(board.cells.get("g8"))).toBe("g9h8h7g7f7f8");
        expect(getCellSiblingsAsString(board.cells.get("h8"))).toBe("h9i9i8h7g8g9");
        expect(getCellSiblingsAsString(board.cells.get("i8"))).toBe("i9j8j7i7h7h8");
        expect(getCellSiblingsAsString(board.cells.get("j8"))).toBe("j9    j7i8i9");
        expect(getCellSiblingsAsString(board.cells.get("a10"))).toBe("  b10b9a9    ");
        expect(getCellSiblingsAsString(board.cells.get("j10"))).toBe("      j9i10  ");
        expect(getCellSiblingsAsString(board.cells.get("a9"))).toBe("a10b9b8a8    ");
        expect(getCellSiblingsAsString(board.cells.get("c9"))).toBe("c10d9d8c8b8b9");
        expect(getCellSiblingsAsString(board.cells.get("e9"))).toBe("e10f9f8e8d8d9");
        expect(getCellSiblingsAsString(board.cells.get("g9"))).toBe("g10h9h8g8f8f9");
        expect(getCellSiblingsAsString(board.cells.get("i9"))).toBe("i10j9j8i8h8h9");
        expect(getCellSiblingsAsString(board.cells.get("b10"))).toBe("    c10b9a10  ");
        expect(getCellSiblingsAsString(board.cells.get("j9"))).toBe("j10    j8i9i10");
        expect(getCellSiblingsAsString(board.cells.get("f10"))).toBe("    g10f9e10  ");
        expect(getCellSiblingsAsString(board.cells.get("c10"))).toBe("  d10d9c9b9b10");
        expect(getCellSiblingsAsString(board.cells.get("d10"))).toBe("    e10d9c10  ");
        expect(getCellSiblingsAsString(board.cells.get("e10"))).toBe("  f10f9e9d9d10");
        expect(getCellSiblingsAsString(board.cells.get("g10"))).toBe("  h10h9g9f9f10");
        expect(getCellSiblingsAsString(board.cells.get("h10"))).toBe("    i10h9g10  ");
        expect(getCellSiblingsAsString(board.cells.get("i10"))).toBe("  j10j9i9h9h10");
        expect(getCellSiblingsAsString(board.cells.get("b9"))).toBe("b10c10c9b8a9a10");
        expect(getCellSiblingsAsString(board.cells.get("d9"))).toBe("d10e10e9d8c9c10");
        expect(getCellSiblingsAsString(board.cells.get("f9"))).toBe("f10g10g9f8e9e10");
        expect(getCellSiblingsAsString(board.cells.get("h9"))).toBe("h10i10i9h8g9g10");
    });
});
