import Signup  from '@/components/singup'
import React from 'react'

function page() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4'>
        <Signup />
    </div>
  )
}

export default page