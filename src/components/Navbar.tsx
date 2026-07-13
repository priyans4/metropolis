import React, { useState } from 'react';
import { Hotel, Award, Star, Menu, X, Landmark, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeBookingsCount: number;
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Navbar({ activeTab, setActiveTab, activeBookingsCount, user, onSignIn, onSignOut }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'suites', label: 'Suites & Rooms', icon: Hotel },
    { id: 'gallery', label: 'Gallery', icon: Landmark },
    { id: 'profile', label: 'Profile & Stays', icon: User, badge: activeBookingsCount > 0 ? activeBookingsCount : undefined },
  ];


  return (
    <nav id="main-navbar" className="sticky top-0 z-40 bg-editorial-cream/95 backdrop-blur-md border-b border-editorial-dark/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setActiveTab('suites')}>
            <div className="flex items-center gap-3">
              <div className="p-2 border border-editorial-dark/20 text-editorial-dark rounded-sm flex items-center justify-center">
                <Landmark className="w-5 h-5" id="nav-logo-icon" />
              </div>
              <div className="leading-none">
                <span className="block text-xl font-serif font-medium tracking-[0.05em] text-editorial-dark uppercase">
                  Metropolis
                </span>
                <span className="block text-[9px] uppercase tracking-[0.3em] text-editorial-gray font-light mt-0.5">
                  Hotel & Suites
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-[0.15em] transition-all duration-200 uppercase ${isActive
                      ? 'text-editorial-dark font-semibold'
                      : 'text-editorial-gray hover:text-editorial-dark hover:bg-editorial-sand/40'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold leading-none bg-editorial-dark text-editorial-cream rounded-sm font-mono">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-editorial-dark" />
                  )}
                </button>
              );
            })}

            {/* Auth Action */}
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-editorial-dark/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full border border-editorial-dark/10" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-editorial-dark text-editorial-cream flex items-center justify-center text-[10px] font-bold font-mono">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <button
                  onClick={onSignOut}
                  className="text-editorial-gray hover:text-red-700 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="ml-4 px-4 py-2 bg-editorial-dark text-editorial-cream text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-black rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-editorial-dark hover:bg-editorial-sand rounded-sm focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div id="mobile-nav-panel" className="md:hidden bg-editorial-cream border-b border-editorial-dark/10">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] transition-all ${isActive
                      ? 'bg-editorial-sand text-editorial-dark font-semibold border-l-2 border-editorial-dark'
                      : 'text-editorial-gray hover:bg-editorial-sand/60 hover:text-editorial-dark'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-editorial-gray" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-editorial-dark text-editorial-cream rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Mobile Auth Action */}
            <div className="border-t border-editorial-dark/10 pt-4 mt-4 px-4 flex flex-col gap-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full border border-editorial-dark/10" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-editorial-dark text-editorial-cream flex items-center justify-center text-[10px] font-bold font-mono">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-[11px] uppercase tracking-wider text-editorial-dark font-medium">{user.displayName || 'Guest'}</span>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsOpen(false);
                    }}
                    className="text-red-600 hover:text-red-800 text-[10px] font-semibold uppercase tracking-[0.12em] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onSignIn();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-editorial-dark text-editorial-cream text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-black rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
