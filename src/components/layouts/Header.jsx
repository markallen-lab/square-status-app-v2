
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, UserCircle, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Header = ({ toggleSidebar, currentUser, onLogout, onNavigate }) => {
  return (
    <header className="bg-slate-800 shadow-md z-10 border-b border-slate-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden mr-3 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-700">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-700">
                <Avatar className="h-9 w-9 border-2 border-sky-500">
                  <AvatarImage src={currentUser?.profileImageUrl || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-slate-300">{currentUser?.name || 'User'}</span>
                <ChevronDown size={18} className="text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700 text-slate-300 shadow-xl">
              <DropdownMenuLabel className="text-slate-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={() => onNavigate('/profile')} className="hover:bg-slate-700 focus:bg-slate-700 hover:text-sky-400">
                <UserCircle className="mr-2 h-4 w-4 text-sky-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('/settings')} className="hover:bg-slate-700 focus:bg-slate-700 hover:text-sky-400">
                <Settings className="mr-2 h-4 w-4 text-sky-500" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={onLogout} className="hover:bg-slate-700 focus:bg-slate-700 hover:text-red-400">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
