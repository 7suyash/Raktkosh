import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  isActive ? 'text-red-600 font-semibold' : 'text-gray-700 hover:text-red-600';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-red-600">
          RAKTKOSH
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          <NavLink to="/find-blood" className={navLinkClass}>Find Blood</NavLink>
          <NavLink to="/login" className="ml-2 btn-primary">Login</NavLink>
        </nav>
      </div>
    </header>
  );
}


