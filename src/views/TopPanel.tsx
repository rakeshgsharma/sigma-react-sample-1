import React from "react";

export class TopPanel extends React.Component{
    todayDate: string | number | readonly string[] | undefined;

    
    componentDidMount() {

            var local = new Date();
this.todayDate = local.toISOString().slice(0, 10)

    }

    render() {
        return (
            <div className="top-panel">
                <div className="top-float">

                <i className="bx bxs-file-pdf pdf-icon"/>
                |
                <label className="date-range-label">Date:</label>
                <input value={this.todayDate} type={'date'} className="date-picker"/>
                </div>
                
            </div>

           
        )
    }
}