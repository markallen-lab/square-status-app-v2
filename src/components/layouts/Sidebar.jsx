import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users as UsersIcon,
  Settings,
  LogOut,
  X,
  Briefcase,
  ClipboardList,
  DollarSign,
  Server,
  Lightbulb,
  KeyRound as UsersRound,
  UserCheck,
  UserCog,
  Shield,
  Settings2,
  BarChartBig,
  Mail,
  Share2,
  ChevronDown,
  ChevronUp,
  Globe,
  Package,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SidebarNavLink = ({
  to,
  icon,
  label,
  onClick,
  isSubItem = false,
  onNavigate,
}) => {
  return (
    <NavLink
      to={to}
      onClick={() => {
        onClick();
        if (onNavigate) onNavigate(to);
      }}
      className={({ isActive }) =>
        cn(
          'flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ease-in-out',
          isSubItem && 'pl-10 py-2',
          isActive
            ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md scale-105'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white transform hover:scale-102'
        )
      }>
      <span className="mr-3 w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
};

const SidebarDropdown = ({ icon, label, children, pathPrefix }) => {
  const location = useLocation();
  const isOpenInitially = location.pathname.startsWith(pathPrefix);
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 ease-in-out">
        <div className="flex items-center">
          <span className="mr-3 w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden pl-4 border-l border-slate-700 ml-2">
            <div className="pt-1 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({
  isOpen,
  toggleSidebar,
  currentUser,
  onLogout,
  onNavigate,
}) => {
  const menuItems = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    { to: '/clients', icon: <UsersIcon size={20} />, label: 'Clients' },
    { to: '/leads', icon: <Lightbulb size={20} />, label: 'Leads' },
    { to: '/tasks', icon: <ClipboardList size={20} />, label: 'Tasks' },
    { to: '/projects', icon: <Briefcase size={20} />, label: 'Projects' },
    { to: '/meetings', icon: <CalendarDays size={20} />, label: 'Meetings' },
    { to: '/collections', icon: <DollarSign size={20} />, label: 'Finance' },
  ];

  const handleNavLinkClick = () => {
    if (isOpen && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <motion.aside
        initial={{ x: isOpen ? 0 : '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 shadow-2xl lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                A
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                AdminPanel
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700">
              <X size={24} />
            </Button>
          </div>

          <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
            <nav className="px-4 space-y-1.5">
              {menuItems.map((item) => (
                <motion.div
                  key={item.to}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <SidebarNavLink
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClick={handleNavLinkClick}
                    onNavigate={onNavigate}
                  />
                </motion.div>
              ))}

              <SidebarDropdown
                icon={<Server size={20} />}
                label="Hosting"
                pathPrefix="/hosting">
                <SidebarNavLink
                  to="/hosting/domains"
                  icon={<Globe size={18} />}
                  label="Domains"
                  onClick={handleNavLinkClick}
                  isSubItem={true}
                  onNavigate={onNavigate}
                />
                <SidebarNavLink
                  to="/hosting/packages"
                  icon={<Package size={18} />}
                  label="Packages"
                  onClick={handleNavLinkClick}
                  isSubItem={true}
                  onNavigate={onNavigate}
                />
              </SidebarDropdown>

              <SidebarDropdown
                icon={<BarChartBig size={20} />}
                label="Marketing"
                pathPrefix="/marketing">
                <SidebarNavLink
                  to="/marketing/campaigns"
                  icon={<BarChartBig size={18} />}
                  label="Campaigns"
                  onClick={handleNavLinkClick}
                  isSubItem={true}
                  onNavigate={onNavigate}
                />
                <SidebarNavLink
                  to="/marketing/email"
                  icon={<Mail size={18} />}
                  label="Email Marketing"
                  onClick={handleNavLinkClick}
                  isSubItem={true}
                  onNavigate={onNavigate}
                />
                <SidebarNavLink
                  to="/marketing/social"
                  icon={<Share2 size={18} />}
                  label="Social Media"
                  onClick={handleNavLinkClick}
                  isSubItem={true}
                  onNavigate={onNavigate}
                />
              </SidebarDropdown>

              {currentUser?.role === 'admin' && (
                <>
                  <SidebarDropdown
                    icon={<UsersRound size={20} />}
                    label="Users"
                    pathPrefix="/users">
                    <SidebarNavLink
                      to="/users/accounts"
                      icon={<UserCheck size={18} />}
                      label="Accounts"
                      onClick={handleNavLinkClick}
                      isSubItem={true}
                      onNavigate={onNavigate}
                    />
                    <SidebarNavLink
                      to="/users/status"
                      icon={<UserCog size={18} />}
                      label="Status & Roles"
                      onClick={handleNavLinkClick}
                      isSubItem={true}
                      onNavigate={onNavigate}
                    />
                  </SidebarDropdown>
                  <SidebarDropdown
                    icon={<Shield size={20} />}
                    label="Security"
                    pathPrefix="/security">
                    <SidebarNavLink
                      to="/security/signup-settings"
                      icon={<Settings2 size={18} />}
                      label="Signup Settings"
                      onClick={handleNavLinkClick}
                      isSubItem={true}
                      onNavigate={onNavigate}
                    />
                  </SidebarDropdown>
                </>
              )}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-700">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
              onClick={onLogout}>
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
