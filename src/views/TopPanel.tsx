import React from "react";

export class TopPanel extends React.Component{
    render() {
        return (
            <div className="top-panel">
                <label className="date-range-label">Date Range:</label>
                <input type={'date'}/>
                <i className="bx bxs-file-pdf pdf-icon"/>
            </div>

           
        )
    }
}