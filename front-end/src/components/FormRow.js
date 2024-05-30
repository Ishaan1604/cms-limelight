import React from 'react'

function FormRow({type, id, name, value}) {
  return (
    <div className='form-row'>
       <label for='name' className='form-label'>{name}</label> 
       <input type={type} id={id} name={name} value={value} className='form-input'></input>
    </div>
  )
}

export default FormRow
