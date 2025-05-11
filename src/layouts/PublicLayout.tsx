import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
    <Outlet />
  </div>
);

export default PublicLayout;
