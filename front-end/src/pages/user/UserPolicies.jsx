import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { CheckButton} from '../../components';
import leftArrow from '../../assets/leftArrow.svg'
import rightArrow from '../../assets/rightArrow.svg'
import MakeClaim from './MakeClaim';
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';

function UserPolicies() {
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError} = useGlobalContext();
  const [policies, setPolicies] = useState([])
  const [queries, setQueries] = useState({page: 1, limit: 10})
  const [claimModal, setClaimModal] = useState(false)
  const [policyId, setPolicyId] = useState(null)
  const navigate = useNavigate();

  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myPolicies?${Object.entries(queries).map((item) => item[0] + '=' + item[1]).join('&')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   myPolicies: [
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //     {
      //       _id: 1,
      //       policyId: 1,
      //       userId: 1,
      //       policyName: 'Example 1',
      //       policyType: 'Health',
      //       amountRemaining: 10000,
      //       expired: 'false',
      //       vailidity: '26-06-06T1234',
      //     },
      //   ]
      // }

      setPolicies(data.myPolicies)
      
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

    if (e.target.id.startsWith('expired')) {
      let expiredArr = queries?.expired?.split(' ') || [];
      if (e.target.checked) {
        expiredArr.push(e.target.name)
      }

      if (!e.target.checked) {
        expiredArr = expiredArr.filter((value) => value !== e.target.name)
      }
      setQueries({...queries, expired: expiredArr.join(' ').trim()})

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
    <>
      {
        claimModal && <MakeClaim policyId={{policyId}} onClick={(e) => {
          if (e.target.name === 'cancel') {
            setClaimModal(false)
            return;
          }
        }}/>
      }
      <section className='flex row'>
        <NavBar/>
        <div className='side-bar flex column' onChange={handleChange}>
          <input type='text' name='policyName' id='policyName' value={queries.policyName}></input>
          <button className='btn' onClick={() => window.location.reload()}>Reset Filters</button>
          <h1>Filter By</h1>
          <h3>Policy Type</h3>
          <CheckButton id='policyType' names={['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']} onClick={handleChange}/>
          <h3>Expired</h3>
          <CheckButton id='expired' names={['true', 'false']} onClick={handleChange}/>
          <h1>Sort By</h1>
          <CheckButton id='sort' names={['policyName', 'policyType', 'expired', 'validity']} onClick={handleChange}/>
          <h1>Page</h1>
          <div className='arrow-container flex row'>
            <button name='left' id='left'><img src={leftArrow} alt='leftArrow'/></button>
            <button name='right' id='right'><img src={rightArrow} alt='rightArrow'/></button>
          </div>
        </div>
        <div className='tile-container grid'>
          {
            policies.length > 0 ? policies.map((policy) => {
              let [year, month, day] = policy.validity.split('-')
              day = day.slice(0, 2)
              const date = day + '/' + month + '/' + year
              return (
                <div className='tile flex row' style={{justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3><span className='bold'>Policy Name: </span>{policy.policyName}</h3>
                  <h3><span className='bold'>Policy Type: </span>{policy.policyType}</h3>
                  <h3><span className='bold'>Amount Remaining: </span>${policy.amountRemaining}</h3>
                  <h3><span className='bold'>Validity: </span>{date}</h3>
                  <h3><span className='bold'>Status: </span>{policy.expired === 'true' ? 'Expired' : 'Active'}</h3>
                  <h3></h3>
                  <button className="btn" style={{margin: '0.5% auto'}} onClick={() => {
                    setPolicyId(policy._id)
                    setClaimModal(true)
                  }}>Make A Claim</button>
                </div>
              )
            }) : <div className='tile flex center'>
              <h3>No Policies Found</h3>
            </div>
          }
        </div>
      </section>
    </>
  )
}

export default UserPolicies
