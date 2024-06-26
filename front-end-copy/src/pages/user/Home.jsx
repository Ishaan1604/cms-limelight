import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom'
import { FormRow, Updates } from '../../components';
import axios from 'axios';
import { useGlobalContext } from '../../context';

function Home() {
  const navigate = useNavigate();
  const [values, setValues] = useState({name: localStorage.name, email: localStorage.email})
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError} = useGlobalContext();
  const [updates, setUpdates] = useState({policies: [], myPolicies: [], claims: []})

  const fetchData = async() => {
    try {
      setIsLoading(true)

      const {data: {policies}} = await axios.get(`http://localhost:3000/api/v1/cms/policies?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      const {data: {myPolicies}} = await axios.get(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myPolicies?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      const {data: {claims}} = await axios.get(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myClaims?status=pending approved rejected&sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      
      setUpdates({policies, myPolicies, claims})
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      const {data} = await axios.patch(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/updateUser`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      localStorage.name = data.user.name;
      localStorage.email = data.user.email;
      localStorage.token = data.token
      setValues({name: data.user.name, email: data.user.email})
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      await axios.delete(`http://localhost:3000/api/v1/cms/user/${localStorage.name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      
      localStorage.clear();
      navigate('/auth/login')
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/auth/login')
      return;
    }

    navigate(`/${localStorage.name}`)
    fetchData();
  }, [])

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

  if (error.err) {
    navigate('error/Error')
  }

  return (
    <div className='flex row'>
      <NavBar/>
      <div className='side-bar flex column center'>
        <h1>Welcome!</h1>
        <h1 style={{textAlign: 'center'}}>{localStorage.name}</h1>
      </div>
      <div className='home-container grid'>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}} onChange={(e) => {
          setValues({...values, [e.target.name] : e.target.value})
        }}>
          <h1>User Info</h1>
          <FormRow type='text' name='name' id='name' value={values.name} />
          <FormRow type='email' name='email' id='email' value={values.email} />
          <button onClick={updateUser}>Update User</button>
          <button onClick={deleteUser}>Delete User</button>
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>Policy Updates</h1>
          {
            updates.policies.length > 0 ? updates.policies.map((policy, i) => {
              if (i > 2 || i >= updates.policies.length) return;
              return <Updates type='policy' content={policy} />
            }) : <h1>No Policy Updates</h1>
          }
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>My Policy Updates</h1>
          {
            updates.myPolicies.length > 0 ? updates.myPolicies.map((userPolicy, i) => {
              if (i > 2 || i >= updates.myPolicies.length) return;
              return <Updates type='user-policy' content={userPolicy} />
            }) : <h1>No User-Policy Updates</h1>
          }
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>My Claims Update</h1>
          {
            updates.claims.length > 0 ? updates.claims.map((claim, i) => {
              if (i > 2 || i >= updates.claims.length) return;
              return <Updates type='claim' content={claim} />
            }) : <h1>No Claim Updates</h1>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
