'use client';

import React from 'react'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const {loginUser} = useAuth();

  return (
    <div>
        <h2 className='text-center'>Login Here</h2>
        <form onSubmit={loginUser} className='flex flex-col space-y-4 items-center justify-center space-x-5'>
            <input className='w-[300px] border border-gray-300 p-2' type="text" name='username' placeholder='Enter Username' />
            <input className='w-[300px] border border-gray-300 p-2' type="password" name='password' placeholder='*****' />
            <input className='w-[300px] border border-gray-300 p-2' type="submit" value="Submit" />
        </form>
    </div>
  )
}

export default LoginPage