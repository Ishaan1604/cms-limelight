import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FormRow, SelectRow } from '../../components'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context'

function ClaimsModal({claimId, onClick}) {

  const [claim, setClaim] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const {setError} = useGlobalContext();
  const navigate = useNavigate();
  
  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/admin/claims/${claimId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   claim: {
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
      // }

      setClaim(data.claim)
      
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setClaim({...claim, [e.target.name] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      const {data} = await axios.patch(`http://localhost:3000/api/v1/cms/admin/claims/${claimId}`, {status: claim.status}, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      onClick()
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
  
  return (
    <section className='modal flex center'>
      <div className='form-container flex center'>
        <form onChange={handleChange} className='form flex row' style={{justifyContent: 'space-between'}} onSubmit={handleSubmit} >
          <FormRow type='text' name='_id' id='_id' value={claim._id} readOnly='true'/>
          <FormRow type='text' name='policyId' id='policyId' value={claim.policyId} readOnly='true'/>
          <FormRow type='text' name='userId' id='userId' value={claim.userId} readOnly='true'/>
          <FormRow type='text' name='policyName' id='policyName' value={claim.policyName} readOnly='true'/>
          <FormRow type='text' name='policyType' id='policyType' value={claim.policyType} readOnly='true'/>
          <FormRow type='text' name='description' id='description' value={claim.description} readOnly='true'/>
          <FormRow type='text' name='claimAmount' id='claimAmount' value={claim.claimAmount} readOnly='true'/>
          <SelectRow name='status' id='status' names={['pending', 'approved', 'rejected']}/>
          <button type='submit' className='btn submit-btn' style={{width: '45%'}}>Update Claim</button>
          <button type='button' name='cancel' className='btn submit-btn' style={{width: '45%'}} onClick={onClick}>Cancel</button>
        </form>
      </div>
    </section>
  )
}

export default ClaimsModal
