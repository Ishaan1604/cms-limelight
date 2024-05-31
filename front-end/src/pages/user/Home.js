import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import { FormRow } from '../../components';

function Home() {
  const navigate = useNavigate();
  const [values, setValues] = useState({})

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/auth/login')
    }

    navigate(`/${localStorage.name}`)
  }, [])

  return (
    <div className='flex row'>
      <NavBar/>
      <div className='side-bar flex column center'>
        <h1>Welcome!</h1>
        <h1 style={{textAlign: 'center'}}>{localStorage.name}</h1>
      </div>
      <div className='tile-container flex row'>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>User Info</h1>
          <FormRow type='text' name='name' id='id' value={values.name} />
          <FormRow type='email' name='email' id='email' value={values.email} />
          <button>Update User</button>
          <button>Delete User</button>
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>Policy Updates</h1>
          <FormRow type='text' name='name' id='id' value={values.name} />
          <FormRow type='email' name='email' id='email' value={values.email} />
          <button>Update User</button>
          <button>Delete User</button>
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>My Policy Updates</h1>
          <FormRow type='text' name='name' id='id' value={values.name} />
          <FormRow type='email' name='email' id='email' value={values.email} />
          <button>Update User</button>
          <button>Delete User</button>
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>My Claims Update</h1>
          <FormRow type='text' name='name' id='id' value={values.name} />
          <FormRow type='email' name='email' id='email' value={values.email} />
          <button>Update User</button>
          <button>Delete User</button>
        </div>
      </div>
    </div>
  )
}

export default Home
