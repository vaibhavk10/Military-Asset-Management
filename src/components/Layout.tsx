import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Database, ArrowLeftRight, Users, Box, Settings, Menu, ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
        active 
          ? 'bg-military-accent text-white' 
          : 'hover:bg-gray-200 text-gray-700'
      )}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="font-medium transition-opacity duration-200 whitespace-nowrap">{label}</span>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use the custom hook for mobile detection
  const isMobile = useIsMobile();
  
  if (!user) {
    return children;
  }
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={toggleMobileMenu}
          className="absolute top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        >
          <Menu size={24} />
        </button>
      )}
      
      {/* Sidebar - desktop collapsed/expanded or mobile open/closed */}
      <aside 
        className={cn(
          "bg-white shadow-md transition-all duration-300 ease-in-out",
          isMobile 
            ? mobileMenuOpen 
              ? "fixed inset-y-0 left-0 w-64 z-40" 
              : "-translate-x-full fixed inset-y-0 left-0 w-64 z-40"
            : collapsed 
              ? "w-20" 
              : "w-64"
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className={cn(
            "font-bold text-military-primary transition-opacity duration-200",
            collapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
          )}>
            Military Asset Management
          </h1>
          {(!isMobile || mobileMenuOpen) && (
            <button 
              onClick={isMobile ? toggleMobileMenu : toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-200"
            >
              <ChevronLeft size={20} className={cn(
                "transition-transform duration-300",
                collapsed && !isMobile ? "rotate-180" : ""
              )} />
            </button>
          )}
        </div>
        
        <nav className="space-y-1 p-4">
          <SidebarItem 
            icon={<Package />} 
            label={collapsed && !isMobile ? "" : "Dashboard"} 
            to="/" 
            active={location.pathname === '/'} 
          />
          <SidebarItem 
            icon={<Database />} 
            label={collapsed && !isMobile ? "" : "Purchases"} 
            to="/purchases" 
            active={location.pathname === '/purchases'} 
          />
          <SidebarItem 
            icon={<ArrowLeftRight />} 
            label={collapsed && !isMobile ? "" : "Transfers"} 
            to="/transfers" 
            active={location.pathname === '/transfers'} 
          />
          <SidebarItem 
            icon={<Users />} 
            label={collapsed && !isMobile ? "" : "Assignments"} 
            to="/assignments" 
            active={location.pathname === '/assignments'} 
          />
          <SidebarItem 
            icon={<Box />} 
            label={collapsed && !isMobile ? "" : "Expenditures"} 
            to="/expenditures" 
            active={location.pathname === '/expenditures'} 
          />
          {user.role === 'Admin' && (
            <SidebarItem 
              icon={<Settings />} 
              label={collapsed && !isMobile ? "" : "Settings"} 
              to="/settings" 
              active={location.pathname === '/settings'} 
            />
          )}
        </nav>
        
        <div className={cn(
          "absolute bottom-0 left-0 w-full p-4 border-t transition-all",
          collapsed && !isMobile ? "px-2" : ""
        )}>
          <div className="flex items-center gap-2">
            <div className={cn(
              "transition-opacity duration-200",
              collapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
            )}>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 text-sm font-medium"
            >
              {collapsed && !isMobile ? <LogOut size={20} /> : "Logout"}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content - zero space between sidebar and content */}
      <main className={cn(
        "flex-1 overflow-y-auto p-0 transition-all duration-300",
        isMobile ? "ml-0" : "ml-0" // No margin
      )}>
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMobileMenu}
          ></div>
        )}
        <div className={cn(
          "transition-all duration-300 ml-4"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
