import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { CheckButton} from '../../components';
import leftArrow from '../../assets/leftArrow.svg'
import rightArrow from '../../assets/rightArrow.svg'
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';

function Claims() {
  const [isLoading, setIsLoading] = useState(true);
  const {error, setError} = useGlobalContext();
  const [claims, setClaims] = useState([])
  const [queries, setQueries] = useState({page: 1, limit: 10})
  const navigate = useNavigate();

  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myClaims?${Object.entries(queries).map((item) => item[0] + '=' + item[1]).join('&')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   claims: [
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       description: 'Blah blah blah',
      //       claimAmount: 10000,
      //       status: 'pending',
      //       document: null,
      //     }
      //   ]
      // }

      setClaims(data.claims)
      
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.target.id.startsWith('sort')) {
      let sortArr = queries?.sort?.split(' ') || [];
      if (e.target.checked) {
        sortArr.push(e.target.name)
      }

      if (!e.target.checked) {
        sortArr = sortArr.filter((value) => value !== e.target.name)
      }
      setQueries({...queries, sort: sortArr.join(' ').trim()})

      return;
    }

    if (e.target.id.startsWith('policyType')) {
      let policyTypeArr = queries?.policyType?.split(' ') || [];
      if (e.target.checked) {
        policyTypeArr.push(e.target.name)
      }

      if (!e.target.checked) {
        policyTypeArr = policyTypeArr.filter((value) => value !== e.target.name)
      }
      setQueries({...queries, policyType: policyTypeArr.join(' ').trim()})

      return;
    }

    if (e.target.id.startsWith('status')) {
      let statusArr = queries?.status?.split(' ') || [];
      if (e.target.checked) {
        statusArr.push(e.target.name)
      }

      if (!e.target.checked) {
        statusArr = statusArr.filter((value) => value !== e.target.name)
      }
      setQueries({...queries, status: statusArr.join(' ').trim()})

      return;
    }

    if (e.target.name === 'left' && queries.page > 1) {
      setQueries({...queries, page: queries.page - 1})
    }

    if (e.target.name === 'right' && claims.length === queries.limit) {
      setQueries({...queries, page: queries.page + 1})
    }

    setQueries({...queries, [e.target.name] : e.target.value})
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
    navigate('/error/Error')
  }

  return (
    <section className='flex row'>
      <NavBar/>
      <div className='side-bar flex column' onChange={handleChange}>
        <input type='text' name='policyName' id='policyName' value={queries.policyName}></input>
        <button className='btn' onClick={() => window.location.reload()}>Reset Filters</button>
        <h1>Filter By</h1>
        <h3>Policy Type</h3>
        <CheckButton id='policyType' names={['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']} onClick={handleChange}/>
        <h3>Status</h3>
        <CheckButton id='status' names={['pending', 'rejected', 'approved']} onClick={handleChange}/>
        <h1>Sort By</h1>
        <CheckButton id='sort' names={['policyName', 'policyType', 'status']} onClick={handleChange}/>
        <h1>Page</h1>
        <div className='arrow-container flex row'>
          <button name='left' id='left'><img src={leftArrow} alt='leftArrow'/></button>
          <button name='right' id='right'><img src={rightArrow} alt='rightArrow'/></button>
        </div>
      </div>
      <div className='tile-container grid'>
        {
          claims.length > 0 ? claims.map((claim) => {
            return (
              <div className='tile flex column' style={{justifyContent: 'center'}}>
                <h3><span className='bold'>Policy Name: </span>{claim.policyName}</h3>
                <h3><span className='bold'>Policy Type: </span>{claim.policyType}</h3>
                <h3><span className='bold'>Claim Amount: </span>${claim.claimAmount}</h3>
                <h3><span className='bold'>Status: </span>{claim.status}</h3>
              </div>
            )
          }) : <div className='tile flex center'>
            <h3>No Claims Found</h3>
          </div>
        }
      </div>
    </section>
  )
}

export default Claims
