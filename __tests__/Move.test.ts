import Board, {Size} from "../src/Board.js";
import {
    getCustomBoard6x6_2HcFen,
    getCustomBoard6x6_3HcFen,
    getCustomBoard6x6_4HcFen,
    getCustomBoard6x6_5HcFen,
    getCustomBoard6x6_6HcFen,
    getCustomBoard6x6_7HcFen,
    movesListToStringList
} from "./helper.js";
import {Color} from "../src/Piece.js";
import Move from "../src/Move.js";

describe('Testing available moves', () => {
    test('available moves default Board 6x6', () => {
        const expectedMovesColorA = ["a2-a3", "b2-a3", "b2-b3", "b2-c3", "c2-c3", "d2-c3", "d2-d3", "d2-e3", "e2-e3", "f2-e3", "f2-f3"];
        const expectedMovesColorB = ["a5-a4", "a5-b4", "b5-b4", "c5-b4", "c5-c4", "c5-d4", "d5-d4", "e5-d4", "e5-e4", "e5-f4", "f5-f4"];
        const expectedAllMoves = expectedMovesColorA.concat(expectedMovesColorB);

        const board = new Board(Size.SIZE_6X6, true);

        const allMoves = movesListToStringList(board.getAvailableMoves());
        expect(allMoves.length).toBe(expectedAllMoves.length);
        expect(allMoves).toStrictEqual(expectedAllMoves);

        const movesA = movesListToStringList(board.getAvailableMovesForColor(Color.A));
        expect(movesA.length).toBe(expectedMovesColorA.length);
        expect(movesA).toStrictEqual(expectedMovesColorA);

        const movesB = movesListToStringList(board.getAvailableMovesForColor(Color.B));
        expect(movesB.length).toBe(expectedMovesColorB.length);
        expect(movesB).toStrictEqual(expectedMovesColorB);
    });

    test('available regular king moves on custom Board 6x6 2', () => {
        const expectedMoves = ["b1-a2", "b1-b2", "b1-b3", "b1-b4", "b1-b5", "b1-b6", "b1-c2", "b1-d2", "b1-e3", "b1-f3", "b1-a1", "b1-c1"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_2HcFen());
        const moves = movesListToStringList(board.getAvailableMoves());
        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available captured men moves on custom Board 6x6 3', () => {
        const expectedMoves = ["b1:d2", "c2:a1"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_3HcFen());
        const moves = movesListToStringList(board.getAvailableMoves());
        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available captured king moves on custom Board 6x6 4', () => {
        const expectedMoves = ["b1:d2", "b1:e3", "b1:f3", "c2:a1"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_4HcFen());
        const moves = movesListToStringList(board.getAvailableMoves());

        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available captured king moves on custom Board 6x6 5', () => {
        const expectedMoves = ["b1:d2:b3", "b1:d2:f3", "c2:a1"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_5HcFen());
        const moves = movesListToStringList(board.getAvailableMoves());

        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available captured king moves on custom Board 6x6 6', () => {
        const expectedMoves = ["b1:d2:b3:b5", "b1:d2:f3", "c2:a1"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        const moves = movesListToStringList(board.getAvailableMoves());

        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available captured king moves on custom Board 6x6 7', () => {
        const expectedMoves = ["b1:b4:d5", "b1:b4:e6", "b1:b4:f6", "b1:b5:f3:b1", "b1:b5:f3:a1", "b1:d2:a4:d5", "b1:d2:a4:e6", "b1:d2:a4:f6", "b1:f3:b5:b2", "b1:f3:b5:b1", "c2:a1"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_7HcFen());
        const moves = movesListToStringList(board.getAvailableMoves());

        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available captured king moves on custom Board 6x6 8', () => {
        const expectedMoves = ["d1:f2", "d5:f6:f2:c4", "d5:f6:f2:b4", "d5:f6:f2:a5", "d5:f6:f1:d2:d4", "d5:f6:f1:d2:d5", "d5:f6:f1:d2:d6", "d5:f6:f1:c3:e4"];

        const board = Board.makeFromHcFen("6x6/---a/----b/---b/-----b/---a/----b");
        const moves = movesListToStringList(board.getAvailableMovesForColor(Color.A));

        expect(moves.length).toBe(expectedMoves.length);
        expect(moves).toStrictEqual(expectedMoves);
    });

    test('available moves after make several moves 1', () => {
        const expectedMoves = ["b5-a6", "b5-b6", "b5-c6"];

        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        board.executeMove(board.buildMove("b1:d2:b3:b5"));

        board.executeMove(board.buildMove("e3-d2"));

        const availableMoves = movesListToStringList(board.getAvailableMovesForColor(Color.A));
        expect(availableMoves).toStrictEqual(expectedMoves);
    });
});

describe('Testing valid moves', () => {
    test('valid moves 1', () => {
        const board = Board.makeFromHcFen("6x6/-aaa/--b////");
        expect(board.isValidMove("b1:d2")).toBe(true);
        expect(board.isValidMove("c1:c3")).toBe(true);
        expect(board.isValidMove("d1:b2")).toBe(true);
        expect(board.isValidMove("b1-a2")).toBe(false);
    });

    test('valid moves 2', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        expect(board.isValidMove("b1:d2:f3")).toBe(true);
        expect(board.isValidMove("b1:d2:b3:b5")).toBe(true);
        expect(board.isValidMove("c2:a1")).toBe(true);
        expect(board.isValidMove("b1-b2")).toBe(false);
        expect(board.isValidMove("c3-b2")).toBe(false);
    });

    test('valid moves 3', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());

        const move = new Move(board.cells.get("b1"), board.cells.get("d2"), board.cells.get("c2").piece);
        expect(board.isValidMove(move)).toBe(false);

        move.setNext(new Move(board.cells.get("d2"), board.cells.get("f3"), board.cells.get("e3").piece));
        expect(board.isValidMove(move)).toBe(true);
    });
});

describe('Testing illegal moves', () => {
    test('illegal moves 1', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        expect(() => board.buildMove("b1-b2")).toThrow();
    });

    test('illegal moves 2', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        const move = new Move(board.cells.get("b1"), board.cells.get("d2"), board.cells.get("c2").piece);
        expect(() => board.executeMove(move)).toThrow();
    });
});

describe('Testing detect capture pieces', () => {
    test('detect capture piece 1', () => {
        const board = Board.makeFromHcFen("6x6/aaaaaa/--b////");
        const piece = Move.detectCapturePiece(board, "b1", "d2");
        expect(piece.cell.name).toBe("c2");
    });

    test('detect capture piece 2', () => {
        const board = Board.makeFromHcFen("6x6//--b/--a///");
        const piece = Move.detectCapturePiece(board, "c3", "c1");
        expect(piece.cell.name).toBe("c2");
    });

    test('detect capture piece 3', () => {
        const board = Board.makeFromHcFen("6x6/A/--b////");
        const piece = Move.detectCapturePiece(board, "a1", "f3");
        expect(piece.cell.name).toBe("c2");
    });
});

describe('Testing moves', () => {
    test('simple move', () => {
        const board = new Board(Size.SIZE_6X6, true);
        board.executeOneMove(new Move(board.cells.get("d2"), board.cells.get("d3")));
        expect(board.toHcFen()).toBe("6x6/aaaaaa/aaa-aa/---a//bbbbbb/bbbbbb");
    });

    test('capture move 1', () => {
        const board = Board.makeFromHcFen("6x6///---a/--b//");
        board.executeOneMove(new Move(board.cells.get("d3"), board.cells.get("b4"), board.cells.get("c4").piece));
        expect(board.toHcFen()).toBe("6x6////-a//");
    });

    test('capture move 2', () => {
        const board = Board.makeFromHcFen("6x6/////-b---a/----b");
        const move1 = new Move(board.cells.get("f5"), board.cells.get("d6"), board.cells.get("e6").piece);
        const move2 = new Move(board.cells.get("d6"), board.cells.get("a5"), board.cells.get("b5").piece);
        move1.setNext(move2);

        board.executeOneMove(move1);
        expect(board.toHcFen()).toBe("6x6/////-b/---Ab");

        board.executeOneMove(move2);
        expect(board.toHcFen()).toBe("6x6/////A/");
    });

    test('capture move 3', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        const move1 = new Move(board.cells.get("b1"), board.cells.get("d2"), board.cells.get("c2").piece);
        const move2 = new Move(board.cells.get("d2"), board.cells.get("f3"), board.cells.get("e3").piece, move1);
        board.executeOneMove(move1);
        board.executeOneMove(move2);
        expect(board.toHcFen()).toBe("6x6///--b--a/-b//");
    });

    test('capture move 4', async () => {
        const board = Board.makeFromHcFen("6x6//-a---b/-b/---a-b/---b/----b");
        board.executeMove(board.buildMove("d4:d6:f5:f3:f1:a4"));
        expect(board.toHcFen()).toBe("6x6//-a//A//");
    });
});

describe('Testing rollback moves', () => {
    test('rollback move 1', () => {
        const board = Board.makeFromHcFen("6x6///---a/--b//");
        const move = new Move(board.cells.get("d3"), board.cells.get("b4"), board.cells.get("c4").piece);

        board.executeOneMove(move);
        expect(board.toHcFen()).toBe("6x6////-a//");

        board.rollbackOneMove(move);
        expect(board.toHcFen()).toBe("6x6///---a/--b//");
    });

    test('rollback move 2', () => {
        const startBoardRepresentation = "6x6/////-b---a/----b";
        const board = Board.makeFromHcFen(startBoardRepresentation);
        const move1 = new Move(board.cells.get("f5"), board.cells.get("d6"), board.cells.get("e6").piece);
        const move2 = new Move(board.cells.get("d6"), board.cells.get("a5"), board.cells.get("b5").piece, move1);

        expect(move1.dstPieceIsKing).toBe(true);

        board.executeOneMove(move1);
        expect(board.toHcFen()).toBe("6x6/////-b/---Ab");

        board.executeOneMove(move2);
        expect(board.toHcFen()).toBe("6x6/////A/");

        board.rollbackOneMove(move2);
        board.rollbackOneMove(move1);

        expect(board.toHcFen()).toBe(startBoardRepresentation);
    });

    test('rollback move 3', () => {
        const startBoardRepresentation = "6x6/////-b---a/----b";
        const board = Board.makeFromHcFen(startBoardRepresentation);
        const move1 = new Move(board.cells.get("f5"), board.cells.get("d6"), board.cells.get("e6").piece);
        const move2 = new Move(board.cells.get("d6"), board.cells.get("a5"), board.cells.get("b5").piece, move1);

        board.executeMove(move1);
        expect(board.toHcFen()).toBe("6x6/////A/");

        board.rollbackMove(move2);

        expect(board.toHcFen()).toBe(startBoardRepresentation);
    });

    test('rollback move 4', () => {
        const startBoardRepresentation = "6x6///B/-b//-----A";
        const board = Board.makeFromHcFen(startBoardRepresentation);
        const move = board.buildMove("f6:a4:a2");

        board.executeMove(move);
        expect(board.toHcFen()).toBe("6x6//A////");

        board.rollbackMove(move);

        expect(board.toHcFen()).toBe(startBoardRepresentation);
    });
});

describe('Testing build moves', () => {
    test('build move from string', () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        const move = board.buildMove("b1:d2:f3");
        expect(move.toString()).toBe("b1:d2:f3");

        board.executeMove(move);
        expect(board.toHcFen()).toBe("6x6///--b--a/-b//");
    });

    test('move representation valid 1', () => {
        const validMoves = ["a1-a2", "a1:a3", "j10-j9", "e2:e4:c5:a4:a2"];
        for (const m of validMoves) {
            expect(Move.isMoveStringRepresentationValid(m)).toBe(true);
        }

        const invalidMoves = ["1234", "qwerty", "a1a2", "a1*a2", "a0-a1", "a11-a12", "s1-s2", "a1", "a1-", "a1-a",
            "a1-a11", "a1:", "a1:a", "a1:a11"];
        for (const m of invalidMoves) {
            expect(Move.isMoveStringRepresentationValid(m)).toBe(false);
        }
    });
});
