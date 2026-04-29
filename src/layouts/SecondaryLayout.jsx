import React from 'react'
import NavBar from '../components/navbar/NavBar'
import { Outlet } from 'react-router-dom'

const SecondaryLayout = () => {
  return (
    <div>
        <div className='sticky top-0 z-100'>
        <NavBar />
        </div>
        <main>
            <Outlet/>
        </main>
    </div>
  )
}

export default SecondaryLayout