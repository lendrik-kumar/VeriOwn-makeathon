import React from 'react';
import UserNavbar from '../components/ui/UserNavbar';
import SideBar from '../components/ui/SideBar';
import Footer from '../components/ui/Footer';
import { Outlet } from 'react-router-dom';

const UserLayout = () => (
  <div className="flex min-h-screen bg-black">
    <SideBar />
    <div className="flex-1 flex flex-col" style={{ marginLeft: '18rem' }}>
      <UserNavbar />
      <main className="flex-1 pt-20 px-8">
        <Outlet />
      </main>
      {/* Footer after sidebar ends */}
      <Footer />
    </div>
  </div>
);

export default UserLayout;