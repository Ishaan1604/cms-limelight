import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { FormRow } from '../../components'

function Register() {
  const [loginInfo, setLoginInfo] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(true);
  const [isTrue, setIsTrue] = useState(false)
  const [error, setError] = useState({err: false, msg: null})
  const [document, setDocumet] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', document)
    Object.keys(loginInfo).forEach((key) => {
      formData.append(key, loginInfo[key]);
    });
    setIsLoading(true)
    try {
      const {data : {person, token}} = await axios.post('http://localhost:3000/api/v1/cms/auth/register', formData)

      localStorage.token = token;
      localStorage.email = person.email
      localStorage.name = person.name
      localStorage.role = person.personType
      
      setLoginInfo({name: '', email: '', password: ''})
      setIsTrue(true)
      navigate(`/${person.name}`)
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setDocumet(e.target.files[0])
      return;
    }
    setLoginInfo({...loginInfo, [e.target.name]: e.target.value})
  }

  if (isLoading) {
    return (
      <div className='loading'>
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
          <FormRow type='text' name='name' id='name' value={loginInfo.name}/>
          <FormRow type='email' name='email' id='email' value={loginInfo.email}/>
          <FormRow type='password' name='password' id='password' value={loginInfo.password}/>
          <FormRow type='file' name='image' id='image' />
          <button type='submit' className='submit-btn'>Register</button>
        </form>
        <p style={{textAlign: 'center', marginBottom: '2%'}}>
          Already have an account?
          <Link style={{marginLeft: '2%'}}to='/auth/login'>Login</Link>
        </p>
      </div>
    </section> 
  )
}

export default Register
