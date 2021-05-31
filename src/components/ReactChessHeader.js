import React, { Fragment } from "react";
import chessIcon from "../assets/Centaur.png";
import reactIcon from "../assets/React-icon.svg";
import EventEmitter from "reactjs-eventemitter";

const ReactChessHeader = () => {
  const quickStartGame = () => {
    EventEmitter.dispatch("quickStartGame", {});
  };

  const showAdvancedConfigModal = () => {
    EventEmitter.dispatch("showAdvancedConfigModal", {});
  };

  return (
    <Fragment>
      <header className={"container-fluid"} id={"react-secondary-header"}>
        <div className={"row p-2"}>
          <div className={"col-3"}>
            <img className={"w-100 mt-3"} alt={"React logo"} src={reactIcon} />
          </div>
          <div className={"col-6 d-grid gap-2"}>
            <button
              type={"button"}
              className={"btn btn-light w-100 btn-sm"}
              onClick={quickStartGame}
            >
              Quick Start
            </button>
            <button
              type={"button"}
              className={"btn btn-light w-100 btn-sm"}
              onClick={showAdvancedConfigModal}
            >
              Advanced Config
            </button>
          </div>
          <div className={"col-3"}>
            <img className={"w-100"} alt={"Chess Logo"} src={chessIcon} />
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default ReactChessHeader;
