import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FormRow, SelectRow } from '../../components'
import { useGlobalContext } from '../../context'

function MakePolicy({onClick}) {

  const [policy, setPolicy] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const {setError} = useGlobalContext();
  
  const handleChange = (e) => {
    setPolicy({...policy, [e.target.name] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)

      await axios.post(`http://localhost:3000/api/v1/cms/admin/policies`, policy, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      onClick();
    } catch (error) {
      setError({err: true, msg: error?.response?.data?.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  } 

  useEffect(() => {
    setIsLoading(false)
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
  // if (error.err) {
  //   return (
  //     <div className='error-div'>
  //       <p>{error.msg}</p>
  //     </div>
  //   )
  // }
  
  return (
    <section className='modal flex center'>
      <div className='form-container flex center'>
        <form onChange={handleChange} className='form flex row' style={{justifyContent: 'space-between'}} onSubmit={handleSubmit}>
          <FormRow type='text' name='name' id='name' value={policy.name} />
          <SelectRow name='policyType' id='policyType' names={['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']}/>
          <FormRow type='text' name='description' id='description' value={policy.description} />
          <FormRow type='number' name='claimAmount' id='claimAmount' value={policy.claimAmount} />
          <FormRow type='text' name='cost' id='cost' value={policy.cost} />
          <FormRow type='text' name='validity' id='validity' value={policy.validity} />
          <button type='submit' className='btn submit-btn' style={{width: '45%'}}>Make Policy</button>
          <button type='button' name='cancel' className='btn submit-btn' style={{width: '45%'}} onClick={onClick}>Cancel</button>
        </form>
      </div>
    </section>
  )
}

export default MakePolicy
