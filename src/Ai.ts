import Board, {assignMovesToBoard, assignMoveToBoard, isBoardInInitialPosition} from "./Board.js";
import {Color, getInvertedColor} from "./Piece.js";
import Move from "./Move.js";
import State from "./State.js";

const THREAD_COUNT = 4;

export default class Ai {
    private readonly board: Board;
    private interrupted = false;
    public fullCalculation = false;

    constructor(board: Board) {
        this.board = board;
    }

    /**
     * Search best move with depth * 2 half moves
     */
    public async findBestMove(color: Color, depth = 2): Promise<Move | null> {
        if (depth <= 0) {
            throw new Error(`Incorrect depth value "${depth}". Should greater than 0.`);
        }

        this.interrupted = false;

        const virtualBoard = this.board.copy();

        const bestMoves: Move[] = this.getPrecalculatedMoves(virtualBoard, color);
        if (bestMoves.length > 0) {
            return assignMoveToBoard(bestMoves[getRandomNumber(0, bestMoves.length - 1)], this.board);
        }

        const moves: Move[] = virtualBoard.getAvailableMovesForColor(color);
        if (moves.length === 0) {
            return null;
        } else if (moves.length === 1) {
            return assignMoveToBoard(moves[0], this.board);
        }

        const partSize = Math.max(1, Math.ceil(moves.length / THREAD_COUNT));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const moveParts = [...Array(Math.ceil(moves.length / partSize))].map(_ => moves.splice(0, partSize));
        const virtualBoards: Board[] = [];
        for (let i = 0; i < moveParts.length; i++) {
            virtualBoards.push(virtualBoard.copy());
            assignMovesToBoard(moveParts[i], virtualBoards[i]);
        }

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const scores: number[] = await (async () => {
            const promises = [];
            for (let i = 0; i < moveParts.length; i++) {
                promises.push(this.getCalculateBestMoveScorePromise(virtualBoards[i], moveParts[i], color, depth));
            }
            return Promise.all(promises);
        })();

        let bestMoveScore = getMaxValue(scores);
        if (bestMoveScore === null) {
            bestMoveScore = Number.MIN_SAFE_INTEGER;
        }
        for (const part of moveParts) {
            for (const move of part) {
                if (move.score === bestMoveScore) {
                    bestMoves.push(move);
                }
            }
        }

        return assignMoveToBoard(bestMoves[getRandomNumber(0, bestMoves.length - 1)], this.board);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public interrupt() {
        this.interrupted = true;
    }

    private getPrecalculatedMoves(board: Board, color: Color): Move[] {
        if (isBoardInInitialPosition(board)) {
            return board.getAvailableMovesForColor(color);
        }
        return [];
    }

    private getCalculateBestMoveScorePromise(board: Board, startMoves: Move[], color: Color, depth: number): Promise<number> {
        return new Promise((resolve) => {
            resolve(this.calculateBestMoveScore(board, startMoves, color, depth));
        });
    }

    private calculateBestMoveScore(board: Board, startMoves: Move[], color: Color, depth: number): number {
        if (this.fullCalculation) {
            return this.calculateBestMoveScoreFull(
                board,
                State.build(board),
                startMoves,
                color,
                depth * 2,
                Number.MIN_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER
            )
        } else {
            return this.calculateBestMoveScoreAB(
                board,
                State.build(board),
                startMoves,
                color,
                depth * 2,
                Number.MIN_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER
            )
        }
    }

    private calculateBestMoveScoreFull(
            board: Board,
            startBoardState: State,
            moves: Move[],
            color: Color,
            depth: number,
            alpha: number,
            beta: number
    ): number {
        if (depth === 0) {
            return this.calculateBoardScoreV2(startBoardState, State.build(board), color);
        }

        const otherPieceColor = getInvertedColor(color);
        const isMaximizingPlayer = depth % 2 === 0;
        let tmpAlpha = alpha;
        let tmpBeta = beta;
        let score: number = isMaximizingPlayer ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

        for (const move of moves) {
            if (this.interrupted) {
                return score;
            }
            board.executeMove(move);
            const tmpScore = this.calculateBestMoveScoreFull(
                board,
                startBoardState,
                board.getAvailableMovesForColor(otherPieceColor),
                otherPieceColor,
                depth - 1,
                tmpAlpha,
                tmpBeta
            );
            board.rollbackMove(move);
            move.root().score = tmpScore;
            move.score = tmpScore;
            if (isMaximizingPlayer) {
                score = Math.max(tmpScore, score);
                tmpAlpha = Math.max(tmpAlpha, score);
            } else {
                score = Math.min(tmpScore, score);
                tmpBeta = Math.min(tmpBeta, score);
            }
        }
        return score;
    }

    private calculateBestMoveScoreAB(
            board: Board,
            startBoardState: State,
            moves: Move[],
            color: Color,
            depth: number,
            alpha: number,
            beta: number
    ): number {
        if (depth === 0) {
            return this.calculateBoardScoreV2(startBoardState, State.build(board), color);
        }

        const otherPieceColor = getInvertedColor(color);
        const isMaximizingPlayer = depth % 2 === 0;
        let tmpAlpha = alpha;
        let tmpBeta = beta;
        let score = isMaximizingPlayer ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;

        for (const move of moves) {
            if (this.interrupted) {
                return this.calculateBoardScoreV2(startBoardState, State.build(board), color);
            }
            board.executeMove(move);
            const tmpScore = this.calculateBestMoveScoreAB(
                board,
                startBoardState,
                board.getAvailableMovesForColor(otherPieceColor),
                otherPieceColor,
                depth - 1,
                tmpAlpha,
                tmpBeta
            );
            board.rollbackMove(move);
            move.root().score = tmpScore;
            move.score = tmpScore;
            if (isMaximizingPlayer) {
                score = Math.max(tmpScore, score);
                tmpAlpha = Math.max(tmpAlpha, score);
                if (beta <= tmpAlpha) break;
            } else {
                score = Math.min(tmpScore, score)
                tmpBeta = Math.min(tmpBeta, score)
                if (tmpBeta <= alpha) break;
            }
        }
        return score;
    }

    private calculateBoardScoreV2(startBoardState: State, boardState: State, color: Color): number {
        const menCost = 100;
        const selfKingCost = menCost * 2;
        const foreignKingCost = menCost * 2;
        let efficiency = 0;
        let blackEfficiency = 0;
        let whiteEfficiency = 0;

        let playerCapturedMoves = 0;
        let otherPlayerCapturedMoves = 0;

        if (color === Color.A) {
            blackEfficiency = boardState.menCountB * menCost + boardState.kingCountB * foreignKingCost;
            whiteEfficiency = boardState.menCountA * menCost + boardState.kingCountA * selfKingCost;
            if (boardState.menCountA + boardState.kingCountA === 0) {
                efficiency = Number.MIN_SAFE_INTEGER;
            } else if (boardState.menCountB + boardState.kingCountB === 0) {
                efficiency = Number.MAX_SAFE_INTEGER;
            } else {
                efficiency = whiteEfficiency - blackEfficiency;
            }
            if (startBoardState.menCountA > boardState.menCountA) {
                efficiency -= (startBoardState.menCountA - boardState.menCountA) * menCost;
            }
            playerCapturedMoves = boardState.captureMovesCountA;
            otherPlayerCapturedMoves = boardState.captureMovesCountB;
        } else {
            blackEfficiency = boardState.menCountB * menCost + boardState.kingCountB * selfKingCost;
            whiteEfficiency = boardState.menCountA * menCost + boardState.kingCountA * foreignKingCost;
            if (boardState.menCountB + boardState.kingCountB === 0) {
                efficiency = Number.MIN_SAFE_INTEGER;
            } else if (boardState.menCountA + boardState.kingCountA === 0) {
                efficiency = Number.MAX_SAFE_INTEGER;
            } else {
                efficiency = blackEfficiency - whiteEfficiency;
            }
            if (startBoardState.menCountB > boardState.menCountB) {
                efficiency -= (startBoardState.menCountB - boardState.menCountB) * menCost;
            }
            playerCapturedMoves = boardState.captureMovesCountB;
            otherPlayerCapturedMoves = boardState.captureMovesCountA;
        }

        if (playerCapturedMoves > 0) efficiency += playerCapturedMoves;
        if (otherPlayerCapturedMoves > 0) efficiency -= otherPlayerCapturedMoves;

        return efficiency;
    }
}

const getRandomNumber = (min, max): number => {
    const floatRandom = Math.random();
    const difference = max - min;
    const random = Math.round(difference * floatRandom);
    return random + min;
};

const getMaxValue = (array): number => {
    let max = null;
    array.forEach(v => {
        if (max === null || v > max) {
            max = v;
        }
    });
    return max;
}
