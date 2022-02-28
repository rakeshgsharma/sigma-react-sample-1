import { FC, useState } from "react";
import { SideBar } from "./SideBar";
import { TopPanel } from "./TopPanel";
import { TitlePanel } from "./TitlePanel";
import { GraphPanel } from "./GraphPanel";
import React from 'react';

const Root: FC = () => {
  
  const [currentPanel, setCurrentPanel] = useState('Batch Milestones');

  return (
    <div id="app-root">
      <TitlePanel/>
      <div id="flex-container">
        <SideBar setCurrentPanel={setCurrentPanel}/>
        <div className="flex-item">
          <TopPanel/>
          <GraphPanel currentPanel={currentPanel}/>
        </div>

      </div>


    </div>
  );
};

export default Root;
