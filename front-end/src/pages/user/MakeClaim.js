import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FormRow } from '../../components'
import { useNavigate } from 'react-router-dom'

function MakeClaim({policyId, onClick}) {

  const [policy, setPolicy] = useState({})
  const [claim, setClaim] = useState({})
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({err: false, msg: null});
  const navigate = useNavigate();
  
  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myPolicies/${policyId.policyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   myPolicy: {
      //     _id: 1,
      //     policyId: 1,
      //     userId: 1,
      //     policyName: 'Example 1',
      //     policyType: 'Health',
      //     amountRemaining: 10000,
      //     expired: 'false',
      //     vailidity: '26-06-06T1234',
      //   }
      // }

      setPolicy(data.myPolicy)
      setClaim({policyId: data.myPolicy.policyId, userId: data.myPolicy.userId, policyName: data.myPolicy.policyName, policyType: data.myPolicy.policyType})
      
    } catch (error) {
      setError({err: true, msg: error.message})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'document') {
      setDocument(e.target.files[0])
      return;
    }
    setClaim({...claim, [e.target.name] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      const formData = new FormData();
      formData.append('file', document)
      Object.keys(claim).map((key) => {
        formData.append(key, claim[key])
      })

      const {data} = await axios.post(`http://localhost:3000/api/v1/cms/user/${localStorage.name}/myPolicies/${policyId.policyId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      navigate(`/${localStorage.name}/claims`)
    } catch (error) {
      console.log(error)
      setError({err: true, msg: error.message})
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
    <section className='modal flex center'>
      <div className='form-container flex center'>
        <form onChange={handleChange} className='form flex row' style={{justifyContent: 'space-between'}} onSubmit={handleSubmit} onClick={onClick}>
          <FormRow type='text' name='_id' id='_id' value={policy._id} readOnly='true'/>
          <FormRow type='text' name='userId' id='userId' value={policy.userId} readOnly='true'/>
          <FormRow type='text' name='policyId' id='policyId' value={policy.policyId} readOnly='true'/>
          <FormRow type='text' name='policyName' id='policyName' value={policy.policyName} readOnly='true'/>
          <FormRow type='text' name='policyType' id='policyType' value={policy.policyType} readOnly='true'/>
          <FormRow type='text' name='description' id='description' value={policy.description} />
          <FormRow type='text' name='claimAmount' id='claimAmount' value={policy.claimAmount} />
          <FormRow type='file' name='document' id='document' value={policy.document} />
          <button type='submit' className='btn submit-btn' style={{width: '45%'}}>Make A Claim</button>
          <button type='button' name='cancel' className='btn submit-btn' style={{width: '45%'}}>Cancel</button>
        </form>
      </div>
    </section>
  )
}

export default MakeClaim
