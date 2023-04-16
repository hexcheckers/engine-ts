import Piece, {Color} from "./Piece.js";
import Board from "./Board.js";
import {Direction} from "./Move.js";

export default class Cell {
    public readonly name: string;
    public readonly board: Board;
    public readonly row: number;
    public readonly col: number;
    public piece?: Piece;
    public topLeft?: Cell = null;
    public topMiddle?: Cell = null;
    public topRight?: Cell = null;
    public bottomLeft?: Cell = null;
    public bottomMiddle?: Cell = null;
    public bottomRight?: Cell = null;

    constructor(board: Board, row: number, col: number) {
        this.board = board;
        this.row = row;
        this.col = col;
        this.name = Cell.getCellNameByCoordinates(row, col);
    }

    public toString(): string {
        return this.name;
    }

    public setPiece(piece: Piece): void {
        this.piece = piece;
        if (piece) {
            piece.cell = this;
        }
    }

    public isEmpty(): boolean {
        return !(this.piece instanceof Piece);
    }

    public isNotEmpty(): boolean {
        return this.piece instanceof Piece;
    }

    public clear(): void {
        this.piece = null;
    }

    public getSiblingCell(direction: Direction): Cell {
        switch (direction) {
            case Direction.TOP_LEFT:
                return this.topLeft;
            case Direction.TOP_MIDDLE:
                return this.topMiddle;
            case Direction.TOP_RIGHT:
                return this.topRight;
            case Direction.BOTTOM_LEFT:
                return this.bottomLeft;
            case Direction.BOTTOM_MIDDLE:
                return this.bottomMiddle;
            case Direction.BOTTOM_RIGHT:
                return this.bottomRight;
        }
    }

    public isKingCellForColor(color: Color): boolean {
        return this.generateKingCells(color).includes(this.name);
    }

    private generateKingCells(color: Color): string[] {
        let cells = color === Color.A ? ["b10", "d10", "f10", "h10", "j10"] : ["a1", "c1", "e1", "g1", "i1"];
        if (color === Color.A && Board.getBoardRowsNumber(this.board.size) === 8) {
            cells = cells.concat(["b8", "d8", "f8", "h8", "j8"]);
        }
        if (color === Color.A && Board.getBoardRowsNumber(this.board.size) === 6) {
            cells = cells.concat(["b6", "d6", "f6", "h6", "j6"]);
        }
        return cells;
    }

    private static getCellNameByCoordinates(row: number, col: number): string {
        return Board.letters[col - 1].toString() + row.toString()
    }
}
