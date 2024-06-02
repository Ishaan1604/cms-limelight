import React from 'react'

function SelectRow({names, id, name, value}) {


    return (
        <div className='form-row'>
            <label for={name} className='form-label'>{name}</label>
            <select className='form-input' name={name} id={id}>
                <option value={`Please select a ${name}`}>{`Please select a ${name}`}</option>
                {
                    names.map((item) => {
                       return <option value={item} style={{textTransform: 'capitalize'}} selected={value === item ? true : false}>{item}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SelectRow
