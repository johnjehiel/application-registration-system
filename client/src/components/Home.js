import React, { Fragment } from 'react'
import { useSelector } from 'react-redux';

const Home = () => {
  const { loading, error, isAuthenticated, user } = useSelector(state => state.authState)
  console.log(user);
  return (
    <Fragment>
        <div>Home</div>
        {!user ? <h1>No user data found</h1>
        :
        <div>
            <p>name: {user.name}</p>
            <p>email: {user.email}</p>
        </div>
        }
    </Fragment>
  )
}

export default Home