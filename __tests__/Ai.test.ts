import Board from "../src/Board.js";
import {getCustomBoard6x6_6HcFen} from "./helper.js";
import {Color} from "../src/Piece.js";
import Ai from "../src/Ai.js";
import Move from "../src/Move.js";

describe('Testing Ai', () => {
    test('Testing Ai 1', async () => {
        const board = Board.makeFromHcFen(getCustomBoard6x6_6HcFen());
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 4);
        expect(move).toBeInstanceOf(Move);
        expect(move.toString()).toBe("b1:d2:b3:b5");
    });

    test('Testing Ai 2', async () => {
        const board = Board.makeFromHcFen("6x6//-a---b/-b/---a-b/---b/----b");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 2);
        expect(move).toBeInstanceOf(Move);
        expect(move.toString()).toBe("d4:d6:f5:f3:f1:a4");

        board.executeMove(move);
        expect(board.toHcFen()).toBe("6x6//-a//A//");
    });

    test('Testing Ai 3', async () => {
        const expectedMoves = ["d5:f6:f1:d2:d4", "d5:f6:f1:d2:d5", "d5:f6:f1:d2:d6"];
        const board = Board.makeFromHcFen("6x6/---a/----b/---b/-----b/---a/----b");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 2);
        expect(move).toBeInstanceOf(Move);
        expect(expectedMoves).toContain(move.toString());
    });

    test('Testing Ai 4', async () => {
        const expectedMoves = ["d4:d6:f5:f3:c2:a1:a4", "d4:d6:f5:f1:a4:a2:c1", "d4:d6:f5:f1:a4:a1:c2"];
        const board = Board.makeFromHcFen("6x6/-b/-a-b/b/---a-b/---b/b---b");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 4);
        expect(move).toBeInstanceOf(Move);
        expect(expectedMoves).toContain(move.toString());
    });

    test('Testing Ai 5', async () => {
        const board = Board.makeFromHcFen("6x6//--a-a/----b/----b//--a");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 4);
        expect(move).toBeInstanceOf(Move);
        board.executeMove(move);
        expect(board.toHcFen()).toBe("6x6//--a--a/----b/----b//--a");
    });

    test('Testing Ai 6', async () => {
        const expectedMoves = ["e2-d2", "e2-f2"];
        const board = Board.makeFromHcFen("6x6//--a-a/----b/----b//--a");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 2);
        expect(move).toBeInstanceOf(Move);
        board.executeMove(move);
        expect(expectedMoves).toContain(move.toString());
    });

    test('Testing Ai 7', async () => {
        const board = Board.makeFromHcFen("6x6//b--a/---bb/--b/-b--b/----b");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.A, 4);
        expect(move).toBeInstanceOf(Move);
        board.executeMove(move);
        expect(board.toHcFen()).toBe("6x6///-----A/--b//");
    });

    test('Testing Ai 8', async () => {
        const expectedMoves = ["f2-f1", "f4-e4", "f4-f3", "b5-a5", "b5-b4", "b5-c5", "f5-e5"];
        const board = Board.makeFromHcFen("6x6//---a-b/-a-aa/a-a--b/-b---b/");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.B, 4);
        expect(move).toBeInstanceOf(Move);
        board.executeMove(move);
        expect(expectedMoves).toContain(move.toString());
    });

    test('Testing Ai 8', async () => {
        const expectedMoves = ["a6-a5", "a6-b5"];
        const board = Board.makeFromHcFen("6x6/---a-a/-a/a/a//bA");
        const ai = new Ai(board);
        const move = await ai.findBestMove(Color.B);
        expect(move).toBeInstanceOf(Move);
        board.executeMove(move);
        expect(expectedMoves).toContain(move.toString());
    });
});
