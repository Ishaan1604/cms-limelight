import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FormRow, SelectRow} from '../../components'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context'

function PolicyModal({policyId, onClick}) {

  const [policy, setPolicy] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const {setError} = useGlobalContext();
  const navigate = useNavigate();
  
  const fetchData = async() => {
    console.log(policyId)
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/policies/${policyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   policy: {
      //     _id: 1,
      //     name: 'Example 1',
      //     policyType: 'Health',
      //     description: 'blah blah blah',
      //     cost: '$200/week for 2 years',
      //     claimAmount: 10000,
      //     active: 'true',
      //     validity: '2 years,0 months',
      //   }
      // }

      setPolicy(data.policy)
      
    } catch (error) {
      console.log(error)
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setPolicy({...policy, [e.target.name] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      const {data} = await axios.patch(`http://localhost:3000/api/v1/cms/admin/policies/${policyId.policyId}`, policy, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      navigate(`/admin/policies`)
    } catch (error) {
      console.log(error)
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
        <form onChange={handleChange} className='form flex row' style={{justifyContent: 'space-between'}} onSubmit={handleSubmit} onClick={onClick}>
          <FormRow type='text' name='_id' id='_id' value={policy._id} readOnly='true'/>
          <FormRow type='text' name='name' id='name' value={policy.name} />
          <SelectRow name='policyType' id='policyType' names={['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']} value={policy.policyType}/>
          <FormRow type='text' name='description' id='description' value={policy.description} />
          <FormRow type='text' name='claimAmount' id='claimAmount' value={policy.claimAmount} />
          <FormRow type='text' name='cost' id='cost' value={policy.cost} />
          <FormRow type='text' name='validity' id='validity' value={policy.validity} />
          <button type='submit' className='btn submit-btn' style={{width: '45%'}}>Update Policy</button>
          <button type='button' name='cancel' className='btn submit-btn' style={{width: '45%'}}>Cancel</button>
        </form>
      </div>
    </section>
  )
}

export default PolicyModal
