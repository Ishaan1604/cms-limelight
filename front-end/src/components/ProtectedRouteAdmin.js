import React from 'react'
import {userNavigate} from 'react-router-dom'
import {useGlobalContext} from '../context'

function ProtectedRouteAdmin({element}) {
  const navigate = userNavigate()
  const {setContent} = useGlobalContext()

  let isAuthenticated = true;

  if (!localStorage.role === 'admin') {
    isAuthenticated = false
    setContent('Access Denied')
  }
  return isAuthenticated ? element : navigate('/error/Error')
}

export default ProtectedRouteAdmin
