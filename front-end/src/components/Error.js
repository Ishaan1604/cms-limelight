import React from 'react'
import {useGlobalContext} from '../context'
import {Link} from 'react-router-dom'

function Error() {
  const {error, setError} = useGlobalContext();
  return (
    <section className='auth-section flex center'>
      <div className='error-div'>
        <h1 style={{fontSize: '2.5rem'}}>{error.msg}</h1>
        <Link to={localStorage.role === 'admin' ? '/admin' : `/${localStorage.name}`} onClick={() => {
          setError({err: false, msg: null})
        }}>
          Go back to Home?
        </Link>
      </div>
    </section>
  )
}

export default Error
