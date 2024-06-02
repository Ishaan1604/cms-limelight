import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Updates } from '../../components';
import axios from 'axios';

function HomeAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({err: false, msg: null});
  const [updates, setUpdates] = useState({policies: [], users: [], claims: [], lengths: {}})

  const fetchData = async() => {
    try {
      setIsLoading(true)

      const {data: policies} = await axios.get(`http://localhost:3000/api/v1/cms/policies?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      const {data: users} = await axios.get(`http://localhost:3000/api/v1/cms/admin/users?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      const {data: claims} = await axios.get(`http://localhost:3000/api/v1/cms/admin/claims?sort=-updatedAt`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      console.log(policies.length > 0)

      setUpdates({policies: [policies[0], policies[1], policies[2]], users: [users[0], users[1], users[2]], claims: [claims[0], claims[1], claims[2]], lengths: {policies: policies.length, users: users.length, claims: claims.length}})
    } catch (error) {
      setError({err: true, msg: error.message})
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
    return (
      <div className='error-div'>
        <p>{error.msg}</p>
      </div>
    )
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
          <h1>{`Number of users: ${updates.lengths.users || 0}`}</h1>
          <h1>{`Number of policies: ${updates.lengths.policies || 0}`}</h1>
          <h1>{`Number of claims: ${updates.lengths.claims || 0}`}</h1>
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>Policy Updates</h1>
          {
            updates.policies[0]  ? updates.policies.map((policy) => {
              return <Updates type='policy' content={policy} />
            }) : <h1>No Policy Updates</h1>
          }
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>User Updates</h1>
          {
            updates.users[0] ? updates.users.map((user) => {
              return <Updates type='user' content={user} />
            }) : <h1>No User Updates</h1>
          }
        </div>
        <div className='home-tile flex row' style={{ justifyContent: 'space-evenly'}}>
          <h1>Claims Update</h1>
          {
            updates.claims[0] ? updates.claims.map((claim) => {
              return <Updates type='claim' content={claim} />
            }) : <h1>No Claim Updates</h1>
          }
        </div>
      </div>
    </div>
  )
}

export default HomeAdmin
