import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Zap, 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  FileText, 
  Send,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Repeat,
  ShoppingBag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout, switchRole } from '../store/slices/authSlice';
import { markAllAsRead } from '../store/slices/notificationSlice';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const currentRole = user?.role || 'buyer';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSwitchRole = async () => {
    const nextRole = currentRole === 'buyer' ? 'seller' : 'buyer';
    try {
      await dispatch(switchRole(nextRole)).unwrap();
      toast.success(`Switched to ${nextRole === 'buyer' ? 'Client' : 'Freelancer'} mode!`);
    } catch (err) {
      toast.error(err || 'Failed to switch role');
    }
  };

  const navLinks = currentRole === 'buyer' ? [
    { path: '/dashboard', label: 'Client Dashboard', icon: LayoutDashboard },
    { path: '/gigs/create', label: 'Post a Gig', icon: PlusCircle },
    { path: '/my-gigs', label: 'My Posted Gigs', icon: FileText },
    { path: '/gigs', label: 'Browse All Gigs', icon: Briefcase },
  ] : [
    { path: '/dashboard', label: 'Freelancer Dashboard', icon: LayoutDashboard },
    { path: '/gigs', label: 'Browse Gigs & Bid', icon: Briefcase },
    { path: '/my-bids', label: 'My Submitted Bids', icon: Send },
    { path: '/my-gigs', label: 'My Gigs', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-200 dark:border-dark-800 sticky top-0 z-50">
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo & Badge */}
          <div className="flex-1 flex items-center justify-start gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-dark-900">
                Gig<span className="text-primary-500">Market</span>
              </span>
            </Link>

            {/* Active Role Indicator Badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              currentRole === 'buyer'
                ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50'
                : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
            }`}>
              {currentRole === 'buyer' ? <ShoppingBag className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
              {currentRole === 'buyer' ? 'Client Mode' : 'Freelancer Mode'}
            </span>
          </div>

          {/* Center Section: Navigation Links */}
          <div className="flex-1 hidden md:flex items-center justify-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 whitespace-nowrap
                    ${isActive(link.path) 
                      ? 'bg-primary-100 text-primary-600 font-semibold dark:bg-primary-900/30 dark:text-primary-400' 
                      : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100 dark:text-dark-400 dark:hover:text-dark-50 dark:hover:bg-dark-800'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section: Actions */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {/* Dynamic Role Switcher Button */}
            <button
              onClick={handleSwitchRole}
              title={`Switch to ${currentRole === 'buyer' ? 'Freelancer' : 'Client'} Mode`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:bg-dark-50 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-300 text-xs font-semibold shadow-sm transition-all"
            >
              <Repeat className="w-3.5 h-3.5 text-primary-500" />
              <span>Switch to {currentRole === 'buyer' ? 'Freelancer' : 'Client'}</span>
            </button>

            <ThemeToggle />

            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 rounded-xl text-dark-500 hover:text-dark-900 hover:bg-dark-100 transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-xs flex items-center justify-center text-white font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-dark-200 p-0 overflow-hidden animate-slide-down">
                  <div className="p-4 border-b border-dark-200 flex items-center justify-between">
                    <h3 className="font-semibold text-dark-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-xs text-primary-500 hover:text-primary-600"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-dark-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-dark-100 hover:bg-dark-50 transition-colors
                            ${!notification.read ? 'bg-primary-50' : ''}`}
                        >
                          <p className="text-sm text-dark-900 font-medium">{notification.title}</p>
                          <p className="text-xs text-dark-500 mt-1">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden md:block">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-dark-600 hover:text-dark-900 hover:bg-dark-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-dark-200 p-2 animate-slide-down">
                  <div className="px-3 py-2 border-b border-dark-100 mb-1">
                    <p className="text-xs text-dark-400 font-medium">Role Mode</p>
                    <p className="text-xs font-semibold capitalize text-primary-600">{currentRole}</p>
                  </div>
                  <button
                    onClick={handleSwitchRole}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors text-xs font-medium mb-1"
                  >
                    <Repeat className="w-3.5 h-3.5 text-primary-500" />
                    <span>Switch to {currentRole === 'buyer' ? 'Freelancer' : 'Client'}</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-dark-500 hover:text-dark-900 hover:bg-dark-100 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-200 dark:border-dark-800 animate-slide-down">
            <div className="px-4 py-2 mb-2 bg-dark-50 dark:bg-dark-800/50 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-dark-600 dark:text-dark-400">Active Mode: <span className="capitalize text-primary-600">{currentRole === 'buyer' ? 'Client' : 'Freelancer'}</span></span>
              <button
                onClick={handleSwitchRole}
                className="text-xs text-primary-600 font-bold flex items-center gap-1"
              >
                <Repeat className="w-3 h-3" />
                Switch
              </button>
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive(link.path) 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'text-dark-600 hover:text-dark-900 hover:bg-dark-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
