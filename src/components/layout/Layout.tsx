import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';

const Layout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Nav />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default Layout;
