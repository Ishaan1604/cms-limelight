import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { CheckButton} from '../../components';
import leftArrow from '../../assets/leftArrow.svg'
import rightArrow from '../../assets/rightArrow.svg'
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';

function Policies() {
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError} = useGlobalContext();
  const [policies, setPolicies] = useState([])
  const [queries, setQueries] = useState({page: 1, limit: 10})
  const navigate = useNavigate();

  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/policies?${Object.entries(queries).map((item) => item[0] + '=' + item[1]).join('&')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   policies: [
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       vailidity: '2 years,0 months',
      //     },
      //   ]
      // }

      setPolicies(data.policies)
      
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

    if (e.target.id.startsWith('active')) {
      let activeArr = queries?.active?.split(' ') || [];
      if (e.target.checked) {
        activeArr.push(e.target.name)
      }

      if (!e.target.checked) {
        activeArr = activeArr.filter((value) => value !== e.target.name)
      }
      setQueries({...queries, active: activeArr.join(' ').trim()})

      return;
    }

    if (e.target.name === 'left' && queries.page > 1) {
      setQueries({...queries, page: queries.page - 1})
    }

    if (e.target.name === 'right' && policies.length === queries.limit) {
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
        <h3>Active</h3>
        <CheckButton id='active' names={['true', 'false']} onClick={handleChange}/>
        <h1>Sort By</h1>
        <CheckButton id='sort' names={['name', 'policyType', 'active', 'validity']} onClick={handleChange}/>
        <h1>Page</h1>
        <div className='arrow-container flex row'>
          <button name='left' id='left'><img src={leftArrow} alt='leftArrow'/></button>
          <button name='right' id='right'><img src={rightArrow} alt='rightArrow'/></button>
        </div>
      </div>
      <div className='tile-container grid'>
        {
          policies.length > 0 ? policies.map((policy) => {
            return (
              <Link to={`/${localStorage.name}/policies/${policy._id}`} className='tile flex row' style={{justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none'}}>
                <h3><span className='bold'>Policy Name: </span>{policy.name}</h3>
                <h3><span className='bold'>Policy Type: </span>{policy.policyType}</h3>
                <h3><span className='bold'>Cost: </span>{policy.cost}</h3>
                <h3><span className='bold'>Claim Amount: </span>${policy.claimAmount}</h3>
                <h3><span className='bold'>Validity: </span>{policy.validity}</h3>
                <h3><span className='bold'>Status: </span>{policy.active === 'false' ? 'Expired' : 'Active'}</h3>
              </Link>
            )
          }) : <div className='tile flex center'>
            <h3>No Policies Found</h3>
          </div>
        }
      </div>
    </section>

  )
}

export default Policies
