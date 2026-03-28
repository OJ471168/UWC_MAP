import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LOGO_URL = 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/Assets/LOGO2%20UPWC@4x.png';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/three-principles', label: 'The Three Principles' },
  { to: '/resources', label: 'Resources' },
  { to: '/map', label: 'Event Map' },
  { to: '/community', label: 'Community' },
] as const;

const Nav: React.FC = () => {
  const { profile, loading } = useAuth();

  return (
    <nav className="bg-white sticky top-0 z-[1000] shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-[35px] py-[10px] font-['Inter',system-ui,-apple-system,sans-serif]">
      <div className="max-w-[1400px] mx-auto px-[30px] flex justify-between items-center">
        {/* Left — Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/">
            <img src={LOGO_URL} alt="UPWC Logo" className="h-[95px] w-auto block" />
          </Link>
        </div>

        {/* Center — Nav Links */}
        <ul className="flex-[3] flex justify-center items-center gap-[30px] list-none m-0 p-0">
          {navLinks.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `no-underline font-medium text-[0.9rem] whitespace-nowrap transition-colors duration-200 ${
                    isActive ? 'text-[#5c8ab9]' : 'text-[#1e293b] hover:text-[#5c8ab9]'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right — Auth Area */}
        <div className="flex-1 flex justify-end items-center gap-3">
          {loading ? null : profile ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-[10px] px-4 py-[6px] rounded-[30px] cursor-pointer transition-all duration-200 border border-[#e5e7eb] no-underline text-[#1e293b] hover:bg-[#f9fafb] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <img
                src={profile.avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover bg-[#e5e7eb] border border-[#e5e7eb]"
              />
              <span className="text-[0.875rem] font-semibold">{profile.fullName}</span>
            </Link>
          ) : (
            <Link
              to="/join"
              className="bg-[#9cbce2] text-white px-8 py-[10px] rounded-full font-bold text-[1.05rem] no-underline transition-all duration-200 shadow-[0_2px_4px_rgba(156,188,226,0.3)] whitespace-nowrap hover:bg-[#8baad1] hover:-translate-y-[1px]"
            >
              Join
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
