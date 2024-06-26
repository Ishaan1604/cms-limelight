import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useGlobalContext} from '../context'

function ProtectedRouteAdmin({element}) {
  const navigate = useNavigate()
  const {setContent} = useGlobalContext()

  let isAuthenticated = true;

  if (!localStorage.role === 'admin') {
    isAuthenticated = false
    setContent('Access Denied')
  }
  return isAuthenticated ? element : navigate('/error/Error')
}

export default ProtectedRouteAdmin
