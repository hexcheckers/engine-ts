import Cell from "./Cell.js";
import Board from "./Board.js";
import Move, {Direction} from "./Move.js";

export enum Color {
    A, B
}

export default class Piece {
    public cell: Cell;
    public color: Color;
    public isKing: boolean;

    constructor(cell: Cell, color: Color, isKing = false) {
        this.cell = cell;
        this.color = color;
        this.isKing = isKing;
        cell.piece = this;
    }

    public toString(): string {
        return `${this.getSign()}@${this.getCellName()}`;
    }

    public getSign(): string {
        let sign: string = this.color === Color.A ? "a" : "b";
        if (this.isKing) {
            sign = sign.toUpperCase();
        }
        return sign;
    }

    public getCellName(): string {
        return this.cell.name;
    }

    public copyTo(board: Board): Piece {
        return new Piece(board.cells.get(this.cell.name), this.color, this.isKing);
    }

    public removeFromBoard(): void {
        this.cell.clear();
    }

    public getAvailableRegularMoves(): Move[] {
        const virtualBoard = this.cell.board.copy();
        const piece = Board.findTwinPieceOnBoard(this, virtualBoard);
        const moves: Move[] = this.isKing ? getAvailableRegularKingMoves(piece) : getAvailableRegularMenMoves(piece);
        return Board.assignMovesToBoard(moves, this.cell.board);
    }

    public getAvailableCaptureMoves(): Move[] {
        const virtualBoard = this.cell.board.copy();
        const piece = Board.findTwinPieceOnBoard(this, virtualBoard);
        const moves: Move[] = this.isKing ? getAvailableCaptureKingMoves(piece) : getAvailableCaptureMenMoves(piece);
        return Board.assignMovesToBoard(moves, this.cell.board);
    }

    public static getInvertedColor(color: Color): Color {
        return color === Color.A ? Color.B : Color.A;
    }
}

const getAvailableRegularMenMoves = (piece: Piece): Move[] => {
    const moves: Move[] = [];
    const directions: Direction[] = piece.color === Color.A ? Board.getTopMoveDirections() : Board.getBottomMoveDirections();
    directions.forEach(direction => {
        if (piece.cell.board.isCellExistsAndEmpty(piece.cell.getSiblingCell(direction))) {
            moves.push(new Move(piece.cell, piece.cell.getSiblingCell(direction)));
        }
    });
    return moves;
};

const getAvailableRegularKingMoves = (piece: Piece): Move[] => {
    const moves: Move[] = [];
    for (const direction of Board.getAllMoveDirections()) {
        let tmp = piece.cell;
        while (piece.cell.board.isCellExistsAndEmpty(tmp.getSiblingCell(direction))) {
            moves.push(new Move(piece.cell, tmp.getSiblingCell(direction)));
            tmp = tmp.getSiblingCell(direction);
        }
    }
    return moves;
};

const getAvailableCaptureMenMoves = (piece: Piece): Move[] => {
    const moves: Map<string, Move> = new Map<string, Move>();
    const capturedPieces: Map<string, Piece> = new Map<string, Piece>();
    buildAvailableCaptureMenMoves(piece, moves, capturedPieces);
    const result: Move[] = [];
    for (const m of moves.values()) {
        result.push(m);
    }
    return result;
};

const buildAvailableCaptureMenMoves = (piece: Piece, queue: Map<string, Move>, capturedPieces: Map<string, Piece>, parentMove: Move|null = null): boolean => {
    if (piece.isKing || (parentMove && (parentMove.srcPieceIsKing || parentMove.dstPieceIsKing))) {
        return buildAvailableCaptureKingMoves(piece, queue, capturedPieces, parentMove);
    }

    if (parentMove) {
        piece.cell.board.executeOneMove(parentMove, false);
        if (parentMove.isCaptured()) {
            capturedPieces.set(parentMove.capturePiece.toString(), parentMove.capturePiece);
        }
    }

    const cell: Cell = parentMove?.dstCell || piece.cell;
    let move: Move|null = null;

    for (const direction of Board.getAllMoveDirections()) {
        const siblingCell = cell.getSiblingCell(direction);
        const targetCell = siblingCell?.getSiblingCell(direction);
        if (siblingCell && targetCell && !siblingCell.isEmpty() && targetCell.isEmpty()
            && siblingCell.piece?.color != piece.color
            && (!parentMove || parentMove.direction !== Board.getInvertedDirection(direction))
            && !capturedPieces.has(siblingCell.piece.toString())
        ) {
            move = new Move(cell, targetCell, siblingCell.piece, parentMove?.copy());
            if (!buildAvailableCaptureMenMoves(piece, queue, capturedPieces, move)) {
                queue.set(move.toString(), move.root());
            }
        }
    }

    if (parentMove) {
        piece.cell.board.rollbackOneMove(parentMove)
        if (parentMove.isCaptured()) {
            capturedPieces.delete(parentMove.capturePiece.toString());
        }
    }

    return !!move;
};

const getAvailableCaptureKingMoves = (piece: Piece): Move[] => {
    const moves: Map<string, Move> = new Map<string, Move>();
    const capturedPieces: Map<string, Piece> = new Map<string, Piece>();
    buildAvailableCaptureKingMoves(piece, moves, capturedPieces);
    const result: Move[] = [];
    for (const m of moves.values()) {
        result.push(m);
    }
    return result;
};

const buildAvailableCaptureKingMoves = (piece: Piece, queue: Map<string, Move>, capturedPieces: Map<string, Piece>, parentMove: Move|null = null): boolean => {
    if (parentMove) {
        piece.cell.board.executeOneMove(parentMove, false);
        if (parentMove.isCaptured()) {
            capturedPieces.set(parentMove.capturePiece.toString(), parentMove.capturePiece);
        }
    }

    const cell: Cell = parentMove?.dstCell || piece.cell || null;
    let enemyPieceCell: Cell|null = null;
    let emptyCell: Cell|null = null;
    let move: Move|null = null;

    for (const direction of Board.getAllMoveDirections()) {
        if (!parentMove || parentMove.direction !== Board.getInvertedDirection(direction)) {
            enemyPieceCell = cell.getSiblingCell(direction);
            while (enemyPieceCell && enemyPieceCell.isEmpty()) {
                enemyPieceCell = enemyPieceCell.getSiblingCell(direction);
            }
            if (enemyPieceCell) {
                if (enemyPieceCell.isNotEmpty()
                    && enemyPieceCell.getSiblingCell(direction)
                    && enemyPieceCell?.piece?.color !== piece.color
                    && !capturedPieces.has(enemyPieceCell.piece.toString())
                ) {
                    emptyCell = enemyPieceCell.getSiblingCell(direction);
                    let capturedMovesExists = false;
                    const regularMoves: Move[] = [];
                    while (emptyCell) {
                        if (emptyCell.isNotEmpty()) {
                            break;
                        }
                        move = new Move(cell, emptyCell, enemyPieceCell.piece, parentMove?.copy());
                        regularMoves.push(move.root());
                        if (buildAvailableCaptureKingMoves(piece, queue, capturedPieces, move)) {
                            capturedMovesExists = true;
                        }
                        emptyCell = emptyCell.getSiblingCell(direction);
                    }
                    if (!capturedMovesExists) {
                        regularMoves.forEach(rm => {
                            queue.set(rm.toString(), rm);
                        });
                    }
                }
            }
        }
    }

    if (parentMove) {
        piece.cell.board.rollbackOneMove(parentMove);
        if (parentMove.isCaptured()) {
            capturedPieces.delete(parentMove.capturePiece.toString());
        }
    }

    return !!move;
};
