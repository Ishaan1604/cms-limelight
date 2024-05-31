import React from 'react'

function NavBar() {
  return (
    <nav className='flex row'>
      <ul style={{width: '20%', fontSize: 'larger'}} className='flex row center'>
        <li>
          <a href={`/${localStorage.name}`}>CMS</a>
        </li>
      </ul>
      <ul className='flex row' style={{width: '60%', justifyContent: 'space-evenly'}}>
        <li>
          <a href={`/${localStorage.name}/policies`}>Policies</a>
        </li>
        <li>
          <a href={`/${localStorage.name}/myPolicies`}>My Policies</a>
        </li>
        <li>
          <a href={`/${localStorage.name}/claims`}>Claims</a>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
