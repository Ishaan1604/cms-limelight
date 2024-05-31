import React from 'react'

function FormRow({type, id, name, value, readOnly}) {
  return (
    <div className='form-row'>
       <label for='name' className='form-label'>{name}</label> 
       <input type={type} id={id} name={name} value={value} className='form-input' readOnly={readOnly ? true : false}></input>
    </div>
  )
}

export default FormRow
