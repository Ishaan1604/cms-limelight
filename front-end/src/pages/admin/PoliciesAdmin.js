import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { CheckButton} from '../../components';
import leftArrow from '../../assets/leftArrow.svg'
import rightArrow from '../../assets/rightArrow.svg'
import { Link} from 'react-router-dom';
import PolicyModal from './PolicyModal';
import MakePolicy from './MakePolicy';
import { useGlobalContext } from '../../context';

function PoliciesAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError} = useGlobalContext();
  const [policies, setPolicies] = useState([])
  const [queries, setQueries] = useState({page: 1, limit: 10})
  const [policyModal, setPolicyModal] = useState(false)
  const [policyId, setPolicyId] = useState(null)
  const [addPolicyModal, setAddPolicyModal] = useState(false)

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
      //       validity: '2 years,0 months',
      //     },
      //     {
      //       _id: 2,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       validity: '2 years,0 months',
      //     },
      //     {
      //       _id: 3,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       validity: '2 years,0 months',
      //     },
      //     {
      //       _id: 4,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       validity: '2 years,0 months',
      //     },
      //     {
      //       _id: 5,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       validity: '2 years,0 months',
      //     },
      //     {
      //       _id: 6,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       validity: '2 years,0 months',
      //     },
      //     {
      //       _id: 7,
      //       name: 'Example 1',
      //       policyType: 'Health',
      //       description: 'blah blah blah',
      //       cost: '$200/week for 2 years',
      //       claimAmount: 10000,
      //       active: 'true',
      //       validity: '2 years,0 months',
      //     },
      //     // {
      //     //   _id: 1,
      //     //   name: 'Example 1',
      //     //   policyType: 'Health',
      //     //   description: 'blah blah blah',
      //     //   cost: '$200/week for 2 years',
      //     //   claimAmount: 10000,
      //     //   active: 'true',
      //     //   validity: '2 years,0 months',
      //     // },
      //     // {
      //     //   _id: 1,
      //     //   name: 'Example 1',
      //     //   policyType: 'Health',
      //     //   description: 'blah blah blah',
      //     //   cost: '$200/week for 2 years',
      //     //   claimAmount: 10000,
      //     //   active: 'true',
      //     //   validity: '2 years,0 months',
      //     // },
      //     // {
      //     //   _id: 1,
      //     //   name: 'Example 1',
      //     //   policyType: 'Health',
      //     //   description: 'blah blah blah',
      //     //   cost: '$200/week for 2 years',
      //     //   claimAmount: 10000,
      //     //   active: 'true',
      //     //   validity: '2 years,0 months',
      //     // },
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
      setQueries({...queries, sort: sortArr.join(' ')})

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
      setQueries({...queries, policyType: policyTypeArr.join(' ')})

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
      setQueries({...queries, active: activeArr.join(' ')})

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
    return (
      <div className='error-div'>
        <p>{error.msg}</p>
      </div>
    )
  }
  return (
    <>
      {
        addPolicyModal && <MakePolicy onClick={(e) => {
          setAddPolicyModal(false)
          window.location.reload();
        }}/>
      }
      {
        policyModal && <PolicyModal policyId={policyId} onClick={(e) => {
          if (e.target.name === 'cancel') {
            setPolicyModal(false)
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
          <h3>Active</h3>
          <CheckButton id='active' names={['true', 'false']} onClick={handleChange}/>
          <h1>Sort By</h1>
          <CheckButton id='sort' names={['name', 'policyType', 'active', 'validity', 'claims']} onClick={handleChange}/>
          <h1>Page</h1>
          <div className='arrow-container flex row'>
            <button name='left' id='left'><img src={leftArrow} alt='leftArrow'/></button>
            <button name='right' id='right'><img src={rightArrow} alt='rightArrow'/></button>
          </div>
          <button className='btn' onClick={() => setAddPolicyModal(true)}>Add Policy</button>
        </div>
        <div className='tile-container grid'>
          {
            policies.length > 0 ? policies.map((policy) => {
              console.log(policy.claims)
              return (
                <Link to={`/admin/claims?policyId=${policy._id}`} className='tile flex row center' style={{textDecoration: 'none'}}>
                  <h3><span className='bold'>Policy Name: </span>{policy.name}</h3>
                  <h3><span className='bold'>Policy Type: </span>{policy.policyType}</h3>
                  <h3><span className='bold'>Cost: </span>{policy.cost}</h3>
                  <h3><span className='bold'>Claim Amount: </span>${policy.claimAmount}</h3>
                  <h3><span className='bold'>Validity: </span>{policy.validity}</h3>
                  <h3><span className='bold'>Status: </span>{policy.active === 'false' ? 'Expired' : 'Active'}</h3>
                  <button className='btn submit-btn' style={{width: '45%'}} onClick={(e) => {
                    e.preventDefault();
                    setPolicyModal(true);
                    setPolicyId(policy._id)
                  }}>Edit</button>
                  <button className='btn submit-btn' style={{width: '45%'}} onClick={async(e) => {
                    e.preventDefault();
                    try {
                      setIsLoading(true)

                      const {data} = await axios.patch(`http://localhost:3000/admin/policies/${policy._id}`, {...policy, active: false}, {
                        headers: {
                          Authorization: `Bearer ${localStorage.token}`
                        }
                      })

                      setPolicies(policies.filter((placholder) => placholder._id !== policy._id))
                    } catch (error) {
                      console.log(error)
                      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
                    } finally {
                      setIsLoading(false)
                    }
                  }}>Delete</button>
                </Link>
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

export default PoliciesAdmin
