import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "chessboard-element";
import Chess from "chess.js";

const ChessboardWrapper = forwardRef((props, ref) => {
  const chessboardRef = useRef();
  useImperativeHandle(ref, () => ({
    quickStartGame: () => {
      chessboardRef.current.start();
      const game = new Chess();
      chessboardRef.current.setAttribute("draggable-pieces", "");
      chessboardRef.current.addEventListener("drag-start", (e) => {
        const { source, piece, position, orientation } = e.detail;

        // do not pick up pieces if the game is over
        if (game.game_over()) {
          e.preventDefault();
          return;
        }

        // only pick up pieces for White
        if (piece.search(/^b/) !== -1) {
          e.preventDefault();
          return;
        }
      });

      function makeRandomMove() {
        let possibleMoves = game.moves();

        // game over
        if (possibleMoves.length === 0) {
          return;
        }

        const randomIdx = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIdx]);
        chessboardRef.current.setPosition(game.fen());
      }

      chessboardRef.current.addEventListener("drop", (e) => {
        const { source, target, setAction } = e.detail;

        // see if the move is legal
        const move = game.move({
          from: source,
          to: target,
          promotion: "q", // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) {
          setAction("snapback");
          return;
        }

        // make random legal move for black
        window.setTimeout(makeRandomMove, 250);
      });

      // update the board position after the piece snap
      // for castling, en passant, pawn promotion
      chessboardRef.current.addEventListener("snap-end", (e) => {
        chessboardRef.current.setPosition(game.fen());
      });
    },
  }));
  useEffect(() => {});
  return <chess-board ref={chessboardRef}></chess-board>;
});

export default ChessboardWrapper;
