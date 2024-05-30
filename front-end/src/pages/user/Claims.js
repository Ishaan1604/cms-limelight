import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { RadioButton } from '../../components';

function Claims() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({err: false, msg: null});
  const [claims, setClaims] = useState([])
  const [queries, setQueries] = useState({})

  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myClaims?${Object.entries(queries).map((item) => item[0] + '=' + item[1]).join('&')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      setClaims(data.claims)
      
    } catch (error) {
      setError({err: true, msg: error.message})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [queries])

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
    <section>
      <NavBar/>
      <div className='side-bar'>
        <input type='text' name='policyName' id='policyName' value={queries.policyName}></input>
        <h1>Filter By</h1>
        <h3>Policy Type</h3>
        <RadioButton id='policyType' names={['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']} />
        <h3>Status</h3>
        <div className='button-container'>

        </div>
        <h1>Sort By</h1>
        <div className='button-container'>

        </div>
      </div>
      <div className='tile-container'>
        {
          claims.length > 0 ? claims.map((claim) => {
            return (
              <div className='tile'>
                <h3><span className='bold'>Policy Name: </span>{claim.policyName}</h3>
                <h3><span className='bold'>Policy Type: </span>{claim.policyType}</h3>
                <h3><span className='bold'>Claim Amount: </span>${claim.claimAmount}</h3>
                <h3><span className='bold'>Status: </span>{claim.status}</h3>
              </div>
            )
          }) : <div className='tile'>
            <h3>No Policies Found</h3>
          </div>
        }
      </div>
    </section>
  )
}

export default Claims
