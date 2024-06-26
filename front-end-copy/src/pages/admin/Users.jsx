import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios';
import { CheckButton} from '../../components';
import leftArrow from '../../assets/leftArrow.svg'
import rightArrow from '../../assets/rightArrow.svg'
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';

function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const {error, setError} = useGlobalContext();
  const [users, setUsers] = useState([])
  const [queries, setQueries] = useState({page: 1, limit: 10})
  const navigate = useNavigate();

  const fetchData = async() => {
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cms/admin/users?${Object.entries(queries).map((item) => item[0] + '=' + item[1]).join('&')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })

      // const data = {
      //   users: [
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 5,
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 5,
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 5,
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 5,
      //     },
      //     {
      //       _id: 1,
      //       name: 'Example 1',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 5,
      //     },
      //     {
      //       _id: 2,
      //       name: 'Example 2',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 10,
      //     },
      //     {
      //       _id: 2,
      //       name: 'Example 2',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 10,
      //     },
      //     {
      //       _id: 2,
      //       name: 'Example 2',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 10,
      //     },
      //     {
      //       _id: 2,
      //       name: 'Example 2',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 10,
      //     },
      //     {
      //       _id: 2,
      //       name: 'Example 2',
      //       email: 'Health',
      //       password: 'blah blah blah',
      //       personType: 'user',
      //       claims: 10,
      //     },
      //   ]
      // }

      setUsers(data.users)
      
    } catch (error) {
      setError({err: true, msg: error?.response?.data.msg || 'Something went wrong'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.target.id.startsWith('sort')) {
      let sortArr = queries?.sort?.split(' ') || [];
      if (e.target.checked) {
        sortArr.push(e.target.name)
      }

      if (!e.target.checked) {
        sortArr = sortArr.filter((value) => value !== e.target.name)
      }
      setQueries({...queries, sort: sortArr.join(' ').trim()})

      return;
    }

    if (e.target.name === 'left' && queries.page > 1) {
      setQueries({...queries, page: queries.page - 1})
    }

    if (e.target.name === 'right' && users.length === queries.limit) {
      setQueries({...queries, page: queries.page + 1})
    }

    setQueries({...queries, [e.target.name] : e.target.value})
  }

  useEffect(() => {
    fetchData()
  }, [queries])

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

  if (error.err) {
    navigate('/error/Error')
  }

  return (
    <section className='flex row'>
      <NavBar/>
      <div className='side-bar flex column' onChange={handleChange}>
        <input type='text' name='userName' id='userName' value={queries.userName}></input>
        <button className='btn' onClick={() => window.location.reload()}>Reset Filters</button>
        <h1>Sort By</h1>
        <CheckButton id='sort' names={['name', 'email', 'claims']} onClick={handleChange}/>
        <h1>Page</h1>
        <div className='arrow-container flex row'>
          <button name='left' id='left'><img src={leftArrow} alt='leftArrow'/></button>
          <button name='right' id='right'><img src={rightArrow} alt='rightArrow'/></button>
        </div>
      </div>
      <div className='tile-container grid'>
        {
          users.length > 0 ? users.map((user) => {
            return (
              <Link to={`/admin/claims?userId=${user._id}`} className='tile flex row center' style={{textDecoration: 'none'}}>
                <h3><span className='bold'>User Name: </span>{user.name}</h3>
                <h3 style={{textTransform: 'none'}}><span className='bold'>User Email: </span>{user.email}</h3>
              </Link>
            )
          }) : <div className='tile flex center'>
            <h3>No users Found</h3>
          </div>
        }
      </div>
    </section>
  )
}

export default Users
