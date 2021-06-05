import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import "chessboard-element";
import Chess from "chess.js";

const ChessboardWrapper = forwardRef((props, ref) => {
  const chessboardRef = useRef();
  const [orientation, setOrientation] = useState("white");
  const [draggablePieces, setDraggablePieces] = useState(false);
  let playingAdvancedGame = false;
  let game, randomMoveInterval;
  const makeRandomMove = () => {
    let possibleMoves = game.moves();

    // game over
    if (possibleMoves.length === 0) {
      clearInterval(randomMoveInterval);
      return;
    }

    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    chessboardRef.current.setPosition(game.fen());
  };
  const addEventListeners = () => {
    chessboardRef.current.addEventListener("drag-start", (e) => {
      // eslint-disable-next-line no-unused-vars
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
    chessboardRef.current.addEventListener("snap-end", () => {
      chessboardRef.current.setPosition(game.fen());
    });
  };
  useImperativeHandle(ref, () => ({
    advancedConfigStartGame: (data) => {
      if (!playingAdvancedGame) {
        playingAdvancedGame = !playingAdvancedGame;
        game = new Chess();
        const { validate_fen: validateFen } = game;
        let result = validateFen(data.fen);

        if (data.fen && result.valid) {
          chessboardRef.current.setPosition(data.fen);
          game.load(data.fen);
        } else {
          chessboardRef.current.start();
        }
        setOrientation(data.orientation);
        if (data.selfPlay) {
          randomMoveInterval = window.setInterval(makeRandomMove, 500);
        } else {
          setDraggablePieces(true);
          addEventListeners();
          if (game.turn() === "b") {
            window.setTimeout(makeRandomMove, 500);
          }
        }
      }
    },
    quickStartGame: () => {
      game = new Chess();
      chessboardRef.current.start();
      setDraggablePieces(true);
      addEventListeners();
    },
  }));
  return (
    <chess-board
      ref={chessboardRef}
      orientation={orientation}
      draggable-pieces={draggablePieces}
    />
  );
});

export default ChessboardWrapper;
