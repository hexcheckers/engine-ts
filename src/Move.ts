import Cell from "./Cell.js";
import Board from "./Board.js";
import Piece from "./Piece.js";

export enum Direction {
    TOP_LEFT, TOP_MIDDLE, TOP_RIGHT,
    BOTTOM_LEFT, BOTTOM_MIDDLE, BOTTOM_RIGHT
}

export default class Move {
    public readonly direction: Direction;
    public srcCell: Cell;
    public dstCell: Cell;
    public srcPieceIsKing = false;
    public dstPieceIsKing = false;
    public piece: Piece;
    public capturePiece?: Piece = null;
    public next?: Move = null;
    public previous?: Move = null;
    public score: number = Number.MIN_SAFE_INTEGER;

    constructor(srcCell: Cell, dstCell: Cell, capturePiece = null, previous = null) {
        this.srcCell = srcCell;
        this.dstCell = dstCell;
        this.capturePiece = capturePiece;
        this.previous = previous;
        this.direction = Move.detectMoveDirection(srcCell, dstCell);
        this.piece = srcCell.piece;
        if (this.piece) {
            this.srcPieceIsKing = this.piece.isKing;
            this.dstPieceIsKing = this.dstCell.isKingCellForColor(this.piece.color);
        }
        if (this.previous) {
            if (this.previous.dstPieceIsKing) {
                this.srcPieceIsKing = true;
                this.dstPieceIsKing = true;
            }
            this.previous.next = this;
        }
    }

    public toString(): string {
        const delimiter = this.isCaptured() ? ":" : "-";
        let moveString = this.srcCell.name + delimiter + this.dstCell.name;
        let tmpMove: Move = this as Move;
        while (tmpMove.hasNext()) {
            tmpMove = tmpMove.next;
            moveString += delimiter + tmpMove.dstCell.name;
        }
        return moveString;
    }

    public asString(full = false): string {
        if (full) {
            return this.toString();
        }
        return this.srcCell.name + (this.isCaptured() ? ":" : "-") + this.dstCell.name;
    }

    public isCaptured(): boolean {
        return this.capturePiece !== null;
    }

    public setNext(move: Move|null): void {
        this.next = move;
        if (move) {
            move.previous = this;
        }
    }

    public hasNext(): boolean {
        return this.next !== null;
    }

    public hasPrevious(): boolean {
        return this.previous !== null;
    }

    public root(): Move {
        let root: Move = this as Move;
        while (root.hasPrevious()) {
            root = root.previous;
        }
        return root;
    }

    public end(): Move {
        let end: Move = this as Move;
        while (end.hasNext()) {
            end = end.next;
        }
        return end;
    }

    public copy(): Move {
        let currentMove: Move = this.root();
        let copy = this.copyOneMove(currentMove);
        while (currentMove.hasNext()) {
            currentMove = currentMove.next;
            const nextMove = this.copyOneMove(currentMove);
            copy.next = nextMove;
            nextMove.previous = copy;
            copy = copy.next;
        }
        return copy;
    }

    private copyOneMove(move: Move): Move {
        const copy = new Move(move.srcCell, move.dstCell, move.capturePiece);
        copy.piece = move.piece;
        copy.srcPieceIsKing = move.srcPieceIsKing;
        copy.dstPieceIsKing = move.dstPieceIsKing;
        return copy;
    }

    public static isMoveStringRepresentationValid(stringRepresentation: string): boolean {
        return !!stringRepresentation.match(/^[a-j][1-9]0*[-:][a-j][1-9]0*([-:][a-j][1-9]0*)*$/);
    }

    public static detectMoveDirection(srcCell: Cell, dstCell: Cell): Direction {
        if (srcCell.name === dstCell.name) {
            throw new Error ("Cells should be different");
        }

        if (dstCell.col < srcCell.col) {
            return dstCell.row < srcCell.row ? Direction.BOTTOM_LEFT : Direction.TOP_LEFT;
        } else if (dstCell.col === srcCell.col) {
            return dstCell.row < srcCell.row ? Direction.BOTTOM_MIDDLE : Direction.TOP_MIDDLE;
        } else {
            return dstCell.row < srcCell.row ? Direction.BOTTOM_RIGHT : Direction.TOP_RIGHT;
        }
    }

    public static detectCapturePiece(board: Board, srcCell: string, dstCell: string): Piece {
        if (!board.isCellExists(srcCell)) {
            throw new Error(`Source cell "${srcCell}" does not exists on the board.`);
        }
        if (!board.isCellExistsAndEmpty(dstCell)) {
            throw new Error(`Empty destination cell "${dstCell}" does not exists on the board.`);
        }
        return Move.detectCapturePieceByCells(board.cells.get(srcCell), board.cells.get(dstCell));
    }

    public static detectCapturePieceByCells(srcCell: Cell, dstCell: Cell): Piece {
        if (srcCell.isEmpty()) {
            throw new Error(`Source cell "${srcCell.name}" is empty.`);
        }
        if (!dstCell.isEmpty()) {
            throw new Error(`Destination cell "${srcCell.name}" is not empty.`);
        }

        const moveDirection = Move.detectMoveDirection(srcCell, dstCell);
        let targetCell;
        if (srcCell.piece.isKing) {
            targetCell = srcCell.getSiblingCell(moveDirection);
            while (targetCell != null && targetCell.isEmpty() && targetCell.name != dstCell.name) {
                targetCell = targetCell.getSiblingCell(moveDirection);
            }
        } else {
            targetCell = srcCell.getSiblingCell(moveDirection);
        }
        if (targetCell != null && !targetCell.isEmpty() && targetCell.name != dstCell.name && targetCell.piece.color != srcCell.piece.color) {
            return targetCell.piece;
        }

        throw new Error(`No capture piece detected between "${srcCell.name}" and "${dstCell.name}" cells.`);
    }
}
