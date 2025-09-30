import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
        <p>© {year} RAKTKOSH. All rights reserved.</p>
        <p className="text-gray-500">Built with React + Vite</p>
      </div>
    </footer>
  );
}


