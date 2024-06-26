import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useGlobalContext} from '../context'

function ProtectedRoute({element}) {
  const navigate = useNavigate()
  const {setContent} = useGlobalContext()

  let isAuthenticated = true;

  if (!localStorage.name) {
    isAuthenticated = false
    setContent('Access Denied')
  }
  return isAuthenticated ? element : navigate('/error/Error')
}

export default ProtectedRoute
