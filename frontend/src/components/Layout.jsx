import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
