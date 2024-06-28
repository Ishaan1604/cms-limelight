import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Updates } from '../../components';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';

function HomeAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError} = useGlobalContext();
  const [updates, setUpdates] = useState({policies: [], users: [], claims: [], lengths: {}})
  const navigate = useNavigate();

  const fetchData = async() => {
    try {
      setIsLoading(true)

      const {data: {policies}} = await axios.get(`http://localhost:3000/api/v1/cms/policies?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      const {data: {users}} = await axios.get(`http://localhost:3000/api/v1/cms/admin/users?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      const {data: {claims}} = await axios.get(`http://localhost:3000/api/v1/cms/admin/claims?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      

      setUpdates({policies, users, claims})
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
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
    navigate('/error/Error')
  }

  return (
    <div className='flex row'>
      <NavBar/>
      <div className='side-bar flex column center'>
        <h1>Welcome!</h1>
        <h1 style={{textAlign: 'center'}}>{localStorage.name}</h1>
      </div>
      <div className='home-container grid'>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>General Info</h1>
          <h1>{`Number of users: ${updates.users.length || 0}`}</h1>
          <h1>{`Number of policies: ${updates.policies.length || 0}`}</h1>
          <h1>{`Number of claims: ${updates.claims.length || 0}`}</h1>
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
          <h1>User Updates</h1>
          {
            updates.users.length > 0 ? updates.users.map((user, i) => {
              if (i > 2 || i >= updates.users.length) return;
              return <Updates type='user' content={user} />
            }) : <h1>No User Updates</h1>
          }
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>Claims Update</h1>
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

export default HomeAdmin
