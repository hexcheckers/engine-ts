import Cell from "./Cell.js";
import Piece, {Color} from "./Piece.js";
import Move, {Direction} from "./Move.js";
import State from "./State.js";

export enum Size {
    SIZE_6X6, SIZE_6X8, SIZE_8X6, SIZE_8X8, SIZE_8X10, SIZE_10X8, SIZE_10X10
}

export default class Board {
    public static readonly letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    public readonly size: Size;
    public readonly cells: Map<string, Cell>;
    private readonly positions: Map<number, string>;

    constructor(size: Size, createInitialPieces = false) {
        this.size = size;
        this.positions = this.generateCellsPositionsById();
        this.cells = this.createCells();
        if (createInitialPieces) {
            this.createInitialPieces();
        }
    }

    public toString(): string {
        return this.toHcFen();
    }

    public toHcFen(): string {
        const cols = Board.getBoardColsNumber(this.size);
        const rows = Board.getBoardRowsNumber(this.size);
        let stringRepresentation = `${cols}x${rows}/`;
        let cellId = 1;
        for (let row = 1; row <= rows; row++) {
            let rowString = ""
            for (let col = 1; col <= cols; col++) {
                rowString += this.getPieceSignInCellId(cellId++)
            }
            stringRepresentation += rowString.trimEnd().replace(/ /g, "-")
            if (row < rows) {
                stringRepresentation += "/"
            }
        }
        return stringRepresentation
    }

    /**
     * Create Ascii-string representation of board
     * @return String
     */
    public toAscii(): string {
        const cellsNumber = Board.getBoardCellsNumber(this.size);
        const boardHeight = Board.getBoardRowsNumber(this.size);
        const boardWidth = Board.getBoardColsNumber(this.size);
        let currentCell: number;

        let buffer = "";
        switch (boardWidth) {
            case 6:
                buffer += "       ___     ___     ___\n";
                buffer += `   ___/ ${this.getColoredPieceSignInCellId(cellsNumber - 4)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber - 2)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber)} \\\n`;
                currentCell = cellsNumber - 5;
                break;

            case 8:
                buffer += "       ___     ___     ___     ___\n";
                buffer += `   ___/ ${this.getColoredPieceSignInCellId(cellsNumber - 6)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber - 4)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber - 2)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber)} \\\n`;
                currentCell = cellsNumber - 7;
                break;

            case 10:
            default:
                buffer += "       ___     ___     ___     ___     ___\n";
                buffer += `   ___/ ${this.getColoredPieceSignInCellId(cellsNumber - 8)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber - 6)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber - 4)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber - 2)} \\___/ ${this.getColoredPieceSignInCellId(cellsNumber)} \\\n`;
                currentCell = cellsNumber - 9
                break;
        }

        for (let i = 1; i <= boardHeight; i++) {
            if (boardWidth === 6) {
                buffer += `${boardHeight - i + 1} / ${this.getColoredPieceSignInCellId(currentCell)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 2)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 4)} \\___/\n`;
                if (i < boardHeight) {
                    buffer += `  \\___/ ${this.getColoredPieceSignInCellId(currentCell - 5)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 3)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 1)} \\\n`;
                    currentCell -= 6;
                }
            } else if (boardWidth === 8) {
                buffer += `${(boardHeight - i + 1) % 10} / ${this.getColoredPieceSignInCellId(currentCell)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 2)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 4)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 6)} \\___/\n`;
                if (i < boardHeight) {
                    buffer += `  \\___/ ${this.getColoredPieceSignInCellId(currentCell - 7)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 5)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 3)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 1)} \\\n`;
                    currentCell -= 8;
                }
            } else { // 10
                buffer += `${(boardHeight - i + 1) % 10} / ${this.getColoredPieceSignInCellId(currentCell)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 2)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 4)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 6)} \\___/ ${this.getColoredPieceSignInCellId(currentCell + 8)} \\___/\n`;
                if (i < boardHeight) {
                    buffer += `  \\___/ ${this.getColoredPieceSignInCellId(currentCell - 9)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 7)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 5)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 3)} \\___/ ${this.getColoredPieceSignInCellId(currentCell - 1)} \\\n`;
                    currentCell -= 10;
                }
            }
        }

        switch (boardWidth) {
            case 6:
                buffer += "  \\___/   \\___/   \\___/\n";
                buffer += "    a   b   c   d   e   f";
                break;

            case 8:
                buffer += "  \\___/   \\___/   \\___/   \\___/\n";
                buffer += "    a   b   c   d   e   f   g   h";
                break;

            case 10:
            default:
                buffer += "  \\___/   \\___/   \\___/   \\___/   \\___/\n";
                buffer += "    a   b   c   d   e   f   g   h   i   j";
                break;
        }

        return buffer;
    }

    public isCellExists(cell: Cell | string): boolean {
        if (cell instanceof Cell) {
            return this.cells.has(cell.name);
        } else {
            return this.cells.has(cell);
        }
    }

    public isCellExistsAndEmpty(cell: Cell | string | null): boolean {
        if (cell === null) {
            return false;
        }
        return this.isCellEmpty(cell);
    }

    public getPieceSignInCellId(cellId: number): string {
        const piece: Piece | null = this.getPieceInCell(this.getCellByPosition(cellId));
        return piece ? piece.getSign() : " ";
    }

    public getColoredPieceSignInCellId(cellId: number): string {
        const ANSI_RESET = "\u001B[0m"
        const ANSI_YELLOW = "\u001B[33m"
        const ANSI_BLUE = "\u001B[34m"
        const sign = this.getPieceSignInCellId(cellId);
        switch (sign) {
            case 'a':
            case 'A':
                return `${ANSI_YELLOW}${sign}${ANSI_RESET}`;
            default:
                return `${ANSI_BLUE}${sign}${ANSI_RESET}`;
        }
    }

    public getPieceInCell(cell: Cell | string): Piece | null {
        if (cell instanceof Cell) {
            return cell.piece ?? null;
        } else {
            this.ensureExistsCellWithName(cell);
            return this.cells.get(cell)?.piece;
        }
    }

    public createPieceInCell(cell: Cell, color: Color, isKing = false): Piece {
        return new Piece(cell, color, isKing);
    }

    public createPieceInCellWithName(cellName: string, color: Color, isKing = false): Piece {
        this.ensureExistsCellWithName(cellName);
        return this.createPieceInCell(this.cells.get(cellName), color, isKing);
    }

    public addPiece(cell: Cell | string, color: Color, isKing = false): Piece {
        if (cell instanceof Cell) {
            return this.createPieceInCell(cell, color, isKing);
        } else {
            return this.createPieceInCellWithName(cell, color, isKing);
        }
    }

    public copy(): Board {
        const boardCopy = new Board(this.size);
        this.cells.forEach(cell => {
            if (!cell.isEmpty()) {
                cell.piece.copyTo(boardCopy);
            }
        });
        return boardCopy;
    }

    public clear(): void {
        this.cells.forEach(cell => {
            cell.clear();
        });
    }

    public isCellEmpty(cell: Cell | string): boolean {
        if (cell instanceof Cell) {
            return cell.isEmpty();
        } else {
            this.ensureExistsCellWithName(cell);
            return this.cells.get(cell).isEmpty();
        }
    }

    public isValidMove(move: Move | string, color: Color | null = null): boolean {
        if (move instanceof Move) {
            return this.isValidMoveByMove(move, color);
        } else {
            return this.isValidMoveByString(move, color);
        }
    }

    private isValidMoveByMove(move: Move, color: Color | null = null): boolean {
        const availableMoves = color === null ? this.getAvailableMoves() : this.getAvailableMovesForColor(color);
        for (const m of availableMoves) {
            if (m.toString() === move.toString()) {
                return true;
            }
        }
        return false;
    }

    private isValidMoveByString(moveString: string, color: Color | null = null): boolean {
        if (!Move.isMoveStringRepresentationValid(moveString)) {
            return false;
        }
        const availableMoves = color ? this.getAvailableMovesForColor(color) : this.getAvailableMoves();
        for (const move of availableMoves) {
            if (moveString === move.toString()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build Move object from string representation
     */
    public buildMove(moveRepresentation: string): Move {
        if (!Move.isMoveStringRepresentationValid(moveRepresentation)) {
            throw new Error(`Incorrect move representation "${moveRepresentation}".`);
        }
        for (const move of this.getAvailableMoves()) {
            if (moveRepresentation === move.toString()) {
                return move;
            }
        }
        throw new Error(`Incorrect move representation "${moveRepresentation}".`);
    }

    /**
     * Execute only one single move without previous/next parts
     */
    public executeOneMove(move: Move, removeCapturedPiecesAtEnd = true): void {
        const piece = this.cells.get(move.srcCell.name).piece;
        move.dstCell.piece = piece
        if (move.dstPieceIsKing) {
            piece.isKing = true;
        }
        move.srcCell.piece = null;
        piece.cell = move.dstCell;
        if (removeCapturedPiecesAtEnd && !move.hasNext()) {
            this.removeCapturedPieces(move);
        }
    }

    /**
     * Execute full move (all parts, from root to end)
     */
    public executeMove(move: Move): void {
        if (!this.isValidMove(move)) {
            throw new Error(`Incorrect move "${move}".`);
        }
        let tmpMove: Move | null = move.root();
        while (tmpMove != null) {
            this.executeOneMove(tmpMove)
            tmpMove = tmpMove.next;
        }
    }

    /**
     * Rollback only one single move without previous/next parts
     */
    public rollbackOneMove(move: Move): void {
        const piece = move.dstCell.piece
        move.srcCell.piece = piece;
        if (piece != null && !move.srcPieceIsKing) {
            piece.isKing = false;
        }
        if (move.capturePiece !== null) {
            move.capturePiece.cell.piece = move.capturePiece;
        }
        move.dstCell.piece = null;
        piece.cell = move.srcCell;
    }

    /**
     * Rollback full move (all parts, from end to root)
     */
    public rollbackMove(move: Move): void {
        let tmpMove: Move | null = move.end();
        while (tmpMove != null) {
            this.rollbackOneMove(tmpMove);
            tmpMove = tmpMove.previous;
        }
    }

    public removeCapturedPieces(move: Move): void {
        let currentMove: Move | null = move;
        while (currentMove !== null) {
            if (currentMove.capturePiece !== null) {
                currentMove.capturePiece.removeFromBoard();
            }
            currentMove = currentMove.previous;
        }
    }

    /**
     * Method not ready yet
     */
    public isDrawCondition(): boolean {
        const capturedMoves = this.getAvailableCaptureMoves();
        if (capturedMoves.length > 0) return false;

        const state = State.build(this);
        if (state.kingCountA >= 1
            && state.kingCountA <= 2
            && state.kingCountB === 1
            && state.menCountA === 0
            && state.menCountB === 0) {
            return true
        }

        return state.kingCountA === 1
            && state.kingCountB >= 1
            && state.kingCountB <= 2
            && state.menCountA === 0
            && state.menCountB === 0;
    }

    public getAvailableMoves(): Move[] {
        return this.getAvailableMovesForColor(Color.A).concat(this.getAvailableMovesForColor(Color.B));
    }

    public getAvailableCaptureMoves(): Move[] {
        let moves: Move[] = [];
        this.cells.forEach(cell => {
            if (cell.isNotEmpty()) {
                moves = moves.concat(cell.piece.getAvailableCaptureMoves());
            }
        });
        return moves;
    }

    public getAvailableMovesForColor(color: Color): Move[] {
        let moves: Move[] = [];
        for (const cell of this.cells.values()) {
            if (cell.isNotEmpty() && cell?.piece?.color === color) {
                moves = moves.concat(cell.piece.getAvailableCaptureMoves());
            }
        }
        if (moves.length > 0) {
            return moves;
        }

        for (const cell of this.cells.values()) {
            if (cell.isNotEmpty() && cell?.piece?.color === color) {
                moves = moves.concat(cell.piece.getAvailableRegularMoves());
            }
        }
        return moves;
    }

    private ensureExistsCellWithName(cellName: string): void {
        if (!this.cells.has(cellName)) {
            throw new Error(`Cell "${cellName}" does not exists on the board.`);
        }
    }

    private generateCellsPositionsById(): Map<number, string> {
        const colsNumber: number = Board.getBoardColsNumber(this.size);
        const positions: Map<number, string> = new Map<number, string>();
        positions.set(0, "00"); // hack to avoid -1 when access
        let letterIndex = 0;
        let number = 1;
        for (let i = 1; i <= Board.getBoardCellsNumber(this.size); i++) {
            positions.set(i, Board.letters[letterIndex] + number);
            letterIndex++;
            if (i % colsNumber === 0) {
                letterIndex = 0;
                number++;
            }
        }
        return positions;
    }

    private createCells(): Map<string, Cell> {
        const cells = new Map<string, Cell>;
        for (let row = 1; row <= Board.getBoardRowsNumber(this.size); row++) {
            for (let col = 1; col <= Board.getBoardColsNumber(this.size); col++) {
                const cell = new Cell(this, row, col)
                cells.set(cell.name, cell);
            }
        }
        this.linkCells(cells);
        return cells;
    }

    private linkCells(cells: Map<string, Cell>): void {
        const cellsInRow: number = Board.getBoardColsNumber(this.size);
        const cellsOnBoard: number = Board.getBoardCellsNumber(this.size);
        const topLine: number[] = [];
        const bottomLine: number[] = [];

        for (let i = 1; i <= cellsInRow; i++) {
            if (i % 2 === 0) {
                bottomLine.push(i - 1);
            } else {
                topLine.push(cellsOnBoard - i + 1);
            }
        }

        for (let i = 1; i <= cellsOnBoard; i++) {
            const cell: Cell = cells.get(this.positions.get(i));

            // BOTTOM_MIDDLE
            if (i > cellsInRow) {
                const bottomMiddleCell = cells.get(this.positions.get(i - cellsInRow));
                cell.bottomMiddle = bottomMiddleCell;
                bottomMiddleCell.topMiddle = cell;
            }

            // TOP_RIGHT
            if (i % cellsInRow != 0 && !topLine.includes(i)) {
                let delta = 1;
                if (i % 2 === 0) delta = cellsInRow + 1;
                const topRightCell = cells.get(this.positions.get(i + delta));
                cell.topRight = topRightCell;
                topRightCell.bottomLeft = cell;
            }

            // BOTTOM_RIGHT
            if (i % cellsInRow != 0 && !bottomLine.includes(i)) {
                let delta = 1;
                if (i % 2 !== 0) delta = -(cellsInRow - 1);
                const bottomRightCell = cells.get(this.positions.get(i + delta));
                cell.bottomRight = bottomRightCell;
                bottomRightCell.topLeft = cell;
            }
        }
    }

    private createInitialPieces(): void {
        const cellsNumber = Board.getBoardCellsNumber(this.size);
        const piecesNumber = Board.getInitialPiecesNumberOnBoard(this.size);
        for (let i = 1; i <= piecesNumber; i++) {
            if (i <= piecesNumber / 2) {
                new Piece(this.getCellByPosition(i), Color.A);
            } else {
                new Piece(this.getCellByPosition(cellsNumber - piecesNumber + i), Color.B);
            }
        }
    }

    private getCellByPosition(position: number): Cell | null {
        return this.cells.get(this.positions.get(position)) || null;
    }

    public static getBoardColsNumber(size: Size): number {
        switch (size) {
            case Size.SIZE_6X6:
            case Size.SIZE_6X8:
                return 6;
            case Size.SIZE_8X6:
            case Size.SIZE_8X8:
            case Size.SIZE_8X10:
                return 8;
            case Size.SIZE_10X8:
            case Size.SIZE_10X10:
                return 10;
        }
    }

    public static getBoardRowsNumber(size: Size): number {
        switch (size) {
            case Size.SIZE_6X6:
            case Size.SIZE_8X6:
                return 6;
            case Size.SIZE_6X8:
            case Size.SIZE_8X8:
            case Size.SIZE_10X8:
                return 8;
            case Size.SIZE_8X10:
            case Size.SIZE_10X10:
                return 10;
        }
    }

    public static getBoardCellsNumber(size: Size): number {
        return this.getBoardRowsNumber(size) * this.getBoardColsNumber(size)
    }

    public static getInitialPiecesNumberOnBoard(size: Size): number {
        switch (size) {
            case Size.SIZE_6X6:
                return 24;
            case Size.SIZE_8X6:
                return 32;
            case Size.SIZE_6X8:
                return 36;
            case Size.SIZE_8X8:
                return 48;
            case Size.SIZE_10X8:
                return 60;
            case Size.SIZE_8X10:
                return 64;
            case Size.SIZE_10X10:
                return 80;
        }
    }

    /**
     * Build Board from HC-FEN string representation (based on FEN)
     * @param stringRepresentation String
     * @return Board
     */
    public static makeFromHcFen(stringRepresentation: string): Board {
        if (!Board.isHcFenStringValid(stringRepresentation)) {
            throw new Error(`Invalid board representation "${stringRepresentation}".`);
        }

        const size = Board.getBoardSizeFromHcFen(stringRepresentation);
        if (size === null) {
            throw new Error(`Invalid board representation "${stringRepresentation}".`);
        }

        const sizeMarkerLength = Board.getBoardSizeStringLength(size);
        const board = new Board(size);
        let row = 1
        let col = 0;
        for (let i = sizeMarkerLength + 1; i < stringRepresentation.length; i++) {
            const c = stringRepresentation[i];
            if (c === '-') {
                col++;
            } else if (c === '/') {
                row++;
                col = 0;
            } else if (['a', 'A', 'b', 'B'].includes(c)) {
                const color = ['a', 'A'].includes(c) ? Color.A : Color.B;
                const isKing = ['A', 'B'].includes(c);
                board.addPiece(board.cells.get("" + this.letters[col] + row), color, isKing)
                col++;
            } else {
                col++;
            }
        }
        return board;
    }

    public static isHcFenStringValid(stringRepresentation: string): boolean {
        const size = Board.getBoardSizeFromHcFen(stringRepresentation);
        if (size === null) {
            return false;
        }
        let regex;
        switch (size) {
            case Size.SIZE_6X6:
                regex = /^6x6\/([aAbB-]{0,6}\/){5}[aAbB-]{0,6}$/;
                break;
            case Size.SIZE_6X8:
                regex = /^6x8\/([aAbB-]{0,6}\/){7}[aAbB-]{0,6}$/;
                break;
            case Size.SIZE_8X6:
                regex = /^8x6\/([aAbB-]{0,8}\/){5}[aAbB-]{0,8}$/;
                break;
            case Size.SIZE_8X8:
                regex = /^8x8\/([aAbB-]{0,8}\/){7}[aAbB-]{0,8}$/;
                break;
            case Size.SIZE_8X10:
                regex = /^8x10\/([aAbB-]{0,8}\/){9}[aAbB-]{0,8}$/;
                break;
            case Size.SIZE_10X8:
                regex = /^10x8\/([aAbB-]{0,10}\/){7}[aAbB-]{0,10}$/;
                break;
            case Size.SIZE_10X10:
                regex = /^10x10\/([aAbB-]{0,10}\/){9}[aAbB-]{0,10}$/;
                break;
        }
        return !!stringRepresentation.match(regex);
    }

    public static getAllMoveDirections(): Direction[] {
        return Board.getTopMoveDirections().concat(Board.getBottomMoveDirections());
    };

    public static getTopMoveDirections(): Direction[] {
        return [Direction.TOP_LEFT, Direction.TOP_MIDDLE, Direction.TOP_RIGHT];
    }

    public static getBottomMoveDirections(): Direction[] {
        return [Direction.BOTTOM_LEFT, Direction.BOTTOM_MIDDLE, Direction.BOTTOM_RIGHT];
    }

    public static getInvertedDirection(direction: Direction): Direction {
        switch (direction) {
            case Direction.TOP_LEFT:
                return Direction.BOTTOM_RIGHT;
            case Direction.TOP_MIDDLE:
                return Direction.BOTTOM_MIDDLE;
            case Direction.TOP_RIGHT:
                return Direction.BOTTOM_LEFT;
            case Direction.BOTTOM_LEFT:
                return Direction.TOP_RIGHT;
            case Direction.BOTTOM_MIDDLE:
                return Direction.TOP_MIDDLE;
            case Direction.BOTTOM_RIGHT:
                return Direction.TOP_LEFT;
        }
    }

    public static findTwinCellOnBoard(targetCell: Cell, board: Board): Cell {
        for (const cell of board.cells.values()) {
            if (targetCell.name === cell.name) {
                return cell;
            }
        }
        throw new Error(`Twin cell "${targetCell}" not found on target board.`);
    }

    public static findTwinPieceOnBoard(targetPiece: Piece, board: Board): Piece {
        for (const cell of board.cells.values()) {
            if (!cell.isEmpty() && targetPiece.cell.name === cell.name) {
                return cell.piece;
            }
        }
        throw new Error(`Twin piece "${targetPiece}" not found on target board.`);
    }

    public static assignMoveToBoard(move: Move, board: Board): Move {
        if (!move) {
            return move;
        }
        let tmpMove: Move | null = move.root();
        while (tmpMove !== null) {
            tmpMove.srcCell = Board.findTwinCellOnBoard(tmpMove.srcCell, board);
            tmpMove.piece = tmpMove.srcCell.piece;
            tmpMove.dstCell = Board.findTwinCellOnBoard(tmpMove.dstCell, board);
            if (tmpMove.capturePiece) {
                tmpMove.capturePiece = Board.findTwinPieceOnBoard(tmpMove.capturePiece, board);
            }
            tmpMove = tmpMove.next;
        }
        return move;
    }

    public static assignMovesToBoard(moves: Move[], board: Board): Move[] {
        for (const move of moves) {
            Board.assignMoveToBoard(move, board);
        }
        return moves;
    };

    public static isBoardInInitialPosition(board: Board): boolean {
        const initialBoardPositions = [
            "6x6/aaaaaa/aaaaaa///bbbbbb/bbbbbb",
            "6x8/aaaaaa/aaaaaa/aaaaaa///bbbbbb/bbbbbb/bbbbbb",
            "8x6/aaaaaaaa/aaaaaaaa///bbbbbbbb/bbbbbbbb",
            "8x8/aaaaaaaa/aaaaaaaa/aaaaaaaa///bbbbbbbb/bbbbbbbb/bbbbbbbb",
            "8x10/aaaaaaaa/aaaaaaaa/aaaaaaaa/aaaaaaaa///bbbbbbbb/bbbbbbbb/bbbbbbbb/bbbbbbbb",
            "10x8/aaaaaaaaaa/aaaaaaaaaa/aaaaaaaaaa///bbbbbbbbbb/bbbbbbbbbb/bbbbbbbbbb",
            "10x10/aaaaaaaaaa/aaaaaaaaaa/aaaaaaaaaa/aaaaaaaaaa///bbbbbbbbbb/bbbbbbbbbb/bbbbbbbbbb/bbbbbbbbbb",
        ];
        return initialBoardPositions.includes(board.toHcFen());
    };

    private static getBoardSizeFromHcFen(stringRepresentation: string): Size | null {
        let sizeMarkerLength = 3;
        if (stringRepresentation.length < sizeMarkerLength) {
            return null;
        }

        let size;
        switch (stringRepresentation.substring(0, sizeMarkerLength).toString().toLowerCase()) {
            case "6x6":
                size = Size.SIZE_6X6;
                break;
            case "6x8":
                size = Size.SIZE_6X8;
                break;
            case "8x6":
                size = Size.SIZE_8X6;
                break;
            case "8x8":
                size = Size.SIZE_8X8;
                break;
            default:
                size = null;
        }

        if (size === null) {
            sizeMarkerLength = 4;
            switch (stringRepresentation.substring(0, sizeMarkerLength).toString().toLowerCase()) {
                case "8x10":
                    size = Size.SIZE_8X10;
                    break;
                case "10x8":
                    size = Size.SIZE_10X8;
                    break;
                default:
                    size = null;
            }
        }

        if (size === null) {
            sizeMarkerLength = 5;
            switch (stringRepresentation.substring(0, sizeMarkerLength).toString().toLowerCase()) {
                case "10x10":
                    size = Size.SIZE_10X10;
                    break;
                default:
                    size = null;
            }
        }

        return size;
    }

    private static getBoardSizeStringLength(size: Size): number {
        switch (size) {
            case Size.SIZE_6X6:
            case Size.SIZE_6X8:
            case Size.SIZE_8X6:
            case Size.SIZE_8X8:
                return 3;
            case Size.SIZE_8X10:
            case Size.SIZE_10X8:
                return 4;
            case Size.SIZE_10X10:
                return 5;
            default:
                return 0;
        }
    }
}
