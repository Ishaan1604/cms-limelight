import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { FormRow } from '../../components'

function Login() {
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
      const {data : {person, token}} = await axios.post('http://localhost:3000/api/v1/cms/auth/login', loginInfo)

      localStorage.token = token;
      localStorage.email = person.email
      localStorage.name = person.name
      localStorage.role = person.personType
      
      setLoginInfo({email: '', password: ''})
      setIsTrue(true)
      navigate(`/${person.name}`)
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
          <p>Registered user successfully</p>
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
          <button type='submit' className='submit-btn'>Login</button>
        </form>
        <p style={{textAlign: 'center', marginBottom: '2%'}}>
          Do not have an account?
          <Link style={{marginLeft: '2%'}}to='/auth/register'>Register</Link>
        </p>
        <p style={{textAlign: 'center', marginBottom: '2%'}}>
          Forgot your password?
          <Link style={{marginLeft: '2%'}}to='/auth/resetPassword'>Reset Password</Link>
        </p>
      </div>
    </section> 
  )
}

export default Login
