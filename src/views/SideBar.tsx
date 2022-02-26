import React from "react";

export class SideBar extends React.Component {

    collapseSideBar() {
        const sideBar = document.querySelector('.side-bar') as HTMLElement;
        const arrowCollapse = document.querySelector('#logo-name__icon') as HTMLElement;
        if(arrowCollapse && sideBar)
        {arrowCollapse.onclick = function () {
          sideBar.classList.toggle('collapse');
          arrowCollapse.classList.toggle('collapse');
        //   if (arrowCollapse.classList.contains('collapse')) {
        //     arrowCollapse.classList =
        //       'bx bx-arrow-from-left logo-name__icon collapse';
        //   } else {
        //     arrowCollapse.classList = 'bx bx-arrow-from-right logo-name__icon';
        //   }
        };}
    }
    

    render() {
        return(
            <div className="side-bar">
        <div className="logo-name-wrapper">
          <div className="logo-name">
            {/* <img
              src="%PUBLIC_URL%/favicon.ico"
              className="logo"
              alt="logo app"
            /> */}
          </div>
          <button onClick={this.collapseSideBar} className="logo-name__button">
            <i
              className="bx bx-menu logo-name__icon"
              id="logo-name__icon"
            ></i>
          </button>
        </div>
        <ul className="category-list">
          <div className="category-header">
            Relationship Insights</div>
          <li className="category-item">
            <i className='bx features-item-icon bx-cctv'></i>
              <span className="category-item-text">Batch Milestones</span>
            <span className="tooltip">Batch Milestones</span>
          </li>
          <li className="category-item">
            <i className='bx features-item-icon bx-alarm-exclamation'></i>
              <span className="category-item-text">Critical Jobs</span>
            <span className="tooltip">Critical Jobs</span>
          </li>
          <li className="category-item">
            <i className='bx features-item-icon bx-trip'></i>
              <span className="category-item-text">Application Path</span>
            <span className="tooltip">Application Path</span>
          </li>
          <li className="category-item">
            <i className='bx features-item-icon bx-grid-small'></i>
              <span className="category-item-text">Overall</span>
            <span className="tooltip">Overall</span>
          </li>
          <br/>
          <div className="category-header">Shortest Path</div>
          <div className="category-header">Reports</div>
          <li className="category-item">
            <i className='bx features-item-icon bx-timer'></i>
              <span className="category-item-text">Job Completion</span>
            <span className="tooltip">Job Completion</span>
          </li>
          <li className="category-item">
            <i className='bx features-item-icon bx-data'></i>
              <span className="category-item-text">Application Resources</span>
            <span className="tooltip">Application Resources</span>
          </li>
          <li className="category-item">
            <i className='bx features-item-icon bxs-report'></i>
              <span className="category-item-text">MIPS Reports</span>
            <span className="tooltip">MIPS Reports</span>
          </li>
          <li className="category-item">
            <i className='bx features-item-icon bx-cake'></i>
              <span className="category-item-text">Custom Reports</span>
            <span className="tooltip">Custom Reports</span>
          </li>
        </ul>
      </div>
        )
    }
}