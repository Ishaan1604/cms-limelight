import React from 'react'

function CheckButton({names, id, onClick}) {


    return (
        <div className='button-container' onClick={onClick}>
        {
            names.map((name, i) => {
                return (
                    <div className='button-row'>
                        <input type='checkbox' name={name} id={id + i} className='check-btn'></input>
                        <label for={name} className='btn-label'>{name}</label>
                    </div>
                )
            })
        }
        </div>
    )
}

export default CheckButton
