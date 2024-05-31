import React from 'react'

function RadioButton({names, id}) {
  return (
    <div className='button-container'>
      {
        names.map((name) => {
            return (
                <div className='button-row'>
                    <button type='radio' name={name} id={id} className='radio-btn'></button>
                    <label for={name} className='btn-label'>{name}</label>
                </div>
            )
        })
      }
    </div>
  )
}

export default RadioButton
