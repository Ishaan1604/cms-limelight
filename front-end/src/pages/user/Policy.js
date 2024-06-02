import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Policy() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({err: false, msg: null});
  const [policy, setPolicy] = useState([])
  const policy_id = useLocation().pathname.split('/').pop();
  const navigate = useNavigate();

  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/policies/${policy_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   policy: 
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     }
      // }

      setPolicy(data.policy)
      
    } catch (error) {
      setError({err: true, msg: error.message})
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      const {data} = await axios.post(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/${policy_id}`, policy, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      navigate(`/${localStorage.name}/myPolicies`)
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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
    <section className='flex row'>
      <NavBar/>
      <div className='policy-container flex row center'>
        <header className='flex row center' style={{justifyContent: 'space-evenly'}}>
          <h1 style={{fontSize: '2.5rem'}}>{policy.name}</h1>
          <h3>{policy.policyType}</h3>
        </header>
        <article>
          {policy.description}
        </article>
        <aside>
          <h1><span className='bold'>Cost: </span>{policy.cost}</h1>
          <h1><span className='bold'>Claim Amount: </span>${policy.claimAmount}</h1>
          <h1><span className='bold'>Validity: </span>{policy.vailidity}</h1>
        </aside>
        <footer className='flex row' style={{justifyContent: 'space-evenly'}}>
          <button className='btn submit-btn' type='submit' onClick={handleSubmit}>Add Policy</button>
          <button className='btn submit-btn' type='button' name='cancel' onClick={() => {
            navigate(`/${localStorage.name}/policies`)
          }}>Go back to browsing</button>
        </footer>
      </div>
    </section>

  )
}

export default Policy
