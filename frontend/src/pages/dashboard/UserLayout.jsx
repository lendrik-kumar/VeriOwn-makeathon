import React from 'react'
import { Outlet } from 'react-router-dom'
import UserNavbar from '../../components/ui/UserNavbar'
import Footer from '../../components/ui/Footer'


function UserLayout() {
  return (
    <>
    <UserNavbar></UserNavbar>
    <Outlet></Outlet>
    <Footer></Footer>
    </>
  )
}

export default UserLayout
