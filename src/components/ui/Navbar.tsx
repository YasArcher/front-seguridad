import NotificationsButton from './Navbar/NotificationsButton';
import ProfileMenu from './Navbar/ProfileMenu';

const Navbar = () => {
  return (
    <header className="w-full bg-gray-900 text-white px-6 py-5 shadow flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wide">🛡️ ShieldDocs</div>
      <div className="flex items-center gap-4">
        <NotificationsButton />
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Navbar;