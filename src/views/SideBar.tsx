import React, { useState } from "react";

interface SideBarProps {
  setCurrentPanel: any;
  currentPanel: any;
}

export function SideBar(props: SideBarProps) {


  const collapseSideBar = () => {
    const sideBar = document.querySelector('.side-bar') as HTMLElement;
    const arrowCollapse = document.querySelector('#logo-name__icon') as HTMLElement;
    if (arrowCollapse && sideBar) {
      arrowCollapse.onclick = function () {
        sideBar.classList.toggle('collapse');
        arrowCollapse.classList.toggle('collapse');
      };
    }
  }

  // const isSelectedNode = (selected: string) => {
  //   return (selected === currentPanel);
  // }


  return (
    <div className="side-bar">

      <div className="logo-name-wrapper">
        <button onClick={() => collapseSideBar()} className="logo-name__button">
          <i className="bx bx-menu logo-name__icon" id="logo-name__icon" />
        </button>
      </div>

      <ul className="category-list">

        <div className="category-header">Relationship Insights</div>

        <li className={`category-item ${(props.currentPanel === 'Batch Milestones') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Batch Milestones')}>
          <i className='bx features-item-icon bx-cctv'></i>
          <span className="category-item-text selected">Batch Milestones</span>
          <span className="tooltip">Batch Milestones</span>
        </li>
        <li className={`category-item ${(props.currentPanel === 'Critical Jobs') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Critical Jobs')}>
          <i className='bx features-item-icon bx-alarm-exclamation'></i>
          <span className="category-item-text">Critical Jobs</span>
          <span className="tooltip">Critical Jobs</span>
        </li>
        <li className={`category-item ${(props.currentPanel === 'Application Path') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Application Path')}>
          <i className='bx features-item-icon bx-trip'></i>
          <span className="category-item-text">Application Path</span>
          <span className="tooltip">Application Path</span>
        </li>
        <li className={`category-item ${(props.currentPanel === 'Overall') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Overall')}>
          <i className='bx features-item-icon bx-grid-small'></i>
          <span className="category-item-text">Overall</span>
          <span className="tooltip">Overall</span>
        </li>
        <br />

        <div className={`category-header ${(props.currentPanel === 'Shortest Path') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Shortest Path')}>Shortest Path</div>
        <div className="category-header">Reports</div>

        <li className={`category-item ${(props.currentPanel === 'Job Completion') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Job Completion')}>
          <i className='bx features-item-icon bx-timer'></i>
          <span className="category-item-text">Job Completion</span>
          <span className="tooltip">Job Completion</span>
        </li>
        <li className={`category-item ${(props.currentPanel === 'Application Resources') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('>Application Resources')}>
          <i className='bx features-item-icon bx-data'></i>
          <span className="category-item-text">Application Resources</span>
          <span className="tooltip">Application Resources</span>
        </li>
        <li className={`category-item ${(props.currentPanel === 'MIPS Reports') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('MIPS Reports')}>
          <i className='bx features-item-icon bxs-report'></i>
          <span className="category-item-text">MIPS Reports</span>
          <span className="tooltip">MIPS Reports</span>
        </li>
        <li className={`category-item ${(props.currentPanel === 'Custom Reports') ? "selected" : ""}`} onClick={() => props.setCurrentPanel('Custom Reports')}>
          <i className='bx features-item-icon bx-cake'></i>
          <span className="category-item-text">Custom Reports</span>
          <span className="tooltip">Custom Reports</span>
        </li>
      </ul>
    </div>
  )

}