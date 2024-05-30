import React from 'react'
import {userNavigate} from 'react-router-dom'
import {useGlobalContext} from '../context'

function ProtectedRoute({element}) {
  const navigate = userNavigate()
  const {setContent} = useGlobalContext()

  let isAuthenticated = true;

  if (!localStorage.name) {
    isAuthenticated = false
    setContent('Access Denied')
  }
  return isAuthenticated ? element : navigate('/error/Error')
}

export default ProtectedRoute
