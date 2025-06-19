import { Outlet } from 'react-router-dom';
import {Sidebar} from './Sidebar';
import {Header} from './Header';
import {Footer} from './Footer';

export const DashboardLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-4 overflow-scroll">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);
