import React from "react";
import ReactDOM from "react-dom";
import { Utils } from "@antv/graphin";
import { Tabs, Button } from 'antd';
import ModuleGraph from 'Component/module-graph.jsx';

import "./root.css";

const { TabPane } = Tabs;

let ws;

ws = new WebSocket(`ws://${location.host}`);

ws.onopen = function(){
  ws.send('fetch Data')
}

ws.onmessage = function(e, data){
  console.log(e.data.text().then(console.log))
}

const rootElement = document.getElementById("root");

const App = () => {

  const data = Utils.mock(13).circle().graphin();

  return (
    <div className="App">
      <Tabs defaultActiveKey="1" onChange={() => {}}>
        <TabPane tab="Module Graph" key="1">
          <ModuleGraph data={data} />
        </TabPane>
        <TabPane tab="Chunk Graph" key="2">
          Content of Chunk Graph
        </TabPane>
      </Tabs>
    </div>
  );
};

// window.addEventListener('load', () => {

  ReactDOM.render(<App />, rootElement)

//   if (ws) {
//     ws.addEventListener('message', event => {
//       console.log(event)
//     });
//   }
// }, false);
