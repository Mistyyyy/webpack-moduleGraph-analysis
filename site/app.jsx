import React from "react";
import ReactDOM from "react-dom";
import Graphin, { Utils } from "@antv/graphin";

import "./root.css";

const data = Utils.mock(13)
  .circle()
  .graphin();

const App = () => {
  return (
    <div className="App">
      <Graphin data={data} />
    </div>
  );
};

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);