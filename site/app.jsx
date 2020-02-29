import React from "react";
import ReactDOM from "react-dom";
import { Utils } from "@antv/graphin";
import { Tabs, Button } from 'antd';
import ModuleGraph from 'Component/module-graph.jsx';

import "./root.css";

const { TabPane } = Tabs;

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

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
