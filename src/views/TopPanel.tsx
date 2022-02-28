import React, { useState } from "react";

interface TopPanelProps {
    currentPanel: string;
}
export const TopPanel = (props: TopPanelProps) => {

    const todaysDate = () => {
        const local = new Date();
        return local.toISOString().slice(0, 10)
    }

    const [selectedDate, updateDate] = useState(todaysDate());

    const valueChanged = (event: any) => {
        if(event) {
            updateDate(event.target.value)
        }
    }


        return (
            <div className="top-panel">
                

                <h2 className="graph-header">
                    {props.currentPanel.toUpperCase()}
                </h2>

                <i className="bx bxs-file-pdf pdf-icon"/>

                <div className="date-div">

                    <label className="date-range-label">Date:</label>
                    <input value={selectedDate} type={'date'} className="date-picker" onChange={valueChanged}/>

                </div>
                
            </div>

           
        )

}