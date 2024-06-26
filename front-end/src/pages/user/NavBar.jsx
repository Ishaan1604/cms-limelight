import React from 'react'
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className='flex row'>
      <ul style={{width: '20%', fontSize: 'larger'}} className='flex row center'>
        <li>
          <a className='flex row center' href={`/${localStorage.name}`}>CMS</a>
        </li>
      </ul>
      <ul className='flex row' style={{width: '60%', justifyContent: 'space-evenly'}}>
        <li>
          <a className='flex row center' href={`/${localStorage.name}/policies`}>Policies</a>
        </li>
        <li>
          <a className='flex row center' href={`/${localStorage.name}/myPolicies`}>My Policies</a>
        </li>
        <li>
          <a className='flex row center' href={`/${localStorage.name}/claims`}>Claims</a>
        </li>
        <li>
          <a className='flex row center' onClick={() => {
            localStorage.clear();
            navigate('/auth/login')
          }}>Logout</a>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
