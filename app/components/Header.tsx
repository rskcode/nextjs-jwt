'use client';

import Link from 'next/link'
import React, { useContext } from 'react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logoutUser } = useAuth();
  return (
    <>
      <div className='w-full flex px-6 py-4 items-center justify-center space-x-6'>
        <Link href="/">Home</Link>
        <span>|</span>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <span>|</span>
            <span>Hello, {user.username}</span>
            <span>|</span>
            <p onClick={logoutUser} className='cursor-pointer'>Logout</p>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
          </>
        )}
      </div>
      <hr />
    </>
  )
}

export default Header