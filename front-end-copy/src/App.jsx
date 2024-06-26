import './index.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Home, Claims, Policies, Policy, UserPolicies} from './pages/user'
import {ProtectedRoute, ProtectedRouteAdmin, Error} from './components'
import {Login, Register, ResetPassword} from './pages/auth'
import {PoliciesAdmin, ClaimsAdmin, Users, HomeAdmin} from './pages/admin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/:user'>
          <Route path='' element={<ProtectedRoute element={<Home/>}/>}/>
          <Route path='policies' element={<ProtectedRoute element={<Policies/>}/>}/>
          <Route path='policies/:policy_id' element={<ProtectedRoute element={<Policy/>}/>}/>
          <Route path='myPolicies' element={<ProtectedRoute element={<UserPolicies/>}/>}/>
          <Route path='claims' element={<ProtectedRoute element={<Claims/>}/>}/>
        </Route>
        <Route path='/auth'>
          <Route path='login' element={<Login/>} />
          <Route path='register' element={<Register/>} />
          <Route path='resetPassword' element={<ResetPassword/>} />
        </Route>
        <Route path='/admin'>
          <Route path='' element={<ProtectedRouteAdmin element={<HomeAdmin />}/>}/>
          <Route path='policies' element={<ProtectedRouteAdmin element={<PoliciesAdmin />}/>}/>
          <Route path='users' element={<ProtectedRouteAdmin element={<Users />}/>}/>
          <Route path='claims' element={<ProtectedRouteAdmin element={<ClaimsAdmin />}/>}/>
        </Route>
        <Route path='*' element={<Error/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
