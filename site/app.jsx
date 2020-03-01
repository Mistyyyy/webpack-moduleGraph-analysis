import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Utils } from "@antv/graphin";
import { Tabs, Button } from 'antd';
import ModuleGraph from 'Component/module-graph.jsx';

import "./root.css";

const { TabPane } = Tabs;

let ws;

ws = new WebSocket('ws://127.0.0.1:12300');

ws.onopen = function(){
  ws.send('fetch Data')
}

const rootElement = document.getElementById("root");

const App = () => {
  let data = new Proxy({}, {
    get() {
      return []
    }
  });

  const [graphData, setData ] = useState(data);

  ws.onmessage = function(e) {
    data = JSON.parse(e.data);
    setData(data);
  }


  const datas = Utils.mock(13).circle().graphin();

  return (
    <div className="App">
      <Tabs defaultActiveKey="1" onChange={() => {}}>
        <TabPane tab="Module Graph" key="1">
          <ModuleGraph data={graphData} />
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
