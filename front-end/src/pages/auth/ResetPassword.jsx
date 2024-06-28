import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { FormRow } from '../../components'

function ResetPassword() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(true);
  const [isTrue, setIsTrue] = useState(false)
  const [error, setError] = useState({err: false, msg: null})

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await axios.patch('http://localhost:3000/api/v1/cms/auth/resetPassword', loginInfo)
      
      setLoginInfo({email: '', password: ''})
      setIsTrue(true)
      navigate(`/auth/login`)
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setLoginInfo({...loginInfo, [e.target.name]: e.target.value})
  }

  if (isLoading) {
    return (
      <div className='loading flex row'>
        <div></div>
        <div></div>
        <div></div>
        <p></p>
      </div>
    )
  }
  return (
    <section className='auth-section flex column center'>
      {
        isTrue && <div className='success-div'>
          <p>Changed password successfully</p>
        </div>
      }
      {
        error.err && <div className='error-div'>
          <p>{error.msg}</p>
        </div>
      }
      <div className='form-container flex column center'>
        <form onSubmit={handleSubmit} onChange={handleChange} className='form'>
          <FormRow type='email' name='email' id='email' value={loginInfo.email}/>
          <FormRow type='password' name='password' id='password' value={loginInfo.password}/>
          <button type='submit' className='btn submit-btn'>Reset Password</button>
        </form>
      </div>
    </section> 
  )
}

export default ResetPassword
