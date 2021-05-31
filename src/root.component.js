import React, { Fragment, useEffect, useRef } from "react";
import ChessboardWrapper from "./components/ChessboardWrapper";
import ReactChessHeader from "./components/ReactChessHeader";
import "./css/reactChess.css";

export default function Root(props) {
  const chessboardRef = useRef();
  useEffect(() => {});
  return (
    <Fragment>
      <ReactChessHeader />
      <ChessboardWrapper ref={chessboardRef} />
      {/*<button onClick={() => chessboardRef.current.quickStartGame()}>Start Button</button>*/}
    </Fragment>
  );
}
