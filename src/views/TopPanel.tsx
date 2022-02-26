import React from "react";

export class TopPanel extends React.Component{

    state = {
        todayDate: this.todaysDate()
    }

    todaysDate () {
        var local = new Date();
        return local.toISOString().slice(0, 10)
    }

    valueChanged(event: any) {
        if(event) {
            // this.todayDate = event.target.value;
            this.setState({
                todayDate: event.target.value
            })
        }
    }

    render() {
        return (
            <div className="top-panel">
                <div className="top-float">

                <i className="bx bxs-file-pdf pdf-icon"/>

                <label className="date-range-label">Date:</label>
                <input value={this.state.todayDate} type={'date'} className="date-picker" onChange={this.valueChanged.bind(this)}/>
                </div>
                
            </div>

           
        )
    }
}