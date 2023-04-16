import Piece, {Color} from "./Piece.js";
import Board from "./Board.js";

export default class State {
    public menCountA = 0;
    public menCountB = 0;
    public kingCountA = 0;
    public kingCountB = 0;
    public captureMovesCountA = 0;
    public captureMovesCountB = 0;

    public incPiecesValue(piece: Piece): void {
        if (piece.isKing) {
            this.incKing(piece.color);
        } else {
            this.incMen(piece.color);
        }
    }

    public incMovesValue(piece: Piece): void {
        if (piece.color === Color.A) {
            this.captureMovesCountA++;
        } else {
            this.captureMovesCountB++;
        }
    }

    private incMen(color: Color): void {
        if (color === Color.A) {
            this.menCountA++;
        } else {
            this.menCountB++;
        }
    }

    private incKing(color: Color): void {
        if (color === Color.A) {
            this.kingCountA++;
        } else {
            this.kingCountB++;
        }
    }

    public static build(board: Board): State {
        const boardState = new State();
        for (const cell of board.cells.values()) {
            if (cell.isNotEmpty()) {
                const piece = cell.piece;
                boardState.incPiecesValue(piece);
                if (piece.getAvailableCaptureMoves().length > 0) {
                    boardState.incMovesValue(piece);
                }
            }
        }
        return boardState;
    }
}
