import React, { useState } from 'react';
import Button from '@mui/material/Button';

function FormatString() {

    const [content, setContent] = useState();
    const [formated, setFormated] = useState();

    const formatContent = () => {
        if (content) {
            //seperating special characters and alphanumeric characters
            let character_array = [];
            let special_array = [];
            let content_array = Array.from(content);
            content_array.forEach((obj, index) => {
                if (obj.match(/^[a-zA-Z0-9]*$/)) character_array.push(obj)
                else special_array[index] = obj;
            });
            //reversing array
            let formatted_array = character_array.reverse();
            //inserting special characters at corresponding positions
            special_array.forEach((obj, index) => {
                if (obj) formatted_array.splice(index, 0, obj);
            });
            setFormated(formatted_array.join(''));
        }
    }

    return (
        <div className='row mt-3 justify-content-start'>
            <div className='col-4 p-2'>
                <input className="form-control m-2" type="text" onChange={(event) => { setContent(event.target.value) }}></input>
                <Button variant="contained" color="primary" className="font-weight-bolder text-white m-2" size="small" onClick={formatContent}>Format String</Button>
            </div>
            <div className='col-4 p-2 ms-5 mt-2'>
                <b>Formatted String: </b>
                <span className="ms-3">{formated}</span>
            </div>
        </div>
    )
}

export default FormatString